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

import { EqualityType } from '../../filter/EqualityType';
import { ISpecification } from '../../filter/ISpecification';
import { ItemData } from '../../../types/Items';
import { SpellSchool } from './Spells';
import { IEnabled, INamed, IWeighted } from './Mixins';
import { AndFilter } from '../../filter/AbstractFilter';
import { TableType } from './DataSource';

export enum FilterType {
    SpellSchool = 'school',
}

export interface AppFilter extends IWeighted, IEnabled, INamed {
    id: string;
    dataPath: string;
    class: new (...args) => ISpecification<ItemData>;
    filterCategory: TableType;
    filterType: FilterType;
    equalityType: EqualityType;
}

const schoolFilterId = (school: SpellSchool) => `${school}`;
const schoolFilter = (school: SpellSchool): AppFilter => {
    return {
        id: schoolFilterId(school),
        name: school.capitalize(),
        dataPath: 'data.school.value',
        class: AndFilter,
        filterCategory: TableType.Spell,
        filterType: FilterType.SpellSchool,
        equalityType: EqualityType.EqualTo,
        weight: 1,
        enabled: true,
    };
};

export const spellFilters: Record<string, AppFilter> = {
    [schoolFilterId(SpellSchool.Abjuration)]: schoolFilter(SpellSchool.Abjuration),
    [schoolFilterId(SpellSchool.Conjuration)]: schoolFilter(SpellSchool.Conjuration),
    [schoolFilterId(SpellSchool.Divination)]: schoolFilter(SpellSchool.Divination),
    [schoolFilterId(SpellSchool.Enchantment)]: schoolFilter(SpellSchool.Enchantment),
    [schoolFilterId(SpellSchool.Evocation)]: schoolFilter(SpellSchool.Evocation),
    [schoolFilterId(SpellSchool.Illusion)]: schoolFilter(SpellSchool.Illusion),
    [schoolFilterId(SpellSchool.Necromancy)]: schoolFilter(SpellSchool.Necromancy),
    [schoolFilterId(SpellSchool.Transmutation)]: schoolFilter(SpellSchool.Transmutation),
};
