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

import { SpellSchool, SpellTradition } from '../module/loot-app/source/Spells';
import { PotencyRuneType } from '../module/loot-app/data/Runes';

declare global {
    interface CONFIG {
        PF2E: {
            preciousMaterials: {
                [T in PreciousMaterialType]: string;
            };
            preciousMaterialGrades: {
                [T in PreciousMaterialGrade]: string;
            };
            weaponStrikingRunes: {
                [T in StrikingRuneType]: string;
            };
            armorResiliencyRunes: {
                [T in ResiliencyRuneType]: string;
            };
            weaponPotencyRunes: {
                [T in ZeroToFour]: string;
            };
            armorPotencyRunes: {
                [T in ZeroToFour]: string;
            };
            weaponPropertyRunes: {
                [T in WeaponPropertyRuneType]: string;
            };
            armorPropertyRunes: {
                [T in ArmorPropertyRuneType]: string;
            };
        };
    }
}

export type HTMLItemString = `@Item[${string}]` | `@Item[${string}]{${string}}`;

export enum Rarity {
    Common = 'common',
    Uncommon = 'uncommon',
    Rare = 'rare',
    Unique = 'unique',
}

export enum EquipmentType {
    Weapon = 'weapon',
    Armor = 'armor',

    Buckler = 'buckler',
    Shield = 'shield',
    Tower = 'tower',
}

export const PropertyRuneCreateKey = ['propertyRune1', 'propertyRune2', 'propertyRune3', 'propertyRune4'];
export type PropertyRuneCreateKey = `propertyRune${'1' | '2' | '3' | '4'}`;

export type EquipmentItemType = 'armor' | 'weapon';
export type PhysicalItemType = EquipmentItemType | 'consumable' | 'equipment' | 'treasure';
export type ItemType = PhysicalItemType | 'spell';

export type ResiliencyRuneType = 'resilient' | 'greaterResilient' | 'majorResilient' | '';
export type StrikingRuneType = 'striking' | 'greaterStriking' | 'majorStriking' | '';
export type ArmorType = 'shield' | 'unarmored' | 'light' | 'medium' | 'heavy';
export type WeaponType = 'unarmed' | 'simple' | 'advanced' | 'martial';

export type WeaponPropertyRuneType =
    | ''
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

export type ArmorPropertyRuneType =
    | ''
    | 'ready'
    | 'slick'
    | 'shadow'
    | 'glamered'
    | 'acidResistant'
    | 'coldResistant'
    | 'electricityResistant'
    | 'fireResistant'
    | 'greaterSlick'
    | 'invisibility'
    | 'sinisterKnight'
    | 'greaterReady'
    | 'greaterShadow'
    | 'greaterInvisibility'
    | 'greaterAcidResistant'
    | 'greaterColdResistant'
    | 'greaterElectricityResistant'
    | 'greaterFireResistant'
    | 'fortification'
    | 'winged'
    | 'rockBraced'
    | 'soaring'
    | 'antimagic'
    | 'majorSlick'
    | 'ethereal'
    | 'majorShadow'
    | 'greaterFortification'
    | 'greaterWinged';

export type PropertyRuneType = WeaponPropertyRuneType | ArmorPropertyRuneType;

export type SpellType = 'attack' | 'save' | 'utility' | 'heal';

export type ConsumableType = 'ammo' | 'potion' | 'oil' | 'scroll' | 'talisman' | 'snare' | 'drug' | 'elixir' | 'mutagen' | 'other' | 'poison' | 'tool' | 'wand';

export type ZeroToFour = 0 | 1 | 2 | 3 | 4;

export type CurrencyType = 'cp' | 'sp' | 'gp' | 'pp';
export type PriceString = `${number} ${CurrencyType}` | `${number}${CurrencyType}`;

export type WeightType = 'L';
export type WeightString = `${number}${WeightType | ''}` | WeightType;

export type PreciousMaterialType =
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

export type ArmorGroupType = 'composite' | 'chain' | 'cloth' | 'leather' | 'plate';
export type WeaponGroupType =
    | 'club'
    | 'knife'
    | 'brawling'
    | 'spear'
    | 'sword'
    | 'axe'
    | 'flail'
    | 'polearm'
    | 'pick'
    | 'hammer'
    | 'shield'
    | 'dart'
    | 'bow'
    | 'sling'
    | 'bomb';

export enum PreciousMaterialGrade {
    None = '',
    Low = 'low',
    Standard = 'standard',
    High = 'high',
}

export type IdentificationStatus = 'identified' | 'unidentified';

export interface IValue<T> {
    value: T;
}

export interface Identification {
    identified: IdentificationData;
    unidentified: IdentificationData;
    status: IdentificationStatus;
}
export interface IdentificationData {
    data: {
        description: IValue<string>;
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
    level: IValue<number>;
    description: IValue<string>;
    source: IValue<string>;
    traits: IValue<Array<string>> & {
        rarity: IValue<Rarity>;
    };
}

export interface SpellItem extends PF2EItem {
    type: 'spell';
    data: SpellData;
}
export interface SpellData extends PF2EItemData {
    spellType: IValue<SpellType>;
    school: IValue<SpellSchool>;
    traditions: IValue<Array<SpellTradition>>;
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
    hp: IValue<number>;
    maxHp: IValue<number>;
    hardness: IValue<number>;
    brokenThreshold: IValue<number>;

    price: IValue<PriceString>;
    weight: IValue<WeightString>;

    quantity: IValue<number>;
    stackGroup: IValue<string>;
    equipped: IValue<boolean>;
    invested: IValue<boolean>;

    identification: Identification;

    preciousMaterial: IValue<PreciousMaterialType>;
    preciousMaterialGrade: IValue<PreciousMaterialGrade>;
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
    value: IValue<number>;
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
    consumableType: IValue<ConsumableType>;
    spell: ConsumableSpellData | NoConsumableSpellData;
}

export interface EquipmentItem extends PhysicalItem {
    type: EquipmentItemType;
    data: EquipmentItemData;
}
export interface EquipmentItemData extends PhysicalItemData {
    group: IValue<WeaponGroupType> | IValue<ArmorGroupType>;
    specific: IValue<boolean>;
    equippedBulk: IValue<WeightString | ''>;
    propertyRune1: IValue<WeaponPropertyRuneType | ArmorPropertyRuneType>;
    propertyRune2: IValue<WeaponPropertyRuneType | ArmorPropertyRuneType>;
    propertyRune3: IValue<WeaponPropertyRuneType | ArmorPropertyRuneType>;
    propertyRune4: IValue<WeaponPropertyRuneType | ArmorPropertyRuneType>;
}
const equipmentCheckProperties = ['equippedBulk', 'propertyRune1', 'propertyRune2'];
export function isEquipment(item: PF2EItem | undefined): item is EquipmentItem {
    if (item === undefined) return false;
    if (!isPhysicalItem(item)) return false;
    for (let i = 0; i < equipmentCheckProperties.length; i++) {
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
    group: IValue<WeaponGroupType>;
    weaponData: IValue<WeaponType>;
    potencyRune: IValue<PotencyRuneType>;
    strikingRune: IValue<StrikingRuneType>;

    propertyRune1: IValue<WeaponPropertyRuneType>;
    propertyRune2: IValue<WeaponPropertyRuneType>;
    propertyRune3: IValue<WeaponPropertyRuneType>;
    propertyRune4: IValue<WeaponPropertyRuneType>;
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
    group: IValue<ArmorGroupType>;
    armorType: IValue<ArmorType>;
    armor: IValue<number>;
    strength: IValue<number>;
    dex: IValue<number>;

    propertyRune1: IValue<ArmorPropertyRuneType>;
    propertyRune2: IValue<ArmorPropertyRuneType>;
    propertyRune3: IValue<ArmorPropertyRuneType>;
    propertyRune4: IValue<ArmorPropertyRuneType>;
}

export interface Armor extends BaseArmor {
    data: ArmorData;
}
export interface ArmorData extends BaseArmorData {
    potencyRune: IValue<PotencyRuneType>;
    resiliencyRune: IValue<ResiliencyRuneType>;
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
