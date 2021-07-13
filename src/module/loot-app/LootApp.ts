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
import { DataSource, GenType, PoolSource, SourceType } from './data/DataSource';
import { buildFilterSettingUpdate, buildSourceSettingUpdate, FLAGS_KEY, getDataSourceSettings, getFilterSettings, SetValueKeys } from './Flags';
import { permanentSources } from './data/Permanent';
import { treasureSources } from './data/Treasure';
import { AndGroup, OrGroup } from '../filter/FilterGroup';
import { createSpellItems, dataSourcesOfType, drawFromSources, DrawResult, mergeExistingStacks, mergeStacks, rollTreasureValues } from './Utilities';
import { SpellItemType, spellSources } from './data/Spells';
import { BuilderType, ItemMaterials, ItemRunes, MaterialGrade } from './data/Materials';
import { TABLE_WEIGHT_MAX, TABLE_WEIGHT_MIN } from './Settings';
import { MODULE_NAME, PF2E_LOOT_SHEET_NAME } from '../Constants';
import { AppFilter, FilterType, spellLevelFilters, spellSchoolFilters, spellTraditionFilters } from './Filters';
import { NumberFilter } from '../filter/Operation/NumberFilter';
import { ArrayIncludesFilter } from '../filter/Operation/ArrayIncludesFilter';
import { StringFilter } from '../filter/Operation/StringFilter';
import { consumableSources } from './data/Consumable';
import { WeightedFilter } from '../filter/Operation/WeightedFilter';
import { EqualityType } from '../filter/EqualityType';
import { isArmor, isEquipment, isShield, isWeapon, PF2EItem, PreciousMaterial } from '../../types/PF2E';
import { ItemBuilder } from './create/ItemBuilder';

export enum LootAppSetting {
    Count = 'count',
}

export const extendLootSheet = () => {
    type ActorSheetConstructor = new (...args: any[]) => ActorSheet<ActorSheet.Options, any>;

    // @ts-ignore
    const extendMe: ActorSheetConstructor = CONFIG.Actor.sheetClasses['loot'][`pf2e.${PF2E_LOOT_SHEET_NAME}`].cls;
    class LootApp extends extendMe {
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
        protected _createBaseItem: PF2EItem | undefined;

        protected get createBaseItem(): PF2EItem | undefined {
            if (this._createBaseItem) return duplicate(this._createBaseItem);
            else return undefined;
        }

        protected set createBaseItem(value: PF2EItem | undefined) {
            // delete local old base item to prevent memory leak
            if (this.createBaseItem !== undefined && this.createBaseItem !== null) {
                game.items?.delete(this.createBaseItem._id);
            }

            value = duplicate(value) as unknown as PF2EItem;
            value._id = foundry.utils.randomID(16);
            value['flags'] = { ...value['flags'], [FLAGS_KEY]: { temporary: true } };

            // @ts-ignore
            const item: Item = new (game.items as Items).documentClass(value);
            game.items?.set(value._id, item);
            this._createBaseItem = value;
        }

        // mapping of collapse-ids to hidden or not states
        protected collapsibles: Record<string, boolean> = {};

        protected getCreateData() {
            const data: Record<string, any> = {};

            const getFlag = (key: string): string => {
                return this.actor.getFlag(MODULE_NAME, `create.${key}`) as string;
            };
            const filteredMaterials = (type: BuilderType) => {
                return Object.values(ItemMaterials)
                    .filter((material) => material.hasOwnProperty(type))
                    .reduce(
                        (prev, curr) =>
                            mergeObject(prev, {
                                [curr.slug]: curr,
                            }),
                        {},
                    );
            };

            const material = getFlag('preciousMaterial');
            data['preciousMaterial'] = material;
            const grade = getFlag('materialGrade');
            data['materialGrade'] = grade;

            const filteredGrades = (type: BuilderType) => {
                if (material === undefined) return [];
                if (material === '') return [];
                let grades = Object.entries(ItemMaterials[material][type]!).map(([key, value]) => {
                    value['label'] = key.capitalize();
                    value['slug'] = key;
                    return value;
                });
                return grades.reduce(
                    (prev, curr) =>
                        mergeObject(prev, {
                            [curr.slug]: curr,
                        }),
                    {},
                );
            };

            if (isWeapon(this.createBaseItem)) {
                data['type'] = BuilderType.Weapon;
                data['materials'] = filteredMaterials(BuilderType.Weapon);
                data['grades'] = filteredGrades(BuilderType.Weapon);
                data['runes'] = ItemRunes['weapon'];
            } else if (isShield(this.createBaseItem)) {
                data['type'] = BuilderType.Shield;
                data['materials'] = filteredMaterials(BuilderType.Shield);
                data['grades'] = filteredGrades(BuilderType.Shield);
                data['runes'] = ItemRunes['shield'];
            } else if (isArmor(this.createBaseItem)) {
                data['type'] = BuilderType.Armor;
                data['materials'] = filteredMaterials(BuilderType.Armor);
                data['grades'] = filteredGrades(BuilderType.Armor);
                data['runes'] = ItemRunes['armor'];
            }

            if (this.createBaseItem) {
                const link = (item: PF2EItem) => `@Item[${item._id}]{${item.name}}`;

                data['template'] = this.createBaseItem;
                data['templateLink'] = link(this.createBaseItem);

                let builtItem = this.createBaseItem;

                const builder = ItemBuilder.MakeBuilder(builtItem);
                if (builder) {
                    builder.setChecks(false);
                    builder.setMaterial(getFlag('preciousMaterial') as PreciousMaterial, getFlag('materialGrade') as MaterialGrade);
                    builtItem = builder.build();
                }

                data['product'] = builtItem;
                data['productLink'] = link(builtItem);
            }

            return data;
        }

        public getData(options?: Application.RenderOptions) {
            const data = super.getData(options) as Record<string, any>;

            data['constants'] = {
                rangeMin: TABLE_WEIGHT_MIN,
                rangeMax: TABLE_WEIGHT_MAX,
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

            data['create'] = this.getCreateData();

            console.warn(data);

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

                if (isWeapon(item) || isArmor(item)) {
                    this.createBaseItem = item;
                    console.warn('unsetting create flag');
                    await this.actor.unsetFlag(FLAGS_KEY, 'create');
                } else {
                    ui.notifications?.warn('The item creator only supports weapons, armor, and shields right now.');
                    return;
                }

                const flags: Record<string, any> = {};
                if (isEquipment(item)) {
                    flags['preciousMaterial'] = item.data.preciousMaterial.value ?? '';
                    flags['materialGrade'] = item.data.preciousMaterialGrade.value ?? MaterialGrade.Standard;
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
                console.warn('updating config flag, they do not exist');
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
                console.warn('rolling spells');
                console.warn(consumableTypes);

                const promises: Promise<Entity[]>[] = [];
                for (const source of Object.values(spellSources)) {
                    // @ts-ignore
                    promises.push(game.packs.get(source.id).getDocuments());
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

                console.warn('drawn spells');
                console.warn(drawnSpells);

                const createdItems = await createSpellItems(drawnSpells, consumableTypes);

                // TODO: Join stacks, slug needs updating to do so.

                console.warn('created spell items');
                console.warn(createdItems);

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
        }
    }
    return LootApp;
};
