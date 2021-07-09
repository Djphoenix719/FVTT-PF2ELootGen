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

import ModuleSettings, { IFeatureDefinition } from '../../FVTT-Common/src/module/settings-app/ModuleSettings';
import { MODULE_NAME } from './Constants';

export const FEATURE_ALLOW_MERGING = 'allow-merging';

export const FEATURE_QUICK_ROLL_MODIFIERS = 'quick-roll-modifiers-enabled';
export const FEATURE_QUICK_ROLL_CONTROL = 'quick-roll-control-count';
export const FEATURE_QUICK_ROLL_SHIFT = 'quick-roll-shift-count';

export const FEATURES: IFeatureDefinition[] = [
    {
        id: FEATURE_ALLOW_MERGING,
        title: 'Merge When Generating',
        attributes: [],
        // TODO: Localization
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
];

export const setup = () => {
    Hooks.on('init', () => ModuleSettings.instance.registerAllSettings(MODULE_NAME, FEATURES));

    Hooks.on('init', () => ModuleSettings.instance.onInit());
    Hooks.on('setup', () => ModuleSettings.instance.onSetup());
    Hooks.on('ready', () => ModuleSettings.instance.onReady());
};
