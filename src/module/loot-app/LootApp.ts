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

import { buildRollTableMessage } from './Utilities';

export enum TableType {
    Treasure = 'treasure',
    Permanent = 'permanent',
    Consumable = 'consumable',
}

export interface RollResult {
    roll: Roll;
    tableResult: any;
}

import { MODULE_NAME, PF2E_LOOT_SHEET_NAME } from '../Constants';
import { consumableTables, ITableDef, permanentTables, treasureTables } from './data/Tables';
import { getItemFromPack, getTableFromPack } from '../Utilities';
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

        /**
         * Fetch and package data needed to render a table row in the sheet.
         * @param table Table definition object
         * @private
         */
        private getTableRenderData(table: ITableDef) {
            const getParam = function (actor: Actor, key: string): any {
                return actor.getFlag(MODULE_NAME, `${table.id}.${key}`);
            };

            const enabled: boolean = getParam(this.actor, 'enabled') ?? false;
            const weight: number = getParam(this.actor, 'weight') ?? 1;

            return {
                ...table,
                enabled,
                weight,
            };
        }

        private getSetting(category: TableType, key: string) {
            return this.actor.getFlag(MODULE_NAME, `settings.${category}.${key}`);
        }

        private async rollTable(event: JQuery.ClickEvent, tableId: string, packId: string) {
            const table = await getTableFromPack(tableId, packId);
            // TODO: Display settings
            // @ts-ignore
            await table.draw({ displayChat: true });
        }

        private async rollTables(event: JQuery.ClickEvent, type: TableType) {
            let allTables: ITableDef[];
            switch (type) {
                case TableType.Treasure:
                    allTables = treasureTables;
                    break;
                case TableType.Permanent:
                    allTables = permanentTables;
                    break;
                case TableType.Consumable:
                    allTables = consumableTables;
                    break;
            }

            const enabled = allTables.map((table) => this.getTableRenderData(table)).filter((data) => data.enabled);
            if (enabled.length === 0) return;

            let weightTotal = 0;
            for (const table of enabled) {
                weightTotal += table.weight;
                table.weight = weightTotal;
            }

            const chooseOne = () => {
                let choice = enabled[0];
                const random = Math.random() * weightTotal;
                for (let i = 1; i < enabled.length; i++) {
                    if (random < choice.weight) break;
                    choice = enabled[i];
                }
                return choice;
            };

            const rollResults: Roll[] = [];
            const tableResults: any[] = [];
            let count = this.getSetting(type, 'count') as number;
            while (count > 0) {
                let choice = chooseOne();
                const table = (await getTableFromPack(choice.id, choice.packId)) as RollTable;
                // @ts-ignore
                const draw = await table.roll({ roll: null, recursive: true });
                rollResults.push(draw.roll);
                tableResults.push(...draw.results);

                count -= 1;
            }

            console.warn(tableResults);

            await buildRollTableMessage(rollResults, tableResults);
        }

        public getData(options?: Application.RenderOptions) {
            const data = super.getData(options);

            data['permanentTables'] = permanentTables.map(this.getTableRenderData.bind(this));
            data['consumableTables'] = consumableTables.map(this.getTableRenderData.bind(this));
            data['treasureTables'] = treasureTables.map(this.getTableRenderData.bind(this));

            console.warn(data);
            console.warn(data['actor'].flags['pf2e-lootgen']);

            return data;
        }

        public activateListeners(html: JQuery) {
            super.activateListeners(html);

            html.find('button.roll-tables').on('click', async (event) => {
                const type = $(event.currentTarget).data('type') as TableType;
                await this.rollTables(event, type);
            });
            html.find('.tables-row i.fa-dice-d20').on('click', async (event) => {
                const element = $(event.currentTarget).closest('.tables-row');
                const tableId = element.data('table-id') as string;
                const packId = element.data('pack-id') as string;
                await this.rollTable(event, tableId, packId);
            });
        }
    }
    return LootApp;
};
