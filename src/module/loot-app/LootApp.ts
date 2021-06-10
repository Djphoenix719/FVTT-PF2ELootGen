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

import {
    drawFromTables,
    getSchoolSettings,
    getSpellSettings,
    getTableSettings,
    mergeExistingStacks,
    mergeStacks,
    rollTreasureValues,
    TableData,
    TableDrawResult,
    tablesOfType,
} from './Utilities';
import { ITableDef, rollableTableDefs } from './data/Tables';
import { MODULE_NAME, PF2E_LOOT_SHEET_NAME } from '../Constants';
import { permanentTables } from './data/tables/Permanent';
import { consumableTables } from './data/tables/Consumable';
import { treasureTables } from './data/tables/Treasure';
import { TABLE_WEIGHT_MAX, TABLE_WEIGHT_MIN } from './Settings';
import ModuleSettings, { FEATURE_ALLOW_MERGING } from '../settings-app/ModuleSettings';
import { ItemData } from '../../types/Items';
import { spellLevelTables, SpellSchool } from './data/Spells';

export enum TableType {
    Treasure = 'treasure',
    Permanent = 'permanent',
    Consumable = 'consumable',
}
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
                    initial: 'scrolls',
                },
            ];
            return options;
        }

        get title(): string {
            return 'PF2E Loot Gen';
        }

        get template(): string {
            return `modules/${MODULE_NAME}/templates/loot-app/index.html`;
        }

        public getData(options?: Application.RenderOptions) {
            const data = super.getData(options);

            data['tableSettings'] = {
                minValue: TABLE_WEIGHT_MIN,
                maxValue: TABLE_WEIGHT_MAX,
            };

            data['spellSchools'] = Object.keys(SpellSchool).map((school) => getSchoolSettings(this.actor, school as SpellSchool));

            data['permanentTables'] = permanentTables.map((table) => getTableSettings(this.actor, table));
            data['consumableTables'] = consumableTables.map((table) => getTableSettings(this.actor, table));
            data['treasureTables'] = treasureTables.map((table) => getTableSettings(this.actor, table));

            data['spellLevels'] = spellLevelTables.map((table) => getSpellSettings(this.actor, table));

            console.warn(data);
            console.warn(data['actor'].flags['pf2e-lootgen']);

            return data;
        }

        /**
         * Create a group of items from a draw result
         * @param results
         * @private
         */
        private async createItemsFromDraw(results: TableDrawResult[]) {
            let itemsToCreate = results.map((d) => d.itemData);
            let itemsToUpdate: ItemData[];
            if (ModuleSettings.get(FEATURE_ALLOW_MERGING)) {
                const existing = this.actor.data.items.map((item) => item.data);
                [itemsToUpdate, itemsToCreate] = mergeExistingStacks(existing, itemsToCreate);
            } else {
                itemsToCreate = mergeStacks(itemsToCreate);
            }

            itemsToCreate.sort((a, b) => a.data.slug.localeCompare(b.data.slug));

            // @ts-ignore
            await this.actor.updateEmbeddedDocuments('Item', itemsToUpdate);
            // @ts-ignore
            await this.actor.createEmbeddedDocuments('Item', itemsToCreate);
        }

        /**
         * Helper function to retrieve certain settings from the flags store.
         * @param type The type of the setting, since these settings are duplicated over the three generator types.
         * @param key The setting key.
         * @private
         */
        private getLootAppSetting<T = any>(type: TableType, key: LootAppSetting): T {
            return this.actor.getFlag(MODULE_NAME, `settings.${type}.${key}`) as T;
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

            // group roll button
            html.find('.buttons .roll').on('click', async (event) => {
                event.preventDefault();
                event.stopPropagation();

                const { container } = getContainer(event);
                const type = container.data('type') as TableType;

                let tablesDefs: ITableDef[] = tablesOfType(type);

                const tables = tablesDefs.map((table) => getTableSettings(this.actor, table)).filter((table) => table.enabled);
                let results = await drawFromTables(this.getLootAppSetting<number>(type, LootAppSetting.Count), tables);
                results = await rollTreasureValues(results);

                await this.createItemsFromDraw(results);
            });

            /**
             * Set all the table values for a specific key in an entire tab
             */
            const setTableSettings = async (type: TableType, key: keyof Omit<TableData, keyof ITableDef>, value: any) => {
                await this.actor.update(
                    tablesOfType(type).reduce((prev, curr) => {
                        return mergeObject(prev, {
                            [`flags.${MODULE_NAME}.${curr.id}.${key}`]: value,
                        });
                    }, {}),
                );
            };

            // check-all button
            html.find('.buttons .check-all').on('click', async (event) => {
                event.preventDefault();
                event.stopPropagation();

                const { container } = getContainer(event);
                const type = container.data('type') as TableType;
                await setTableSettings(type, 'enabled', true);
            });
            // check-none button
            html.find('.buttons .check-none').on('click', async (event) => {
                event.preventDefault();
                event.stopPropagation();

                const { container } = getContainer(event);
                const type = container.data('type') as TableType;
                await setTableSettings(type, 'enabled', false);
            });
            // reset button
            html.find('.buttons .reset').on('click', async (event) => {
                event.preventDefault();
                event.stopPropagation();

                const { container } = getContainer(event);
                const type = container.data('type') as TableType;
                await setTableSettings(type, 'weight', 100);
            });

            // quick roll button
            html.find('.weights i.fa-dice-d20').on('click', async (event) => {
                event.preventDefault();
                event.stopPropagation();

                const element = $(event.currentTarget).closest('.tables-row');
                const tableId = element.data('table-id') as string;
                const table = rollableTableDefs.find((table) => table.id === tableId);

                let results = await drawFromTables(1, [getTableSettings(this.actor, table)]);
                results = await rollTreasureValues(results);

                await this.createItemsFromDraw(results);
            });
        }
    }
    return LootApp;
};
