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

import { permanentSources } from './data/Permanent';
import { consumableSources } from './data/Consumable';
import { isTreasureSource, TreasureSource, treasureSources } from './data/Treasure';
import { SpellItemType, spellSources } from './data/Spells';
import { DataSource, getPack, isPackSource, isPoolSource, isTableSource, ItemType } from './data/DataSource';
import { ItemData } from '../../types/Items';
import { getItemFromPack, getTableFromPack } from '../Utilities';
import { AppFilter, FilterType, spellFilters, spellLevelFilters, spellSchoolFilters } from './Filters';

/**
 * Returns distinct elements of an array when used to filter an array.
 * @param value
 * @param index
 * @param array
 */
function distinct<T>(value: T, index: number, array: T[]): boolean {
    return array.indexOf(value) === index;
}

/**
 * Choose a random element from the array.
 * @param choices The array of choices.
 */
function chooseFromArray<T>(choices: T[]): T {
    return choices[Math.floor(Math.random() * choices.length)];
}

/**
 * Return the correct source map for the given item type.
 * @param type Type of sources to fetch.
 */
export function dataSourcesOfType(type: ItemType): Record<string, DataSource> {
    switch (type) {
        case ItemType.Treasure:
            return treasureSources;
        case ItemType.Permanent:
            return permanentSources;
        case ItemType.Consumable:
            return consumableSources;
        case ItemType.Spell:
            return spellSources;
    }
}

export function filtersOfType(type: FilterType): Record<string, AppFilter> {
    switch (type) {
        case FilterType.SpellSchool:
            return spellSchoolFilters;
        case FilterType.SpellLevel:
            return spellLevelFilters;
    }
}

export interface DrawOptions {
    displayChat?: boolean;
}
export interface DrawResult {
    itemData: ItemData;
    source: DataSource;
}
export interface SpellDrawResult extends DrawResult {}

/**
 * Draw from a series of data sources and return the item data for the items drawn, along with their source tables.
 * @param count The number of items to draw.
 * @param sources The data sources available to be drawn from.
 * @param options Options
 */
export async function drawFromSources(count: number, sources: DataSource[], options?: DrawOptions): Promise<DrawResult[]> {
    if (options === undefined) {
        options = {
            displayChat: true,
        };
    }

    if (sources.length === 0) {
        return [];
    }
    sources = duplicate(sources) as DataSource[];

    let weightTotal = 0;
    sources.forEach((source) => {
        weightTotal += source.weight;
    });

    const chooseTable = () => {
        let choice = sources[0];
        const random = Math.random() * weightTotal;
        for (let i = 1; i < sources.length; i++) {
            if (random < choice.weight) break;
            choice = sources[i];
        }
        return choice;
    };

    const results: DrawResult[] = [];
    for (let i = 0; i < count; i++) {
        const choice = chooseTable();

        // TODO: Something is "weird" with the table weights, seeming to prefer very high level items and large groups
        //  of the same item are being created, even with all tables enabled and evenly weighted
        let item: ItemData;
        if (isTableSource(choice)) {
            const table = await getTableFromPack(choice.id, choice.tableSource.id);

            // @ts-ignore
            const draw = await table.roll({ roll: null, recursive: true });
            const [result]: [TableResult] = draw.results;

            if (result.data.resultId) {
                item = await getItemFromPack(result.data.collection, result.data.resultId);
            } else {
                // TODO: Create random weapons/armor/gear of rolled type
                i -= 1;
                continue;
            }
        } else if (isPackSource(choice)) {
            // @ts-ignore
            const itemId: string = chooseFromArray(getPack(choice).index.contents).key;
            item = await getItemFromPack(choice.id, itemId);
        } else if (isPoolSource(choice)) {
            item = chooseFromArray(choice.elements);
        } else {
            throw new Error(`Unknown source type: ${choice.sourceType}`);
        }

        results.push({
            itemData: item.data as unknown as ItemData,
            source: choice,
        });
    }

    // if (options.displayChat) {
    //     await buildRollTableMessage(results);
    // }
    return results;
}

export async function createSpellItems(itemDatas: ItemData[], itemTypes: SpellItemType[]): Promise<ItemData[]> {
    // TODO:
    return undefined;
}

//
// /**
//  * Build a rollable table results message
//  * @param results
//  */
// export async function buildRollTableMessage(results: TableDrawResult[]) {
//     const pool = PoolTerm.fromRolls(results.map((r) => r.roll));
//     const roll = Roll.fromTerms([pool]);
//     const uniqueTables = results.map((result) => result.tableId).filter(distinct);
//     const messageData = {
//         flavor: `Drew ${results.length} result(s) from ${uniqueTables.length} table(s).`,
//         user: game.user.id,
//         type: CONST.CHAT_MESSAGE_TYPES.ROLL,
//         roll: roll,
//         sound: CONFIG.sounds.dice,
//         content: '',
//         flags: { 'core.RollTable': null },
//     };
//
//     messageData.content = await renderTemplate(CONFIG.RollTable.resultTemplate, {
//         results: results.map((result) => {
//             return {
//                 id: result.resultId,
//                 text: `@Compendium[${result.collection}.${result.resultId}]{${result.itemData.name}}`,
//                 icon: result.itemData['img'],
//             };
//         }),
//         table: null,
//     });
//     messageData.content = TextEditor.enrichHTML(messageData.content, { entities: true });
//
//     // @ts-ignore
//     return ChatMessage.create(messageData, {});
//

/**
 * Roll and create a new set of item data for the values of treasure items in the results
 * @param results The results to duplicate and then modify
 */
export async function rollTreasureValues(results: DrawResult[]) {
    const rollValue = async (source: TreasureSource): Promise<number> => {
        // @ts-ignore
        const roll = await new Roll(source.value).roll({ async: true });
        return roll.total;
    };

    results = duplicate(results) as DrawResult[];
    for (const result of results) {
        if (isTreasureSource(result.source)) {
            result.itemData['data']['value']['value'] = await rollValue(result.source);
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
