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

import { EquipmentItem, EquipmentType, PreciousMaterialGrade, PreciousMaterialType, WeightString } from '../../../types/PF2E';
import { getEquipmentType } from '../Utilities';
import { numericCommas } from '../Formatting';

export interface BaseMaterialData {
    slug: PreciousMaterialGrade;
    label: string;
    level: number;
    price: BasePriceData;
}
export interface BasePriceData {
    basePrice: number;
}
export interface ScalingPriceData extends BasePriceData {
    bulkPrice: number;
    displayPrice: string;
}

export interface WeaponArmorData extends BaseMaterialData {
    price: ScalingPriceData;
}
export function isWeaponArmorData(data: BaseMaterialData): data is WeaponArmorData {
    return data.price.hasOwnProperty('bulkPrice');
}

export interface DurabilityData {
    hardness: number;
    hitPoints: number;
    breakThreshold: number;
}
export interface ShieldData extends BaseMaterialData {
    bulk: WeightString;
    durability: DurabilityData;
}

const durabilityData = (hardness: number): DurabilityData => {
    return {
        hardness,
        hitPoints: hardness * 4,
        breakThreshold: hardness * 2,
    };
};
const shieldData = (grade: PreciousMaterialGrade, level: number, basePrice: number, hardness: number, bulk: WeightString): ShieldData => {
    return {
        slug: grade,
        label: '',
        level,
        price: { basePrice },
        bulk,
        durability: durabilityData(hardness),
    };
};
const scalingPriceData = (basePrice: number): ScalingPriceData => {
    return {
        basePrice,
        bulkPrice: basePrice / 10,
        displayPrice: `${numericCommas(basePrice)}gp + ${numericCommas(basePrice / 10)}gp/bulk`,
    };
};
const weaponArmorData = (grade: PreciousMaterialGrade, level: number, basePrice: number): WeaponArmorData => {
    return {
        slug: grade,
        label: `PF2E.PreciousMaterial${grade.capitalize()}Grade`,
        level,
        price: scalingPriceData(basePrice),
    };
};

type GradedMaterialData<T> = {
    [TGrade in PreciousMaterialGrade]?: T;
};

export interface IMaterial {
    slug: string;
    label: string;
    defaultGrade: PreciousMaterialGrade;
    [EquipmentType.Armor]?: GradedMaterialData<WeaponArmorData>;
    [EquipmentType.Weapon]?: GradedMaterialData<WeaponArmorData>;
    [EquipmentType.Buckler]?: GradedMaterialData<ShieldData>;
    [EquipmentType.Shield]?: GradedMaterialData<ShieldData>;
    [EquipmentType.Tower]?: GradedMaterialData<ShieldData>;
}

export const CREATE_KEY_NONE = '';
export const MaterialNone: IMaterial = {
    slug: CREATE_KEY_NONE,
    label: 'None',
    defaultGrade: PreciousMaterialGrade.None,
    [EquipmentType.Weapon]: {},
    [EquipmentType.Armor]: {},
    [EquipmentType.Buckler]: {},
    [EquipmentType.Shield]: {},
    [EquipmentType.Tower]: {},
};

export const MaterialAdamantine: IMaterial = {
    slug: 'adamantine',
    label: 'PF2E.PreciousMaterialAdamantine',
    defaultGrade: PreciousMaterialGrade.Standard,
    [EquipmentType.Weapon]: {
        [PreciousMaterialGrade.Standard]: weaponArmorData(PreciousMaterialGrade.Standard, 11, 1_400),
        [PreciousMaterialGrade.High]: weaponArmorData(PreciousMaterialGrade.High, 17, 13_000),
    },
    [EquipmentType.Armor]: {
        [PreciousMaterialGrade.Standard]: weaponArmorData(PreciousMaterialGrade.Standard, 12, 1_600),
        [PreciousMaterialGrade.High]: weaponArmorData(PreciousMaterialGrade.High, 19, 32_000),
    },

    [EquipmentType.Buckler]: {
        [PreciousMaterialGrade.Standard]: shieldData(PreciousMaterialGrade.Standard, 8, 400, 8, `L`),
        [PreciousMaterialGrade.High]: shieldData(PreciousMaterialGrade.High, 16, 8_000, 11, `1`),
    },
    [EquipmentType.Shield]: {
        [PreciousMaterialGrade.Standard]: shieldData(PreciousMaterialGrade.Standard, 8, 440, 8, `L`),
        [PreciousMaterialGrade.High]: shieldData(PreciousMaterialGrade.High, 16, 8_800, 13, `1`),
    },
};
export const MaterialColdIron: IMaterial = {
    slug: 'coldIron',
    label: 'PF2E.PreciousMaterialColdIron',
    defaultGrade: PreciousMaterialGrade.Standard,
    [EquipmentType.Weapon]: {
        [PreciousMaterialGrade.Low]: weaponArmorData(PreciousMaterialGrade.Low, 2, 40),
        [PreciousMaterialGrade.Standard]: weaponArmorData(PreciousMaterialGrade.Standard, 10, 880),
        [PreciousMaterialGrade.High]: weaponArmorData(PreciousMaterialGrade.High, 16, 9_000),
    },
    [EquipmentType.Armor]: {
        [PreciousMaterialGrade.Low]: weaponArmorData(PreciousMaterialGrade.Low, 5, 140),
        [PreciousMaterialGrade.Standard]: weaponArmorData(PreciousMaterialGrade.Standard, 11, 1_200),
        [PreciousMaterialGrade.High]: weaponArmorData(PreciousMaterialGrade.High, 18, 20_000),
    },

    [EquipmentType.Buckler]: {
        [PreciousMaterialGrade.Low]: shieldData(PreciousMaterialGrade.Low, 2, 30, 3, `L`),
        [PreciousMaterialGrade.Standard]: shieldData(PreciousMaterialGrade.Standard, 7, 300, 5, `L`),
        [PreciousMaterialGrade.High]: shieldData(PreciousMaterialGrade.High, 15, 5_000, 8, `L`),
    },
    [EquipmentType.Shield]: {
        [PreciousMaterialGrade.Low]: shieldData(PreciousMaterialGrade.Low, 2, 34, 5, `1`),
        [PreciousMaterialGrade.Standard]: shieldData(PreciousMaterialGrade.Standard, 7, 340, 7, `1`),
        [PreciousMaterialGrade.High]: shieldData(PreciousMaterialGrade.High, 15, 5_500, 10, `1`),
    },
};
export const MaterialDarkwood: IMaterial = {
    slug: 'darkwood',
    label: 'PF2E.PreciousMaterialDarkwood',
    defaultGrade: PreciousMaterialGrade.Standard,
    [EquipmentType.Weapon]: {
        [PreciousMaterialGrade.Standard]: weaponArmorData(PreciousMaterialGrade.Standard, 11, 1_400),
        [PreciousMaterialGrade.High]: weaponArmorData(PreciousMaterialGrade.High, 17, 13_500),
    },
    [EquipmentType.Armor]: {
        [PreciousMaterialGrade.Standard]: weaponArmorData(PreciousMaterialGrade.Standard, 12, 1_600),
        [PreciousMaterialGrade.High]: weaponArmorData(PreciousMaterialGrade.High, 19, 32_000),
    },

    [EquipmentType.Buckler]: {
        [PreciousMaterialGrade.Standard]: shieldData(PreciousMaterialGrade.Standard, 8, 400, 3, `L`),
        [PreciousMaterialGrade.High]: shieldData(PreciousMaterialGrade.High, 15, 5_000, 6, `L`),
    },
    [EquipmentType.Shield]: {
        [PreciousMaterialGrade.Standard]: shieldData(PreciousMaterialGrade.Standard, 8, 440, 5, `L`),
        [PreciousMaterialGrade.High]: shieldData(PreciousMaterialGrade.High, 15, 5_500, 8, `L`),
    },
    [EquipmentType.Tower]: {
        [PreciousMaterialGrade.Standard]: shieldData(PreciousMaterialGrade.Standard, 8, 560, 5, `3`),
        [PreciousMaterialGrade.High]: shieldData(PreciousMaterialGrade.High, 15, 5_500, 8, `3`),
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
        [PreciousMaterialGrade.Standard]: weaponArmorData(PreciousMaterialGrade.Standard, 12, 1_600),
        [PreciousMaterialGrade.High]: weaponArmorData(PreciousMaterialGrade.High, 19, 32_000),
    },

    [EquipmentType.Buckler]: {
        [PreciousMaterialGrade.Standard]: shieldData(PreciousMaterialGrade.Standard, 8, 400, 2, `L`),
        [PreciousMaterialGrade.High]: shieldData(PreciousMaterialGrade.High, 16, 8_000, 5, `L`),
    },
    [EquipmentType.Shield]: {
        [PreciousMaterialGrade.Standard]: shieldData(PreciousMaterialGrade.Standard, 8, 440, 4, `1`),
        [PreciousMaterialGrade.High]: shieldData(PreciousMaterialGrade.High, 16, 8_800, 7, `1`),
    },
};
export const MaterialMithral: IMaterial = {
    slug: 'mithral',
    label: 'PF2E.PreciousMaterialMithral',
    defaultGrade: PreciousMaterialGrade.Standard,
    [EquipmentType.Weapon]: {
        // TODO: Bulk reduced by 1
        [PreciousMaterialGrade.Standard]: weaponArmorData(PreciousMaterialGrade.Standard, 11, 1_400),
        [PreciousMaterialGrade.High]: weaponArmorData(PreciousMaterialGrade.High, 17, 13_500),
    },
    [EquipmentType.Armor]: {
        [PreciousMaterialGrade.Standard]: weaponArmorData(PreciousMaterialGrade.Standard, 12, 1_600),
        [PreciousMaterialGrade.High]: weaponArmorData(PreciousMaterialGrade.High, 19, 32_000),
    },

    [EquipmentType.Buckler]: {
        [PreciousMaterialGrade.Standard]: shieldData(PreciousMaterialGrade.Standard, 8, 400, 3, `L`),
        [PreciousMaterialGrade.High]: shieldData(PreciousMaterialGrade.High, 16, 8_000, 6, `L`),
    },
    [EquipmentType.Shield]: {
        [PreciousMaterialGrade.Standard]: shieldData(PreciousMaterialGrade.Standard, 8, 440, 5, `L`),
        [PreciousMaterialGrade.High]: shieldData(PreciousMaterialGrade.High, 16, 8_800, 8, `L`),
    },
};
export const MaterialOrichalcum: IMaterial = {
    slug: 'orichalcum',
    label: 'PF2E.PreciousMaterialOrichalcum',
    defaultGrade: PreciousMaterialGrade.High,
    [EquipmentType.Weapon]: {
        // TODO: Speed costs half the normal price
        [PreciousMaterialGrade.High]: weaponArmorData(PreciousMaterialGrade.High, 18, 22_500),
    },
    [EquipmentType.Armor]: {
        // TODO: +1 circumstance bonus to initiative rolls
        [PreciousMaterialGrade.High]: weaponArmorData(PreciousMaterialGrade.High, 20, 55_000),
    },

    [EquipmentType.Buckler]: {
        [PreciousMaterialGrade.High]: shieldData(PreciousMaterialGrade.High, 17, 12_000, 14, `L`),
    },
    [EquipmentType.Shield]: {
        [PreciousMaterialGrade.High]: shieldData(PreciousMaterialGrade.High, 17, 13_200, 16, `1`),
    },
};
export const MaterialSilver: IMaterial = {
    slug: 'silver',
    label: 'PF2E.PreciousMaterialSilver',
    defaultGrade: PreciousMaterialGrade.Standard,
    [EquipmentType.Weapon]: {
        [PreciousMaterialGrade.Low]: weaponArmorData(PreciousMaterialGrade.Low, 2, 40),
        [PreciousMaterialGrade.Standard]: weaponArmorData(PreciousMaterialGrade.Standard, 10, 880),
        [PreciousMaterialGrade.High]: weaponArmorData(PreciousMaterialGrade.High, 16, 9_000),
    },
    [EquipmentType.Armor]: {
        [PreciousMaterialGrade.Low]: weaponArmorData(PreciousMaterialGrade.Low, 5, 140),
        [PreciousMaterialGrade.Standard]: weaponArmorData(PreciousMaterialGrade.Standard, 11, 1_200),
        [PreciousMaterialGrade.High]: weaponArmorData(PreciousMaterialGrade.High, 18, 20_000),
    },

    [EquipmentType.Buckler]: {
        [PreciousMaterialGrade.Low]: shieldData(PreciousMaterialGrade.Low, 2, 30, 1, `L`),
        [PreciousMaterialGrade.Standard]: shieldData(PreciousMaterialGrade.Standard, 7, 300, 3, `L`),
        [PreciousMaterialGrade.High]: shieldData(PreciousMaterialGrade.High, 15, 5_000, 6, `L`),
    },
    [EquipmentType.Shield]: {
        [PreciousMaterialGrade.Low]: shieldData(PreciousMaterialGrade.Low, 2, 34, 3, `1`),
        [PreciousMaterialGrade.Standard]: shieldData(PreciousMaterialGrade.Standard, 7, 340, 5, `1`),
        [PreciousMaterialGrade.High]: shieldData(PreciousMaterialGrade.High, 15, 5_500, 8, `1`),
    },
};
export const MaterialSovereignSteel: IMaterial = {
    slug: 'sovereignSteel',
    label: 'PF2E.PreciousMaterialSovereignSteel',
    defaultGrade: PreciousMaterialGrade.Standard,
    [EquipmentType.Weapon]: {
        [PreciousMaterialGrade.Standard]: weaponArmorData(PreciousMaterialGrade.Standard, 12, 1_600),
        [PreciousMaterialGrade.High]: weaponArmorData(PreciousMaterialGrade.High, 19, 32_000),
    },
    [EquipmentType.Armor]: {
        [PreciousMaterialGrade.Standard]: weaponArmorData(PreciousMaterialGrade.Standard, 13, 2_400),
        [PreciousMaterialGrade.High]: weaponArmorData(PreciousMaterialGrade.High, 20, 50_000),
    },
};
export const MaterialWarpglass: IMaterial = {
    slug: 'warpglass',
    label: 'PF2E.PreciousMaterialWarpglass',
    defaultGrade: PreciousMaterialGrade.Standard,
    [EquipmentType.Weapon]: {
        [PreciousMaterialGrade.High]: weaponArmorData(PreciousMaterialGrade.High, 17, 14_000),
    },
};

export const ItemMaterials: Record<PreciousMaterialType, IMaterial> = {
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
export const getValidMaterialGrades = (item: EquipmentItem, materialType: PreciousMaterialType): GradedMaterialData<WeaponArmorData | ShieldData> => {
    const equipmentType = getEquipmentType(item);
    if (!equipmentType) {
        return {};
    }

    console.warn(materialType);
    console.warn(equipmentType);
    console.warn(ItemMaterials[materialType][equipmentType]);
    if (ItemMaterials[materialType].hasOwnProperty(equipmentType)) {
        return ItemMaterials[materialType][equipmentType]!;
    } else {
        return {};
    }
};
