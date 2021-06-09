/*
 * Copyright 2021 Andrew Cuccinello
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 *
 * You may obreakThresholdain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Data contained in this file is part of the Open Gaming License, and not subject to the above copyright.

export type Bulk = 'L' | number;
export type IMaterialMap = Record<string, IMaterial>;

export enum EquipmentGrade {
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
    defaultGrade: EquipmentGrade;
    items?: ISpecialData &
        {
            [TGrade in EquipmentGrade]?: IPriceData &
                ILevelData & {
                    thinItems?: IDurability;
                    items?: IDurability;
                    structures?: IDurability;
                };
        };
    shields?: ISpecialData &
        {
            [TGrade in EquipmentGrade]?: IPriceData &
                ILevelData &
                {
                    [TShield in ShieldType]?: IDurability;
                };
        };
    armors?: ISpecialData &
        {
            [TGrade in EquipmentGrade]?: IPriceData & ILevelData;
        };
    weapons?: ISpecialData &
        {
            [TGrade in EquipmentGrade]?: IPriceData & ILevelData;
        };
}>;

// TODO: Descriptions w/ links for items, embed in description
// TODO: Descriptions w/ links for weapons, embed in description
// TODO: Descriptions w/ links for armors, embed in description

export const MaterialCloth: IMaterial = {
    slug: 'cloth',
    label: 'Cloth',
    defaultGrade: EquipmentGrade.Standard,
    items: {
        [EquipmentGrade.Standard]: {
            level: 0,
            basePrice: 0,
            bulkPrice: 0,
            thinItems: { hardness: 0, hitPoints: 1, breakThreshold: 0 },
            items: { hardness: 1, hitPoints: 4, breakThreshold: 2 },
        },
    },
    weapons: {
        [EquipmentGrade.Standard]: {
            level: 0,
            basePrice: 0,
            bulkPrice: 0,
        },
    },
    armors: {
        [EquipmentGrade.Standard]: {
            level: 0,
            basePrice: 0,
            bulkPrice: 0,
        },
    },
};
export const MaterialLeather: IMaterial = {
    slug: 'leather',
    label: 'Leather',
    defaultGrade: EquipmentGrade.Standard,
    items: {
        [EquipmentGrade.Standard]: {
            level: 0,
            basePrice: 0,
            bulkPrice: 0,
            items: { hardness: 4, hitPoints: 16, breakThreshold: 8 },
        },
    },
    weapons: {
        [EquipmentGrade.Standard]: {
            level: 0,
            basePrice: 0,
            bulkPrice: 0,
        },
    },
    armors: {
        [EquipmentGrade.Standard]: {
            level: 0,
            basePrice: 0,
            bulkPrice: 0,
        },
    },
};
export const MaterialMetal: IMaterial = {
    slug: 'metal',
    label: 'Metal',
    defaultGrade: EquipmentGrade.Standard,
    items: {
        [EquipmentGrade.Standard]: {
            level: 0,
            basePrice: 0,
            bulkPrice: 0,
            items: { hardness: 9, hitPoints: 36, breakThreshold: 18 },
        },
    },
    weapons: {
        [EquipmentGrade.Standard]: {
            level: 0,
            basePrice: 0,
            bulkPrice: 0,
        },
    },
    armors: {
        [EquipmentGrade.Standard]: {
            level: 0,
            basePrice: 0,
            bulkPrice: 0,
        },
    },
};
export const MaterialWood: IMaterial = {
    slug: 'wood',
    label: 'Wood',
    defaultGrade: EquipmentGrade.Standard,
    items: {
        [EquipmentGrade.Standard]: {
            level: 0,
            basePrice: 0,
            bulkPrice: 0,
            items: { hardness: 5, hitPoints: 20, breakThreshold: 10 },
        },
    },
    weapons: {
        [EquipmentGrade.Standard]: {
            level: 0,
            basePrice: 0,
            bulkPrice: 0,
        },
    },
    armors: {
        [EquipmentGrade.Standard]: {
            level: 0,
            basePrice: 0,
            bulkPrice: 0,
        },
    },
};
export const MaterialAdamantine: IMaterial = {
    slug: 'adamantine',
    label: 'Adamantine',
    defaultGrade: EquipmentGrade.Standard,
    items: {
        [EquipmentGrade.Standard]: {
            level: 8,
            basePrice: 0,
            bulkPrice: 350,
            thinItems: { hardness: 10, hitPoints: 40, breakThreshold: 20 },
            items: { hardness: 14, hitPoints: 56, breakThreshold: 28 },
            structures: { hardness: 28, hitPoints: 112, breakThreshold: 56 },
        },
        [EquipmentGrade.High]: {
            level: 16,
            basePrice: 0,
            bulkPrice: 6000,
            thinItems: { hardness: 13, hitPoints: 52, breakThreshold: 26 },
            items: { hardness: 17, hitPoints: 68, breakThreshold: 34 },
            structures: { hardness: 34, hitPoints: 136, breakThreshold: 68 },
        },
    },
    armors: {
        [EquipmentGrade.Standard]: {
            level: 12,
            basePrice: 1600,
            bulkPrice: 160,
        },
        [EquipmentGrade.High]: {
            level: 19,
            basePrice: 32000,
            bulkPrice: 3200,
        },
    },
    weapons: {
        [EquipmentGrade.Standard]: {
            level: 11,
            basePrice: 1400,
            bulkPrice: 140,
        },
        [EquipmentGrade.High]: {
            level: 17,
            basePrice: 13000,
            bulkPrice: 1350,
        },
    },
    shields: {},
};
export const MaterialColdIron: IMaterial = {
    slug: 'coldIron',
    label: 'Cold Iron',
    defaultGrade: EquipmentGrade.Standard,
    items: {
        [EquipmentGrade.Low]: {
            level: 2,
            basePrice: 0,
            bulkPrice: 20,
            thinItems: { hardness: 5, hitPoints: 20, breakThreshold: 10 },
            items: { hardness: 9, hitPoints: 36, breakThreshold: 18 },
            structures: { hardness: 18, hitPoints: 72, breakThreshold: 36 },
        },
        [EquipmentGrade.Standard]: {
            level: 7,
            basePrice: 0,
            bulkPrice: 250,
            thinItems: { hardness: 7, hitPoints: 28, breakThreshold: 14 },
            items: { hardness: 11, hitPoints: 44, breakThreshold: 22 },
            structures: { hardness: 22, hitPoints: 88, breakThreshold: 44 },
        },
        [EquipmentGrade.High]: {
            level: 15,
            basePrice: 0,
            bulkPrice: 4500,
            thinItems: { hardness: 10, hitPoints: 40, breakThreshold: 20 },
            items: { hardness: 14, hitPoints: 56, breakThreshold: 28 },
            structures: { hardness: 28, hitPoints: 112, breakThreshold: 56 },
        },
    },
    armors: {
        [EquipmentGrade.Low]: {
            level: 5,
            basePrice: 140,
            bulkPrice: 14,
        },
        [EquipmentGrade.Standard]: {
            level: 11,
            basePrice: 1200,
            bulkPrice: 120,
        },
        [EquipmentGrade.High]: {
            level: 18,
            basePrice: 20000,
            bulkPrice: 2000,
        },
    },
    weapons: {
        [EquipmentGrade.Low]: {
            level: 2,
            basePrice: 40,
            bulkPrice: 4,
        },
        [EquipmentGrade.Standard]: {
            level: 10,
            basePrice: 880,
            bulkPrice: 88,
        },
        [EquipmentGrade.High]: {
            level: 16,
            basePrice: 9000,
            bulkPrice: 900,
        },
    },
};
export const MaterialDarkwood: IMaterial = {
    slug: 'darkwood',
    label: 'Darkwood',
    defaultGrade: EquipmentGrade.Standard,
    items: {
        [EquipmentGrade.Standard]: {
            level: 8,
            basePrice: 0,
            bulkPrice: 350,
            thinItems: { hardness: 5, hitPoints: 20, breakThreshold: 10 },
            items: { hardness: 7, hitPoints: 28, breakThreshold: 14 },
            structures: { hardness: 14, hitPoints: 56, breakThreshold: 28 },
        },
        [EquipmentGrade.High]: {
            level: 16,
            basePrice: 0,
            bulkPrice: 6000,
            thinItems: { hardness: 8, hitPoints: 32, breakThreshold: 16 },
            items: { hardness: 10, hitPoints: 40, breakThreshold: 20 },
            structures: { hardness: 20, hitPoints: 80, breakThreshold: 40 },
        },
    },
    armors: {
        [EquipmentGrade.Standard]: {
            level: 12,
            basePrice: 1600,
            bulkPrice: 160,
        },
        [EquipmentGrade.High]: {
            level: 19,
            basePrice: 32000,
            bulkPrice: 3200,
        },
    },
    weapons: {
        [EquipmentGrade.Standard]: {
            level: 11,
            basePrice: 1400,
            bulkPrice: 140,
        },
        [EquipmentGrade.High]: {
            level: 17,
            basePrice: 13500,
            bulkPrice: 1350,
        },
    },
};
export const MaterialDragonhide: IMaterial = {
    slug: 'dragonhide',
    label: 'Dragonhide',
    defaultGrade: EquipmentGrade.Standard,
    items: {
        [EquipmentGrade.Standard]: {
            level: 8,
            basePrice: 0,
            bulkPrice: 350,
            thinItems: { hardness: 4, hitPoints: 16, breakThreshold: 8 },
            items: { hardness: 7, hitPoints: 28, breakThreshold: 14 },
        },
        [EquipmentGrade.High]: {
            level: 16,
            basePrice: 0,
            bulkPrice: 6000,
            thinItems: { hardness: 8, hitPoints: 32, breakThreshold: 16 },
            items: { hardness: 11, hitPoints: 44, breakThreshold: 22 },
        },
    },
    armors: {
        // TODO: +1 circumstance bonus to your AC and saving throws
        //  against attacks and spells that deal the corresponding
        //  damage type
        [EquipmentGrade.Standard]: {
            level: 12,
            basePrice: 1600,
            bulkPrice: 160,
        },
        [EquipmentGrade.High]: {
            level: 19,
            basePrice: 32000,
            bulkPrice: 3200,
        },
    },
};
export const MaterialMithral: IMaterial = {
    slug: 'mithral',
    label: 'Mithral',
    defaultGrade: EquipmentGrade.Standard,
    items: {
        [EquipmentGrade.Standard]: {
            level: 8,
            basePrice: 0,
            bulkPrice: 350,
            thinItems: { hardness: 5, hitPoints: 20, breakThreshold: 10 },
            items: { hardness: 9, hitPoints: 36, breakThreshold: 18 },
            structures: { hardness: 18, hitPoints: 72, breakThreshold: 36 },
        },
        [EquipmentGrade.High]: {
            level: 16,
            basePrice: 0,
            bulkPrice: 6000,
            thinItems: { hardness: 8, hitPoints: 32, breakThreshold: 16 },
            items: { hardness: 12, hitPoints: 48, breakThreshold: 24 },
            structures: { hardness: 24, hitPoints: 96, breakThreshold: 48 },
        },
    },
    armors: {
        [EquipmentGrade.Standard]: {
            level: 12,
            basePrice: 1600,
            bulkPrice: 160,
        },
        [EquipmentGrade.High]: {
            level: 19,
            basePrice: 32000,
            bulkPrice: 3200,
        },
    },
    weapons: {
        // TODO: Bulk reduced by 1
        [EquipmentGrade.Standard]: {
            level: 11,
            basePrice: 1400,
            bulkPrice: 140,
        },
        [EquipmentGrade.High]: {
            level: 17,
            basePrice: 13500,
            bulkPrice: 1350,
        },
    },
};
export const MaterialOrichalcum: IMaterial = {
    slug: 'orichalcum',
    label: 'Orichalcum',
    defaultGrade: EquipmentGrade.High,
    items: {
        [EquipmentGrade.High]: {
            level: 17,
            basePrice: 0,
            bulkPrice: 10000,
            thinItems: { hardness: 16, hitPoints: 64, breakThreshold: 32 },
            items: { hardness: 18, hitPoints: 72, breakThreshold: 36 },
            structures: { hardness: 35, hitPoints: 140, breakThreshold: 70 },
        },
    },
    armors: {
        // TODO: +1 circumstance bonus to initiative rolls
        [EquipmentGrade.High]: {
            level: 20,
            basePrice: 55000,
            bulkPrice: 5500,
        },
    },
    weapons: {
        // TODO: Speed costs half the normal price
        [EquipmentGrade.High]: {
            level: 18,
            basePrice: 22500,
            bulkPrice: 2250,
        },
    },
};
export const MaterialSilver: IMaterial = {
    slug: 'silver',
    label: 'Silver',
    defaultGrade: EquipmentGrade.Standard,
    items: {
        [EquipmentGrade.Low]: {
            level: 2,
            basePrice: 0,
            bulkPrice: 20,
            thinItems: { hardness: 3, hitPoints: 12, breakThreshold: 6 },
            items: { hardness: 5, hitPoints: 20, breakThreshold: 10 },
            structures: { hardness: 10, hitPoints: 40, breakThreshold: 20 },
        },
        [EquipmentGrade.Standard]: {
            level: 7,
            basePrice: 0,
            bulkPrice: 250,
            thinItems: { hardness: 5, hitPoints: 20, breakThreshold: 10 },
            items: { hardness: 7, hitPoints: 28, breakThreshold: 14 },
            structures: { hardness: 14, hitPoints: 56, breakThreshold: 28 },
        },
        [EquipmentGrade.High]: {
            level: 15,
            basePrice: 0,
            bulkPrice: 4500,
            thinItems: { hardness: 8, hitPoints: 32, breakThreshold: 16 },
            items: { hardness: 10, hitPoints: 40, breakThreshold: 20 },
            structures: { hardness: 20, hitPoints: 80, breakThreshold: 40 },
        },
    },
    armors: {
        [EquipmentGrade.Low]: {
            level: 5,
            basePrice: 140,
            bulkPrice: 14,
        },
        [EquipmentGrade.Standard]: {
            level: 11,
            basePrice: 1200,
            bulkPrice: 120,
        },
        [EquipmentGrade.High]: {
            level: 18,
            basePrice: 20000,
            bulkPrice: 2000,
        },
    },
    weapons: {
        [EquipmentGrade.Low]: {
            level: 2,
            basePrice: 40,
            bulkPrice: 4,
        },
        [EquipmentGrade.Standard]: {
            level: 10,
            basePrice: 880,
            bulkPrice: 88,
        },
        [EquipmentGrade.High]: {
            level: 16,
            basePrice: 9000,
            bulkPrice: 900,
        },
    },
};
export const MaterialSovereignSteel: IMaterial = {
    slug: 'sovereignSteel',
    label: 'Sovereign Steel',
    defaultGrade: EquipmentGrade.Standard,
    items: {
        [EquipmentGrade.Standard]: {
            level: 9,
            basePrice: 0,
            bulkPrice: 500,
            thinItems: { hardness: 7, hitPoints: 28, breakThreshold: 14 },
            items: { hardness: 11, hitPoints: 44, breakThreshold: 22 },
            structures: { hardness: 22, hitPoints: 88, breakThreshold: 44 },
        },
        [EquipmentGrade.High]: {
            level: 17,
            basePrice: 0,
            bulkPrice: 8000,
            thinItems: { hardness: 10, hitPoints: 40, breakThreshold: 20 },
            items: { hardness: 14, hitPoints: 56, breakThreshold: 28 },
            structures: { hardness: 28, hitPoints: 112, breakThreshold: 56 },
        },
    },
    armors: {
        [EquipmentGrade.Standard]: {
            level: 13,
            basePrice: 2400,
            bulkPrice: 240,
        },
        [EquipmentGrade.Standard]: {
            level: 20,
            basePrice: 50000,
            bulkPrice: 5000,
        },
    },
    weapons: {
        [EquipmentGrade.Standard]: {
            level: 12,
            basePrice: 1600,
            bulkPrice: 160,
        },
        [EquipmentGrade.High]: {
            level: 19,
            basePrice: 32000,
            bulkPrice: 3200,
        },
    },
};
export const MaterialWarpglass: IMaterial = {
    slug: 'warpglass',
    label: 'Warpglass',
    defaultGrade: EquipmentGrade.Standard,
    items: {
        [EquipmentGrade.High]: {
            level: 17,
            basePrice: 0,
            bulkPrice: 8000,
            thinItems: { hardness: 8, hitPoints: 32, breakThreshold: 16 },
            items: { hardness: 12, hitPoints: 48, breakThreshold: 24 },
            structures: { hardness: 24, hitPoints: 96, breakThreshold: 48 },
        },
    },
    weapons: {
        [EquipmentGrade.High]: {
            level: 17,
            basePrice: 14000,
            bulkPrice: 1400,
        },
    },
};

export const Materials: IMaterialMap = {
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
