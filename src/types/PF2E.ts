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

export type EquipmentItemType = 'armor' | 'weapon';
export type PhysicalItemType = EquipmentItemType | 'consumable' | 'equipment';
export type ItemType = PhysicalItemType | 'spell';

export type ResiliencyRuneType = 'resilient' | 'greaterResilient' | 'majorResilient';
export type StrikingRuneType = 'striking' | 'greaterStriking' | 'majorStriking';
export type ArmorType = 'shield' | 'unarmored' | 'light' | 'medium' | 'heavy';
export type WeaponType = 'unarmed' | 'simple' | 'advanced' | 'martial';

export type WeaponPropertyTypes =
    | 'kinWarding'
    | 'returning'
    | 'ghostTouch'
    | 'disrupting'
    | 'pacifying'
    | 'fearsome'
    | 'shifting'
    | 'conducting'
    | 'wounding'
    | 'bloodbane'
    | 'corrosive'
    | 'cunning'
    | 'flaming'
    | 'frost'
    | 'shock'
    | 'thundering'
    | 'grievous'
    | 'serrating'
    | 'anarchic'
    | 'axiomatic'
    | 'holy'
    | 'unholy'
    | 'greaterFearsome'
    | 'dancing'
    | 'spellStoring'
    | 'greaterBloodbane'
    | 'keen'
    | 'greaterDisrupting'
    | 'greaterCorrosive'
    | 'greaterFlaming'
    | 'greaterFrost'
    | 'greaterShock'
    | 'greaterThundering'
    | 'ancestralEchoing'
    | 'speed'
    | 'vorpal';

export type SpellType = 'attack' | 'save' | 'utility' | 'heal';

export type ZeroToFour = 0 | 1 | 2 | 3 | 4;

export type CurrencyType = 'cp' | 'sp' | 'gp' | 'pp';
export type PriceString = `${number} ${CurrencyType}`;

export type WeightType = 'L';
export type WeightString = `${number}${WeightType | ''}`;

export type PreciousMaterial = 'adamantine' | 'coldIron' | 'darkwood' | 'dragonhide' | 'mithral' | 'orichalcum' | 'silver' | 'sovereignSteel' | 'warpglass';
export type PreciousMaterialGrade = 'low' | 'standard' | 'high';

export type IdentificationStatus = 'identified' | 'unidentified';

export interface Value<T> {
    value: T;
}

export interface Identification {
    identified: IdentificationData;
    unidentified: IdentificationData;
    status: IdentificationStatus;
}
export interface IdentificationData {
    data: {
        description: Value<string>;
    };
    img: string;
    name: string;
}

export interface PF2EItem {
    _id: string;
    name?: string;
    type: ItemType;
    data: PF2EItemData;

    flags: Record<string, unknown>;
    folder?: string;
}
export interface PF2EItemData {
    slug: string;
    level: Value<number>;
    description: Value<string>;
    source: Value<string>;
    traits: Value<Array<string>> & {
        rarity: Value<string>;
    };
}

export interface Spell extends PF2EItem {
    type: 'spell';
    data: SpellData;
}
export interface SpellData extends PF2EItemData {
    spellType: Value<SpellType>;
    school: Value<SpellSchool>;
}
export function isSpell(item: PF2EItem): item is Spell {
    return item.data.hasOwnProperty('spellType');
}

export interface PhysicalItem extends PF2EItem {
    type: PhysicalItemType;
    data: PhysicalItemData;
}
export interface PhysicalItemData extends PF2EItemData {
    hp: Value<number>;
    maxHp: Value<number>;
    hardness: Value<number>;
    brokenThreshold: Value<number>;

    price: Value<PriceString>;
    weight: Value<WeightString>;

    quantity: Value<number>;
    stackGroup: Value<string>;
    equipped: Value<boolean>;
    invested: Value<boolean>;

    preciousMaterial: Value<PreciousMaterial>;
    preciousMaterialGrade: Value<PreciousMaterialGrade>;
}

export interface EquipmentItem extends PhysicalItem {
    type: EquipmentItemType;
    data: EquipmentItemData;
}
export interface EquipmentItemData extends PhysicalItemData {
    equippedBulk: Value<WeightString | ''>;
    propertyRune1: Value<WeaponPropertyTypes | null>;
    propertyRune2: Value<WeaponPropertyTypes | null>;
    propertyRune3: Value<WeaponPropertyTypes | null>;
    propertyRune4: Value<WeaponPropertyTypes | null>;
}

export interface Weapon extends PhysicalItem {
    type: 'weapon';
    data: WeaponData;
}
export interface WeaponData extends EquipmentItemData {
    weaponData: Value<WeaponType>;
    potencyRune: Value<ZeroToFour>;
    strikingRune: Value<StrikingRuneType>;
}
export function isWeapon(data: PF2EItem): data is Weapon {
    return data.type === 'weapon';
}

interface BaseArmor extends PhysicalItem {
    type: 'armor';
    data: ArmorData | ShieldData;
}
interface BaseArmorData extends EquipmentItemData {
    armorType: Value<ArmorType>;
    strength: Value<number>;
    dex: Value<number>;
}

export interface Armor extends BaseArmor {
    data: ArmorData;
}
export interface ArmorData extends BaseArmorData {
    potencyRune: Value<ZeroToFour>;
    resiliencyRune: Value<ResiliencyRuneType>;
}
export function isArmor(item: PF2EItem): item is Armor {
    return item.type === 'armor';
}

export interface Shield extends BaseArmor {
    data: ShieldData;
}
export interface ShieldData extends BaseArmorData {}
export function isShield(item: PF2EItem): item is Shield {
    return isArmor(item) && item.data.armorType.value === 'shield';
}
