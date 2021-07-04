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

import { MODULE_NAME, PF2E_LOOT_SHEET_NAME } from '../Constants';
import { buildFilterSettingUpdate, buildSourceSettingUpdate, FLAGS_KEY, getDataSourceSettings, getFilterSettings, SetValueKeys } from './Flags';
import { TABLE_WEIGHT_MAX, TABLE_WEIGHT_MIN } from './Settings';
import { CreateType, isArmorData, isShieldData, isWeaponData, ItemData } from '../../types/Items';
import { createSpellItems, dataSourcesOfType, drawFromSources, DrawResult, mergeExistingStacks, mergeStacks, rollTreasureValues } from './Utilities';
import { DataSource, GenType, PoolSource, SourceType } from './data/DataSource';
import ModuleSettings, {
    FEATURE_ALLOW_MERGING,
    FEATURE_QUICK_ROLL_CONTROL,
    FEATURE_QUICK_ROLL_MODIFIERS,
    FEATURE_QUICK_ROLL_SHIFT,
} from '../settings-app/ModuleSettings';
import { SpellItemType, spellSources } from './data/Spells';
import { AppFilter, FilterType, spellLevelFilters, spellSchoolFilters, spellTraditionFilters } from './Filters';
import { consumableSources } from './data/Consumable';
import { permanentSources } from './data/Permanent';
import { treasureSources } from './data/Treasure';
import { NumberFilter } from '../filter/Operation/NumberFilter';
import { StringFilter } from '../filter/Operation/StringFilter';
import { EqualityType } from '../filter/EqualityType';
import { AndGroup, OrGroup } from '../filter/FilterGroup';
import { WeightedFilter } from '../filter/Operation/WeightedFilter';
import { ArrayIncludesFilter } from '../filter/Operation/ArrayIncludesFilter';
import DragEvent = JQuery.DragEvent;

export enum LootAppSetting {
    Count = 'count',
}

export const extendLootSheet = () => {
    type ActorSheetConstructor = new (...args: any[]) => ActorSheet;
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
        protected createBaseItem: ItemData;

        // mapping of collapse-ids to hidden or not states
        protected collapsibles: Record<string, boolean> = {};

        protected getCreateData() {
            const data = {};

            if (isWeaponData(this.createBaseItem)) {
                data['type'] = CreateType.Weapon;
            } else if (isShieldData(this.createBaseItem)) {
                data['type'] = CreateType.Shield;
            } else if (isArmorData(this.createBaseItem)) {
                data['type'] = CreateType.Armor;
            }

            return data;
        }

        public getData(options?: Application.RenderOptions) {
            const data = super.getData(options);

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

        private async createItems(datas: ItemData[]) {
            //@ts-ignore
            await this.actor.createEmbeddedDocuments('Item', datas);
        }

        private async updateItems(datas: ItemData[]) {
            //@ts-ignore
            await this.actor.updateEmbeddedDocuments('Item', datas);
        }

        /**
         * Create a group of items from a draw result
         * @param results
         * @private
         */
        private async createItemsFromDraw(results: DrawResult[]) {
            let itemsToUpdate: ItemData[];
            let itemsToCreate = results.map((d) => d.itemData);
            if (ModuleSettings.get(FEATURE_ALLOW_MERGING)) {
                const existing = this.actor.data.items.map((item) => item.data);
                [itemsToUpdate, itemsToCreate] = mergeExistingStacks(existing, itemsToCreate);
            } else {
                itemsToCreate = mergeStacks(itemsToCreate);
            }

            itemsToCreate.sort((a, b) => a.data.slug.localeCompare(b.data.slug));

            await this.updateItems(itemsToUpdate);
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
            console.warn('event');
            console.warn(event);
            console.warn('data');
            console.warn(data);

            const dragEvent: DragEvent = event as DragEvent;
            const dropRegion = $(this.element).find('div.template-drop');
            const dropTarget = dropRegion.find(dragEvent.target);

            const isTemplateDrop = dropTarget.length > 0;

            if (isTemplateDrop) {
                const item = await Item.fromDropData(data);
                this.createBaseItem = item.data;
                await this.render(true);
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
            if (!this.actor.getFlag(MODULE_NAME, 'settings')) {
                await this._updateObject(new Event('submit'), this._getSubmitData());
            }

            /**
             * Calculate quick roll count by checking event modifiers and the module settings.
             * @param event
             */
            const getQuickRollCount = (event: JQuery.ClickEvent): number => {
                if (!ModuleSettings.get(FEATURE_QUICK_ROLL_MODIFIERS)) {
                    return 1;
                }

                let count = 1;
                if (event.shiftKey) {
                    count *= ModuleSettings.get(FEATURE_QUICK_ROLL_SHIFT) as number;
                }
                if (event.ctrlKey) {
                    count *= ModuleSettings.get(FEATURE_QUICK_ROLL_CONTROL) as number;
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

                let spells = (await Promise.all(promises)).flat().map((spell) => spell.data) as unknown as ItemData[];
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
                    ui.notifications.warn('The current filters excluded all spells.', { permanent: true });
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
