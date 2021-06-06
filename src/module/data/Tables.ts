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

export const consumableTables = [
    {
        id: 'tlX5PLwar8b1tmiQ',
        name: '1st-Level Consumables Items',
    },
    {
        id: 'g30jZWCJEiK1RlIa',
        name: '2nd-Level Consumables Items',
    },
    {
        id: 'mDPLoPYwuPo3o0Wj',
        name: '3rd-Level Consumables Items',
    },
    {
        id: '0WpkRFm8SyfwVCP6',
        name: '4th-Level Consumables Items',
    },
    {
        id: 'zRyuNslbOzN9oW5u',
        name: '5th-Level Consumables Items',
    },
    {
        id: 'A68C9O0vtWbFXbfS',
        name: '6th-Level Consumables Items',
    },
    {
        id: 'E9ZNupg1p4yLpfrd',
        name: '7th-Level Consumables Items',
    },
    {
        id: 'UmJGUUgN9TQtFQDI',
        name: '8th-Level Consumables Items',
    },
    {
        id: 'XAJFTpuo8qrcW30P',
        name: '9th-Level Consumables Items',
    },
    {
        id: 'AIBvZzHidUXxZfEF',
        name: '10th-Level Consumables Items',
    },
    {
        id: 'Ca7vD8PZtMPqVuHu',
        name: '11th-Level Consumables Items',
    },
    {
        id: '5HHqLskEnfjxpkCO',
        name: '12th-Level Consumables Items',
    },
    {
        id: 'awfTQvkm7NrRjRaQ',
        name: '13th-Level Consumables Items',
    },
    {
        id: 'Vhuuy0vFJV5tYldR',
        name: '14th-Level Consumables Items',
    },
    {
        id: 'Af7beeFZhtvDAZaM',
        name: '15th-Level Consumables Items',
    },
    {
        id: 'aomFSKgGl52z7tdX',
        name: '16th-Level Consumables Items',
    },
    {
        id: 'YyQkwd1PksU1Lno4',
        name: '17th-Level Consumables Items',
    },
    {
        id: 'PSs31Xj5RfszMbAe',
        name: '18th-Level Consumables Items',
    },
    {
        id: 'pH85KVl31VBdENuy',
        name: '19th-Level Consumables Items',
    },
    {
        id: 'nusyoQjLs0ZxifRd',
        name: '20th-Level Consumable Items',
    },
];
export const permanentItemsTables = [
    {
        id: 'JyDn13oc0MdLjpyw',
        name: '1st-Level',
    },
    {
        id: 'q6hhGYSee35XxKE8',
        name: '2nd-Level',
    },
    {
        id: 'Ow2zoRUSX0s7JjMo',
        name: '3rd-Level',
    },
    {
        id: 'k0Al2PJni2NTtdIY',
        name: '4th-Level',
    },
    {
        id: 'k5bG37570BbflxR2',
        name: '5th-Level',
    },
    {
        id: '9xol7FdCfaU585WR',
        name: '6th-Level',
    },
    {
        id: 'r8F8mI2BZU6nOMQB',
        name: '7th-Level',
    },
    {
        id: 'QoEkRoteKJwHHVRd',
        name: '8th-Level',
    },
    {
        id: 'AJOYeeeF3E8UC7KF',
        name: '9th-Level',
    },
    {
        id: 'W0qudblot2Z9Vu86',
        name: '10th-Level',
    },
    {
        id: 'ood552HB1onSdJFS',
        name: '11th-Level',
    },
    {
        id: 'uzkmxRIn4CtzfP47',
        name: '12th-Level',
    },
    {
        id: 'eo7kjM8xv6KD5h5q',
        name: '13th-Level',
    },
    {
        id: 'cBpFoBUNSApkvP6L',
        name: '14th-Level',
    },
    {
        id: 'X2QkgnYrda4mV5v3',
        name: '15th-Level',
    },
    {
        id: 'J7XfeVrfUj72IkRY',
        name: '16th-Level',
    },
    {
        id: '0jlGmwn6YGqsfG1q',
        name: '17th-Level',
    },
    {
        id: '6FmhLLYH94xhucIs',
        name: '18th-Level',
    },
    {
        id: 'gkdB45QC0u1WeiRA',
        name: '19th-Level',
    },
    {
        id: 'NOkobOGi0nqsboHI',
        name: '20th-Level',
    },
];

// All prices in silver, converted to GP at runtime
export const semipreciousStonesTables = [
    {
        id: 'ucTtWBPXViITI8wr',
        name: 'Lesser Semiprecious Stones',
        value: '1d4*5',
    },
    {
        id: 'mCzuipepJAJcuY0H',
        name: 'Moderate Semiprecious Stones',
        value: '1d4*25',
    },
    {
        id: 'P3HzJtS2iUUWMedJ',
        name: 'Greater Semiprecious Stones',
        value: '1d4*50',
    },
];
export const preciousStonesTables = [
    {
        id: 'ZCYAQplm6zORj6eN',
        name: 'Lesser Precious Stones',
        value: '1d4*50*10',
    },
    {
        id: 'wCXPh3nft3qWuxro',
        name: 'Moderate Precious Stones',
        value: '1d4*100*10',
    },
    {
        id: 'teZCrF2SOghusarb',
        name: 'Greater Precious Stones',
        value: '1d4*500*10',
    },
];
export const artTreasureTables = [
    {
        id: 'ME37cisDz8J2m0H7',
        name: 'Minor Art Object',
        value: '1d4*1*10',
    },
    {
        id: 'zyXbnTnUGs7tWR5j',
        name: 'Lesser Art Object',
        value: '1d4*10*10',
    },
    {
        id: 'bCD07W38YjbnyVoZ',
        name: 'Moderate Art Object',
        value: '1d4*25*10',
    },
    {
        id: 'qmxGfxkMp9vCOtNQ',
        name: 'Greater Art Object',
        value: '1d4*250*10',
    },
    {
        id: 'hTBTUf9dmhDkpIo8',
        name: 'Major Art Object',
        value: '1d4*1000*10',
    },
];
export const treasureTables = [...semipreciousStonesTables, ...preciousStonesTables, ...artTreasureTables];
