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

/**
 * Load a RollTable from a compendium pack by id.
 * @param tableId
 * @param packId
 */
export const getTable = async (tableId: string, packId: string = 'pf2e.rollable-tables'): Promise<RollTable> => {
    const compendium = game?.packs?.get(packId);
    // @ts-ignore
    return await compendium?.getDocument(tableId);
};

export const rollMany = async (table: RollTable, count: number): Promise<Entity[]> => {
    // @ts-ignore
    return await table.drawMany(count);
};

export interface ITableDef {
    id: string;
    packId: string;
    name: string;
}
export interface ITreasureTableDef extends ITableDef {
    value: string;
}

export const consumableTables: ITableDef[] = [
    {
        id: 'tlX5PLwar8b1tmiQ',
        packId: 'pf2e.rollable-tables',
        name: '1st-Level',
    },
    {
        id: 'g30jZWCJEiK1RlIa',
        packId: 'pf2e.rollable-tables',
        name: '2nd-Level',
    },
    {
        id: 'mDPLoPYwuPo3o0Wj',
        packId: 'pf2e.rollable-tables',
        name: '3rd-Level',
    },
    {
        id: '0WpkRFm8SyfwVCP6',
        packId: 'pf2e.rollable-tables',
        name: '4th-Level',
    },
    {
        id: 'zRyuNslbOzN9oW5u',
        packId: 'pf2e.rollable-tables',
        name: '5th-Level',
    },
    {
        id: 'A68C9O0vtWbFXbfS',
        packId: 'pf2e.rollable-tables',
        name: '6th-Level',
    },
    {
        id: 'E9ZNupg1p4yLpfrd',
        packId: 'pf2e.rollable-tables',
        name: '7th-Level',
    },
    {
        id: 'UmJGUUgN9TQtFQDI',
        packId: 'pf2e.rollable-tables',
        name: '8th-Level',
    },
    {
        id: 'XAJFTpuo8qrcW30P',
        packId: 'pf2e.rollable-tables',
        name: '9th-Level',
    },
    {
        id: 'AIBvZzHidUXxZfEF',
        packId: 'pf2e.rollable-tables',
        name: '10th-Level',
    },
    {
        id: 'Ca7vD8PZtMPqVuHu',
        packId: 'pf2e.rollable-tables',
        name: '11th-Level',
    },
    {
        id: '5HHqLskEnfjxpkCO',
        packId: 'pf2e.rollable-tables',
        name: '12th-Level',
    },
    {
        id: 'awfTQvkm7NrRjRaQ',
        packId: 'pf2e.rollable-tables',
        name: '13th-Level',
    },
    {
        id: 'Vhuuy0vFJV5tYldR',
        packId: 'pf2e.rollable-tables',
        name: '14th-Level',
    },
    {
        id: 'Af7beeFZhtvDAZaM',
        packId: 'pf2e.rollable-tables',
        name: '15th-Level',
    },
    {
        id: 'aomFSKgGl52z7tdX',
        packId: 'pf2e.rollable-tables',
        name: '16th-Level',
    },
    {
        id: 'YyQkwd1PksU1Lno4',
        packId: 'pf2e.rollable-tables',
        name: '17th-Level',
    },
    {
        id: 'PSs31Xj5RfszMbAe',
        packId: 'pf2e.rollable-tables',
        name: '18th-Level',
    },
    {
        id: 'pH85KVl31VBdENuy',
        packId: 'pf2e.rollable-tables',
        name: '19th-Level',
    },
    {
        id: 'nusyoQjLs0ZxifRd',
        packId: 'pf2e.rollable-tables',
        name: '20th-Level',
    },
];
export const permanentTables: ITableDef[] = [
    {
        id: 'JyDn13oc0MdLjpyw',
        packId: 'pf2e.rollable-tables',
        name: '1st-Level',
    },
    {
        id: 'q6hhGYSee35XxKE8',
        packId: 'pf2e.rollable-tables',
        name: '2nd-Level',
    },
    {
        id: 'Ow2zoRUSX0s7JjMo',
        packId: 'pf2e.rollable-tables',
        name: '3rd-Level',
    },
    {
        id: 'k0Al2PJni2NTtdIY',
        packId: 'pf2e.rollable-tables',
        name: '4th-Level',
    },
    {
        id: 'k5bG37570BbflxR2',
        packId: 'pf2e.rollable-tables',
        name: '5th-Level',
    },
    {
        id: '9xol7FdCfaU585WR',
        packId: 'pf2e.rollable-tables',
        name: '6th-Level',
    },
    {
        id: 'r8F8mI2BZU6nOMQB',
        packId: 'pf2e.rollable-tables',
        name: '7th-Level',
    },
    {
        id: 'QoEkRoteKJwHHVRd',
        packId: 'pf2e.rollable-tables',
        name: '8th-Level',
    },
    {
        id: 'AJOYeeeF3E8UC7KF',
        packId: 'pf2e.rollable-tables',
        name: '9th-Level',
    },
    {
        id: 'W0qudblot2Z9Vu86',
        packId: 'pf2e.rollable-tables',
        name: '10th-Level',
    },
    {
        id: 'ood552HB1onSdJFS',
        packId: 'pf2e.rollable-tables',
        name: '11th-Level',
    },
    {
        id: 'uzkmxRIn4CtzfP47',
        packId: 'pf2e.rollable-tables',
        name: '12th-Level',
    },
    {
        id: 'eo7kjM8xv6KD5h5q',
        packId: 'pf2e.rollable-tables',
        name: '13th-Level',
    },
    {
        id: 'cBpFoBUNSApkvP6L',
        packId: 'pf2e.rollable-tables',
        name: '14th-Level',
    },
    {
        id: 'X2QkgnYrda4mV5v3',
        packId: 'pf2e.rollable-tables',
        name: '15th-Level',
    },
    {
        id: 'J7XfeVrfUj72IkRY',
        packId: 'pf2e.rollable-tables',
        name: '16th-Level',
    },
    {
        id: '0jlGmwn6YGqsfG1q',
        packId: 'pf2e.rollable-tables',
        name: '17th-Level',
    },
    {
        id: '6FmhLLYH94xhucIs',
        packId: 'pf2e.rollable-tables',
        name: '18th-Level',
    },
    {
        id: 'gkdB45QC0u1WeiRA',
        packId: 'pf2e.rollable-tables',
        name: '19th-Level',
    },
    {
        id: 'NOkobOGi0nqsboHI',
        packId: 'pf2e.rollable-tables',
        name: '20th-Level',
    },
];

// All prices in silver, converted to GP at runtime
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
