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

import { MODULE_NAME } from './Constants';
import { GenType } from './loot-app/source/DataSource';
import { numericCommas } from './loot-app/Formatting';
import { HandlebarsContext } from '../../FVTT-Common/src/module/Handlebars';

export async function registerHandlebarsTemplates() {
    const templatePath = (path: string) => `modules/${MODULE_NAME}/${path}`;

    const partials: Record<string, string> = {
        'weight-range': `templates/loot-app/partials/weight-range.html`,
        'tab-buttons': `templates/loot-app/tabs/partials/tab-buttons.html`,
        'create-select': `templates/loot-app/tabs/partials/create-select.html`,
        'rune-stats': `templates/loot-app/tabs/partials/rune-stats.html`,
        'property-runes': `templates/loot-app/tabs/partials/property-runes.html`,
        'final-info': `templates/loot-app/tabs/partials/final-info.html`,
        'collapsible': `templates/loot-app/partials/collapsible.html`,
    };

    const templatePaths = [
        `templates/settings-app/SettingsApp.html`,
        `templates/settings-app/tabs/About.html`,
        `templates/settings-app/tabs/Features.html`,
        `templates/settings-app/tabs/License.html`,

        `templates/loot-app/inventory.html`,
        `templates/loot-app/sidebar.html`,
        `templates/loot-app/partials/loot-profile.html`,

        `templates/loot-app/tabs/settings.html`,

        `templates/loot-app/tabs/create/index.html`,
        `templates/loot-app/tabs/create/weapon.html`,
        `templates/loot-app/tabs/create/armor.html`,
        `templates/loot-app/tabs/create/shield.html`,

        `templates/chat/table-output.html`,

        ...Object.values(GenType).map((type) => `templates/loot-app/tabs/${type}.html`),
        ...Object.values(partials),
    ].map(templatePath);

    for (const [key, value] of Object.entries(partials)) {
        Handlebars.registerPartial(key, `{{> ${templatePath(value)} }}`);
    }

    await loadTemplates(templatePaths);
}

export function registerHandlebarsHelpers() {
    // stringify the object provided.
    Handlebars.registerHelper('json', (data: any) => {
        return JSON.stringify(data);
    });
    // object exists and is not null or empty
    Handlebars.registerHelper('defined', (data: any) => {
        return data !== undefined && data !== null && data !== '';
    });
    // use the provided value if it exists, otherwise default to the fallback.
    Handlebars.registerHelper('default', (value: any, defaultValue: any) => {
        return value === undefined || value === null ? defaultValue : value;
    });
    // separate hundreds groups in numbers with commas
    Handlebars.registerHelper('numeric-commas', (a: string | number | undefined) => {
        if (!a) return undefined;
        return numericCommas(a);
    });
    // round a number or return other values
    Handlebars.registerHelper('round', (a: any) => {
        if (typeof a === 'number') {
            return Math.round(a);
        }
        return a;
    });

    // assorted helpers for dealing with equality in templates
    Handlebars.registerHelper('eq', (lhs: any, rhs: any, context: HandlebarsContext) => {
        return lhs === rhs;
    });
    Handlebars.registerHelper('lt', (lhs: number, rhs: number, context: HandlebarsContext) => {
        return lhs < rhs;
    });
    Handlebars.registerHelper('gt', (lhs: number, rhs: number, context: HandlebarsContext) => {
        return lhs > rhs;
    });
    Handlebars.registerHelper('lteq', (lhs: number, rhs: number, context: HandlebarsContext) => {
        return lhs <= rhs;
    });
    Handlebars.registerHelper('gteq', (lhs: number, rhs: number, context: HandlebarsContext) => {
        return lhs >= rhs;
    });

    // enrich html
    Handlebars.registerHelper('enrichHTML', (htmlString: string) => TextEditor.enrichHTML(htmlString));

    /**
     * Walk an object tree. Mostly exists for convenience so lookup does not need to be chained.
     * @param data The data to walk over.
     * @param path The data path to walk.
     * @param context The handlebars context where this is being called.
     */
    const walk = (data: Record<string, any>, path: string, context: HandlebarsContext) => {
        let current = data;
        const parts = path.split('.');
        while (parts.length > 0) {
            let key = parts.shift() as string;

            if (context.hash && key.startsWith('$')) {
                key = context.hash[key.substr(1)];
            }
            current = current[key];

            if (current === null || current === undefined) {
                return undefined;
            }
        }
        return current;
    };
    Handlebars.registerHelper('walk', walk);

    // When working with keys in the partial system, append the module name
    //  so we have a lower chance of overwriting or deleting another modules
    //  registered partials.
    const blockKey = (key: string) => `${MODULE_NAME}-${key}`;

    /**
     * Set a block, so the next call to get-block renders the provided content.
     * @param name The name of the block to set.
     * @param parentContext The handlebars context where the block is being set.
     */
    const setBlock = (name: string, parentContext: HandlebarsContext) => {
        Handlebars.registerPartial(blockKey(name), (childContext: HandlebarsContext) => {
            return parentContext.fn!(mergeObject(parentContext, childContext));
        });
    };
    /**
     * Get and render a block by it's name.
     * @param name The name of the block.
     * @param context The handlebars context where this block is rendering.
     */
    const getBlock = (name: string, context: HandlebarsContext) => {
        const loadPartial = (name: string) => {
            let partial = Handlebars.partials[name];
            if (typeof partial === 'string') {
                partial = Handlebars.compile(partial);
                Handlebars.partials[name] = partial;
            }
            return partial;
        };

        const partial = loadPartial(blockKey(name)) || context.fn;
        // @ts-ignore
        return partial(this, { data: context.hash });
    };
    /**
     * Unset a block template. It is important to unset so later calls to
     *  a template do not re-render old data where it does not belong.
     * @param name The name of the block to delete.
     */
    const delBlock = (name: string) => {
        Handlebars.unregisterPartial(blockKey(name));
    };

    Handlebars.registerHelper('set-block', setBlock);
    Handlebars.registerHelper('del-block', delBlock);
    Handlebars.registerHelper('get-block', getBlock);
}
