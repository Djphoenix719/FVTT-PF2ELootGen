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

import ModuleSettings from '../../FVTT-Common/src/module/settings-app/ModuleSettings';
import { registerHandlebarsHelpers, registerHandlebarsTemplates } from './Handlebars';
import { extendLootSheet } from './loot-app/LootApp';
import { MODULE_NAME } from './Constants';
import { distinct } from './loot-app/Utilities';
import { FLAGS_KEY } from './loot-app/Flags';

Hooks.on('init', ModuleSettings.registerAllSettings);

Hooks.on('init', ModuleSettings.onInit);
Hooks.on('setup', ModuleSettings.onSetup);
Hooks.on('ready', ModuleSettings.onReady);

Hooks.on('setup', registerHandlebarsTemplates);
Hooks.on('setup', registerHandlebarsHelpers);

Hooks.on('ready', async () => {
    const extendedSheet = extendLootSheet();
    Actors.registerSheet(MODULE_NAME, extendedSheet, {
        label: 'PF2E Loot Generator',
        types: ['loot'],
        makeDefault: false,
    });

    await game.actors.getName('Lootboi').delete();
    // @ts-ignore
    await Actor.create({ name: 'Lootboi', type: 'loot', ['flags.core.sheetClass']: 'pf2e-lootgen.LootApp' });
    await game.actors.getName('Lootboi').sheet.render(true);
});

// TODO: Move to a better place for this
Hooks.on('renderItemDirectory', (itemDirectory: any, html: JQuery, options: any) => {
    const lis: JQuery = html.find('ol.directory-list li.directory-item.item');
    for (const element of lis) {
        const item: Item = game.items.get(element.getAttribute('data-entity-id'));
        if (item.getFlag(FLAGS_KEY, 'temporary')) {
            $(element).remove();
        }
    }
});
