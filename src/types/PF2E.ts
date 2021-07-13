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

import { SpellSchool, SpellTradition } from '../module/loot-app/data/Spells';
import { Rarity } from '../module/loot-app/data/Materials';

export type EquipmentItemType = 'armor' | 'weapon';
export type PhysicalItemType = EquipmentItemType | 'consumable' | 'equipment' | 'treasure';
export type ItemType = PhysicalItemType | 'spell';

export type ResiliencyRuneType = 'resilient' | 'greaterResilient' | 'majorResilient' | '';
export type StrikingRuneType = 'striking' | 'greaterStriking' | 'majorStriking' | '';
export type ArmorType = 'shield' | 'unarmored' | 'light' | 'medium' | 'heavy';
export type WeaponType = 'unarmed' | 'simple' | 'advanced' | 'martial';

export type WeaponPropertyType =
    | null
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

export type ConsumableType = 'ammo' | 'potion' | 'oil' | 'scroll' | 'talisman' | 'snare' | 'drug' | 'elixir' | 'mutagen' | 'other' | 'poison' | 'tool' | 'wand';

export type ZeroToFour = 0 | 1 | 2 | 3 | 4;

export type CurrencyType = 'cp' | 'sp' | 'gp' | 'pp';
export type PriceString = `${number} ${CurrencyType}`;

export type WeightType = 'L';
export type WeightString = `${number}${WeightType | ''}`;

export type PreciousMaterial =
    | 'adamantine'
    | 'coldIron'
    | 'darkwood'
    | 'dragonhide'
    | 'mithral'
    | 'orichalcum'
    | 'silver'
    | 'sovereignSteel'
    | 'warpglass'
    | '';
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
        rarity: Value<Rarity>;
    };
}

export interface SpellItem extends PF2EItem {
    type: 'spell';
    data: SpellData;
}
export interface SpellData extends PF2EItemData {
    spellType: Value<SpellType>;
    school: Value<SpellSchool>;
    traditions: Value<Array<SpellTradition>>;
}
export function isSpell(item: PF2EItem | undefined): item is SpellItem {
    if (item === undefined) return false;
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
const physicalCheckProperties = ['hp', 'maxHp', 'price', 'weight'];
export function isPhysicalItem(item: PF2EItem | undefined): item is PhysicalItem {
    if (item === undefined) return false;
    for (let i = 0; i < physicalCheckProperties.length; i++) {
        if (!item.data.hasOwnProperty(physicalCheckProperties[i])) {
            return false;
        }
    }
    return true;
}

export interface TreasureItem extends PhysicalItem {
    type: 'treasure';
    data: TreasureItemData;
}
export interface TreasureItemData extends PhysicalItemData {
    value: Value<number>;
}
export function isTreasure(item: PF2EItem | undefined): item is TreasureItem {
    if (item === undefined) return false;
    return isPhysicalItem(item) && item.data.hasOwnProperty('value');
}

export interface ConsumableItem extends PhysicalItem {
    type: 'consumable';
    data: ConsumableItemData;
}
interface ConsumableSpellData {
    data: SpellItem;
    heightenedLevel: number;
}
interface NoConsumableSpellData {
    data: null;
    heightenedLevel: null;
}
export interface ConsumableItemData extends PhysicalItemData {
    consumableType: Value<ConsumableType>;
    spell: ConsumableSpellData | NoConsumableSpellData;
}

export interface EquipmentItem extends PhysicalItem {
    type: EquipmentItemType;
    data: EquipmentItemData;
}
export interface EquipmentItemData extends PhysicalItemData {
    equippedBulk: Value<WeightString | ''>;
    propertyRune1: Value<WeaponPropertyType | null>;
    propertyRune2: Value<WeaponPropertyType | null>;
    propertyRune3: Value<WeaponPropertyType | null>;
    propertyRune4: Value<WeaponPropertyType | null>;
}
const equipmentCheckProperties = ['equippedBulk', 'propertyRune1', 'propertyRune2'];
export function isEquipment(item: PF2EItem | undefined): item is EquipmentItem {
    if (item === undefined) return false;
    if (!isPhysicalItem(item)) return false;
    for (let i = 0; i < physicalCheckProperties.length; i++) {
        if (!item.data.hasOwnProperty(equipmentCheckProperties[i])) {
            return false;
        }
    }
    return true;
}

export interface Weapon extends EquipmentItem {
    type: 'weapon';
    data: WeaponData;
}
export interface WeaponData extends EquipmentItemData {
    weaponData: Value<WeaponType>;
    potencyRune: Value<ZeroToFour>;
    strikingRune: Value<StrikingRuneType>;
}
export function isWeapon(item: PF2EItem | undefined): item is Weapon {
    if (item === undefined) return false;
    return item.type === 'weapon';
}

export interface BaseArmor extends EquipmentItem {
    type: 'armor';
    data: ArmorData | ShieldData;
}
export interface BaseArmorData extends EquipmentItemData {
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
export function isArmor(item: PF2EItem | undefined): item is Armor {
    if (item === undefined) return false;
    return item.type === 'armor';
}

export interface Shield extends BaseArmor {
    data: ShieldData;
}
export interface ShieldData extends BaseArmorData {}
export function isShield(item: PF2EItem | undefined): item is Shield {
    if (item === undefined) return false;
    return isArmor(item) && item.data.armorType.value === 'shield';
}
