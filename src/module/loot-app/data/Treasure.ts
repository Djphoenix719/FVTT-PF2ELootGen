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

import { DataSource, isTableSource, SourceType, TableSource, ItemType, tableStoreId } from './DataSource';
import { INamed } from './Mixins';
import { RollableTablesPack } from './RollableTables';

export enum Denomination {
    Copper = 'cp',
    Silver = 'sp',
    Gold = 'gp',
    Platinum = 'pp',
}

export interface TreasureSource extends TableSource, INamed {
    value: string;
    denomination: Denomination;
}
export function isTreasureSource(source: DataSource): source is TreasureSource {
    return isTableSource(source) && source.hasOwnProperty('value');
}

type UniqueTableData = {
    id: string;
    name: string;
    value: string;
    denomination: Denomination;
};

const semipreciousTables: UniqueTableData[] = [
    {
        id: 'ucTtWBPXViITI8wr',
        name: 'Lesser Semiprecious Stones',
        value: '1d4*5',
        denomination: Denomination.Silver,
    },
    {
        id: 'mCzuipepJAJcuY0H',
        name: 'Moderate Semiprecious Stones',
        value: '1d4*25',
        denomination: Denomination.Silver,
    },
    {
        id: 'P3HzJtS2iUUWMedJ',
        name: 'Greater Semiprecious Stones',
        value: '1d4*5',
        denomination: Denomination.Gold,
    },
];
const preciousTables: UniqueTableData[] = [
    {
        id: 'ZCYAQplm6zORj6eN',
        name: 'Lesser Precious Stones',
        value: '1d4*50',
        denomination: Denomination.Gold,
    },
    {
        id: 'wCXPh3nft3qWuxro',
        name: 'Moderate Precious Stones',
        value: '1d4*100',
        denomination: Denomination.Gold,
    },
    {
        id: 'teZCrF2SOghusarb',
        name: 'Greater Precious Stones',
        value: '1d4*500',
        denomination: Denomination.Gold,
    },
];
const artTables: UniqueTableData[] = [
    {
        id: 'ME37cisDz8J2m0H7',
        name: 'Minor Art Object',
        value: '1d4*1',
        denomination: Denomination.Gold,
    },
    {
        id: 'zyXbnTnUGs7tWR5j',
        name: 'Lesser Art Object',
        value: '1d4*10',
        denomination: Denomination.Gold,
    },
    {
        id: 'bCD07W38YjbnyVoZ',
        name: 'Moderate Art Object',
        value: '1d4*25',
        denomination: Denomination.Gold,
    },
    {
        id: 'qmxGfxkMp9vCOtNQ',
        name: 'Greater Art Object',
        value: '1d4*250',
        denomination: Denomination.Gold,
    },
    {
        id: 'hTBTUf9dmhDkpIo8',
        name: 'Major Art Object',
        value: '1d4*1000',
        denomination: Denomination.Gold,
    },
];

const tableIds: UniqueTableData[] = [...semipreciousTables, ...preciousTables, ...artTables];

/**
 * Format a roll into a value range string.
 * @param valueRoll The value string to format.
 */
const treasureRange = (valueRoll: string) => {
    valueRoll = valueRoll.substr('1d4*'.length);
    const value = parseInt(valueRoll);
    return `${value}-${value * 4}`;
};

const treasureSourceTemplate = (data: UniqueTableData): TreasureSource => {
    return {
        id: data.id,
        storeId: tableStoreId(data.id),
        name: `${data.name} (${treasureRange(data.value)}${data.denomination})`,
        value: data.value,
        denomination: data.denomination,

        tableSource: RollableTablesPack,
        sourceType: SourceType.Table,
        itemType: ItemType.Permanent,
        weight: 1,
        enabled: true,
    };
};

export const treasureSources: Record<string, TreasureSource> = tableIds.reduce(
    (prev, curr) =>
        mergeObject(prev, {
            [tableStoreId(curr.id)]: treasureSourceTemplate(curr),
        }),
    {},
);
