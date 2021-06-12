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
 * Get an item with an id of itemId from the pack with id packId.
 * @param packId
 * @param itemId
 */
export const getItemFromPack = async (packId: string, itemId: string): Promise<any> => {
    const pack = await game.packs?.get(packId);
    // @ts-ignore
    return await pack.getDocument(itemId);
};

/**
 * Load a RollTable from a compendium pack by id.
 * @param tableId
 * @param packId
 */
export const getTableFromPack = async (tableId: string, packId: string): Promise<RollTable> => {
    return await getItemFromPack(packId, tableId);
};
