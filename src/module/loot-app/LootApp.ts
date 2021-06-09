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

import { drawFromTables, getTableSettings, rollTreasureValues } from './Utilities';
import { rollableTableDefs } from './data/Tables';
import { MODULE_NAME, PF2E_LOOT_SHEET_NAME } from '../Constants';
import { permanentTables } from './data/tables/Permanent';
import { consumableTables } from './data/tables/Consumable';
import { treasureTables } from './data/tables/Treasure';

export enum TableType {
    Treasure = 'treasure',
    Permanent = 'permanent',
    Consumable = 'consumable',
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

        public activateListeners(html: JQuery) {
            super.activateListeners(html);

            html.find('button.roll-tables').on('click', async (event) => {
                const type = $(event.currentTarget).data('type') as TableType;
                // await this.rollTables(event, type);
            });
            html.find('.tables-row i.fa-dice-d20').on('click', async (event) => {
                const element = $(event.currentTarget).closest('.tables-row');
                const tableId = element.data('table-id') as string;
                const table = rollableTableDefs.find((table) => table.id === tableId);

                let drawm = await drawFromTables(1, [getTableSettings(this.actor, table)]);
                drawm = await rollTreasureValues(drawm);

                // TODO: Treasure values are not correct (I think?)

                // @ts-ignore
                this.actor.createEmbeddedDocuments(
                    // @ts-ignore
                    'Item',
                    // @ts-ignore
                    drawm.map((d) => d.itemData),
                );
            });
        }
    }
    return LootApp;
};
