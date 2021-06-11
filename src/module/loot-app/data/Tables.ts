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

import { permanentTables } from './tables/Permanent';
import { consumableTables } from './tables/Consumable';
import { treasureTables } from './tables/Treasure';

export interface ITableDef {
    id: string;
    // TODO: We should have a pack def type, to reuse more code
    packId: string;
    name: string;
}
export interface ITreasureTableDef extends ITableDef {
    value: string;
}

export function isTableDef(table: object): table is ITableDef {
    return table.hasOwnProperty('id') && table.hasOwnProperty('packId') && table.hasOwnProperty('name');
}
export function isTreasureTableDef(table: object): table is ITreasureTableDef {
    return isTableDef(table) && table.hasOwnProperty('value');
}

export const rollableTableDefs = [...consumableTables, ...permanentTables, ...treasureTables];
