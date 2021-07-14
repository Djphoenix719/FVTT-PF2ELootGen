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

import { IEnabled, IWeighted } from './Mixins';
import { PF2EItem } from '../../../types/PF2E';

export enum SourceType {
    Table = 'table',
    Pack = 'pack',
    Pool = 'pool',
}

export enum GenType {
    Treasure = 'treasure',
    Permanent = 'permanent',
    Consumable = 'consumable',
    Spell = 'spell',
}

export const tableStoreId = (id: string) => `table-${id}`;
export const filterStoreId = (id: string) => `filter-${id}`;

export interface IStorable {
    id: string | null;
    storeId: string | null;
}
export interface DataSource extends IStorable, IWeighted, IEnabled {
    id: string | null;
    sourceType: SourceType;
    itemType?: GenType;
}

export interface TableSource extends DataSource {
    // id is table id in this case
    id: string;
    sourceType: SourceType.Table;
    // Where to find the table.
    tableSource: PackSource;
}
export function isTableSource(source: DataSource): source is TableSource {
    return source.sourceType === SourceType.Table;
}
export async function getTableSourceTable(source: TableSource): Promise<RollTable> {
    return await getFromPackSource(source.tableSource, source.id);
}

export interface PackSource extends DataSource {
    // id is compendium pack id in this case
    id: string;
    sourceType: SourceType.Pack;
}
export function isPackSource(source: DataSource): source is PackSource {
    return source.sourceType === SourceType.Pack;
}
export function getPack(source: PackSource) {
    return game.packs.get(source.id);
}
export async function getFromPackSource<TResult = PF2EItem>(source: PackSource, documentId: string): Promise<TResult> {
    const pack = game.packs.get(source.id);
    // @ts-ignore
    return await pack.getDocument(documentId);
}
export async function getPackSourceContents(source: PackSource): Promise<PF2EItem[]> {
    const pack = game.packs.get(source.id);
    // @ts-ignore
    return await pack.getDocuments();
}

export interface PoolSource extends DataSource {
    // id will be null in this case
    id: null;
    sourceType: SourceType.Pool;
    elements: PF2EItem[];
}
export function isPoolSource(source: DataSource): source is PoolSource {
    return source.sourceType === SourceType.Pool;
}

export type FilteredSource<TSource extends DataSource, TItem extends PF2EItem = PF2EItem> = TSource & {
    getFiltered: (source: TSource) => Promise<TItem[]>;
};

/**
 * Convert a number to an ordinal string (1st, 2nd, 3rd...)
 * @param n The number to convert.
 */
export function ordinalNumber(n: number): string {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const index = n % 100;
    const ordinal = suffixes[(index - 20) % 10] || suffixes[index] || suffixes[0];
    return `${n}${ordinal}`;
}
