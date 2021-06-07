import { MODULE_NAME } from './Constants';

export async function registerHandlebarsTemplates() {
    // prettier-ignore
    const templatePaths = [
        `modules/${MODULE_NAME}/templates/settings-app/SettingsApp.html`,
        `modules/${MODULE_NAME}/templates/settings-app/tabs/About.html`,
        `modules/${MODULE_NAME}/templates/settings-app/tabs/Features.html`,
        `modules/${MODULE_NAME}/templates/settings-app/tabs/License.html`,

        `modules/${MODULE_NAME}/templates/loot-app/inventory.html`,
        `modules/${MODULE_NAME}/templates/loot-app/tabs/consumables/index.html`,
        `modules/${MODULE_NAME}/templates/loot-app/tabs/magic-items/index.html`,
        `modules/${MODULE_NAME}/templates/loot-app/partials/table-list.html`,
    ];
    await Handlebars.registerPartial('table-list', '{{> modules/pf2e-lootgen/templates/loot-app/table-list.html }}');
    await loadTemplates(templatePaths);
}

export function registerHandlebarsHelpers() {
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
        if (obj === undefined) {
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
