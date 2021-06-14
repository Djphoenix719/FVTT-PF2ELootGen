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
import { TreasureSource } from './data/Treasure';
import { PermanentSource } from './data/Permanent';
import { ConsumableSource } from './data/Consumable';
import { SpellSource } from './data/Spells';
import { DataSource, ItemType } from './data/DataSource';
import { dataSourcesOfType } from './Utilities';
import { AppFilter, FilterType, spellFilters } from './Filters';
import { IEnabled, IWeighted } from './data/Mixins';

export const FLAGS_KEY = MODULE_NAME;

export interface LootCategoryConfig {
    count: number;
}
export interface LootAppFlags {
    sources: {
        [ItemType.Treasure]: Record<string, TreasureSource>;
        [ItemType.Permanent]: Record<string, PermanentSource>;
        [ItemType.Consumable]: Record<string, ConsumableSource>;
        [ItemType.Spell]: Record<string, SpellSource>;
    };
    filters: {
        [ItemType.Spell]: {
            [FilterType.SpellSchool]: Record<string, AppFilter>;
            [FilterType.SpellLevel]: Record<string, AppFilter>;
        };
    };
    config: {
        [TKey in ItemType]: LootCategoryConfig;
    };
}

export function getFilterSettings<T extends AppFilter>(actor: Actor, filter: T): T {
    const flags: AppFilter = actor.getFlag(FLAGS_KEY, `filters.${filter.filterCategory}.${filter.filterType}.${filter.id}`) as AppFilter;
    return mergeObject(duplicate(filter) as AppFilter, flags) as T;
}

/**
 * Load and merge changed settings into a copy of the provided data source.
 * @param actor The actor to load from.
 * @param source The source to load.
 */
export function getDataSourceSettings<T extends DataSource>(actor: Actor, source: T): T {
    const flags: DataSource = actor.getFlag(FLAGS_KEY, `sources.${source.itemType}.${source.id}`) as DataSource;
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

export type SetValueKeys = keyof IEnabled | keyof IWeighted;
export async function setDataSourceSettingValue(actor: Actor, type: ItemType, keys: SetValueKeys | SetValueKeys[], values: any | any[]): Promise<Actor> {
    if (!Array.isArray(keys)) keys = [keys];
    if (!Array.isArray(values)) values = [values];
    if (keys.length !== values.length) throw new Error(`keys and values must be of equal length, got ${keys.length} and ${values.length}`);

    const sources = dataSourcesOfType(type);
    let updateData = Object.values(sources).reduce(
        (prevSource, currSource) =>
            mergeObject(
                prevSource,
                (keys as SetValueKeys[]).reduce(
                    (prevKey, currKey, currIdx) =>
                        mergeObject(prevKey, {
                            [`flags.${FLAGS_KEY}.sources.${currSource.itemType}.${currSource.id}.${currKey}`]: values[currIdx],
                        }),
                    {},
                ),
            ),
        {},
    );

    return await actor.update(updateData);
}

export async function setSpellFilterSettingValue(actor: Actor, type: FilterType, keys: SetValueKeys | SetValueKeys[], values: any | any[]): Promise<Actor> {
    if (!Array.isArray(keys)) keys = [keys];
    if (!Array.isArray(values)) values = [values];
    if (keys.length !== values.length) throw new Error(`keys and values must be of equal length, got ${keys.length} and ${values.length}`);

    let updateData = Object.values(spellFilters).reduce(
        (prevSource, currSource) =>
            mergeObject(
                prevSource,
                (keys as SetValueKeys[]).reduce(
                    (prevKey, currKey, currIdx) =>
                        mergeObject(prevKey, {
                            [`flags.${FLAGS_KEY}.filters.spell.${currSource.filterType}.${currSource.id}.${currKey}`]: values[currIdx],
                        }),
                    {},
                ),
            ),
        {},
    );

    return await actor.update(updateData);
}
