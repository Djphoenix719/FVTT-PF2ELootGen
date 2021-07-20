/*
 * Copyright 2021 Andrew Cuccinello
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 *
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { FEATURE_ALLOW_MERGING, FEATURE_QUICK_ROLL_CONTROL, FEATURE_QUICK_ROLL_MODIFIERS, FEATURE_QUICK_ROLL_SHIFT } from '../Setup';
import ModuleSettings from '../../../FVTT-Common/src/module/ModuleSettings';
import { DataSource, GenType, PoolSource, SourceType } from './source/DataSource';
import { buildFilterSettingUpdate, buildSourceSettingUpdate, createFlagPath, FLAGS_KEY, getDataSourceSettings, getFilterSettings, SetValueKeys } from './Flags';
import { permanentSources } from './source/Permanent';
import { treasureSources } from './source/Treasure';
import { AndGroup, OrGroup } from '../filter/FilterGroup';
import {
    calculateFinalPriceAndLevel,
    createSpellItems,
    dataSourcesOfType,
    drawFromSources,
    DrawResult,
    getEquipmentType,
    mergeExistingStacks,
    mergeStacks,
    rollTreasureValues,
} from './Utilities';
import { SpellItemType, spellSources } from './source/Spells';
import { BasePriceData, CREATE_KEY_NONE, getValidMaterialGrades, getValidMaterials, ItemMaterials } from './data/Materials';
import { ITEM_ID_LENGTH, MODULE_NAME, PF2E_LOOT_SHEET_NAME, QUICK_MYSTIFY, TOOLBOX_NAME } from '../Constants';
import { AppFilter, FilterType, spellLevelFilters, spellSchoolFilters, spellTraditionFilters } from './Filters';
import { NumberFilter } from '../filter/Operation/NumberFilter';
import { ArrayIncludesFilter } from '../filter/Operation/ArrayIncludesFilter';
import { StringFilter } from '../filter/Operation/StringFilter';
import { consumableSources } from './source/Consumable';
import { WeightedFilter } from '../filter/Operation/WeightedFilter';
import { EqualityType } from '../filter/EqualityType';
import {
    ArmorPropertyRuneType,
    EquipmentItem,
    EquipmentType,
    HTMLItemString,
    isArmor,
    isEquipment,
    isShield,
    isWeapon,
    PF2EItem,
    PreciousMaterialGrade,
    PreciousMaterialType,
    PropertyRuneCreateKey,
    PropertyRuneType,
    Rarity,
    ResiliencyRuneType,
    StrikingRuneType,
    WeaponPropertyRuneType,
} from '../../types/PF2E';
import { FundamentalRuneType, ItemRunes, PotencyRuneType } from './data/Runes';

export enum LootAppSetting {
    Count = 'count',
}

interface FormOption<TSlug, TLabel = string> {
    slug: TSlug;
    label: TLabel;
}
export type LootAppCreateData = {
    type: EquipmentType;

    template: EquipmentItem;
    templateLink: HTMLItemString;
    product?: EquipmentItem;

    preciousMaterial: PreciousMaterialType;
    preciousMaterialGrade: PreciousMaterialGrade;

    potencyRune: PotencyRuneType;

    strikingRune?: StrikingRuneType;
    resiliencyRune?: ResiliencyRuneType;

    shieldType?: EquipmentType;

    materials: ReturnType<typeof getValidMaterials>;
    grades: ReturnType<typeof getValidMaterialGrades>;
    runes: typeof ItemRunes[EquipmentType];
    shieldTypes?: FormOption<EquipmentType>[];

    hardness: number;
    hitPoints: number;
    brokenThreshold: number;
    finalPrice: BasePriceData;
    finalLevel: number;
} & {
    [T in PropertyRuneCreateKey]: PropertyRuneType;
};

export const extendLootSheet = () => {
    type ActorSheetConstructor = new (...args: any[]) => ActorSheet<ActorSheet.Options, any>;

    // @ts-ignore
    const BaseClass: ActorSheetConstructor = CONFIG.Actor.sheetClasses['loot'][`pf2e.${PF2E_LOOT_SHEET_NAME}`].cls;
    class LootApp extends BaseClass {
        static get defaultOptions() {
            // @ts-ignore
            const options = super.defaultOptions;
            options.classes = options.classes ?? [];
            options.classes = [...options.classes, 'pf2e-lootgen', 'loot-app'];
            options.tabs = [
                ...options.tabs,
                {
                    navSelector: '.loot-app-nav',
                    contentSelector: '.loot-app-content',
                    initial: 'create',
                },
            ];
            return options;
        }

        get title(): string {
            return 'PF2E Loot Generator';
        }

        get template(): string {
            return `modules/${MODULE_NAME}/templates/loot-app/index.html`;
        }

        // base item data dragged from somewhere
        protected _createBaseItem: EquipmentItem | undefined;

        protected get createBaseItem(): EquipmentItem | undefined {
            if (this._createBaseItem) {
                return duplicate(this._createBaseItem);
            } else return undefined;
        }

        protected set createBaseItem(value: EquipmentItem | undefined) {
            // delete local old base item to prevent memory leak
            if (this.createBaseItem !== undefined && this.createBaseItem !== null) {
                game.items?.delete(this.createBaseItem._id);
            }

            value = duplicate(value) as EquipmentItem;
            value._id = foundry.utils.randomID(ITEM_ID_LENGTH);
            value['flags'] = { ...value['flags'], [FLAGS_KEY]: { temporary: true } };

            // @ts-ignore
            const item: Item = new (game.items as Items).documentClass(value);
            game.items?.set(value._id, item);
            this._createBaseItem = value;
        }

        // mapping of collapse-ids to hidden or not states
        protected collapsibles: Record<string, boolean> = {};

        protected getCreateFlag<T>(key: string): T | undefined {
            return this.actor.getFlag(FLAGS_KEY, `create.${key}`) as T;
        }

        protected async getCreateData() {
            if (this.createBaseItem === undefined) {
                return {};
            }
            const equipmentType = getEquipmentType(this.createBaseItem);
            if (equipmentType === undefined) {
                return {};
            }

            let data: Partial<LootAppCreateData> = {};
            data['type'] = equipmentType;
            data['template'] = this.createBaseItem;
            data['templateLink'] = `@Item[${this.createBaseItem._id}]`;

            const materialGradeType = this.getCreateFlag<PreciousMaterialGrade>('preciousMaterialGrade') ?? PreciousMaterialGrade.None;
            data['preciousMaterialGrade'] = materialGradeType;

            const materialType = this.getCreateFlag<PreciousMaterialType>('preciousMaterial') ?? CREATE_KEY_NONE;
            data['preciousMaterial'] = materialType;

            const potencyRuneType = this.getCreateFlag<PotencyRuneType>('potencyRune') ?? '0';
            data['potencyRune'] = potencyRuneType;

            let fundamentalRune: FundamentalRuneType = '';
            if (isWeapon(this.createBaseItem)) {
                fundamentalRune = this.getCreateFlag<StrikingRuneType>('strikingRune') ?? '';
                data['strikingRune'] = fundamentalRune;
            }
            if (isArmor(this.createBaseItem)) {
                fundamentalRune = this.getCreateFlag<ResiliencyRuneType>('resiliencyRune') ?? '';
                data['resiliencyRune'] = fundamentalRune;
            }

            const propertyRunes: [PropertyRuneType, PropertyRuneType, PropertyRuneType, PropertyRuneType] = ['', '', '', ''];
            for (let i = 0; i < 4; i++) {
                const key = `propertyRune${i + 1}` as PropertyRuneCreateKey;
                propertyRunes[i] = this.getCreateFlag<PropertyRuneType>(key) ?? '';
                data[key] = propertyRunes[i];
            }

            data['materials'] = getValidMaterials(this.createBaseItem);
            data['grades'] = getValidMaterialGrades(this.createBaseItem, materialType);
            data['runes'] = ItemRunes[equipmentType];

            // switch here so the type is narrowed by ts properly
            switch (equipmentType) {
                case EquipmentType.Buckler:
                case EquipmentType.Shield:
                case EquipmentType.Tower:
                    data['shieldType'] = equipmentType;
                    data['shieldTypes'] = [EquipmentType.Buckler, EquipmentType.Shield, EquipmentType.Tower].map((type) => {
                        return {
                            slug: type,
                            label: type.toString().capitalize(),
                        };
                    });
                    break;
            }

            const dataUpdates = this.validateFlagData(this.createBaseItem);
            data = mergeObject(data, dataUpdates);

            const { price, level, hardness, hitPoints, brokenThreshold } = calculateFinalPriceAndLevel({
                item: this.createBaseItem,
                materialType,
                materialGradeType,
                potencyRune: potencyRuneType,
                fundamentalRune: fundamentalRune,
                propertyRunes: propertyRunes,
            });

            data['hardness'] = hardness;
            data['hitPoints'] = hitPoints;
            data['brokenThreshold'] = brokenThreshold;
            data['finalPrice'] = { basePrice: price };
            data['finalLevel'] = level;

            const product = this.buildProduct(data as LootAppCreateData);
            if (product) {
                data['product'] = product;
            }

            return data;
        }

        protected buildProduct(data: LootAppCreateData): EquipmentItem | undefined {
            const product = this.createBaseItem;
            if (product === undefined) {
                return undefined;
            }

            // setting this way to ensure it exists, armor does not contain this ATM but I expect it
            // to be added to armors in later version of PF2E as automation continues to improve
            product.data.specific = { value: true };

            product.data.level.value = data.finalLevel;
            product.data.price.value = `${data.finalPrice.basePrice} gp`;

            product.data.preciousMaterial.value = data.preciousMaterial;
            product.data.preciousMaterialGrade.value = data.preciousMaterialGrade;

            product.data.propertyRune1.value = data.propertyRune1;
            product.data.propertyRune2.value = data.propertyRune2;
            product.data.propertyRune3.value = data.propertyRune3;
            product.data.propertyRune4.value = data.propertyRune4;

            if (isWeapon(product) && data.strikingRune) {
                product.data.potencyRune.value = data.potencyRune;
                product.data.strikingRune.value = data.strikingRune;
            }
            if (isArmor(product) && data.resiliencyRune) {
                product.data.potencyRune.value = data.potencyRune;
                product.data.resiliencyRune.value = data.resiliencyRune;
            }

            let newName: string = '';
            if (data.potencyRune && data.potencyRune !== '0' && (data.potencyRune as string) !== '') {
                newName = `+${data.potencyRune}`;
            }
            if (data.strikingRune && (data.strikingRune as string) !== '') {
                newName += ` ${game.i18n.localize(CONFIG.PF2E.weaponStrikingRunes[data.strikingRune])}`;
            }
            if (data.resiliencyRune && (data.resiliencyRune as string) !== '') {
                newName += ` ${game.i18n.localize(CONFIG.PF2E.armorResiliencyRunes[data.resiliencyRune])}`;
            }

            if (data.preciousMaterial && (data.preciousMaterial as string) !== '') {
                newName += ` ${game.i18n.localize(CONFIG.PF2E.preciousMaterials[data.preciousMaterial])}`;
            }

            if (isWeapon(product)) {
                for (let i = 1; i <= 4; i++) {
                    const key = `propertyRune${i}` as PropertyRuneCreateKey;
                    const value = data[key] as WeaponPropertyRuneType;
                    if (value && (value as string) !== '') {
                        newName += ` ${game.i18n.localize(CONFIG.PF2E.weaponPropertyRunes[value])}`;
                    }
                }
            }
            if (isArmor(product)) {
                for (let i = 1; i <= 4; i++) {
                    const key = `propertyRune${i}` as PropertyRuneCreateKey;
                    const value = data[key] as ArmorPropertyRuneType;
                    if (value && (value as string) !== '') {
                        newName += ` ${game.i18n.localize(CONFIG.PF2E.armorPropertyRunes[value])}`;
                    }
                }
            }

            product.data.hardness.value = data.hardness;
            product.data.hp.value = data.hitPoints;
            product.data.maxHp.value = data.hitPoints;
            product.data.brokenThreshold.value = data.brokenThreshold;

            // update table description of shields
            if (isShield(product)) {
                let description = product.data.description.value;

                const startLength = '<td>'.length;

                const hardnessStart = description.indexOf('<td>') + startLength;

                if (hardnessStart !== -1) {
                    const hardnessEnd = description.indexOf('</td>', hardnessStart);
                    description = description.slice(0, hardnessStart) + data.hardness + description.slice(hardnessEnd, description.length);

                    const hitPointsStart = description.indexOf('<td>', hardnessStart) + startLength;
                    const hitPointsEnd = description.indexOf('</td>', hitPointsStart);
                    description = description.slice(0, hitPointsStart) + data.hitPoints + description.slice(hitPointsEnd, description.length);

                    const breakThresholdStart = description.indexOf('<td>', hitPointsStart) + startLength;
                    const breakThresholdEnd = description.indexOf('</td>', breakThresholdStart);
                    description = description.slice(0, breakThresholdStart) + data.brokenThreshold + description.slice(breakThresholdEnd, description.length);

                    product.data.description.value = description;
                }
            }

            if (data.finalLevel === 25) {
                product.data.traits.rarity.value = Rarity.Unique;
            }

            product.name = `${newName} ${product.name}`;
            product._id = foundry.utils.randomID(ITEM_ID_LENGTH);

            return product;
        }

        protected validateFlagData(item: EquipmentItem): Record<string, any> {
            const dataUpdates: Record<string, any> = {};
            let equipmentType = getEquipmentType(item)!;

            let preciousMaterialType = this.getCreateFlag<PreciousMaterialType>('preciousMaterial');
            let preciousMaterialGradeType = this.getCreateFlag<PreciousMaterialGrade>('preciousMaterialGrade');

            if (!preciousMaterialGradeType) {
                preciousMaterialGradeType = PreciousMaterialGrade.None;
            }

            if (preciousMaterialType) {
                let preciousMaterial = ItemMaterials[preciousMaterialType];
                if (!preciousMaterial.hasOwnProperty(equipmentType)) {
                    preciousMaterialType = '';
                    dataUpdates['preciousMaterial'] = preciousMaterialType;
                }

                const validGrades = getValidMaterialGrades(item, preciousMaterialType);
                if (!validGrades.hasOwnProperty(preciousMaterialGradeType)) {
                    preciousMaterialGradeType = preciousMaterial.defaultGrade;
                    dataUpdates['preciousMaterialGrade'] = preciousMaterialGradeType;
                }
            }

            let potencyRuneType = this.getCreateFlag<PotencyRuneType>('potencyRune');
            // when initializing we can have empty string technically
            if ((potencyRuneType as string) === '') {
                potencyRuneType = '0';
            }
            if (potencyRuneType) {
                const potencyValue = parseInt(potencyRuneType);

                if (potencyValue < 4) {
                    dataUpdates['propertyRune4'] = '';
                }
                if (potencyValue < 3) {
                    dataUpdates['propertyRune3'] = '';
                }
                if (potencyValue < 2) {
                    dataUpdates['propertyRune2'] = '';
                }
                if (potencyValue < 1) {
                    dataUpdates['propertyRune1'] = '';
                    dataUpdates['strikingRune'] = '';
                    dataUpdates['resiliencyRune'] = '';
                }
            }

            if (!isObjectEmpty(dataUpdates)) {
                const flagUpdates: Record<string, any> = {};
                for (const [key, value] of Object.entries(dataUpdates)) {
                    flagUpdates[createFlagPath(key, true)] = value;
                }
                this.actor.update(flagUpdates);
            }
            return dataUpdates;
        }

        public async getData(options?: Application.RenderOptions) {
            const data = super.getData(options) as Record<string, any>;

            data['constants'] = {
                rangeMin: 1,
                rangeMax: 25,
            };
            data['collapsibles'] = { ...data['collapsibles'], ...this.collapsibles };

            const getFilter = (filter: AppFilter): AppFilter => getFilterSettings(this.actor, filter);
            data['filters'] = {
                spell: {
                    school: Object.values(spellSchoolFilters).map(getFilter),
                    level: Object.values(spellLevelFilters).map(getFilter),
                    tradition: Object.values(spellTraditionFilters).map(getFilter),
                },
            };

            const getSource = (source: DataSource): DataSource => getDataSourceSettings(this.actor, source);
            data['sources'] = {
                [GenType.Consumable]: Object.values(consumableSources).map(getSource),
                [GenType.Permanent]: Object.values(permanentSources).map(getSource),
                [GenType.Treasure]: Object.values(treasureSources).map(getSource),
                [GenType.Spell]: Object.values(spellSources).map(getSource),
            };

            data['flags'] = {
                ...data['flags'],
                ...data['actor']['flags'][FLAGS_KEY],
            };

            data['create'] = await this.getCreateData();

            return data;
        }

        private async createItems(datas: PF2EItem[]) {
            //@ts-ignore
            await this.actor.createEmbeddedDocuments('Item', datas);
        }

        private async updateItems(datas: PF2EItem[]) {
            //@ts-ignore
            await this.actor.updateEmbeddedDocuments('Item', datas);
        }

        /**
         * Create a group of items from a draw result
         * @param results
         * @private
         */
        private async createItemsFromDraw(results: DrawResult[]) {
            let itemsToUpdate: PF2EItem[] | undefined = undefined;
            let itemsToCreate = results.map((d) => d.itemData);
            if (ModuleSettings.instance.get(FEATURE_ALLOW_MERGING)) {
                const existing = this.actor.data.items.map((item) => item.data as PF2EItem);
                [itemsToUpdate, itemsToCreate] = mergeExistingStacks(existing, itemsToCreate);
            } else {
                itemsToCreate = mergeStacks(itemsToCreate);
            }

            itemsToCreate.sort((a, b) => a.data.slug.localeCompare(b.data.slug));

            if (itemsToUpdate !== undefined) {
                await this.updateItems(itemsToUpdate);
            }
            await this.createItems(itemsToCreate);
        }

        /**
         * Helper function to retrieve certain settings from the flags store.
         * @param type The type of the setting, since these settings are duplicated over the three generator types.
         * @param key The setting key.
         * @private
         */
        private getLootAppSetting<T = any>(type: GenType, key: LootAppSetting): T {
            return this.actor.getFlag(MODULE_NAME, `config.${type}.${key}`) as T;
        }

        protected override async _onDropItem(event: any, data: any) {
            const dragEvent: DragEvent = event as DragEvent;
            const dropRegion = $(this.element).find('div.template-drop');
            const dropTarget = dropRegion.find(dragEvent.target as any);

            const isTemplateDrop = dropTarget.length > 0;

            if (isTemplateDrop) {
                const item = (await Item.fromDropData(data))?.data as PF2EItem;

                if ((isWeapon(item) && item.data.group.value !== 'bomb') || isArmor(item)) {
                    this.createBaseItem = item;
                    await this.actor.unsetFlag(FLAGS_KEY, 'create');
                } else {
                    ui.notifications?.warn('The item creator only supports weapons, armor, and shields right now.');
                    return;
                }

                const flags: Record<string, any> = {};
                if (isEquipment(item)) {
                    flags['preciousMaterial'] = item.data.preciousMaterial.value ?? '';
                    flags['preciousMaterialGrade'] = item.data.preciousMaterialGrade.value ?? PreciousMaterialGrade.Standard;
                    flags['propertyRune1'] = item.data.propertyRune1.value ?? '';
                    flags['propertyRune2'] = item.data.propertyRune2.value ?? '';
                    flags['propertyRune3'] = item.data.propertyRune3.value ?? '';
                    flags['propertyRune4'] = item.data.propertyRune4.value ?? '';
                    flags['potencyRune'] = item.data.potencyRune.value ?? '';

                    if (isWeapon(item)) {
                        flags['strikingRune'] = item.data.strikingRune.value ?? '';
                    } else if (isArmor(item)) {
                        flags['resiliencyRune'] = item.data.resiliencyRune.value ?? '';
                    }

                    if (isShield(item)) {
                        flags['shieldType'] = getEquipmentType(item);
                    }
                }

                await this.actor.setFlag(FLAGS_KEY, 'create', flags);

                return;
            }

            return super._onDropItem(event, data);
        }

        public async activateListeners(html: JQuery) {
            super.activateListeners(html);

            // Since all our data is derived from the form, for simplicity of code if the
            //  data has never been set, e.g. the user has never interacted with the form,
            //  we will submit the form to get a default set of data stored on the server.
            //  This is done in activateListeners so we can ensure we get the proper HTML
            //  to derive the form data from.
            if (!this.actor.getFlag(MODULE_NAME, 'config')) {
                await this._updateObject(new Event('submit'), this._getSubmitData());
            }

            // TODO: Move to utility file
            /**
             * Calculate quick roll count by checking event modifiers and the module settings.
             * @param event
             */
            const getQuickRollCount = (event: JQuery.ClickEvent): number => {
                if (!ModuleSettings.instance.get(FEATURE_QUICK_ROLL_MODIFIERS)) {
                    return 1;
                }

                let count = 1;
                if (event.shiftKey) {
                    count *= ModuleSettings.instance.get(FEATURE_QUICK_ROLL_SHIFT) as number;
                }
                if (event.ctrlKey) {
                    count *= ModuleSettings.instance.get(FEATURE_QUICK_ROLL_CONTROL) as number;
                }
                return count;
            };
            /**
             * Get the closest container and element for an event.
             * @param event
             */
            const getContainer = (event: JQuery.ClickEvent) => {
                const element = $(event.currentTarget);
                const container = element.closest('.tab-container');
                return { element, container };
            };

            const getType = (event: JQuery.ClickEvent) => {
                const { container } = getContainer(event);
                return container.data('type') as GenType;
            };

            // group roll button
            html.find('.buttons .roll').on('click', async (event) => {
                event.preventDefault();
                event.stopPropagation();

                const { container } = getContainer(event);
                const type = container.data('type') as GenType;

                const sources = Object.values(dataSourcesOfType(type))
                    .map((source) => getDataSourceSettings(this.actor, source))
                    .filter((table) => table.enabled);

                let results = await drawFromSources(this.getLootAppSetting<number>(type, LootAppSetting.Count), sources);
                results = await rollTreasureValues(results);
                await this.createItemsFromDraw(results);
            });

            // quick roll button for sources
            html.find('.treasure i.quick-roll, .permanent i.quick-roll, .consumable i.quick-roll').on('click', async (event) => {
                event.preventDefault();
                event.stopPropagation();

                const element = $(event.currentTarget).closest('.source-wrapper');
                const source: DataSource = element.data('source');

                let results = await drawFromSources(getQuickRollCount(event), [source]);
                results = await rollTreasureValues(results);
                await this.createItemsFromDraw(results);
            });

            const rollSpells = async (consumableTypes: SpellItemType[]) => {
                const promises: Promise<Item[]>[] = [];
                for (const source of Object.values(spellSources)) {
                    const pack = game.packs.get(source.id);
                    if (pack === undefined) {
                        continue;
                    }
                    // noinspection ES6MissingAwait
                    promises.push(pack.getDocuments() as Promise<Item[]>);
                }

                const levelFilters = Object.values(spellLevelFilters)
                    .map((filter) => getFilterSettings(this.actor, filter))
                    .filter((filter) => filter.enabled)
                    .map((filter) => new NumberFilter('data.level.value', filter.desiredValue as number, filter.weight, EqualityType.EqualTo));
                const schoolFilters = Object.values(spellSchoolFilters)
                    .map((filter) => getFilterSettings(this.actor, filter))
                    .filter((filter) => filter.enabled)
                    .map((filter) => new StringFilter('data.school.value', filter.desiredValue as string, filter.weight));
                const traditionFilters = Object.values(spellTraditionFilters)
                    .map((filter) => getFilterSettings(this.actor, filter))
                    .filter((filter) => filter.enabled)
                    .map((filter) => new ArrayIncludesFilter('data.traditions.value', filter.desiredValue as string, filter.weight));

                const isLevel = new OrGroup([...levelFilters]);
                const isSchool = new OrGroup([...schoolFilters]);
                const isTradition = new OrGroup([...traditionFilters]);
                const isEnabled = new AndGroup([isLevel, isSchool, isTradition]);
                const filters: WeightedFilter<number | string>[] = [...levelFilters, ...schoolFilters, ...traditionFilters];

                let spells = (await Promise.all(promises)).flat().map((spell) => spell.data) as unknown as PF2EItem[];
                spells = spells.filter((spell) => isEnabled.isSatisfiedBy(spell));

                const sources: Record<number, PoolSource> = {};
                for (const entry of spells) {
                    const weight = filters.reduce((prev, curr) => (curr.isSatisfiedBy(entry) ? prev + curr.weight : prev), 0);
                    if (!sources.hasOwnProperty(weight)) {
                        sources[weight] = {
                            id: null,
                            storeId: null,
                            enabled: true,
                            sourceType: SourceType.Pool,
                            weight: weight,
                            elements: [],
                        };
                    }
                    sources[weight].elements.push(entry);
                }

                if (Object.values(sources).length === 0) {
                    // TODO: Localization
                    ui.notifications?.warn('The current filters excluded all spells.', { permanent: true });
                    return;
                }

                const drawnSpells = await drawFromSources(this.getLootAppSetting<number>(GenType.Spell, LootAppSetting.Count), Object.values(sources));

                const createdItems = await createSpellItems(drawnSpells, consumableTypes);

                // TODO: Join stacks, slug needs updating to do so.

                await this.createItems(createdItems);
            };

            // roll scrolls
            html.find('.buttons .roll-scroll').on('click', async (event) => {
                event.preventDefault();
                event.stopPropagation();

                await rollSpells([SpellItemType.Scroll]);
            });
            // roll wands
            html.find('.buttons .roll-wand').on('click', async (event) => {
                event.preventDefault();
                event.stopPropagation();

                await rollSpells([SpellItemType.Wand]);
            });
            // roll scrolls + wands
            html.find('.buttons .roll-both').on('click', async (event) => {
                event.preventDefault();
                event.stopPropagation();

                await rollSpells([SpellItemType.Scroll, SpellItemType.Wand]);
            });

            /**
             * Handle a settings update event, e.g. one of the check all, check none, or reset buttons are pressed.
             * @param event The triggering even.
             * @param keys The keys that should be updated.
             * @param values The values that should be placed in those keys.
             */
            const settingsUpdate = async (event: JQuery.ClickEvent, keys: SetValueKeys[], values: any[]): Promise<void> => {
                event.preventDefault();
                event.stopPropagation();

                let updateData = buildSourceSettingUpdate(this.actor, getType(event), keys, values);
                if (getType(event) === GenType.Spell) {
                    updateData = { ...updateData, ...buildFilterSettingUpdate(this.actor, FilterType.SpellSchool, keys, values) };
                    updateData = { ...updateData, ...buildFilterSettingUpdate(this.actor, FilterType.SpellLevel, keys, values) };
                    updateData = { ...updateData, ...buildFilterSettingUpdate(this.actor, FilterType.SpellTradition, keys, values) };
                }
                await this.actor.update(updateData);
            };

            // check-all button
            html.find('.buttons .check-all').on('click', async (event) => {
                await settingsUpdate(event, ['enabled'], [true]);
            });
            // check-none button
            html.find('.buttons .check-none').on('click', async (event) => {
                await settingsUpdate(event, ['enabled'], [false]);
            });
            // reset button
            html.find('.buttons .reset').on('click', async (event) => {
                await settingsUpdate(event, ['weight', 'enabled'], [1, true]);
            });

            // collapsibles
            html.find('.collapsible h4').on('click', async (event) => {
                const header = $(event.currentTarget);
                const container = header.closest('.collapsible');
                const wrapper = header.next('.collapse-content');

                const id: string = container.data('collapse-id');
                wrapper.toggle('fast', 'swing', () => {
                    this.collapsibles[id] = wrapper.css('display') === 'none';
                });
            });

            // create item
            html.find('#create-item').on('click', async (event) => {
                const createData = await this.getCreateData();
                if (!createData.product) {
                    return;
                }

                const product = createData.product;
                const mystifyEnabled = game.settings.get(TOOLBOX_NAME, QUICK_MYSTIFY) as boolean;
                if (mystifyEnabled && event.altKey) {
                    product.data.identification.status = 'unidentified';
                }

                await this.createItems([createData.product]);
            });
        }
    }
    return LootApp;
};
