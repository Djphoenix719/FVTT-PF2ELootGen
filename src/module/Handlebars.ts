import { MODULE_NAME } from './Constants';
import { DataSource } from './loot-app/data/Draw';

export async function registerHandlebarsTemplates() {
    // prettier-ignore
    const templatePaths = [
        `modules/${MODULE_NAME}/templates/settings-app/SettingsApp.html`,
        `modules/${MODULE_NAME}/templates/settings-app/tabs/About.html`,
        `modules/${MODULE_NAME}/templates/settings-app/tabs/Features.html`,
        `modules/${MODULE_NAME}/templates/settings-app/tabs/License.html`,

        `modules/${MODULE_NAME}/templates/loot-app/inventory.html`,
        `modules/${MODULE_NAME}/templates/loot-app/sidebar.html`,
        `modules/${MODULE_NAME}/templates/loot-app/tabs/consumable/index.html`,
        `modules/${MODULE_NAME}/templates/loot-app/tabs/permanent/index.html`,
        `modules/${MODULE_NAME}/templates/loot-app/tabs/gm-settings/index.html`,
        `modules/${MODULE_NAME}/templates/loot-app/tabs/treasure/index.html`,
        `modules/${MODULE_NAME}/templates/loot-app/tabs/spell/index.html`,

        `modules/${MODULE_NAME}/templates/loot-app/partials/loot-profile.html`,
        `modules/${MODULE_NAME}/templates/loot-app/partials/table-list.html`,
        `modules/${MODULE_NAME}/templates/loot-app/partials/table-buttons.html`,
    ];
    await Handlebars.registerPartial('table-list', '{{> modules/pf2e-lootgen/templates/loot-app/partials/table-list.html }}');
    await loadTemplates(templatePaths);
}

export function registerHandlebarsHelpers() {
    Handlebars.registerHelper('sourceFlag', function (source: DataSource) {
        return `flags.pf2e-lootgen.sources.${source.itemType}.${source.id}`;
    });

    Handlebars.registerHelper('includes', function (array: any[], value: any, options: any) {
        if (array.includes(value)) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });
    Handlebars.registerHelper('ifeq', function (v1, v2, options) {
        if (v1 === v2) return options.fn(this);
        else return options.inverse(this);
    });
    Handlebars.registerHelper('ifne', function (v1, v2, options) {
        if (v1 !== v2) return options.fn(this);
        else return options.inverse(this);
    });
    Handlebars.registerHelper('ifgt', function (v1, v2, options) {
        if (v1 > v2) return options.fn(this);
        else return options.inverse(this);
    });
    Handlebars.registerHelper('iflt', function (v1, v2, options) {
        if (v1 < v2) return options.fn(this);
        else return options.inverse(this);
    });

    Handlebars.registerHelper('isNaN', function (context, options) {
        if (isNaN(context) && !(typeof context === 'string')) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });

    Handlebars.registerHelper('default', function (obj, def) {
        if (obj === undefined || obj === null) {
            return def;
        } else {
            return obj;
        }
    });

    Handlebars.registerHelper('undefined', function () {
        return undefined;
    });
    Handlebars.registerHelper('commas', function (context) {
        return context.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    });

    Handlebars.registerHelper('hasKey', function (context, key) {
        for (const prop of context) {
            if (prop.hasOwnProperty(key)) {
                return true;
            }
        }
        return false;
    });
}
