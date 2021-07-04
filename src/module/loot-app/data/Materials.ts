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

export const MaterialCloth: IMaterial = {
    slug: 'cloth',
    label: 'Cloth',
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
};
export const MaterialLeather: IMaterial = {
    slug: 'leather',
    label: 'Leather',
    defaultGrade: MaterialGrade.Standard,
    item: {
        [MaterialGrade.Standard]: {
            level: 0,
            basePrice: 0,
            bulkPrice: 0,
            items: { hardness: 4, hitPoints: 16, breakThreshold: 8 },
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
};
export const MaterialMetal: IMaterial = {
    slug: 'metal',
    label: 'Metal',
    defaultGrade: MaterialGrade.Standard,
    item: {
        [MaterialGrade.Standard]: {
            level: 0,
            basePrice: 0,
            bulkPrice: 0,
            items: { hardness: 9, hitPoints: 36, breakThreshold: 18 },
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
};
export const MaterialWood: IMaterial = {
    slug: 'wood',
    label: 'Wood',
    defaultGrade: MaterialGrade.Standard,
    item: {
        [MaterialGrade.Standard]: {
            level: 0,
            basePrice: 0,
            bulkPrice: 0,
            items: { hardness: 5, hitPoints: 20, breakThreshold: 10 },
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
};
export const MaterialAdamantine: IMaterial = {
    slug: 'adamantine',
    label: 'Adamantine',
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
        [MaterialGrade.Standard]: {
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

export const AllMaterials: IMaterialMap = {
    cloth: MaterialCloth,
    leather: MaterialLeather,
    metal: MaterialMetal,
    wood: MaterialWood,
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
    id: string;
    index?: number;
    label: string;
    level: number;
    price: number;
}

export const CREATE_KEY_NONE = '';
const CREATE_OBJECT_NONE: Rune = {
    id: CREATE_KEY_NONE,
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
                id: '1',
                index: 1,
                label: 'Weapon Potency (+1)',
                level: 2,
                price: 35,
            },
            '2': {
                id: '2',
                index: 2,
                label: 'Weapon Potency (+2)',
                level: 10,
                price: 935,
            },
            '3': {
                id: '3',
                index: 3,
                label: 'Weapon Potency (+3)',
                level: 16,
                price: 8935,
            },
            '4': {
                id: '4',
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
                id: 'striking',
                index: 1,
                label: 'striking',
                price: 65,
                level: 4,
            },
            greaterStriking: {
                id: 'greaterStriking',
                index: 2,
                label: 'greater striking',
                price: 1065,
                level: 12,
            },
            majorStriking: {
                id: 'majorStriking',
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
                id: 'anarchic',
                label: 'anarchic',
                price: 1400,
                level: 11,
            },
            ancestralEchoing: {
                id: 'ancestralEchoing',
                label: 'ancestral echoing',
                price: 9500,
                level: 15,
            },
            axiomatic: {
                id: 'axiomatic',
                label: 'axiomatic',
                price: 1400,
                level: 11,
            },
            bloodbane: {
                id: 'bloodbane',
                label: 'bloodbane',
                price: 475,
                level: 8,
            },
            corrosive: {
                id: 'corrosive',
                label: 'corrosive',
                price: 500,
                level: 8,
            },
            dancing: {
                id: 'dancing',
                label: 'dancing',
                price: 2700,
                level: 13,
            },
            disrupting: {
                id: 'disrupting',
                label: 'disrupting',
                price: 150,
                level: 5,
            },
            fearsome: {
                id: 'fearsome',
                label: 'fearsome',
                price: 160,
                level: 5,
            },
            flaming: {
                id: 'flaming',
                label: 'flaming',
                price: 500,
                level: 8,
            },
            frost: {
                id: 'frost',
                label: 'frost',
                price: 500,
                level: 8,
            },
            ghostTouch: {
                id: 'ghostTouch',
                label: 'ghost touch',
                price: 75,
                level: 4,
            },
            greaterBloodbane: {
                id: 'greaterBloodbane',
                label: 'greater bloodbane',
                price: 6500,
                level: 15,
            },
            greaterCorrosive: {
                id: 'greaterCorrosive',
                label: 'greater corrosive',
                price: 6500,
                level: 15,
            },
            greaterDisrupting: {
                id: 'greaterDisrupting',
                label: 'greater disrupting',
                price: 4300,
                level: 14,
            },
            greaterFearsome: {
                id: 'greaterFearsome',
                label: 'greater fearsome',
                price: 2000,
                level: 12,
            },
            greaterFlaming: {
                id: 'greaterFlaming',
                label: 'greater flaming',
                price: 6500,
                level: 15,
            },
            greaterFrost: {
                id: 'greaterFrost',
                label: 'greater frost',
                price: 6500,
                level: 15,
            },
            greaterShock: {
                id: 'greaterShock',
                label: 'greater shock',
                price: 6500,
                level: 15,
            },
            greaterThundering: {
                id: 'greaterThundering',
                label: 'greater thundering',
                price: 6500,
                level: 15,
            },
            grievous: {
                id: 'grievous',
                label: 'grievous',
                price: 700,
                level: 9,
            },
            holy: {
                id: 'holy',
                label: 'holy',
                price: 1400,
                level: 11,
            },
            keen: {
                id: 'keen',
                label: 'keen',
                price: 3000,
                level: 13,
            },
            kinWarding: {
                id: 'kinWarding',
                label: 'kin-warding',
                price: 52,
                level: 3,
            },
            pacifying: {
                id: 'pacifying',
                label: 'pacifying',
                price: 150,
                level: 5,
            },
            returning: {
                id: 'returning',
                label: 'returning',
                price: 55,
                level: 3,
            },
            serrating: {
                id: 'serrating',
                label: 'serrating',
                price: 1000,
                level: 10,
            },
            shifting: {
                id: 'shifting',
                label: 'shifting',
                price: 225,
                level: 6,
            },
            shock: {
                id: 'shock',
                label: 'shock',
                price: 500,
                level: 8,
            },
            speed: {
                id: 'speed',
                label: 'speed',
                price: 10000,
                level: 16,
            },
            spellStoring: {
                id: 'spellStoring',
                label: 'spell-storing',
                price: 2700,
                level: 13,
            },
            thundering: {
                id: 'thundering',
                label: 'thundering',
                price: 500,
                level: 8,
            },
            unholy: {
                id: 'unholy',
                label: 'unholy',
                price: 1400,
                level: 11,
            },
            vorpal: {
                id: 'vorpal',
                label: 'vorpal',
                price: 15000,
                level: 17,
            },
            wounding: {
                id: 'wounding',
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
                id: '1',
                index: 1,
                label: 'Armor Potency (+1)',
                level: 5,
                price: 160,
            },
            '2': {
                id: '2',
                index: 2,
                label: 'Armor Potency (+2)',
                level: 11,
                price: 1060,
            },
            '3': {
                id: '3',
                index: 3,
                label: 'Armor Potency (+3)',
                level: 18,
                price: 20560,
            },
            '4': {
                id: '4',
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
                id: 'resilient',
                label: 'resilient',
                level: 8,
                price: 340,
            },
            greaterResilient: {
                id: 'greaterResilient',
                label: 'greater resilient',
                level: 14,
                price: 3440,
            },
            majorResilient: {
                id: 'majorResilient',
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
                id: 'acidResistant',
                label: 'acid-resistant',
                price: 420,
                level: 8,
            },
            antimagic: {
                id: 'antimagic',
                label: 'antimagic',
                price: 6500,
                level: 15,
            },
            coldResistant: {
                id: 'coldResistant',
                label: 'cold-resistant',
                price: 420,
                level: 8,
            },
            electricityResistant: {
                id: 'electricityResistant',
                label: 'electricity-resistant',
                price: 420,
                level: 8,
            },
            ethereal: {
                id: 'ethereal',
                label: 'ethereal',
                price: 13500,
                level: 17,
            },
            fireResistant: {
                id: 'fireResistant',
                label: 'fire-resistant',
                price: 420,
                level: 8,
            },
            fortification: {
                id: 'fortification',
                label: 'fortification',
                price: 2000,
                level: 12,
            },
            glamered: {
                id: 'glamered',
                label: 'glamered',
                price: 140,
                level: 5,
            },
            greaterAcidResistant: {
                id: 'greaterAcidResistant',
                label: 'greater acid-resistant',
                price: 1650,
                level: 12,
            },
            greaterColdResistant: {
                id: 'greaterColdResistant',
                label: 'greater cold-resistant',
                price: 1650,
                level: 12,
            },
            greaterElectricityResistant: {
                id: 'greaterElectricityResistant',
                label: 'greater electricity-resistant',
                price: 1650,
                level: 12,
            },
            greaterFireResistant: {
                id: 'greaterFireResistant',
                label: 'greater fire-resistant',
                price: 1650,
                level: 12,
            },
            greaterFortification: {
                id: 'greaterFortification',
                label: 'greater fortification',
                price: 24000,
                level: 18,
            },
            greaterInvisibility: {
                id: 'greaterInvisibility',
                label: 'greater invisibility',
                price: 1000,
                level: 10,
            },
            greaterReady: {
                id: 'greaterReady',
                label: 'greater ready',
                price: 1200,
                level: 11,
            },
            greaterShadow: {
                id: 'greaterShadow',
                label: 'greater shadow',
                price: 650,
                level: 9,
            },
            greaterSlick: {
                id: 'greaterSlick',
                label: 'greater slick',
                price: 450,
                level: 8,
            },
            greaterWinged: {
                id: 'greaterWinged',
                label: 'greater winged',
                price: 35000,
                level: 19,
            },
            invisibility: {
                id: 'invisibility',
                label: 'invisibility',
                price: 500,
                level: 8,
            },
            majorShadow: {
                id: 'majorShadow',
                label: 'major shadow',
                price: 14000,
                level: 17,
            },
            majorSlick: {
                id: 'majorSlick',
                label: 'major slick',
                price: 9000,
                level: 16,
            },
            ready: {
                id: 'ready',
                label: 'ready',
                price: 200,
                level: 6,
            },
            rockBraced: {
                id: 'rockBraced',
                label: 'rock-braced',
                price: 3000,
                level: 13,
            },
            shadow: {
                id: 'shadow',
                label: 'shadow',
                price: 55,
                level: 3,
            },
            sinisterKnight: {
                id: 'sinisterKnight',
                label: 'sinister knight',
                price: 500,
                level: 8,
            },
            slick: {
                id: 'slick',
                label: 'slick',
                price: 45,
                level: 3,
            },
            winged: {
                id: 'winged',
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
