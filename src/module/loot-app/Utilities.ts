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

export async function buildRollTableMessage(rollResults: Roll[], tableResults: any[]) {
    const distinct = (value: any, index: number, array: any[]) => {
        return array.indexOf(value) === index;
    };

    const uniqueTables = tableResults.map((result) => result.parent).filter(distinct);

    const roll = Roll.fromTerms([PoolTerm.fromRolls(rollResults)]);
    const messageData = {
        flavor: `Drew ${rollResults.length} result(s) from ${uniqueTables.length} table(s).`,
        user: game.user.id,
        type: CONST.CHAT_MESSAGE_TYPES.ROLL,
        roll: roll,
        sound: CONFIG.sounds.dice,
        content: '',
    };

    //@Compendium[pf2e.equipment-srd.jC8GmH0Un6vDxdMj]{Acid Flask (Greater)}
    messageData.content = await renderTemplate(CONFIG.RollTable.resultTemplate, {
        results: tableResults.map((result) => {
            return {
                id: result.data.resultId,
                text: `@Compendium[${result.data.collection}.${result.data.resultId}]{${result.data.text}}`,
                icon: result.data.img,
            };
        }),
        rollHtml: await roll.render(),
        table: null,
    });
    messageData.content = TextEditor.enrichHTML(messageData.content, { entities: true });

    console.warn(messageData);

    // @ts-ignore
    return ChatMessage.create(messageData, {});
}
