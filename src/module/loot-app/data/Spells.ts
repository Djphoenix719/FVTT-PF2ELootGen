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

import { FilteredSource, getPackSourceContents, PackSource, SourceType } from './Draw';
import { INamed } from './Mixins';
import { TableType } from './Flags';

export enum SpellSchool {
    Abjuration = 'abjuration',
    Conjuration = 'conjuration',
    Divination = 'divination',
    Enchantment = 'enchantment',
    Evocation = 'evocation',
    Illusion = 'illusion',
    Necromancy = 'necromancy',
    Transmutation = 'transmutation',
}

export interface SpellSource extends PackSource, INamed {}

export const spellSources: Record<string, SpellSource> = {
    'spells-srd': {
        id: 'pf2e.spells-srd',
        name: 'SRD Spells',
        sourceType: SourceType.Pack,
        itemType: TableType.Spell,
        weight: 1,
        enabled: true,
    },
};

export const SCROLL_TEMPLATE_PACK_ID = 'pf2e.equipment-srd';

export const scrollTemplateIds = {
    1: 'RjuupS9xyXDLgyIr',
    2: 'Y7UD64foDbDMV9sx',
    3: 'ZmefGBXGJF3CFDbn',
    4: 'QSQZJ5BC3DeHv153',
    5: 'tjLvRWklAylFhBHQ',
    6: '4sGIy77COooxhQuC',
    7: 'fomEZZ4MxVVK3uVu',
    8: 'iPki3yuoucnj7bIt',
    9: 'cFHomF3tty8Wi1e5',
    10: 'o1XIHJ4MJyroAHfF',
};
export const wandTemplateIds = {
    1: 'UJWiN0K3jqVjxvKk',
    2: 'vJZ49cgi8szuQXAD',
    3: 'wrDmWkGxmwzYtfiA',
    4: 'Sn7v9SsbEDMUIwrO',
    5: '5BF7zMnrPYzyigCs',
    6: 'kiXh4SUWKr166ZeM',
    7: 'nmXPj9zuMRQBNT60',
    8: 'Qs8RgNH6thRPv2jt',
    9: 'Fgv722039TVM5JTc',
};

export const leveledSpellSources: FilteredSource<SpellSource>[] = [
    {
        id: 'pf2e.spells-srd',
        name: '1st Level',
        sourceType: SourceType.Pack,
        itemType: TableType.Spell,
        weight: 1,
        enabled: true,
        getFiltered: undefined,
    },
    {
        id: 'pf2e.spells-srd',
        name: '2nd Level',
        sourceType: SourceType.Pack,
        itemType: TableType.Spell,
        weight: 1,
        enabled: true,
        getFiltered: undefined,
    },
    {
        id: 'pf2e.spells-srd',
        name: '3rd Level',
        sourceType: SourceType.Pack,
        itemType: TableType.Spell,
        weight: 1,
        enabled: true,
        getFiltered: undefined,
    },
    {
        id: 'pf2e.spells-srd',
        name: '4th Level',
        sourceType: SourceType.Pack,
        itemType: TableType.Spell,
        weight: 1,
        enabled: true,
        getFiltered: undefined,
    },
    {
        id: 'pf2e.spells-srd',
        name: '5th Level',
        sourceType: SourceType.Pack,
        itemType: TableType.Spell,
        weight: 1,
        enabled: true,
        getFiltered: undefined,
    },
    {
        id: 'pf2e.spells-srd',
        name: '6th Level',
        sourceType: SourceType.Pack,
        itemType: TableType.Spell,
        weight: 1,
        enabled: true,
        getFiltered: undefined,
    },
    {
        id: 'pf2e.spells-srd',
        name: '7th Level',
        sourceType: SourceType.Pack,
        itemType: TableType.Spell,
        weight: 1,
        enabled: true,
        getFiltered: undefined,
    },
    {
        id: 'pf2e.spells-srd',
        name: '8th Level',
        sourceType: SourceType.Pack,
        itemType: TableType.Spell,
        weight: 1,
        enabled: true,
        getFiltered: undefined,
    },
    {
        id: 'pf2e.spells-srd',
        name: '9th Level',
        sourceType: SourceType.Pack,
        itemType: TableType.Spell,
        weight: 1,
        enabled: true,
        getFiltered: undefined,
    },
    {
        id: 'pf2e.spells-srd',
        name: '10th Level',
        sourceType: SourceType.Pack,
        itemType: TableType.Spell,
        weight: 1,
        enabled: true,
        getFiltered: undefined,
    },
];

for (let i = 0; i < leveledSpellSources.length; i++) {
    leveledSpellSources[i].getFiltered = async (source) => {
        const spells = await getPackSourceContents(source);
        return spells.filter((spell) => spell.data.level.value === i);
    };
}
