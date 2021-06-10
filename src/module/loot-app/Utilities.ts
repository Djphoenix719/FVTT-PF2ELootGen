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
import { ItemData } from '../../types/Items';
import { TableType } from './LootApp';
import { treasureTables } from './data/tables/Treasure';
import { permanentTables } from './data/tables/Permanent';
import { consumableTables } from './data/tables/Consumable';
import { TABLE_WEIGHT_DEFAULT } from './Settings';
import { ISpellDef, SCROLL_TEMPLATE_PACK_ID, SpellSchool } from './data/Spells';

// Helper function for distinct values of an array.
const distinct = (value: any, index: number, array: any[]) => {
    return array.indexOf(value) === index;
};

/**
 * Return the correct table map for the given table type.
 * @param type
 */
export function tablesOfType(type: TableType): ITableDef[] {
    console.warn(type);
    switch (type) {
        case TableType.Treasure:
            return treasureTables;
        case TableType.Permanent:
            return permanentTables;
        case TableType.Consumable:
            return consumableTables;
    }
}

/**
 * Fetch and package data needed to render a table row in the sheet.
 * @param actor Actor to fetch from
 * @param table Table definition object
 */
export function getTableSettings(actor: Actor, table: ITableDef) {
    const getParam = function (key: string): any {
        return actor.getFlag(MODULE_NAME, `${table.id}.${key}`);
    };

    const enabled: boolean = getParam('enabled') ?? true;
    const weight: number = getParam('weight') ?? TABLE_WEIGHT_DEFAULT;

    return {
        ...table,
        enabled,
        weight,
    };
}
export type TableData = ReturnType<typeof getTableSettings>;

/**
 * Fetch and package data needed to render spell school selection in the scrolls box.
 * @param actor Actor to fetch from.
 * @param school School to fetch for.
 */
export function getSchoolSettings(actor: Actor, school: SpellSchool) {
    const getParam = function (key: string): any {
        return actor.getFlag(MODULE_NAME, `settings.scroll.${school}.${key}`);
    };

    const enabled: boolean = getParam('enabled') ?? true;

    return {
        id: school,
        name: school.capitalize(),
        enabled,
    };
}
export type SchoolData = ReturnType<typeof getSchoolSettings>;

export function getSpellSettings(actor: Actor, def: ISpellDef) {
    const getParam = function (key: string): any {
        return actor.getFlag(MODULE_NAME, `settings.scroll.${def.id}.${key}`);
    };

    const enabled: boolean = getParam('enabled') ?? true;
    const weight: number = getParam('weight') ?? TABLE_WEIGHT_DEFAULT;

    return {
        ...def,
        enabled,
        weight,
    };
}

export interface TableDrawOptions {
    displayChat?: boolean;
}
export interface TableDrawResult {
    roll: Roll;
    collection: string;
    resultId: string;
    tableId: string;
    itemData: ItemData;
    def: TableData;
}

/**
 * Draw a series of items from a group of weighted tables
 * @param count The number of items to draw
 * @param tables The tables and their draw weights
 * @param options
 */
export async function drawFromTables(count: number, tables: TableData[], options?: TableDrawOptions): Promise<TableDrawResult[]> {
    options = options ?? {
        displayChat: true,
    };

    if (tables.length === 0) return [];
    tables = duplicate(tables) as TableData[];

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
    return results;
}

/**
 * Build a rollable table results message
 * @param results
 */
export async function buildRollTableMessage(results: TableDrawResult[]) {
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

/**
 * Roll and modify item data for the values of a treasure item
 * @param results The results to modify
 */
export async function rollTreasureValues(results: TableDrawResult[]) {
    const rollValue = async (table: TableDrawResult): Promise<number> => {
        // @ts-ignore
        const roll = await new Roll((table.def as ITreasureTableDef).value).roll({ async: true });
        return roll.total;
    };

    results = duplicate(results) as TableDrawResult[];
    for (const result of results) {
        if (isTreasureTableDef(result.def)) {
            result.itemData['data']['value']['value'] = await rollValue(result);
        }
    }

    return results;
}

export interface MergeStacksOptions {
    /**
     * Should values be compared when determining uniqueness?
     */
    compareValues?: boolean;
}

/**
 * Get a function that correctly fetches a slug from an item data given the options.
 * @param options
 */
const getSlugFunction = (options: MergeStacksOptions) => {
    // Our slugs are human readable unique ids, in our case when we want to
    // compare the values as well we can append the value to the slug and get
    // a pseudo-hash to use for comparison instead
    let getSlug: (i: ItemData) => string;
    if (options.compareValues) {
        getSlug = (i) => `${i.data.slug}-${i.data.value?.value ?? i.data.price?.value}`;
    } else {
        getSlug = (i) => i.data.slug;
    }
    return getSlug;
};

/**
 *  * Takes two sets of itemDatas, and attempts to merge all the new datas into the old datas.
 * Returns an array of items that were unable to be merges
 * @param oldDatas
 * @param newDatas
 * @param options
 * @returns [merged, remaining]
 *  merged: The successfully merged old + new items
 *  remaining: items that could not be merged.
 */
export function mergeExistingStacks(oldDatas: ItemData[], newDatas: ItemData[], options?: MergeStacksOptions) {
    if (options === undefined) {
        options = { compareValues: true };
    }

    const getSlug = getSlugFunction(options);

    oldDatas = duplicate(oldDatas) as ItemData[];
    newDatas = duplicate(newDatas) as ItemData[];

    const oldSlugs = oldDatas.map(getSlug);
    const newSlugs = newDatas.map(getSlug);

    for (let i = newSlugs.length - 1; i >= 0; i--) {
        const index = oldSlugs.indexOf(newSlugs[i]);
        if (index === -1) continue;
        mergeItem(oldDatas[index], newDatas[i]);
        newDatas.splice(i, 1);
    }

    newDatas = mergeStacks(newDatas, options);

    return [oldDatas, newDatas];
}

/**
 * Merge an array of item datas into a set of stacked items of the same slug
 *  and optionally also compare and do not merge items based on provided options.
 * @param itemDatas
 * @param options
 */
export function mergeStacks(itemDatas: ItemData[], options?: MergeStacksOptions) {
    if (options === undefined) {
        options = { compareValues: true };
    }

    itemDatas = duplicate(itemDatas) as ItemData[];

    console.warn('mergeStacks: itemDatas');
    console.warn(itemDatas);

    const getSlug = getSlugFunction(options);

    let allSlugs: string[] = itemDatas.map(getSlug);
    const unqSlugs = allSlugs.filter(distinct);
    for (const slug of unqSlugs) {
        // we'll keep the first item in the array, and discard the rest
        const first = allSlugs.indexOf(slug);
        for (let i = itemDatas.length - 1; i > first; i--) {
            const itemData = itemDatas[i];
            if (getSlug(itemData) !== slug) continue;
            mergeItem(itemDatas[first], itemData);
            itemDatas.splice(i, 1);
            allSlugs.splice(i, 1);
        }
    }

    return itemDatas;
}

/**
 * Merge item a IN PLACE by incrementing it's quantity by item b's quantity.
 * @param a The target item
 * @param b The item to increase the target by
 */
export function mergeItem(a: ItemData, b: ItemData) {
    a.data.quantity.value += b.data.quantity.value;
}

export async function createItemFromSpell(spellData: ItemData, templateId: string, level?: string) {
    level = level ?? spellData.data.level.value;

    // @ts-ignore
    const templateObject = await game.packs.get(SCROLL_TEMPLATE_PACK_ID)?.getDocument(templateId);
    console.warn(templateObject);

    // const consumableData = consumable.toObject();
    // consumableData.data.traits.value.push(...spellData.data.traditions.value);
    // consumableData.name = getNameForSpellConsumable(type, spellData.name, heightenedLevel);
    // const description = consumableData.data.description.value;
    // consumableData.data.description.value = `@Compendium[pf2e.spells-srd.${spellData._id}]{${spellData.name}}\n<hr/>${description}`;
    // consumableData.data.spell = {
    //     data: duplicate(spellData),
    //     heightenedLevel: heightenedLevel,
    // };
    // return consumableData;
}
