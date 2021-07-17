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

import { EquipmentItem, PropertyRuneType, ResiliencyRuneType, StrikingRuneType, ZeroToFour } from '../../../types/PF2E';
import { EquipmentType, CREATE_KEY_NONE, getEquipmentType } from './Materials';

export interface IRune {
    slug: string;
    label: string;
    level: number;
    price: number;
}

const RuneNone: IRune = {
    slug: CREATE_KEY_NONE,
    label: 'None',
    price: 0,
    level: 0,
};

export type FundamentalRuneType = StrikingRuneType | ResiliencyRuneType;
export type PotencyRuneType = `${ZeroToFour}`;

export interface IRuneMap {
    potency?: Record<PotencyRuneType, IRune>;
    fundamental: Record<string, IRune>;
    property: Record<string, IRune>;
}
export type ItemRunes = {
    [EquipmentType.Weapon]: IRuneMap;
    [EquipmentType.Armor]: IRuneMap;
    [EquipmentType.Shield]: IRuneMap;
};
export const ItemRunes: ItemRunes = {
    [EquipmentType.Weapon]: {
        potency: {
            '0': {
                ...RuneNone,
            },
            '1': {
                slug: '1',
                label: 'PF2E.WeaponPotencyRune1',
                level: 2,
                price: 35,
            },
            '2': {
                slug: '2',
                label: 'PF2E.WeaponPotencyRune2',
                level: 10,
                price: 935,
            },
            '3': {
                slug: '3',
                label: 'PF2E.WeaponPotencyRune3',
                level: 16,
                price: 8935,
            },
            '4': {
                slug: '4',
                label: 'PF2E.WeaponPotencyRune4',
                level: 25,
                price: 0,
            },
        },
        fundamental: {
            [CREATE_KEY_NONE]: {
                ...RuneNone,
            },
            striking: {
                slug: 'striking',
                label: 'PF2E.ArmorStrikingRune',
                price: 65,
                level: 4,
            },
            greaterStriking: {
                slug: 'greaterStriking',
                label: 'PF2E.ArmorGreaterStrikingRune',
                price: 1065,
                level: 12,
            },
            majorStriking: {
                slug: 'majorStriking',
                label: 'PF2E.ArmorMajorStrikingRune',
                price: 31065,
                level: 19,
            },
        },
        property: {
            [CREATE_KEY_NONE]: {
                ...RuneNone,
            },
            anarchic: {
                slug: 'anarchic',
                label: 'PF2E.WeaponPropertyRuneAnarchic',
                price: 1400,
                level: 11,
            },
            ancestralEchoing: {
                slug: 'ancestralEchoing',
                label: 'PF2E.WeaponPropertyRuneAncestralEchoing',
                price: 9500,
                level: 15,
            },
            axiomatic: {
                slug: 'axiomatic',
                label: 'PF2E.WeaponPropertyRuneAxiomatic',
                price: 1400,
                level: 11,
            },
            bloodbane: {
                slug: 'bloodbane',
                label: 'PF2E.WeaponPropertyRuneBloodbane',
                price: 475,
                level: 8,
            },
            corrosive: {
                slug: 'corrosive',
                label: 'PF2E.WeaponPropertyRuneCorrosive',
                price: 500,
                level: 8,
            },
            dancing: {
                slug: 'dancing',
                label: 'PF2E.WeaponPropertyRuneDancing',
                price: 2700,
                level: 13,
            },
            disrupting: {
                slug: 'disrupting',
                label: 'PF2E.WeaponPropertyRuneDisrupting',
                price: 150,
                level: 5,
            },
            fearsome: {
                slug: 'fearsome',
                label: 'PF2E.WeaponPropertyRuneFearsome',
                price: 160,
                level: 5,
            },
            flaming: {
                slug: 'flaming',
                label: 'PF2E.WeaponPropertyRuneFlaming',
                price: 500,
                level: 8,
            },
            frost: {
                slug: 'frost',
                label: 'PF2E.WeaponPropertyRuneFrost',
                price: 500,
                level: 8,
            },
            ghostTouch: {
                slug: 'ghostTouch',
                label: 'PF2E.WeaponPropertyRuneGhostTouch',
                price: 75,
                level: 4,
            },
            greaterBloodbane: {
                slug: 'greaterBloodbane',
                label: 'PF2E.WeaponPropertyRuneGreaterBloodbane',
                price: 6500,
                level: 15,
            },
            greaterCorrosive: {
                slug: 'greaterCorrosive',
                label: 'PF2E.WeaponPropertyRuneGreaterCorrosive',
                price: 6500,
                level: 15,
            },
            greaterDisrupting: {
                slug: 'greaterDisrupting',
                label: 'PF2E.WeaponPropertyRuneGreaterDisrupting',
                price: 4300,
                level: 14,
            },
            greaterFearsome: {
                slug: 'greaterFearsome',
                label: 'PF2E.WeaponPropertyRuneGreaterFearsome',
                price: 2000,
                level: 12,
            },
            greaterFlaming: {
                slug: 'greaterFlaming',
                label: 'PF2E.WeaponPropertyRuneGreaterFlaming',
                price: 6500,
                level: 15,
            },
            greaterFrost: {
                slug: 'greaterFrost',
                label: 'PF2E.WeaponPropertyRuneGreaterFrost',
                price: 6500,
                level: 15,
            },
            greaterShock: {
                slug: 'greaterShock',
                label: 'PF2E.WeaponPropertyRuneGreaterShock',
                price: 6500,
                level: 15,
            },
            greaterThundering: {
                slug: 'greaterThundering',
                label: 'PF2E.WeaponPropertyRuneGreaterThundering',
                price: 6500,
                level: 15,
            },
            grievous: {
                slug: 'grievous',
                label: 'PF2E.WeaponPropertyRuneGrievous',
                price: 700,
                level: 9,
            },
            holy: {
                slug: 'holy',
                label: 'PF2E.WeaponPropertyRuneHoly',
                price: 1400,
                level: 11,
            },
            keen: {
                slug: 'keen',
                label: 'PF2E.WeaponPropertyRuneKeen',
                price: 3000,
                level: 13,
            },
            kinWarding: {
                slug: 'kinWarding',
                label: 'PF2E.WeaponPropertyRuneKinWarding',
                price: 52,
                level: 3,
            },
            pacifying: {
                slug: 'pacifying',
                label: 'PF2E.WeaponPropertyRunePacifying',
                price: 150,
                level: 5,
            },
            returning: {
                slug: 'returning',
                label: 'PF2E.WeaponPropertyRuneReturning',
                price: 55,
                level: 3,
            },
            serrating: {
                slug: 'serrating',
                label: 'PF2E.WeaponPropertyRuneSerrating',
                price: 1000,
                level: 10,
            },
            shifting: {
                slug: 'shifting',
                label: 'PF2E.WeaponPropertyRuneShifting',
                price: 225,
                level: 6,
            },
            shock: {
                slug: 'shock',
                label: 'PF2E.WeaponPropertyRuneShock',
                price: 500,
                level: 8,
            },
            speed: {
                slug: 'speed',
                label: 'PF2E.WeaponPropertyRuneSpeed',
                price: 10000,
                level: 16,
            },
            spellStoring: {
                slug: 'spellStoring',
                label: 'PF2E.WeaponPropertyRuneSpellStoring',
                price: 2700,
                level: 13,
            },
            thundering: {
                slug: 'thundering',
                label: 'PF2E.WeaponPropertyRuneThundering',
                price: 500,
                level: 8,
            },
            unholy: {
                slug: 'unholy',
                label: 'PF2E.WeaponPropertyRuneUnholy',
                price: 1400,
                level: 11,
            },
            vorpal: {
                slug: 'vorpal',
                label: 'PF2E.WeaponPropertyRuneVorpal',
                price: 15000,
                level: 17,
            },
            wounding: {
                slug: 'wounding',
                label: 'PF2E.WeaponPropertyRuneWounding',
                price: 340,
                level: 7,
            },
        },
    },
    [EquipmentType.Armor]: {
        potency: {
            '0': {
                ...RuneNone,
            },
            '1': {
                slug: '1',
                label: 'PF2E.ArmorPotencyRune1',
                level: 5,
                price: 160,
            },
            '2': {
                slug: '2',
                label: 'PF2E.ArmorPotencyRune2',
                level: 11,
                price: 1060,
            },
            '3': {
                slug: '3',
                label: 'PF2E.ArmorPotencyRune3',
                level: 18,
                price: 20560,
            },
            '4': {
                slug: '4',
                label: 'PF2E.ArmorPotencyRune4',
                level: 25,
                price: 0,
            },
        },
        fundamental: {
            [CREATE_KEY_NONE]: {
                ...RuneNone,
            },
            resilient: {
                slug: 'resilient',
                label: 'PF2E.ArmorResilientRune',
                level: 8,
                price: 340,
            },
            greaterResilient: {
                slug: 'greaterResilient',
                label: 'PF2E.ArmorGreaterResilientRune',
                level: 14,
                price: 3440,
            },
            majorResilient: {
                slug: 'majorResilient',
                label: 'PF2E.ArmorMajorResilientRune',
                level: 20,
                price: 49440,
            },
        },
        property: {
            [CREATE_KEY_NONE]: {
                ...RuneNone,
            },
            acidResistant: {
                slug: 'acidResistant',
                label: 'PF2E.ArmorPropertyRuneAcidResistant',
                price: 420,
                level: 8,
            },
            antimagic: {
                slug: 'antimagic',
                label: 'PF2E.ArmorPropertyRuneAntimagic',
                price: 6500,
                level: 15,
            },
            coldResistant: {
                slug: 'coldResistant',
                label: 'PF2E.ArmorPropertyRuneColdResistant',
                price: 420,
                level: 8,
            },
            electricityResistant: {
                slug: 'electricityResistant',
                label: 'PF2E.ArmorPropertyRuneElectricityResistant',
                price: 420,
                level: 8,
            },
            ethereal: {
                slug: 'ethereal',
                label: 'PF2E.ArmorPropertyRuneEthereal',
                price: 13500,
                level: 17,
            },
            fireResistant: {
                slug: 'fireResistant',
                label: 'PF2E.ArmorPropertyRuneFireResistant',
                price: 420,
                level: 8,
            },
            fortification: {
                slug: 'fortification',
                label: 'PF2E.ArmorPropertyRuneFortification',
                price: 2000,
                level: 12,
            },
            glamered: {
                slug: 'glamered',
                label: 'PF2E.ArmorPropertyRuneGlamered',
                price: 140,
                level: 5,
            },
            greaterAcidResistant: {
                slug: 'greaterAcidResistant',
                label: 'PF2E.ArmorPropertyRuneGreaterAcidResistant',
                price: 1650,
                level: 12,
            },
            greaterColdResistant: {
                slug: 'greaterColdResistant',
                label: 'PF2E.ArmorPropertyRuneGreaterColdResistant',
                price: 1650,
                level: 12,
            },
            greaterElectricityResistant: {
                slug: 'greaterElectricityResistant',
                label: 'PF2E.ArmorPropertyRuneGreaterElectricityResistant',
                price: 1650,
                level: 12,
            },
            greaterFireResistant: {
                slug: 'greaterFireResistant',
                label: 'PF2E.ArmorPropertyRuneGreaterFireResistant',
                price: 1650,
                level: 12,
            },
            greaterFortification: {
                slug: 'greaterFortification',
                label: 'PF2E.ArmorPropertyRuneGreaterFortification',
                price: 24000,
                level: 18,
            },
            greaterInvisibility: {
                slug: 'greaterInvisibility',
                label: 'PF2E.ArmorPropertyRuneGreaterInvisibility',
                price: 1000,
                level: 10,
            },
            greaterReady: {
                slug: 'greaterReady',
                label: 'PF2E.ArmorPropertyRuneGreaterReady',
                price: 1200,
                level: 11,
            },
            greaterShadow: {
                slug: 'greaterShadow',
                label: 'PF2E.ArmorPropertyRuneGreaterShadow',
                price: 650,
                level: 9,
            },
            greaterSlick: {
                slug: 'greaterSlick',
                label: 'PF2E.ArmorPropertyRuneGreaterSlick',
                price: 450,
                level: 8,
            },
            greaterWinged: {
                slug: 'greaterWinged',
                label: 'PF2E.ArmorPropertyRuneGreaterWinged',
                price: 35000,
                level: 19,
            },
            invisibility: {
                slug: 'invisibility',
                label: 'PF2E.ArmorPropertyRuneInvisibility',
                price: 500,
                level: 8,
            },
            majorShadow: {
                slug: 'majorShadow',
                label: 'PF2E.ArmorPropertyRuneMajorShadow',
                price: 14000,
                level: 17,
            },
            majorSlick: {
                slug: 'majorSlick',
                label: 'PF2E.ArmorPropertyRuneMajorSlick',
                price: 9000,
                level: 16,
            },
            ready: {
                slug: 'ready',
                label: 'PF2E.ArmorPropertyRuneReady',
                price: 200,
                level: 6,
            },
            rockBraced: {
                slug: 'rockBraced',
                label: 'PF2E.ArmorPropertyRuneRockBraced',
                price: 3000,
                level: 13,
            },
            shadow: {
                slug: 'shadow',
                label: 'PF2E.ArmorPropertyRuneShadow',
                price: 55,
                level: 3,
            },
            sinisterKnight: {
                slug: 'sinisterKnight',
                label: 'PF2E.ArmorPropertyRuneSinisterKnight',
                price: 500,
                level: 8,
            },
            slick: {
                slug: 'slick',
                label: 'PF2E.ArmorPropertyRuneSlick',
                price: 45,
                level: 3,
            },
            winged: {
                slug: 'winged',
                label: 'PF2E.ArmorPropertyRuneWinged',
                price: 2500,
                level: 13,
            },
        },
    },
    [EquipmentType.Shield]: {
        fundamental: {},
        property: {},
    },
};

/**
 * Get all valid runes that could be used for this item.
 * @param item
 */
export const getValidPropertyRunes = (item: EquipmentItem): Partial<Record<PropertyRuneType, IRune>> => {
    const equipmentType = getEquipmentType(item);
    if (!equipmentType) {
        return {};
    }

    return ItemRunes[equipmentType]['property'];
};
