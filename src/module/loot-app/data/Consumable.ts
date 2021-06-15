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

import { SourceType, TableSource, ItemType, tableStoreId, ordinalNumber } from './DataSource';
import { INamed } from './Mixins';
import { RollableTablesPack } from './RollableTables';

export interface ConsumableSource extends TableSource, INamed {}

const tableIds: string[] = [
    'tlX5PLwar8b1tmiQ',
    'g30jZWCJEiK1RlIa',
    'mDPLoPYwuPo3o0Wj',
    '0WpkRFm8SyfwVCP6',
    'zRyuNslbOzN9oW5u',
    'A68C9O0vtWbFXbfS',
    'E9ZNupg1p4yLpfrd',
    'UmJGUUgN9TQtFQDI',
    'XAJFTpuo8qrcW30P',
    'AIBvZzHidUXxZfEF',
    'Ca7vD8PZtMPqVuHu',
    '5HHqLskEnfjxpkCO',
    'awfTQvkm7NrRjRaQ',
    'Vhuuy0vFJV5tYldR',
    'Af7beeFZhtvDAZaM',
    'aomFSKgGl52z7tdX',
    'YyQkwd1PksU1Lno4',
    'PSs31Xj5RfszMbAe',
    'pH85KVl31VBdENuy',
    'nusyoQjLs0ZxifRd',
];
const consumableSourceTemplate = (level: number): ConsumableSource => {
    return {
        id: tableIds[level],
        storeId: tableStoreId(tableIds[level]),
        name: `${ordinalNumber(level + 1)}-Level`,
        tableSource: RollableTablesPack,
        sourceType: SourceType.Table,
        itemType: ItemType.Permanent,
        weight: 1,
        enabled: true,
    };
};

export const consumableSources: Record<string, ConsumableSource> = tableIds.reduce(
    (prev, curr, indx) =>
        mergeObject(prev, {
            [tableStoreId(curr)]: consumableSourceTemplate(indx),
        }),
    {},
);
