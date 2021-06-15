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

import { SpellSchool } from './data/Spells';
import { IEnabled, INamed, IWeighted } from './data/Mixins';
import { ItemType, ordinalNumber } from './data/DataSource';

export enum FilterType {
    SpellSchool = 'school',
    SpellLevel = 'level',
}

export interface AppFilter extends IWeighted, IEnabled, INamed {
    id: string;
    filterType: FilterType;
    filterCategory: ItemType;
    desiredValue: number | string | boolean;
}
export interface SpellFilter extends AppFilter {
    filterCategory: ItemType.Spell;
}

const levelFilterId = (level: number) => `level-${level}`;
const levelFilter = (level: number): SpellFilter => {
    return {
        id: levelFilterId(level),
        name: ordinalNumber(level + 1),

        filterType: FilterType.SpellLevel,
        filterCategory: ItemType.Spell,

        desiredValue: level,

        weight: 1,
        enabled: true,
    };
};

const schoolFilterId = (school: SpellSchool) => `${school}`;
const schoolFilter = (school: SpellSchool): SpellFilter => {
    return {
        id: schoolFilterId(school),
        name: school.capitalize(),

        filterType: FilterType.SpellLevel,
        filterCategory: ItemType.Spell,

        desiredValue: school,

        weight: 1,
        enabled: true,
    };
};

export const spellLevelFilters: Record<string, AppFilter> = Array.fromRange(10).reduce(
    (prev, curr) =>
        mergeObject(prev, {
            [levelFilterId(curr + 1)]: levelFilter(curr + 1),
        }),
    {},
);

export const spellSchoolFilters: Record<string, AppFilter> = Object.values(SpellSchool).reduce(
    (prev, curr) =>
        mergeObject(prev, {
            [schoolFilterId(curr)]: schoolFilter(curr),
        }),
    {},
);

export const spellFilters = { ...spellLevelFilters, ...spellSchoolFilters };
