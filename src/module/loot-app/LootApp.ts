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

import { drawFromTables, getTableSettings, mergeStacks, rollTreasureValues, TableDrawResult } from './Utilities';
import { isTreasureTableDef, ITableDef, rollableTableDefs } from './data/Tables';
import { MODULE_NAME, PF2E_LOOT_SHEET_NAME } from '../Constants';
import { permanentTables } from './data/tables/Permanent';
import { consumableTables } from './data/tables/Consumable';
import { treasureTables } from './data/tables/Treasure';

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
                    initial: 'treasure',
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

            data['permanentTables'] = permanentTables.map((table) => getTableSettings(this.actor, table));
            data['consumableTables'] = consumableTables.map((table) => getTableSettings(this.actor, table));
            data['treasureTables'] = treasureTables.map((table) => getTableSettings(this.actor, table));

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
            let itemDatas = results.map((d) => d.itemData);
            itemDatas = mergeStacks(itemDatas);
            itemDatas.sort((a, b) => a.data.slug.localeCompare(b.data.slug));

            // @ts-ignore
            await this.actor.createEmbeddedDocuments('Item', itemDatas);
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

        public activateListeners(html: JQuery) {
            super.activateListeners(html);

            html.find('button.roll-tables').on('click', async (event) => {
                const type = $(event.currentTarget).data('type') as TableType;
                let tablesDefs: ITableDef[];
                switch (type) {
                    case TableType.Treasure:
                        tablesDefs = treasureTables;
                        break;
                    case TableType.Permanent:
                        tablesDefs = permanentTables;
                        break;
                    case TableType.Consumable:
                        tablesDefs = consumableTables;
                        break;
                }

                const tables = tablesDefs.map((table) => getTableSettings(this.actor, table)).filter((table) => table.enabled);
                let results = await drawFromTables(this.getLootAppSetting<number>(type, LootAppSetting.Count), tables);
                results = await rollTreasureValues(results);

                await this.createItemsFromDraw(results);
            });
            // quick roll button
            html.find('.tables-row i.fa-dice-d20').on('click', async (event) => {
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
