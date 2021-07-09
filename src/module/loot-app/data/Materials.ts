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

import { ResilientRuneType, StrikingRuneType } from '../../../types/Items';

export type Bulk = 'L' | number;
export type IMaterialMap = Record<string, IMaterial>;

export enum BuilderType {
    Weapon = 'weapon',
    Armor = 'armor',
    Shield = 'shield',
}
export enum MaterialGrade {
    Low = 'low',
    Standard = 'standard',
    High = 'high',
}
export enum ShieldType {
    Buckler = 'buckler',
    Shield = 'shield',
}
export enum Rarity {
    Common = 'common',
    Uncommon = 'uncommon',
    Rare = 'rare',
    Unique = 'unique',
}

export interface IDurability {
    hardness: number;
    hitPoints: number;
    breakThreshold: number;
}

// Weapons
//  Reduce bulk by X
//  Traits for some
//  Grade (not all may be present)
//   Base Price + Price Per Bulk
//   Level
//
// Armor
//  Dragonhide (+1 circumstance to AC)
//  Darkwood (reduce check penalty strength, lighter)
//  Orichalcum +Initiative
//  Reduce Speed Penalty
//  Reduce bulk by X
//  Grade (not all may be present)
//   Base Price + Price Per Bulk
//   Level
//
// Shields
//  Reduce bulk by X
//  Grade
//   Fixed price & stats
//   Level

export interface IPriceData {
    basePrice: number;
    bulkPrice: number;
}
export interface ILevelData {
    level: number;
}
export interface IRarityData {
    rarity: Rarity;
}
export interface ISpecialData {
    bulkModifier?: number;
}

export const durability = (hardness: number): IDurability => {
    return {
        hardness: hardness,
        breakThreshold: hardness * 2,
        hitPoints: hardness * 4,
    };
};

export type IMaterial = Readonly<{
    slug: string;
    label: string;
    value: string;
    defaultGrade: MaterialGrade;
    item?: ISpecialData &
        {
            [TGrade in MaterialGrade]?: IPriceData &
                ILevelData & {
                    thinItems?: IDurability;
                    items?: IDurability;
                    structures?: IDurability;
                };
        };
    [BuilderType.Shield]?: ISpecialData &
        {
            [TGrade in MaterialGrade]?: IPriceData &
                ILevelData &
                {
                    [TShield in ShieldType]?: IDurability;
                };
        };
    [BuilderType.Armor]?: ISpecialData &
        {
            [TGrade in MaterialGrade]?: IPriceData & ILevelData;
        };
    [BuilderType.Weapon]?: ISpecialData &
        {
            [TGrade in MaterialGrade]?: IPriceData & ILevelData;
        };
}>;

// TODO: Descriptions w/ links for items, embed in description
// TODO: Descriptions w/ links for weapons, embed in description
// TODO: Descriptions w/ links for armors, embed in description

export const MaterialNone: IMaterial = {
    slug: 'none',
    label: 'None',
    value: '',
    defaultGrade: MaterialGrade.Standard,
    item: {
        [MaterialGrade.Standard]: {
            level: 0,
            basePrice: 0,
            bulkPrice: 0,
            thinItems: { hardness: 0, hitPoints: 1, breakThreshold: 0 },
            items: { hardness: 1, hitPoints: 4, breakThreshold: 2 },
        },
    },
    [BuilderType.Weapon]: {
        [MaterialGrade.Standard]: {
            level: 0,
            basePrice: 0,
            bulkPrice: 0,
        },
    },
    [BuilderType.Armor]: {
        [MaterialGrade.Standard]: {
            level: 0,
            basePrice: 0,
            bulkPrice: 0,
        },
    },
    [BuilderType.Shield]: {
        [MaterialGrade.Standard]: {
            level: 0,
            basePrice: 0,
            bulkPrice: 0,
        },
    },
};

export const MaterialAdamantine: IMaterial = {
    slug: 'adamantine',
    label: 'Adamantine',
    value: 'adamantine',
    defaultGrade: MaterialGrade.Standard,
    item: {
        [MaterialGrade.Standard]: {
            level: 8,
            basePrice: 0,
            bulkPrice: 350,
            thinItems: { hardness: 10, hitPoints: 40, breakThreshold: 20 },
            items: { hardness: 14, hitPoints: 56, breakThreshold: 28 },
            structures: { hardness: 28, hitPoints: 112, breakThreshold: 56 },
        },
        [MaterialGrade.High]: {
            level: 16,
            basePrice: 0,
            bulkPrice: 6000,
            thinItems: { hardness: 13, hitPoints: 52, breakThreshold: 26 },
            items: { hardness: 17, hitPoints: 68, breakThreshold: 34 },
            structures: { hardness: 34, hitPoints: 136, breakThreshold: 68 },
        },
    },
    [BuilderType.Armor]: {
        [MaterialGrade.Standard]: {
            level: 12,
            basePrice: 1600,
            bulkPrice: 160,
        },
        [MaterialGrade.High]: {
            level: 19,
            basePrice: 32000,
            bulkPrice: 3200,
        },
    },
    [BuilderType.Weapon]: {
        [MaterialGrade.Standard]: {
            level: 11,
            basePrice: 1400,
            bulkPrice: 140,
        },
        [MaterialGrade.High]: {
            level: 17,
            basePrice: 13000,
            bulkPrice: 1350,
        },
    },
    shield: {},
};
export const MaterialColdIron: IMaterial = {
    slug: 'coldIron',
    label: 'Cold Iron',
    value: 'coldIron',
    defaultGrade: MaterialGrade.Standard,
    item: {
        [MaterialGrade.Low]: {
            level: 2,
            basePrice: 0,
            bulkPrice: 20,
            thinItems: { hardness: 5, hitPoints: 20, breakThreshold: 10 },
            items: { hardness: 9, hitPoints: 36, breakThreshold: 18 },
            structures: { hardness: 18, hitPoints: 72, breakThreshold: 36 },
        },
        [MaterialGrade.Standard]: {
            level: 7,
            basePrice: 0,
            bulkPrice: 250,
            thinItems: { hardness: 7, hitPoints: 28, breakThreshold: 14 },
            items: { hardness: 11, hitPoints: 44, breakThreshold: 22 },
            structures: { hardness: 22, hitPoints: 88, breakThreshold: 44 },
        },
        [MaterialGrade.High]: {
            level: 15,
            basePrice: 0,
            bulkPrice: 4500,
            thinItems: { hardness: 10, hitPoints: 40, breakThreshold: 20 },
            items: { hardness: 14, hitPoints: 56, breakThreshold: 28 },
            structures: { hardness: 28, hitPoints: 112, breakThreshold: 56 },
        },
    },
    [BuilderType.Armor]: {
        [MaterialGrade.Low]: {
            level: 5,
            basePrice: 140,
            bulkPrice: 14,
        },
        [MaterialGrade.Standard]: {
            level: 11,
            basePrice: 1200,
            bulkPrice: 120,
        },
        [MaterialGrade.High]: {
            level: 18,
            basePrice: 20000,
            bulkPrice: 2000,
        },
    },
    [BuilderType.Weapon]: {
        [MaterialGrade.Low]: {
            level: 2,
            basePrice: 40,
            bulkPrice: 4,
        },
        [MaterialGrade.Standard]: {
            level: 10,
            basePrice: 880,
            bulkPrice: 88,
        },
        [MaterialGrade.High]: {
            level: 16,
            basePrice: 9000,
            bulkPrice: 900,
        },
    },
};
export const MaterialDarkwood: IMaterial = {
    slug: 'darkwood',
    label: 'Darkwood',
    value: 'darkwood',
    defaultGrade: MaterialGrade.Standard,
    item: {
        [MaterialGrade.Standard]: {
            level: 8,
            basePrice: 0,
            bulkPrice: 350,
            thinItems: { hardness: 5, hitPoints: 20, breakThreshold: 10 },
            items: { hardness: 7, hitPoints: 28, breakThreshold: 14 },
            structures: { hardness: 14, hitPoints: 56, breakThreshold: 28 },
        },
        [MaterialGrade.High]: {
            level: 16,
            basePrice: 0,
            bulkPrice: 6000,
            thinItems: { hardness: 8, hitPoints: 32, breakThreshold: 16 },
            items: { hardness: 10, hitPoints: 40, breakThreshold: 20 },
            structures: { hardness: 20, hitPoints: 80, breakThreshold: 40 },
        },
    },
    [BuilderType.Armor]: {
        [MaterialGrade.Standard]: {
            level: 12,
            basePrice: 1600,
            bulkPrice: 160,
        },
        [MaterialGrade.High]: {
            level: 19,
            basePrice: 32000,
            bulkPrice: 3200,
        },
    },
    [BuilderType.Weapon]: {
        [MaterialGrade.Standard]: {
            level: 11,
            basePrice: 1400,
            bulkPrice: 140,
        },
        [MaterialGrade.High]: {
            level: 17,
            basePrice: 13500,
            bulkPrice: 1350,
        },
    },
};
export const MaterialDragonhide: IMaterial = {
    slug: 'dragonhide',
    label: 'Dragonhide',
    value: 'dragonhide',
    defaultGrade: MaterialGrade.Standard,
    item: {
        [MaterialGrade.Standard]: {
            level: 8,
            basePrice: 0,
            bulkPrice: 350,
            thinItems: { hardness: 4, hitPoints: 16, breakThreshold: 8 },
            items: { hardness: 7, hitPoints: 28, breakThreshold: 14 },
        },
        [MaterialGrade.High]: {
            level: 16,
            basePrice: 0,
            bulkPrice: 6000,
            thinItems: { hardness: 8, hitPoints: 32, breakThreshold: 16 },
            items: { hardness: 11, hitPoints: 44, breakThreshold: 22 },
        },
    },
    [BuilderType.Armor]: {
        // TODO: +1 circumstance bonus to your AC and saving throws
        //  against attacks and spells that deal the corresponding
        //  damage type
        [MaterialGrade.Standard]: {
            level: 12,
            basePrice: 1600,
            bulkPrice: 160,
        },
        [MaterialGrade.High]: {
            level: 19,
            basePrice: 32000,
            bulkPrice: 3200,
        },
    },
};
export const MaterialMithral: IMaterial = {
    slug: 'mithral',
    label: 'Mithral',
    value: 'mithral',
    defaultGrade: MaterialGrade.Standard,
    item: {
        [MaterialGrade.Standard]: {
            level: 8,
            basePrice: 0,
            bulkPrice: 350,
            thinItems: { hardness: 5, hitPoints: 20, breakThreshold: 10 },
            items: { hardness: 9, hitPoints: 36, breakThreshold: 18 },
            structures: { hardness: 18, hitPoints: 72, breakThreshold: 36 },
        },
        [MaterialGrade.High]: {
            level: 16,
            basePrice: 0,
            bulkPrice: 6000,
            thinItems: { hardness: 8, hitPoints: 32, breakThreshold: 16 },
            items: { hardness: 12, hitPoints: 48, breakThreshold: 24 },
            structures: { hardness: 24, hitPoints: 96, breakThreshold: 48 },
        },
    },
    [BuilderType.Armor]: {
        [MaterialGrade.Standard]: {
            level: 12,
            basePrice: 1600,
            bulkPrice: 160,
        },
        [MaterialGrade.High]: {
            level: 19,
            basePrice: 32000,
            bulkPrice: 3200,
        },
    },
    [BuilderType.Weapon]: {
        // TODO: Bulk reduced by 1
        [MaterialGrade.Standard]: {
            level: 11,
            basePrice: 1400,
            bulkPrice: 140,
        },
        [MaterialGrade.High]: {
            level: 17,
            basePrice: 13500,
            bulkPrice: 1350,
        },
    },
};
export const MaterialOrichalcum: IMaterial = {
    slug: 'orichalcum',
    label: 'Orichalcum',
    value: 'orichalcum',
    defaultGrade: MaterialGrade.High,
    item: {
        [MaterialGrade.High]: {
            level: 17,
            basePrice: 0,
            bulkPrice: 10000,
            thinItems: { hardness: 16, hitPoints: 64, breakThreshold: 32 },
            items: { hardness: 18, hitPoints: 72, breakThreshold: 36 },
            structures: { hardness: 35, hitPoints: 140, breakThreshold: 70 },
        },
    },
    [BuilderType.Armor]: {
        // TODO: +1 circumstance bonus to initiative rolls
        [MaterialGrade.High]: {
            level: 20,
            basePrice: 55000,
            bulkPrice: 5500,
        },
    },
    [BuilderType.Weapon]: {
        // TODO: Speed costs half the normal price
        [MaterialGrade.High]: {
            level: 18,
            basePrice: 22500,
            bulkPrice: 2250,
        },
    },
};
export const MaterialSilver: IMaterial = {
    slug: 'silver',
    label: 'Silver',
    value: 'silver',
    defaultGrade: MaterialGrade.Standard,
    item: {
        [MaterialGrade.Low]: {
            level: 2,
            basePrice: 0,
            bulkPrice: 20,
            thinItems: { hardness: 3, hitPoints: 12, breakThreshold: 6 },
            items: { hardness: 5, hitPoints: 20, breakThreshold: 10 },
            structures: { hardness: 10, hitPoints: 40, breakThreshold: 20 },
        },
        [MaterialGrade.Standard]: {
            level: 7,
            basePrice: 0,
            bulkPrice: 250,
            thinItems: { hardness: 5, hitPoints: 20, breakThreshold: 10 },
            items: { hardness: 7, hitPoints: 28, breakThreshold: 14 },
            structures: { hardness: 14, hitPoints: 56, breakThreshold: 28 },
        },
        [MaterialGrade.High]: {
            level: 15,
            basePrice: 0,
            bulkPrice: 4500,
            thinItems: { hardness: 8, hitPoints: 32, breakThreshold: 16 },
            items: { hardness: 10, hitPoints: 40, breakThreshold: 20 },
            structures: { hardness: 20, hitPoints: 80, breakThreshold: 40 },
        },
    },
    [BuilderType.Armor]: {
        [MaterialGrade.Low]: {
            level: 5,
            basePrice: 140,
            bulkPrice: 14,
        },
        [MaterialGrade.Standard]: {
            level: 11,
            basePrice: 1200,
            bulkPrice: 120,
        },
        [MaterialGrade.High]: {
            level: 18,
            basePrice: 20000,
            bulkPrice: 2000,
        },
    },
    [BuilderType.Weapon]: {
        [MaterialGrade.Low]: {
            level: 2,
            basePrice: 40,
            bulkPrice: 4,
        },
        [MaterialGrade.Standard]: {
            level: 10,
            basePrice: 880,
            bulkPrice: 88,
        },
        [MaterialGrade.High]: {
            level: 16,
            basePrice: 9000,
            bulkPrice: 900,
        },
    },
};
export const MaterialSovereignSteel: IMaterial = {
    slug: 'sovereignSteel',
    label: 'Sovereign Steel',
    value: 'sovereignSteel',
    defaultGrade: MaterialGrade.Standard,
    item: {
        [MaterialGrade.Standard]: {
            level: 9,
            basePrice: 0,
            bulkPrice: 500,
            thinItems: { hardness: 7, hitPoints: 28, breakThreshold: 14 },
            items: { hardness: 11, hitPoints: 44, breakThreshold: 22 },
            structures: { hardness: 22, hitPoints: 88, breakThreshold: 44 },
        },
        [MaterialGrade.High]: {
            level: 17,
            basePrice: 0,
            bulkPrice: 8000,
            thinItems: { hardness: 10, hitPoints: 40, breakThreshold: 20 },
            items: { hardness: 14, hitPoints: 56, breakThreshold: 28 },
            structures: { hardness: 28, hitPoints: 112, breakThreshold: 56 },
        },
    },
    [BuilderType.Armor]: {
        [MaterialGrade.Standard]: {
            level: 13,
            basePrice: 2400,
            bulkPrice: 240,
        },
        [MaterialGrade.High]: {
            level: 20,
            basePrice: 50000,
            bulkPrice: 5000,
        },
    },
    [BuilderType.Weapon]: {
        [MaterialGrade.Standard]: {
            level: 12,
            basePrice: 1600,
            bulkPrice: 160,
        },
        [MaterialGrade.High]: {
            level: 19,
            basePrice: 32000,
            bulkPrice: 3200,
        },
    },
};
export const MaterialWarpglass: IMaterial = {
    slug: 'warpglass',
    label: 'Warpglass',
    value: 'warpglass',
    defaultGrade: MaterialGrade.Standard,
    item: {
        [MaterialGrade.High]: {
            level: 17,
            basePrice: 0,
            bulkPrice: 8000,
            thinItems: { hardness: 8, hitPoints: 32, breakThreshold: 16 },
            items: { hardness: 12, hitPoints: 48, breakThreshold: 24 },
            structures: { hardness: 24, hitPoints: 96, breakThreshold: 48 },
        },
    },
    [BuilderType.Weapon]: {
        [MaterialGrade.High]: {
            level: 17,
            basePrice: 14000,
            bulkPrice: 1400,
        },
    },
};

export const ItemMaterials: IMaterialMap = {
    none: MaterialNone,
    adamantine: MaterialAdamantine,
    coldIron: MaterialColdIron,
    darkwood: MaterialDarkwood,
    dragonhide: MaterialDragonhide,
    mithral: MaterialMithral,
    orichalcum: MaterialOrichalcum,
    silver: MaterialSilver,
    sovereignSteel: MaterialSovereignSteel,
    warpglass: MaterialWarpglass,
};

export interface Rune {
    slug: string;
    index?: number;
    label: string;
    level: number;
    price: number;
}

export const CREATE_KEY_NONE = '';
const CREATE_OBJECT_NONE: Rune = {
    slug: CREATE_KEY_NONE,
    index: 0,
    label: 'None',
    price: 0,
    level: 0,
};

export type FundamentalRune = StrikingRuneType | ResilientRuneType;

export interface IRuneMap {
    potency: Record<string, Rune>;
    fundamental: Record<string, Rune>;
    property: Record<string, Rune>;
}
export type ItemRunes = {
    [BuilderType.Weapon]: IRuneMap;
    [BuilderType.Armor]: IRuneMap;
    [BuilderType.Shield]: IRuneMap;
};
export const ItemRunes: ItemRunes = {
    [BuilderType.Weapon]: {
        potency: {
            [CREATE_KEY_NONE]: {
                ...CREATE_OBJECT_NONE,
            },
            '1': {
                slug: '1',
                index: 1,
                label: 'Weapon Potency (+1)',
                level: 2,
                price: 35,
            },
            '2': {
                slug: '2',
                index: 2,
                label: 'Weapon Potency (+2)',
                level: 10,
                price: 935,
            },
            '3': {
                slug: '3',
                index: 3,
                label: 'Weapon Potency (+3)',
                level: 16,
                price: 8935,
            },
            '4': {
                slug: '4',
                index: 4,
                label: 'Weapon Potency (+4)',
                level: 25,
                price: 0,
            },
        },
        fundamental: {
            [CREATE_KEY_NONE]: {
                ...CREATE_OBJECT_NONE,
            },
            striking: {
                slug: '1',
                index: 1,
                label: 'striking',
                price: 65,
                level: 4,
            },
            greaterStriking: {
                slug: '2',
                index: 2,
                label: 'greater striking',
                price: 1065,
                level: 12,
            },
            majorStriking: {
                slug: '3',
                index: 3,
                label: 'major striking',
                price: 31065,
                level: 19,
            },
        },
        property: {
            [CREATE_KEY_NONE]: {
                ...CREATE_OBJECT_NONE,
            },
            anarchic: {
                slug: 'anarchic',
                label: 'anarchic',
                price: 1400,
                level: 11,
            },
            ancestralEchoing: {
                slug: 'ancestralEchoing',
                label: 'ancestral echoing',
                price: 9500,
                level: 15,
            },
            axiomatic: {
                slug: 'axiomatic',
                label: 'axiomatic',
                price: 1400,
                level: 11,
            },
            bloodbane: {
                slug: 'bloodbane',
                label: 'bloodbane',
                price: 475,
                level: 8,
            },
            corrosive: {
                slug: 'corrosive',
                label: 'corrosive',
                price: 500,
                level: 8,
            },
            dancing: {
                slug: 'dancing',
                label: 'dancing',
                price: 2700,
                level: 13,
            },
            disrupting: {
                slug: 'disrupting',
                label: 'disrupting',
                price: 150,
                level: 5,
            },
            fearsome: {
                slug: 'fearsome',
                label: 'fearsome',
                price: 160,
                level: 5,
            },
            flaming: {
                slug: 'flaming',
                label: 'flaming',
                price: 500,
                level: 8,
            },
            frost: {
                slug: 'frost',
                label: 'frost',
                price: 500,
                level: 8,
            },
            ghostTouch: {
                slug: 'ghostTouch',
                label: 'ghost touch',
                price: 75,
                level: 4,
            },
            greaterBloodbane: {
                slug: 'greaterBloodbane',
                label: 'greater bloodbane',
                price: 6500,
                level: 15,
            },
            greaterCorrosive: {
                slug: 'greaterCorrosive',
                label: 'greater corrosive',
                price: 6500,
                level: 15,
            },
            greaterDisrupting: {
                slug: 'greaterDisrupting',
                label: 'greater disrupting',
                price: 4300,
                level: 14,
            },
            greaterFearsome: {
                slug: 'greaterFearsome',
                label: 'greater fearsome',
                price: 2000,
                level: 12,
            },
            greaterFlaming: {
                slug: 'greaterFlaming',
                label: 'greater flaming',
                price: 6500,
                level: 15,
            },
            greaterFrost: {
                slug: 'greaterFrost',
                label: 'greater frost',
                price: 6500,
                level: 15,
            },
            greaterShock: {
                slug: 'greaterShock',
                label: 'greater shock',
                price: 6500,
                level: 15,
            },
            greaterThundering: {
                slug: 'greaterThundering',
                label: 'greater thundering',
                price: 6500,
                level: 15,
            },
            grievous: {
                slug: 'grievous',
                label: 'grievous',
                price: 700,
                level: 9,
            },
            holy: {
                slug: 'holy',
                label: 'holy',
                price: 1400,
                level: 11,
            },
            keen: {
                slug: 'keen',
                label: 'keen',
                price: 3000,
                level: 13,
            },
            kinWarding: {
                slug: 'kinWarding',
                label: 'kin-warding',
                price: 52,
                level: 3,
            },
            pacifying: {
                slug: 'pacifying',
                label: 'pacifying',
                price: 150,
                level: 5,
            },
            returning: {
                slug: 'returning',
                label: 'returning',
                price: 55,
                level: 3,
            },
            serrating: {
                slug: 'serrating',
                label: 'serrating',
                price: 1000,
                level: 10,
            },
            shifting: {
                slug: 'shifting',
                label: 'shifting',
                price: 225,
                level: 6,
            },
            shock: {
                slug: 'shock',
                label: 'shock',
                price: 500,
                level: 8,
            },
            speed: {
                slug: 'speed',
                label: 'speed',
                price: 10000,
                level: 16,
            },
            spellStoring: {
                slug: 'spellStoring',
                label: 'spell-storing',
                price: 2700,
                level: 13,
            },
            thundering: {
                slug: 'thundering',
                label: 'thundering',
                price: 500,
                level: 8,
            },
            unholy: {
                slug: 'unholy',
                label: 'unholy',
                price: 1400,
                level: 11,
            },
            vorpal: {
                slug: 'vorpal',
                label: 'vorpal',
                price: 15000,
                level: 17,
            },
            wounding: {
                slug: 'wounding',
                label: 'wounding',
                price: 340,
                level: 7,
            },
        },
    },
    [BuilderType.Armor]: {
        potency: {
            [CREATE_KEY_NONE]: {
                ...CREATE_OBJECT_NONE,
            },
            '1': {
                slug: '1',
                index: 1,
                label: 'Armor Potency (+1)',
                level: 5,
                price: 160,
            },
            '2': {
                slug: '2',
                index: 2,
                label: 'Armor Potency (+2)',
                level: 11,
                price: 1060,
            },
            '3': {
                slug: '3',
                index: 3,
                label: 'Armor Potency (+3)',
                level: 18,
                price: 20560,
            },
            '4': {
                slug: '4',
                index: 4,
                label: 'Armor Potency (+4)',
                level: 25,
                price: 0,
            },
        },
        fundamental: {
            [CREATE_KEY_NONE]: {
                ...CREATE_OBJECT_NONE,
            },
            resilient: {
                slug: 'resilient',
                label: 'resilient',
                level: 8,
                price: 340,
            },
            greaterResilient: {
                slug: 'greaterResilient',
                label: 'greater resilient',
                level: 14,
                price: 3440,
            },
            majorResilient: {
                slug: 'majorResilient',
                label: 'major resilient',
                level: 20,
                price: 49440,
            },
        },
        property: {
            [CREATE_KEY_NONE]: {
                ...CREATE_OBJECT_NONE,
            },
            acidResistant: {
                slug: 'acidResistant',
                label: 'acid-resistant',
                price: 420,
                level: 8,
            },
            antimagic: {
                slug: 'antimagic',
                label: 'antimagic',
                price: 6500,
                level: 15,
            },
            coldResistant: {
                slug: 'coldResistant',
                label: 'cold-resistant',
                price: 420,
                level: 8,
            },
            electricityResistant: {
                slug: 'electricityResistant',
                label: 'electricity-resistant',
                price: 420,
                level: 8,
            },
            ethereal: {
                slug: 'ethereal',
                label: 'ethereal',
                price: 13500,
                level: 17,
            },
            fireResistant: {
                slug: 'fireResistant',
                label: 'fire-resistant',
                price: 420,
                level: 8,
            },
            fortification: {
                slug: 'fortification',
                label: 'fortification',
                price: 2000,
                level: 12,
            },
            glamered: {
                slug: 'glamered',
                label: 'glamered',
                price: 140,
                level: 5,
            },
            greaterAcidResistant: {
                slug: 'greaterAcidResistant',
                label: 'greater acid-resistant',
                price: 1650,
                level: 12,
            },
            greaterColdResistant: {
                slug: 'greaterColdResistant',
                label: 'greater cold-resistant',
                price: 1650,
                level: 12,
            },
            greaterElectricityResistant: {
                slug: 'greaterElectricityResistant',
                label: 'greater electricity-resistant',
                price: 1650,
                level: 12,
            },
            greaterFireResistant: {
                slug: 'greaterFireResistant',
                label: 'greater fire-resistant',
                price: 1650,
                level: 12,
            },
            greaterFortification: {
                slug: 'greaterFortification',
                label: 'greater fortification',
                price: 24000,
                level: 18,
            },
            greaterInvisibility: {
                slug: 'greaterInvisibility',
                label: 'greater invisibility',
                price: 1000,
                level: 10,
            },
            greaterReady: {
                slug: 'greaterReady',
                label: 'greater ready',
                price: 1200,
                level: 11,
            },
            greaterShadow: {
                slug: 'greaterShadow',
                label: 'greater shadow',
                price: 650,
                level: 9,
            },
            greaterSlick: {
                slug: 'greaterSlick',
                label: 'greater slick',
                price: 450,
                level: 8,
            },
            greaterWinged: {
                slug: 'greaterWinged',
                label: 'greater winged',
                price: 35000,
                level: 19,
            },
            invisibility: {
                slug: 'invisibility',
                label: 'invisibility',
                price: 500,
                level: 8,
            },
            majorShadow: {
                slug: 'majorShadow',
                label: 'major shadow',
                price: 14000,
                level: 17,
            },
            majorSlick: {
                slug: 'majorSlick',
                label: 'major slick',
                price: 9000,
                level: 16,
            },
            ready: {
                slug: 'ready',
                label: 'ready',
                price: 200,
                level: 6,
            },
            rockBraced: {
                slug: 'rockBraced',
                label: 'rock-braced',
                price: 3000,
                level: 13,
            },
            shadow: {
                slug: 'shadow',
                label: 'shadow',
                price: 55,
                level: 3,
            },
            sinisterKnight: {
                slug: 'sinisterKnight',
                label: 'sinister knight',
                price: 500,
                level: 8,
            },
            slick: {
                slug: 'slick',
                label: 'slick',
                price: 45,
                level: 3,
            },
            winged: {
                slug: 'winged',
                label: 'winged',
                price: 2500,
                level: 13,
            },
        },
    },
    [BuilderType.Shield]: {
        potency: {},
        fundamental: {},
        property: {},
    },
};
