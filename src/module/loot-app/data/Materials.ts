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

import {
    EquipmentItem,
    isArmor,
    isShield,
    isWeapon,
    PF2EItem,
    PreciousMaterialType,
    ResiliencyRuneType,
    StrikingRuneType,
    PreciousMaterialGrade,
} from '../../../types/PF2E';

export type IMaterialMap = Record<PreciousMaterialType, IMaterial>;

export enum EquipmentType {
    Weapon = 'weapon',
    Armor = 'armor',
    Shield = 'shield',
}
export const getEquipmentType = (item: PF2EItem): EquipmentType | undefined => {
    let equipmentType: EquipmentType;
    if (isWeapon(item)) {
        equipmentType = EquipmentType.Weapon;
    } else if (isShield(item)) {
        equipmentType = EquipmentType.Shield;
    } else if (isArmor(item)) {
        equipmentType = EquipmentType.Shield;
    } else {
        return undefined;
    }
};

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
    displayPrice: string;
}
interface BaseMaterialData {
    level: number;
    price: IPriceData;
}

const createPriceData = (basePrice: number): IPriceData => {
    return {
        basePrice,
        bulkPrice: basePrice / 10,
        displayPrice: `${basePrice}gp + ${basePrice / 10}gp/bulk`,
    };
};
const createBaseMaterialData = (level: number, basePrice: number): BaseMaterialData => {
    return {
        level,
        price: createPriceData(basePrice),
    };
};

type GradedMaterialData = {
    [TGrade in PreciousMaterialGrade]?: BaseMaterialData;
};

export type IMaterial = Readonly<{
    slug: string;
    label: string;
    defaultGrade: PreciousMaterialGrade;
    [EquipmentType.Shield]?: GradedMaterialData;
    [EquipmentType.Armor]?: GradedMaterialData;
    [EquipmentType.Weapon]?: GradedMaterialData;
}>;

// TODO: Descriptions w/ links for items, embed in description
// TODO: Descriptions w/ links for weapons, embed in description
// TODO: Descriptions w/ links for armors, embed in description

export const CREATE_KEY_NONE = '';
export const MaterialNone: IMaterial = {
    slug: CREATE_KEY_NONE,
    label: 'None',
    defaultGrade: PreciousMaterialGrade.Standard,
    [EquipmentType.Weapon]: {},
    [EquipmentType.Armor]: {},
    [EquipmentType.Shield]: {},
};

export const MaterialAdamantine: IMaterial = {
    slug: 'adamantine',
    label: 'PF2E.PreciousMaterialAdamantine',
    defaultGrade: PreciousMaterialGrade.Standard,
    [EquipmentType.Armor]: {
        [PreciousMaterialGrade.Standard]: createBaseMaterialData(12, 1_600),
        [PreciousMaterialGrade.High]: createBaseMaterialData(19, 32_000),
    },
    [EquipmentType.Weapon]: {
        [PreciousMaterialGrade.Standard]: createBaseMaterialData(11, 1_400),
        [PreciousMaterialGrade.High]: createBaseMaterialData(17, 13_000),
    },
    shield: {},
};
export const MaterialColdIron: IMaterial = {
    slug: 'coldIron',
    label: 'PF2E.PreciousMaterialColdIron',
    defaultGrade: PreciousMaterialGrade.Standard,
    [EquipmentType.Armor]: {
        [PreciousMaterialGrade.Low]: createBaseMaterialData(5, 140),
        [PreciousMaterialGrade.Standard]: createBaseMaterialData(11, 1_200),
        [PreciousMaterialGrade.High]: createBaseMaterialData(18, 20_000),
    },
    [EquipmentType.Weapon]: {
        [PreciousMaterialGrade.Low]: createBaseMaterialData(2, 40),
        [PreciousMaterialGrade.Standard]: createBaseMaterialData(10, 880),
        [PreciousMaterialGrade.High]: createBaseMaterialData(16, 9_000),
    },
};
export const MaterialDarkwood: IMaterial = {
    slug: 'darkwood',
    label: 'PF2E.PreciousMaterialDarkwood',
    defaultGrade: PreciousMaterialGrade.Standard,
    [EquipmentType.Armor]: {
        [PreciousMaterialGrade.Standard]: createBaseMaterialData(12, 1_600),
        [PreciousMaterialGrade.High]: createBaseMaterialData(19, 32_000),
    },
    [EquipmentType.Weapon]: {
        [PreciousMaterialGrade.Standard]: createBaseMaterialData(11, 1_400),
        [PreciousMaterialGrade.High]: createBaseMaterialData(17, 13_500),
    },
};
export const MaterialDragonhide: IMaterial = {
    slug: 'dragonhide',
    label: 'PF2E.PreciousMaterialDragonhide',
    defaultGrade: PreciousMaterialGrade.Standard,
    [EquipmentType.Armor]: {
        // TODO: +1 circumstance bonus to your AC and saving throws
        //  against attacks and spells that deal the corresponding
        //  damage type
        [PreciousMaterialGrade.Standard]: createBaseMaterialData(12, 1_600),
        [PreciousMaterialGrade.High]: createBaseMaterialData(19, 32_000),
    },
};
export const MaterialMithral: IMaterial = {
    slug: 'mithral',
    label: 'PF2E.PreciousMaterialMithral',
    defaultGrade: PreciousMaterialGrade.Standard,
    [EquipmentType.Armor]: {
        [PreciousMaterialGrade.Standard]: createBaseMaterialData(12, 1_600),
        [PreciousMaterialGrade.High]: createBaseMaterialData(19, 32_000),
    },
    [EquipmentType.Weapon]: {
        // TODO: Bulk reduced by 1
        [PreciousMaterialGrade.Standard]: createBaseMaterialData(11, 1_400),
        [PreciousMaterialGrade.High]: createBaseMaterialData(17, 13_500),
    },
};
export const MaterialOrichalcum: IMaterial = {
    slug: 'orichalcum',
    label: 'PF2E.PreciousMaterialOrichalcum',
    defaultGrade: PreciousMaterialGrade.High,
    [EquipmentType.Armor]: {
        // TODO: +1 circumstance bonus to initiative rolls
        [PreciousMaterialGrade.High]: createBaseMaterialData(20, 55_000),
    },
    [EquipmentType.Weapon]: {
        // TODO: Speed costs half the normal price
        [PreciousMaterialGrade.High]: createBaseMaterialData(18, 22_500),
    },
};
export const MaterialSilver: IMaterial = {
    slug: 'silver',
    label: 'PF2E.PreciousMaterialSilver',
    defaultGrade: PreciousMaterialGrade.Standard,
    [EquipmentType.Armor]: {
        [PreciousMaterialGrade.Low]: createBaseMaterialData(5, 140),
        [PreciousMaterialGrade.Standard]: createBaseMaterialData(11, 1_200),
        [PreciousMaterialGrade.High]: createBaseMaterialData(18, 20_000),
    },
    [EquipmentType.Weapon]: {
        [PreciousMaterialGrade.Low]: createBaseMaterialData(2, 40),
        [PreciousMaterialGrade.Standard]: createBaseMaterialData(10, 880),
        [PreciousMaterialGrade.High]: createBaseMaterialData(16, 9_000),
    },
};
export const MaterialSovereignSteel: IMaterial = {
    slug: 'sovereignSteel',
    label: 'PF2E.PreciousMaterialSovereignSteel',
    defaultGrade: PreciousMaterialGrade.Standard,
    [EquipmentType.Armor]: {
        [PreciousMaterialGrade.Standard]: createBaseMaterialData(13, 2_400),
        [PreciousMaterialGrade.High]: createBaseMaterialData(20, 50_000),
    },
    [EquipmentType.Weapon]: {
        [PreciousMaterialGrade.Standard]: createBaseMaterialData(12, 1_600),
        [PreciousMaterialGrade.High]: createBaseMaterialData(19, 32_000),
    },
};
export const MaterialWarpglass: IMaterial = {
    slug: 'warpglass',
    label: 'PF2E.PreciousMaterialWarpglass',
    defaultGrade: PreciousMaterialGrade.Standard,
    [EquipmentType.Weapon]: {
        [PreciousMaterialGrade.High]: createBaseMaterialData(17, 14_000),
    },
};

export const ItemMaterials: IMaterialMap = {
    '': MaterialNone,
    'adamantine': MaterialAdamantine,
    'coldIron': MaterialColdIron,
    'darkwood': MaterialDarkwood,
    'dragonhide': MaterialDragonhide,
    'mithral': MaterialMithral,
    'orichalcum': MaterialOrichalcum,
    'silver': MaterialSilver,
    'sovereignSteel': MaterialSovereignSteel,
    'warpglass': MaterialWarpglass,
};

/**
 * Get all valid materials that could be used for this item.
 * @param item
 */
export const getValidMaterials = (item: EquipmentItem): Partial<Record<PreciousMaterialType, IMaterial>> => {
    const equipmentType = getEquipmentType(item);
    if (!equipmentType) {
        return {};
    }

    const materials: Partial<Record<PreciousMaterialType, IMaterial>> = {};

    for (const [materialType, materialData] of Object.entries(ItemMaterials)) {
        if (!materialData.hasOwnProperty(equipmentType)) {
            continue;
        }
        materials[materialType as PreciousMaterialType] = materialData;
    }

    return materials;
};

/**
 * Get valid material grade data for the item and specified material
 * @param item
 * @param materialType
 */
export const getValidMaterialGrades = (item: EquipmentItem, materialType: PreciousMaterialType): GradedMaterialData => {
    const equipmentType = getEquipmentType(item);
    if (!equipmentType) {
        return {};
    }

    if (ItemMaterials[materialType].hasOwnProperty(equipmentType)) {
        return ItemMaterials[materialType][equipmentType]!;
    } else {
        return {};
    }
};
