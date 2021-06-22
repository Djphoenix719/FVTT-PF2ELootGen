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

import { SpellSchool, SpellTradition } from './data/Spells';
import { IEnabled, INamed, IWeighted } from './data/Mixins';
import { GenType, ordinalNumber } from './data/DataSource';

export enum FilterType {
    SpellSchool = 'school',
    SpellLevel = 'level',
    SpellTradition = 'tradition',
}

export interface AppFilter extends IWeighted, IEnabled, INamed {
    id: string;
    filterType: FilterType;
    filterCategory: GenType;
    desiredValue: number | string | boolean;
}
export interface SpellFilter extends AppFilter {
    filterCategory: GenType.Spell;
}

const levelFilterId = (level: number) => `level-${level}`;
const levelFilter = (level: number): SpellFilter => {
    return {
        id: levelFilterId(level),
        name: `${ordinalNumber(level)}-Level`,

        filterType: FilterType.SpellLevel,
        filterCategory: GenType.Spell,

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
        filterCategory: GenType.Spell,

        desiredValue: school,

        weight: 1,
        enabled: true,
    };
};

const traditionFilterId = (tradition: SpellTradition) => `${tradition}`;
const traditionFilter = (tradition: SpellTradition): SpellFilter => {
    return {
        id: traditionFilterId(tradition),
        name: tradition.capitalize(),

        filterType: FilterType.SpellTradition,
        filterCategory: GenType.Spell,

        desiredValue: tradition,

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

export const spellTraditionFilters: Record<string, AppFilter> = Object.values(SpellTradition).reduce(
    (prev, curr) =>
        mergeObject(prev, {
            [traditionFilterId(curr)]: traditionFilter(curr),
        }),
    {},
);

export const spellFilters = { ...spellLevelFilters, ...spellSchoolFilters, ...spellTraditionFilters };
