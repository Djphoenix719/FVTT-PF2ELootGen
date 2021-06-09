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

// Data contained in this file is part of the Open Gaming License, and not subject to the above copyright.

import { ITreasureTableDef } from '../Tables';

export const semipreciousStonesTables: ITreasureTableDef[] = [
    {
        id: 'ucTtWBPXViITI8wr',
        packId: 'pf2e.rollable-tables',
        name: 'Lesser Semiprecious Stones',
        value: '1d4*5',
    },
    {
        id: 'mCzuipepJAJcuY0H',
        packId: 'pf2e.rollable-tables',
        name: 'Moderate Semiprecious Stones',
        value: '1d4*25',
    },
    {
        id: 'P3HzJtS2iUUWMedJ',
        packId: 'pf2e.rollable-tables',
        name: 'Greater Semiprecious Stones',
        value: '1d4*50',
    },
];
export const preciousStonesTables: ITreasureTableDef[] = [
    {
        id: 'ZCYAQplm6zORj6eN',
        packId: 'pf2e.rollable-tables',
        name: 'Lesser Precious Stones',
        value: '1d4*50*10',
    },
    {
        id: 'wCXPh3nft3qWuxro',
        packId: 'pf2e.rollable-tables',
        name: 'Moderate Precious Stones',
        value: '1d4*100*10',
    },
    {
        id: 'teZCrF2SOghusarb',
        packId: 'pf2e.rollable-tables',
        name: 'Greater Precious Stones',
        value: '1d4*500*10',
    },
];
export const artTreasureTables: ITreasureTableDef[] = [
    {
        id: 'ME37cisDz8J2m0H7',
        packId: 'pf2e.rollable-tables',
        name: 'Minor Art Object',
        value: '1d4*1*10',
    },
    {
        id: 'zyXbnTnUGs7tWR5j',
        packId: 'pf2e.rollable-tables',
        name: 'Lesser Art Object',
        value: '1d4*10*10',
    },
    {
        id: 'bCD07W38YjbnyVoZ',
        packId: 'pf2e.rollable-tables',
        name: 'Moderate Art Object',
        value: '1d4*25*10',
    },
    {
        id: 'qmxGfxkMp9vCOtNQ',
        packId: 'pf2e.rollable-tables',
        name: 'Greater Art Object',
        value: '1d4*250*10',
    },
    {
        id: 'hTBTUf9dmhDkpIo8',
        packId: 'pf2e.rollable-tables',
        name: 'Major Art Object',
        value: '1d4*1000*10',
    },
];
export const treasureTables = [...semipreciousStonesTables, ...preciousStonesTables, ...artTreasureTables];
