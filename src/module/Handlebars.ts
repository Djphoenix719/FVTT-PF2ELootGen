import { MODULE_NAME } from './Constants';
import { DataSource, ItemType } from './loot-app/data/DataSource';
import { AppFilter } from './loot-app/Filters';

export interface HandlebarsContext {
    data: Record<string, any> & {
        root: Record<string, any>;
    };
    hash?: Record<string, any>;
    // contents of block
    fn?: (context: any) => string;
    // contents of else block
    inverse?: () => string;
    loc?: {
        start: { line: number; column: number };
        end: { line: number; column: number };
    };
    name?: string;
}

export async function registerHandlebarsTemplates() {
    const templatePath = (path: string) => `modules/${MODULE_NAME}/${path}`;

    const partials: Record<string, string> = {
        'weight-range': `templates/loot-app/partials/weight-range.html`,
        'filters-list': `templates/loot-app/partials/filters-list.html`,
        'sources-list': `templates/loot-app/partials/sources-list.html`,
        'tab-buttons': `templates/loot-app/tabs/partials/tab-buttons.html`,
        'tab-config': `templates/loot-app/tabs/partials/tab-config.html`,
    };

    const templatePaths = [
        `templates/settings-app/SettingsApp.html`,
        `templates/settings-app/tabs/About.html`,
        `templates/settings-app/tabs/Features.html`,
        `templates/settings-app/tabs/License.html`,
        `templates/loot-app/inventory.html`,
        `templates/loot-app/sidebar.html`,
        `templates/loot-app/partials/sources-list.html`,
        `templates/loot-app/partials/filters-list.html`,
        `templates/loot-app/partials/loot-profile.html`,

        `templates/loot-app/tabs/settings.html`,

        ...Object.values(ItemType).map((type) => `templates/loot-app/tabs/${type}.html`),
        ...Object.values(partials),
    ].map(templatePath);

    for (const [key, value] of Object.entries(partials)) {
        Handlebars.registerPartial(key, `{{> ${templatePath(value)} }}`);
    }

    await loadTemplates(templatePaths);
}

export function registerHandlebarsHelpers() {
    Handlebars.registerHelper('sourceFlag', (source: DataSource) => {
        return `flags.pf2e-lootgen.sources.${source.itemType}.${source.id}`;
    });
    Handlebars.registerHelper('filterFlag', (filter: AppFilter) => {
        return `flags.pf2e-lootgen.filters.${filter.filterCategory}.${filter.filterType}.${filter.id}`;
    });

    Handlebars.registerHelper('json', (data: any) => {
        return JSON.stringify(data);
    });

    Handlebars.registerHelper('default', (value, defaultValue) => {
        return value === undefined || value === null ? defaultValue : value;
    });

    /***
     * Walks an object tree with a data path with replaceable keys to avoid lookup chains.
     */
    Handlebars.registerHelper('walk', (data: Record<string, any>, path: string, context: HandlebarsContext) => {
        let current = data;
        const parts = path.split('.');
        while (parts.length > 0) {
            let key = parts.shift();

            if (key.startsWith('$')) {
                key = context.hash[key.substr(1)];
            }
            current = current[key];

            if (current === null || current === undefined) {
                return undefined;
            }
        }
        return current;
    });

    Handlebars.registerHelper('setting-key', (key: string, context: HandlebarsContext) => {});

    const loadPartial = (name: string) => {
        let partial = Handlebars.partials[name];
        if (typeof partial === 'string') {
            partial = Handlebars.compile(partial);
            Handlebars.partials[name] = partial;
        }
        return partial;
    };

    const blockKey = (key: string) => `${MODULE_NAME}-${key}`;
    Handlebars.registerHelper('set-block', (name: string, options) => {
        Handlebars.registerPartial(blockKey(name), options.fn);
    });
    Handlebars.registerHelper('del-block', (name: string) => {
        Handlebars.unregisterPartial(blockKey(name));
    });
    Handlebars.registerHelper('get-block', (name: string, options) => {
        const partial = loadPartial(blockKey(name)) || options.fn;
        return partial(this, { data: options.hash });
    });
}
