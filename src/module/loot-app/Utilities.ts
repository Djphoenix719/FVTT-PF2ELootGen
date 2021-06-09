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

import { isTreasureTableDef, ITableDef, ITreasureTableDef } from './data/Tables';
import { getItemFromPack, getTableFromPack } from '../Utilities';
import { MODULE_NAME } from '../Constants';

/**
 * Fetch and package data needed to render a table row in the sheet.
 * @param actor Actor to fetch from
 * @param table Table definition object
 */
export function getTableSettings(actor: Actor, table: ITableDef) {
    const getParam = function (key: string): any {
        return actor.getFlag(MODULE_NAME, `${table.id}.${key}`);
    };

    const enabled: boolean = getParam('enabled') ?? false;
    const weight: number = getParam('weight') ?? 1;

    return {
        ...table,
        enabled,
        weight,
    };
}
export type TableData = ReturnType<typeof getTableSettings>;

export interface TableDrawOptions {
    displayChat?: boolean;
}
export interface TableDrawResult {
    roll: Roll;
    collection: string;
    resultId: string;
    tableId: string;
    itemData: Entity.Data;
    def: TableData;
}
export async function drawFromTables(count: number, tables: TableData[], options?: TableDrawOptions): Promise<TableDrawResult[]> {
    options = options ?? {
        displayChat: true,
    };

    tables = duplicate(tables) as TableData[];
    if (tables.length === 0) return [];

    let weightTotal = 0;
    for (const table of tables) {
        weightTotal += table.weight;
        table.weight = weightTotal;
    }

    const chooseTable = () => {
        let choice = tables[0];
        const random = Math.random() * weightTotal;
        for (let i = 1; i < tables.length; i++) {
            if (random < choice.weight) break;
            choice = tables[i];
        }
        return choice;
    };

    const results: TableDrawResult[] = [];
    for (let i = 0; i < count; i++) {
        const choice = chooseTable();
        const table = await getTableFromPack(choice.id, choice.packId);
        // @ts-ignore
        const draw = await table.roll({ roll: null, recursive: true });
        const [result]: [TableResult] = draw.results;

        const item = await getItemFromPack(result.data.collection, result.data.resultId);

        results.push({
            roll: draw.roll,
            collection: result.data.collection,
            resultId: result.data.resultId,
            tableId: table.id,
            itemData: item.data,
            def: choice,
        });
    }

    if (options.displayChat) {
        await buildRollTableMessage(results);
    }
    console.warn(results);
    return results;
}

export async function buildRollTableMessage(results: TableDrawResult[]) {
    const distinct = (value: any, index: number, array: any[]) => {
        return array.indexOf(value) === index;
    };

    const pool = PoolTerm.fromRolls(results.map((r) => r.roll));
    const roll = Roll.fromTerms([pool]);
    const uniqueTables = results.map((result) => result.tableId).filter(distinct);
    const messageData = {
        flavor: `Drew ${results.length} result(s) from ${uniqueTables.length} table(s).`,
        user: game.user.id,
        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
        roll: roll,
        sound: CONFIG.sounds.dice,
        content: '',
        flags: { 'core.RollTable': null },
    };

    messageData.content = await renderTemplate(CONFIG.RollTable.resultTemplate, {
        results: results.map((result) => {
            return {
                id: result.resultId,
                text: `@Compendium[${result.collection}.${result.resultId}]{${result.itemData.name}}`,
                icon: result.itemData['img'],
            };
        }),
        table: null,
    });
    messageData.content = TextEditor.enrichHTML(messageData.content, { entities: true });

    // @ts-ignore
    return ChatMessage.create(messageData, {});
}

export async function rollTreasureValues(results: TableDrawResult[]) {
    const rollValue = async (table: TableDrawResult): Promise<number> => {
        if (isTreasureTableDef(table.def)) {
            // @ts-ignore
            const roll = await new Roll((table.def as ITreasureTableDef).value).roll({ async: true });
            return roll.total;
        }
        throw new Error('Unable to roll a treasure value with no defined roll.');
    };

    results = duplicate(results) as TableDrawResult[];
    for (const result of results) {
        result.itemData['data']['value']['value'] = await rollValue(result);
    }

    return results;
}
