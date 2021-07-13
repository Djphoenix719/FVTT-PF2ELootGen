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

import { BuilderType, FundamentalRune, IMaterial, IMaterialMap, IRuneMap, ItemMaterials, ItemRunes, MaterialGrade } from '../data/Materials';
import { Exception } from 'handlebars';
import {
    Armor,
    BaseArmor,
    EquipmentItem,
    isArmor,
    isEquipment,
    isShield,
    isWeapon,
    PF2EItem,
    PreciousMaterial,
    PreciousMaterialGrade,
    ResiliencyRuneType,
    Shield,
    StrikingRuneType,
    Weapon,
    WeaponPropertyType,
    ZeroToFour,
} from '../../../types/PF2E';

/**
 * Fetch all materials from the material map which have associated data for a builder type.
 * @param type The material type to fetch.
 */
function getMaterialsOfType(type: BuilderType): IMaterialMap {
    let materials: IMaterialMap = {};
    for (const material of Object.values(ItemMaterials)) {
        if (material.hasOwnProperty(type)) {
            materials[material.slug] = material;
        }
    }
    return materials;
}

/**
 * Get all runes for a specific type of item.
 * @param type
 */
function getRunesOfType(type: BuilderType): IRuneMap {
    return ItemRunes[type];
}

export class ItemBuilderException extends Exception {}

export abstract class ItemBuilder<T extends EquipmentItem> {
    protected readonly baseItem: Readonly<T>;

    protected potencyRune: ZeroToFour;
    protected materialSlug: PreciousMaterial;
    protected materialGrade: PreciousMaterialGrade;
    protected checksEnabled: boolean = true;

    public static MakeBuilder(baseItem: PF2EItem) {
        if (isShield(baseItem)) {
            return new ShieldBuilder(baseItem);
        }
        if (isArmor(baseItem)) {
            return new ArmorBuilder(baseItem);
        }
        if (isWeapon(baseItem)) {
            return new WeaponBuilder(baseItem);
        }
    }

    protected constructor(baseItem: T) {
        this.baseItem = baseItem;
        this.materialSlug = '';
        this.materialGrade = MaterialGrade.Standard;
        this.potencyRune = 0;
    }

    /**
     * Get a listing of valid materials for this base item.
     */
    public abstract get validMaterials(): IMaterialMap;

    /**
     * Get a listing of valid runes for this base item.
     */
    public abstract get validRunes(): IRuneMap;

    /**
     * Get the material data for the current material.
     */
    public get material(): IMaterial | undefined {
        if (this.materialSlug === undefined || this.materialGrade === undefined) {
            return undefined;
        }
        return ItemMaterials[this.materialSlug];
    }

    public setMaterial(materialSlug: PreciousMaterial, materialGrade: MaterialGrade): ItemBuilder<T> {
        this.materialSlug = materialSlug;
        this.materialGrade = materialGrade;
        if (this.checksEnabled) {
            if (!Object.keys(this.validMaterials).includes(materialSlug)) {
                throw new ItemBuilderException(`Specified material "${materialSlug}" is not a valid material for this item type.`);
            }
        }
        return this;
    }

    public setPotency(value: ZeroToFour): ItemBuilder<T> {
        if (this.checksEnabled) {
            if (value < 0 || value > 4) {
                throw new ItemBuilderException(`Potency value must be >= 0 and <= 4, but "${value}" was provided.`);
            }
        }
        this.potencyRune = value;
        return this;
    }

    /**
     * Enable or disable validity checks on method calls.
     * @param enabled
     */
    public setChecks(enabled: boolean): ItemBuilder<T> {
        this.checksEnabled = enabled;
        return this;
    }

    public build(): T {
        let item: T = duplicate(this.baseItem) as T;

        item._id = foundry.utils.randomID(16);

        item.data.preciousMaterial.value = this.materialSlug;
        item.data.preciousMaterialGrade.value = this.materialGrade;

        return item;
    }
}

abstract class EquipmentBuilder<T extends EquipmentItem> extends ItemBuilder<T> {
    protected propertySlugs: [WeaponPropertyType, WeaponPropertyType, WeaponPropertyType, WeaponPropertyType];

    protected constructor(baseItem: T) {
        super(baseItem);
        this.propertySlugs = [
            baseItem.data.propertyRune1.value,
            baseItem.data.propertyRune2.value,
            baseItem.data.propertyRune3.value,
            baseItem.data.propertyRune4.value,
        ];
    }

    public build(): T {
        let item = super.build();

        if (isEquipment(item)) {
            item.data.propertyRune1.value = this.propertySlugs[0];
            item.data.propertyRune2.value = this.propertySlugs[1];
            item.data.propertyRune3.value = this.propertySlugs[2];
            item.data.propertyRune4.value = this.propertySlugs[3];
        }

        return item;
    }
}

export class WeaponBuilder extends EquipmentBuilder<Weapon> {
    protected strikingRune: StrikingRuneType;

    public constructor(baseItem: Weapon) {
        super(baseItem);
        this.strikingRune = baseItem.data.strikingRune.value;
    }

    public get validMaterials(): IMaterialMap {
        return getMaterialsOfType(BuilderType.Weapon);
    }

    public get validRunes(): IRuneMap {
        return getRunesOfType(BuilderType.Weapon);
    }

    public setStrikingRune(value: StrikingRuneType): ItemBuilder<Weapon> {
        if (this.checksEnabled) {
            if (this.potencyRune === undefined) {
                throw new ItemBuilderException(`Potency must be set before setting fundamental.`);
            }

            const runes = this.validRunes;
            if (!runes['fundamental'].hasOwnProperty(value)) {
                throw new ItemBuilderException(`${value} is not a valid fundamental value for this item type.`);
            }
        }
        this.strikingRune = value;
        return this;
    }

    public build(): Weapon {
        let item = super.build();

        item.data.strikingRune.value = this.strikingRune;

        return item;
    }
}

abstract class BaseArmorBuilder<T extends BaseArmor> extends ItemBuilder<T> {
    protected dex: number;
    protected strength: number;

    protected constructor(baseItem: T) {
        super(baseItem);
        this.dex = baseItem.data.dex.value;
        this.strength = baseItem.data.strength.value;
    }

    public build(): T {
        const item = super.build();

        item.data.dex.value = this.dex;
        item.data.strength.value = this.strength;

        return item;
    }
}

export class ArmorBuilder extends BaseArmorBuilder<Armor> {
    protected resiliencyRune: ResiliencyRuneType;

    public constructor(baseItem: Armor) {
        super(baseItem);
        this.resiliencyRune = baseItem.data.resiliencyRune.value;
    }

    public get validMaterials(): IMaterialMap {
        return getMaterialsOfType(BuilderType.Armor);
    }

    public get validRunes(): IRuneMap {
        return getRunesOfType(BuilderType.Armor);
    }

    public setResiliencyRune(value: ResiliencyRuneType): ItemBuilder<Armor> {
        if (this.checksEnabled) {
            if (this.potencyRune === undefined) {
                throw new ItemBuilderException(`Potency must be set before setting fundamental.`);
            }

            const runes = this.validRunes;
            if (!runes['fundamental'].hasOwnProperty(value)) {
                throw new ItemBuilderException(`${value} is not a valid fundamental value for this item type.`);
            }
        }
        this.resiliencyRune = value;
        return this;
    }

    public build(): Armor {
        let item = super.build();

        item.data.resiliencyRune.value = this.resiliencyRune;

        return item;
    }
}

export class ShieldBuilder extends BaseArmorBuilder<Shield> {
    public constructor(baseItem: Shield) {
        super(baseItem);
    }

    public get validMaterials(): IMaterialMap {
        return getMaterialsOfType(BuilderType.Shield);
    }

    public get validRunes(): IRuneMap {
        return getRunesOfType(BuilderType.Shield);
    }
}
