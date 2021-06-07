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
import { consumableTables, permanentItemsTables } from '../data/Tables';
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
                    initial: 'loot-config',
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

            // TODO: Extract to some sort of helper.
            // TODO: Key should be defined somewhere, rather than relying on duplication of typing.
            data['magicItemTables'] = permanentItemsTables;
            for (const table of data['magicItemTables']) {
                table['enabled'] = this.actor.getFlag(MODULE_NAME, `magic-items.${table['id']}`) ?? false;
            }

            // TODO: Extract to some sort of helper.
            // TODO: Key should be defined somewhere, rather than relying on duplication of typing.
            data['consumablesTables'] = consumableTables;
            for (const table of data['consumablesTables']) {
                table['enabled'] = this.actor.getFlag(MODULE_NAME, `consumables.${table['id']}`) ?? false;
            }

            console.warn(data);

            return data;
        }
    }
    return LootApp;
};
