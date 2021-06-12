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

import { RollableTablesPack, TableType } from './Tables';
import { SourceType, TableSource } from './DataSource';
import { INamed } from './Mixins';

export interface TreasureSource extends TableSource, INamed {
    value: string;
}

export const semipreciousStonesTables: Record<string, TreasureSource> = {
    ucTtWBPXViITI8wr: {
        id: 'ucTtWBPXViITI8wr',
        name: 'Lesser Semiprecious Stones',
        value: '1d4*5',
        tableSource: RollableTablesPack,
        sourceType: SourceType.Table,
        itemType: TableType.Treasure,
        weight: 1,
        enabled: true,
    },
    mCzuipepJAJcuY0H: {
        id: 'mCzuipepJAJcuY0H',
        name: 'Moderate Semiprecious Stones',
        value: '1d4*25',
        tableSource: RollableTablesPack,
        sourceType: SourceType.Table,
        itemType: TableType.Treasure,
        weight: 1,
        enabled: true,
    },
    P3HzJtS2iUUWMedJ: {
        id: 'P3HzJtS2iUUWMedJ',
        name: 'Greater Semiprecious Stones',
        value: '1d4*5',
        tableSource: RollableTablesPack,
        sourceType: SourceType.Table,
        itemType: TableType.Treasure,
        weight: 1,
        enabled: true,
    },
};
export const preciousStonesTables: Record<string, TreasureSource> = {
    ZCYAQplm6zORj6eN: {
        id: 'ZCYAQplm6zORj6eN',
        name: 'Lesser Precious Stones',
        value: '1d4*50',
        tableSource: RollableTablesPack,
        sourceType: SourceType.Table,
        itemType: TableType.Treasure,
        weight: 1,
        enabled: true,
    },
    wCXPh3nft3qWuxro: {
        id: 'wCXPh3nft3qWuxro',
        name: 'Moderate Precious Stones',
        value: '1d4*100',
        tableSource: RollableTablesPack,
        sourceType: SourceType.Table,
        itemType: TableType.Treasure,
        weight: 1,
        enabled: true,
    },
    teZCrF2SOghusarb: {
        id: 'teZCrF2SOghusarb',
        name: 'Greater Precious Stones',
        value: '1d4*500',
        tableSource: RollableTablesPack,
        sourceType: SourceType.Table,
        itemType: TableType.Treasure,
        weight: 1,
        enabled: true,
    },
};
export const artTreasureTables: Record<string, TreasureSource> = {
    ME37cisDz8J2m0H7: {
        id: 'ME37cisDz8J2m0H7',
        name: 'Minor Art Object',
        value: '1d4*1',
        tableSource: RollableTablesPack,
        sourceType: SourceType.Table,
        itemType: TableType.Treasure,
        weight: 1,
        enabled: true,
    },
    zyXbnTnUGs7tWR5j: {
        id: 'zyXbnTnUGs7tWR5j',
        name: 'Lesser Art Object',
        value: '1d4*10',
        tableSource: RollableTablesPack,
        sourceType: SourceType.Table,
        itemType: TableType.Treasure,
        weight: 1,
        enabled: true,
    },
    bCD07W38YjbnyVoZ: {
        id: 'bCD07W38YjbnyVoZ',
        name: 'Moderate Art Object',
        value: '1d4*25',
        tableSource: RollableTablesPack,
        sourceType: SourceType.Table,
        itemType: TableType.Treasure,
        weight: 1,
        enabled: true,
    },
    qmxGfxkMp9vCOtNQ: {
        id: 'qmxGfxkMp9vCOtNQ',
        name: 'Greater Art Object',
        value: '1d4*250',
        tableSource: RollableTablesPack,
        sourceType: SourceType.Table,
        itemType: TableType.Treasure,
        weight: 1,
        enabled: true,
    },
    hTBTUf9dmhDkpIo8: {
        id: 'hTBTUf9dmhDkpIo8',
        name: 'Major Art Object',
        value: '1d4*1000',
        tableSource: RollableTablesPack,
        sourceType: SourceType.Table,
        itemType: TableType.Treasure,
        weight: 1,
        enabled: true,
    },
};
export const treasureSources = { ...semipreciousStonesTables, ...preciousStonesTables, ...artTreasureTables };
