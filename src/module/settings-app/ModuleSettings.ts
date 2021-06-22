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

import { MODULE_NAME } from '../Constants';
import SettingsApp from './SettingsApp';

// TODO: Localization of strings in this file.

const Features = {};

const MENU_KEY = 'SETTINGS_MENU';

type IFeatureInputType = 'checkbox' | 'number' | 'text' | 'file';
interface IFeatureAttribute {
    icon: string;
    title: string;
}
interface IFeatureInput {
    name: string;
    label: string;
    type: IFeatureInputType;
    help?: string;
    value: any;
    max?: number;
    min?: number;
}
interface IFeatureRegistration {
    name: string;
    type: BooleanConstructor | NumberConstructor | StringConstructor;
    default: any;
    onChange?: (value: any) => void;
}
type HookCallback = () => void;
interface IFeatureDefinition {
    id: string;
    title: string;
    attributes?: IFeatureAttribute[];
    description: string;
    default?: boolean;
    inputs: IFeatureInput[];
    register: IFeatureRegistration[];
    help?: string;
    onReady?: HookCallback;
    onInit?: HookCallback;
    onSetup?: HookCallback;
}

export const ATTR_RELOAD_REQUIRED: IFeatureAttribute = {
    icon: 'fas fa-sync',
    title: 'Reload Required',
};
export const ATTR_REOPEN_SHEET_REQUIRED: IFeatureAttribute = {
    icon: 'fas fa-sticky-note',
    title: 'Sheets must be closed and re-opened.',
};

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

export default class ModuleSettings {
    public static readonly FEATURES = Features;

    /**
     * Retrieve a setting from the store.
     * @param key They key the setting resides at.
     */
    public static get<T = any>(key: string): T {
        return game.settings.get(MODULE_NAME, key) as T;
    }

    /**
     * Set the value of a setting in the store.
     * @param key The key the setting resides at.
     * @param value The value the setting should be set to.
     */
    public static async set(key: string, value: any) {
        return game.settings.set(MODULE_NAME, key, value);
    }

    /**
     * Register a setting with the store.
     * @param key The key the setting should reside at.
     * @param value The default value of the setting.
     */
    public static reg(key: string, value: any) {
        game.settings.register(MODULE_NAME, key, value);
    }

    /**
     * Binds on init hooks for each feature that has them.
     */
    public static onInit() {
        for (const feature of FEATURES) {
            if (feature.onInit && ModuleSettings.get(feature.id)) {
                feature.onInit();
            }
        }
    }

    /**
     * Binds on setup hooks for each feature that has them.
     */
    public static onSetup() {
        for (const feature of FEATURES) {
            if (feature.onSetup && ModuleSettings.get(feature.id)) {
                feature.onSetup();
            }
        }
    }

    /**
     * Binds on ready hooks for each feature that has them.
     */
    public static onReady() {
        for (const feature of FEATURES) {
            if (feature.onReady && ModuleSettings.get(feature.id)) {
                feature.onReady();
            }
        }
    }

    /**
     * Registers all game settings for the application.
     */
    public static registerAllSettings() {
        for (const feature of FEATURES) {
            // Register the feature toggle
            const enabled = {
                name: feature.id,
                scope: 'world',
                type: Boolean,
                default: feature.default ?? false,
                config: false,
                restricted: true,
            };
            ModuleSettings.reg(feature.id, enabled);

            // Register any other settings values for a feature.
            for (const registration of feature.register) {
                const setting = {
                    name: registration.name,
                    scope: 'world',
                    type: registration.type,
                    default: registration.default,
                    config: false,
                    restricted: true,
                    onChange: registration.onChange,
                };
                ModuleSettings.reg(registration.name, setting);
            }
        }

        game.settings.registerMenu(MODULE_NAME, MENU_KEY, {
            name: 'PF2E Loot Generator Settings',
            label: 'PF2E Loot Generator Settings',
            hint: 'Configure PF2E Loot Generator enabled features and other options.',
            icon: 'fas fa-cogs',
            type: SettingsApp,
            restricted: true,
        });
    }
}
