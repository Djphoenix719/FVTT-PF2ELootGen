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
import { getDataSourceSettings, getFilterSettings, LootAppFlags, setDataSourceSettingValue } from './Flags';
import { TABLE_WEIGHT_MAX, TABLE_WEIGHT_MIN } from './Settings';
import { ItemData } from '../../types/Items';
import { dataSourcesOfType, drawFromSources, DrawResult, mergeExistingStacks, mergeStacks, rollTreasureValues } from './Utilities';
import { DataSource, TableType } from './data/DataSource';
import ModuleSettings, { FEATURE_ALLOW_MERGING } from '../settings-app/ModuleSettings';
import { SpellSchool } from './data/Spells';
import { spellFilters } from './data/Filters';

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
                    initial: 'spell',
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

        public getData(options?: Application.RenderOptions) {
            const data = super.getData(options);

            data['constants'] = {
                rangeMin: TABLE_WEIGHT_MIN,
                rangeMax: TABLE_WEIGHT_MAX,
            };

            data['filters'] = {
                spell: {
                    school: Object.values(spellFilters).map((filter) => getFilterSettings(this.actor, filter)),
                },
            };

            data['sources'] = Object.values(TableType).reduce(
                (prev, curr) =>
                    mergeObject(prev, {
                        [curr]: Object.values(dataSourcesOfType(curr)).map((source) => getDataSourceSettings(this.actor, source)),
                    }),
                {},
            );

            // data['spellLevels'] = leveledSpellSources.map((table) => getTableSettings(this.actor, table));

            console.warn(data);
            console.warn(data['actor'].flags['pf2e-lootgen']);

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

        // private async createSpellItemsFromDraws(results: SpellDrawResults[]) {
        //     const itemDatas = await createItemsFromSpellDraws(results);
        //     await this.createItems(itemDatas);
        // }

        /**
         * Helper function to retrieve certain settings from the flags store.
         * @param type The type of the setting, since these settings are duplicated over the three generator types.
         * @param key The setting key.
         * @private
         */
        private getLootAppSetting<T = any>(type: TableType, key: LootAppSetting): T {
            return this.actor.getFlag(MODULE_NAME, `config.${type}.${key}`) as T;
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

            const getContainer = (event: JQuery.ClickEvent) => {
                const element = $(event.currentTarget);
                const container = element.closest('.tab-container');
                return { element, container };
            };
            const getType = (event: JQuery.ClickEvent) => {
                const { container } = getContainer(event);
                return container.data('type') as TableType;
            };

            // group roll button
            html.find('.buttons .roll').on('click', async (event) => {
                event.preventDefault();
                event.stopPropagation();

                const { container } = getContainer(event);
                const type = container.data('type') as TableType;

                const sources = Object.values(dataSourcesOfType(type))
                    .map((source) => getDataSourceSettings(this.actor, source))
                    .filter((table) => table.enabled);

                let results = await drawFromSources(this.getLootAppSetting<number>(type, LootAppSetting.Count), sources);
                results = await rollTreasureValues(results);
                await this.createItemsFromDraw(results);
            });

            // quick roll button
            html.find('.sources i.fa-dice-d20').on('click', async (event) => {
                event.preventDefault();
                event.stopPropagation();

                const element = $(event.currentTarget).closest('.sources-row');
                const source: DataSource = element.data('source');

                let results = await drawFromSources(1, [source]);
                results = await rollTreasureValues(results);
                await this.createItemsFromDraw(results);
            });

            // const rollSpells = async (consumableTypes: SpellItemType[]) => {
            //     const promises: Promise<Entity[]>[] = [];
            //     for (const table of spellSources) {
            //         // @ts-ignore
            //         promises.push(game.packs.get(table.packId).getDocuments());
            //     }
            //     const spells = (await Promise.all(promises)).flat().map((spell) => spell.data) as unknown as ItemData[];
            //
            //     const choices: SpellOptions = Object.values(SpellSchool).reduce(
            //         (prev, curr) =>
            //             mergeObject(prev, {
            //                 [curr]: {
            //                     enabled: this.actor.getFlag(MODULE_NAME, `settings.scroll.${curr}.enabled`),
            //                     spells: spells.filter((spell) => spell.data.school?.value === curr),
            //                 },
            //             }),
            //         {},
            //     ) as SpellOptions;
            //
            //     const count = this.getLootAppSetting<number>(TableType.Spell, LootAppSetting.Count);
            //     const spellDraws = await drawFromSources(count, choices, {
            //         displayChat: true, // TODO
            //         consumableTypes: consumableTypes,
            //     });
            //     const spellDatas = await createItemsFromSpellDraws(spellDraws);
            //     // await this.createItemsFromDraw();
            // };
            //
            // // roll scrolls
            // html.find('.buttons .roll-scroll').on('click', async (event) => {
            //     event.preventDefault();
            //     event.stopPropagation();
            //
            //     await rollSpells(container, [SpellConsumableType.Scroll]);
            // });
            // // roll wands
            // html.find('.buttons .roll-wand').on('click', async (event) => {
            //     event.preventDefault();
            //     event.stopPropagation();
            //
            //     const { container } = getContainer(event);
            //     await rollSpells(container, [SpellConsumableType.Wand]);
            // });
            // // roll scrolls + wands
            // html.find('.buttons .roll-both').on('click', async (event) => {
            //     event.preventDefault();
            //     event.stopPropagation();
            //
            //     const { container } = getContainer(event);
            //     await rollSpells(container, [SpellConsumableType.Scroll, SpellConsumableType.Wand]);
            // });

            /**
             * Set all the table values for a specific key in an entire tab
             */
            // const setTableSettings = async (type: TableType, key: keyof Omit<TableData, keyof IRollableTableDef>, value: any) => {
            //     await this.actor.update(
            //         sourcesOfType(type).reduce((prev, curr) => {
            //             return mergeObject(prev, {
            //                 [`flags.${MODULE_NAME}.${curr.id}.${key}`]: value,
            //             });
            //         }, {}),
            //     );
            // };

            // check-all button
            html.find('.buttons .check-all').on('click', async (event) => {
                event.preventDefault();
                event.stopPropagation();

                await setDataSourceSettingValue(this.actor, getType(event), 'enabled', true);
            });
            // check-none button
            html.find('.buttons .check-none').on('click', async (event) => {
                event.preventDefault();
                event.stopPropagation();

                await setDataSourceSettingValue(this.actor, getType(event), 'enabled', false);
            });
            // reset button
            html.find('.buttons .reset').on('click', async (event) => {
                event.preventDefault();
                event.stopPropagation();

                await setDataSourceSettingValue(this.actor, getType(event), ['weight', 'enabled'], [1, true]);
            });
        }
    }
    return LootApp;
};
