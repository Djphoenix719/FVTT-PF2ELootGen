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
import { DataSource, GenType } from './data/DataSource';
import { dataSourcesOfType, filtersOfType } from './Utilities';
import { AppFilter, FilterType } from './Filters';
import { IEnabled, IWeighted } from './data/Mixins';

export const FLAGS_KEY = MODULE_NAME;

export interface LootCategoryConfig {
    count: number;
}
export interface LootStoredData extends IEnabled, IWeighted {}
export interface LootAppFlags {
    sources: {
        [storeId: string]: LootStoredData;
    };
    filters: {
        [storeId: string]: LootStoredData;
    };
    config: {
        [TKey in GenType]: LootCategoryConfig;
    };
}

// TODO: Should EVERY storable setting have a unique key, so we can handle all data save and load the same way?
//  > Probably!

export function sourceFlagPath(source: DataSource, withFlags: boolean = false): string {
    let path = `sources.${source.storeId}`;
    if (withFlags) {
        path = `flags.${FLAGS_KEY}.${path}`;
    }
    return path;
}
export function filterFlagPath(filter: AppFilter, withFlags: boolean = false): string {
    let path = `filters.${filter.id}`;
    if (withFlags) {
        path = `flags.${FLAGS_KEY}.${path}`;
    }
    return path;
}

Handlebars.registerHelper('source-flag', (source: DataSource) => sourceFlagPath(source, true));
Handlebars.registerHelper('filter-flag', (filter: AppFilter) => filterFlagPath(filter, true));

/**
 * Get a filter with the saved weight and enabled status from an actor.
 * @param actor The actor to fetch from.
 * @param filter The filter to fetch.
 */
export function getFilterSettings<T extends AppFilter>(actor: Actor, filter: T): T {
    const flags = actor.getFlag(FLAGS_KEY, filterFlagPath(filter)) as Partial<AppFilter>;
    return mergeObject(duplicate(filter) as AppFilter, flags) as T;
}

/**
 * Load and merge changed settings into a copy of the provided data source.
 * @param actor The actor to load from.
 * @param source The source to load.
 */
export function getDataSourceSettings<T extends DataSource>(actor: Actor, source: T): T {
    const flags = actor.getFlag(FLAGS_KEY, sourceFlagPath(source)) as Partial<DataSource>;
    return mergeObject(duplicate(source) as DataSource, flags) as T;
}

/**
 * Set the options values of a single data source for an actor.
 * @param actor The actor to update.
 * @param source The data source to update.
 */
export async function setDataSourceSetting(actor: Actor, source: DataSource | DataSource[]): Promise<Actor> {
    if (!Array.isArray(source)) {
        source = [source];
    }
    const updateData = source.reduce(
        (prev, curr) =>
            mergeObject(prev, {
                [`flags.${FLAGS_KEY}.sources.${curr.itemType}.${curr.id}`]: curr,
            }),
        {},
    );
    return await actor.update(updateData);
}

// TODO: Should be pretty easy to collapse buildSourceSettingUpdate + buildFilterSettingUpdate into one function.
export type SetValueKeys = keyof IEnabled | keyof IWeighted;
export function buildSourceSettingUpdate(actor: Actor, type: GenType, keys: SetValueKeys | SetValueKeys[], values: any | any[]): Record<string, any> {
    if (!Array.isArray(keys)) keys = [keys];
    if (!Array.isArray(values)) values = [values];
    if (keys.length !== values.length) {
        throw new Error(`keys and values must be of equal length, got ${keys.length} and ${values.length}.`);
    }

    const sources = dataSourcesOfType(type);
    const updateData: Record<string, any> = {};
    for (const source of Object.values(sources)) {
        for (let i = 0; i < keys.length; i++) {
            updateData[`${sourceFlagPath(source, true)}.${keys[i]}`] = values[i];
        }
    }
    return updateData;
}
export function buildFilterSettingUpdate(actor: Actor, type: FilterType, keys: SetValueKeys | SetValueKeys[], values: any | any[]): Record<string, any> {
    if (!Array.isArray(keys)) keys = [keys];
    if (!Array.isArray(values)) values = [values];
    if (keys.length !== values.length) {
        throw new Error(`keys and values must be of equal length, got ${keys.length} and ${values.length}.`);
    }

    const filters = filtersOfType(type);
    const updateData: Record<string, any> = {};
    for (const filter of Object.values(filters)) {
        for (let i = 0; i < keys.length; i++) {
            updateData[`${filterFlagPath(filter, true)}.${keys[i]}`] = values[i];
        }
    }
    return updateData;
}
