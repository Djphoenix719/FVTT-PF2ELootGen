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
import { ItemData } from '../../../types/Items';
import { TableType } from './Flags';

export enum SourceType {
    Table = 'table',
    Pack = 'pack',
}

export interface DataSource extends IWeighted, IEnabled {
    id: string;
    sourceType: SourceType;
    itemType?: TableType;
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
export async function getFromPackSource<TResult = ItemData>(source: PackSource, documentId: string): Promise<TResult> {
    const pack = game.packs.get(source.id);
    // @ts-ignore
    return await pack.getDocument(documentId);
}
export async function getPackSourceContents(source: PackSource): Promise<ItemData[]> {
    const pack = game.packs.get(source.id);
    // @ts-ignore
    return await pack.getDocuments();
}

export type FilteredSource<TSource extends DataSource, TItem extends ItemData = ItemData> = TSource & {
    getFiltered: (source: TSource) => Promise<TItem[]>;
};
