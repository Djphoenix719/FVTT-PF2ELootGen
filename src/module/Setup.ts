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

import ModuleSettings, { IFeatureDefinition } from '../../FVTT-Common/src/module/ModuleSettings';
import { MODULE_NAME, MODULE_TITLE } from './Constants';
import { registerHandlebarsHelpers, registerHandlebarsTemplates } from './Handlebars';
import { extendLootSheet } from './loot-app/LootApp';
import { FLAGS_KEY } from './loot-app/Flags';

export const FEATURE_ALLOW_MERGING = 'allow-merging';

export const FEATURE_QUICK_ROLL_MODIFIERS = 'quick-roll-modifiers-enabled';
export const FEATURE_QUICK_ROLL_CONTROL = 'quick-roll-control-count';
export const FEATURE_QUICK_ROLL_SHIFT = 'quick-roll-shift-count';

export const FEATURE_OUTPUT_LOOT_ROLLS = 'output-loot-rolls';
export const FEATURE_OUTPUT_LOOT_ROLLS_WHISPER = 'output-loot-rolls-whisper';

// TODO: Localization
export const FEATURES: IFeatureDefinition[] = [
    {
        id: FEATURE_ALLOW_MERGING,
        title: 'Merge When Generating',
        attributes: [],
        description:
            'If this setting is enabled, PF2E Lootgen will attempt to merge generated items into' +
            ' existing stacks on the actor. If this setting is disabled, new stacks will still merge but not' +
            ' merge with existing items.',
        inputs: [],
        register: [],
        help:
            'PF2E Lootgen will not check for modifications on existing items, so if you expect to change' +
            ' them this may result in improper treasure values, item descriptions, etc. for generated items.',
    },
    {
        id: FEATURE_QUICK_ROLL_MODIFIERS,
        title: 'Quick Roll Key Modifiers',
        attributes: [],
        description: 'When a key is held when using the quick roll buttons on the loot generator, these settings determine how many items should be rolled.',
        inputs: [
            {
                name: FEATURE_QUICK_ROLL_CONTROL,
                label: 'Control',
                type: 'number',
                value: 10,
                min: 1,
            },
            {
                name: FEATURE_QUICK_ROLL_SHIFT,
                label: 'Shift',
                type: 'number',
                value: 5,
                min: 1,
            },
        ],
        register: [
            {
                name: FEATURE_QUICK_ROLL_CONTROL,
                type: Number,
                default: 10,
            },
            {
                name: FEATURE_QUICK_ROLL_SHIFT,
                type: Number,
                default: 5,
            },
        ],
        help: 'Holding down multiple keys will multiply together the modifiers.',
    },
    {
        id: FEATURE_OUTPUT_LOOT_ROLLS,
        title: 'Output Loot Rolled to Chat',
        attributes: [],
        description: '',
        inputs: [
            {
                name: FEATURE_OUTPUT_LOOT_ROLLS_WHISPER,
                label: 'Whisper Results',
                type: 'checkbox',
                value: false,
                help: 'If enabled, always whisper the results to the GMs. Otherwise, respect your current roll mode.',
            },
        ],
        register: [
            {
                name: FEATURE_OUTPUT_LOOT_ROLLS_WHISPER,
                type: Boolean,
                default: false,
            },
        ],
        help: '',
    },
];

export const setup = () => {
    Hooks.on('init', () =>
        ModuleSettings.initialize({
            moduleName: MODULE_NAME,
            moduleTitle: MODULE_TITLE,
            features: FEATURES,
        }),
    );

    Hooks.on('setup', registerHandlebarsTemplates);
    Hooks.on('setup', registerHandlebarsHelpers);

    Hooks.on('ready', async () => {
        const extendedSheet = extendLootSheet();
        // @ts-ignore
        Actors.registerSheet(MODULE_NAME, extendedSheet, {
            label: 'PF2E Loot Generator',
            types: ['loot'],
            makeDefault: false,
        });

        await game.actors?.getName('Lootboi')?.delete();
        await Actor.create({ name: 'Lootboi', type: 'loot', ['flags.core.sheetClass']: 'pf2e-lootgen.LootApp' });
        await game.actors?.getName('Lootboi')?.sheet?.render(true);
    });
};
