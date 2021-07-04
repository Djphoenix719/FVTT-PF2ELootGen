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

import { SpellSchool } from '../module/loot-app/data/Spells';
import { MaterialGrade, AllMaterials, Rarity } from '../module/loot-app/data/Materials';

export type ResilientRuneType = 'resilient' | 'greaterResilient' | 'majorResilient';
export type StrikingRuneType = 'striking' | 'greaterStriking' | 'majorStriking';

export type ArmorType = 'shield' | 'unarmored' | 'light' | 'medium' | 'heavy';
export type WeaponType = 'unarmed' | 'simple' | 'advanced' | 'martial';

export enum CreateType {
    Weapon = 'weapon',
    Armor = 'armor',
    Shield = 'shield',
}

export interface ItemDataData {
    slug: string;
    stackGroup: { value: string };
    value?: { value: number };
    price?: { value: string };
    weight: { value: string | number };
    traditions?: { value: string[] };
    traits?: {
        rarity: { value: Rarity };
        value: string[];
    };
    quantity: { value: number };
    description?: { value: string };
    level?: { value: number };
    school?: { value: SpellSchool };
    spell?: {
        data: ItemData;
        heightenedLevel: number;
    };
}

export interface ItemData extends Entity.Data {
    data: ItemDataData;
}

export interface EquipmentDataData extends ItemDataData {
    preciousMaterial: { value: typeof AllMaterials[string]['slug'] };
    preciousMaterialGrade: { value: MaterialGrade };

    potencyRune: { value: number };

    propertyRune1: { value: string };
    propertyRune2: { value: string };
    propertyRune3: { value: string };
    propertyRune4: { value: string };
}
export interface EquipmentData extends ItemData {
    data: EquipmentDataData;
}

export interface ArmorDataData extends EquipmentDataData {
    armorType: { value: ArmorType | '' };
    resiliencyRune: { value: ResilientRuneType | '' };
}
export interface ArmorData extends EquipmentData {
    type: 'armor';
    data: ArmorDataData;
}
export function isArmorData(itemData?: ItemData): itemData is ArmorData {
    if (itemData === undefined || itemData === null) return false;
    return itemData.data.hasOwnProperty('armorType');
}
export function isShieldData(itemData?: ItemData): itemData is ArmorData {
    if (itemData === undefined || itemData === null) return false;
    return isArmorData(itemData) && itemData.data.armorType.value === 'shield';
}

export interface WeaponDataData extends EquipmentDataData {
    weaponType: { value: WeaponType | '' };
    strikingRune: { value: StrikingRuneType | '' };
}
export interface WeaponData extends EquipmentData {
    type: 'weapon';
    data: WeaponDataData;
}
export function isWeaponData(itemData?: ItemData): itemData is WeaponData {
    if (itemData === undefined || itemData === null) return false;
    return itemData.data.hasOwnProperty('weaponType');
}
