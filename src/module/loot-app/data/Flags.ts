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

import { MODULE_NAME } from '../../Constants';
import { TreasureSource } from './Treasure';
import { PermanentSource } from './Permanent';
import { ConsumableSource } from './Consumable';
import { SpellSource } from './Spells';
import { DataSource } from './Draw';
import { dataSourcesOfType } from '../Utilities';
import { TableType } from './Tables';

export const FLAGS_KEY = MODULE_NAME;

export interface LootCategoryConfig {
    count: number;
}
export interface LootAppFlags {
    sources: {
        [TableType.Treasure]: Record<string, TreasureSource>;
        [TableType.Permanent]: Record<string, PermanentSource>;
        [TableType.Consumable]: Record<string, ConsumableSource>;
        [TableType.Spell]: Record<string, SpellSource>;
    };
    config: {
        [TKey in TableType]: LootCategoryConfig;
    };
}

/**
 * Load and merge changed settings into a copy of the provided data source.
 * @param actor The actor to load from.
 * @param source The source to load.
 */
export function getDataSourceSettings<T extends DataSource>(actor: Actor, source: T): T {
    const flags: LootAppFlags = actor.data.flags[FLAGS_KEY];
    const flagData = flags?.sources?.[source.itemType]?.[source.id];
    return mergeObject(duplicate(source) as DataSource, flagData) as T;
}
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

export type SourceKeys = keyof TreasureSource | PermanentSource | ConsumableSource | SpellSource;
export async function setDataSourceSettingValue(actor: Actor, type: TableType, keys: SourceKeys | SourceKeys[], values: any | any[]): Promise<Actor> {
    if (!Array.isArray(keys)) keys = [keys];
    if (!Array.isArray(values)) values = [values];
    if (keys.length !== values.length) throw new Error(`keys and values must be of equal length, got ${keys.length} and ${values.length}`);

    const sources = dataSourcesOfType(type);
    const updateData = Object.values(sources).reduce(
        (prevSource, currSource) =>
            mergeObject(
                prevSource,
                (keys as SourceKeys[]).reduce(
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
