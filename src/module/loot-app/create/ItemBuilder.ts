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

import { ArmorData, EquipmentData, isArmorData, isWeaponData, ItemData, ResilientRuneType, StrikingRuneType, WeaponData } from '../../../types/Items';
import { ItemMaterials, BuilderType, FundamentalRune, IMaterial, IMaterialMap, IRuneMap, ItemRunes, MaterialGrade, Rune } from '../data/Materials';
import { Exception } from 'handlebars';

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

export abstract class ItemBuilder<T extends EquipmentData> {
    protected readonly baseItem: Readonly<T>;

    protected potencyValue: number;
    protected fundamentalValue: FundamentalRune;
    protected materialSlug: string;
    protected materialGrade: MaterialGrade;
    protected propertySlugs: string[];
    protected checksEnabled: boolean = true;

    public static MakeBuilder(baseItem: ItemData) {
        if (isArmorData(baseItem)) {
            if (baseItem.data.armorType.value === 'shield') {
                return new ShieldBuilder(baseItem);
            } else {
                return new ArmorBuilder(baseItem);
            }
        }
        if (isWeaponData(baseItem)) {
            return new WeaponBuilder(baseItem);
        }
    }

    protected constructor(baseItem: T) {
        this.baseItem = baseItem;
        this.reset();
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
    public get material(): IMaterial {
        if (this.materialSlug === undefined || this.materialGrade === undefined) {
            return undefined;
        }
        return ItemMaterials[this.materialSlug];
    }

    public setMaterial(materialSlug: string, materialGrade: MaterialGrade): ItemBuilder<T> {
        this.materialSlug = materialSlug;
        this.materialGrade = materialGrade;
        if (this.checksEnabled) {
            if (!Object.keys(this.validMaterials).includes(materialSlug)) {
                throw new ItemBuilderException(`Specified material "${materialSlug}" is not a valid material for this item type.`);
            }
        }
        return this;
    }

    public setPotency(value: number): ItemBuilder<T> {
        if (this.checksEnabled) {
            if (value < 0 || value > 4) {
                throw new ItemBuilderException(`Potency value must be >= 0 and <= 4, but "${value}" was provided.`);
            }
        }
        this.potencyValue = value;
        return this;
    }

    public setFundamental(value: FundamentalRune): ItemBuilder<T> {
        if (this.checksEnabled) {
            if (this.potencyValue === undefined) {
                throw new ItemBuilderException(`Potency must be set before setting fundamental.`);
            }

            const runes = this.validRunes;
            if (!runes['fundamental'].hasOwnProperty(value)) {
                throw new ItemBuilderException(`${value} is not a valid fundamental value for this item type.`);
            }
        }
        this.fundamentalValue = value;
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

    public reset(): ItemBuilder<T> {
        this.potencyValue = undefined;
        this.fundamentalValue = undefined;
        this.materialSlug = undefined;
        this.materialGrade = undefined;
        this.propertySlugs = ['', '', '', ''];
        return this;
    }

    public build(): T {
        let item: T = duplicate(this.baseItem) as T;

        item.data.preciousMaterial.value = this.materialSlug;
        item.data.preciousMaterialGrade.value = this.materialGrade;
        item.data.potencyRune.value = this.potencyValue;

        item.data.propertyRune1.value = this.propertySlugs[0];
        item.data.propertyRune2.value = this.propertySlugs[1];
        item.data.propertyRune3.value = this.propertySlugs[2];
        item.data.propertyRune4.value = this.propertySlugs[3];

        return item;
    }
}

export class WeaponBuilder extends ItemBuilder<WeaponData> {
    protected fundamentalValue: StrikingRuneType;

    public get validMaterials(): IMaterialMap {
        return getMaterialsOfType(BuilderType.Weapon);
    }

    public get validRunes(): IRuneMap {
        return getRunesOfType(BuilderType.Weapon);
    }

    public setFundamental(id: StrikingRuneType): ItemBuilder<WeaponData> {
        return super.setFundamental(id);
    }

    public build(): WeaponData {
        let item = super.build();

        item.data.strikingRune.value = this.fundamentalValue;

        return item;
    }
}

export class ArmorBuilder extends ItemBuilder<ArmorData> {
    protected fundamentalValue: ResilientRuneType;

    public get validMaterials(): IMaterialMap {
        return getMaterialsOfType(BuilderType.Armor);
    }

    public get validRunes(): IRuneMap {
        return getRunesOfType(BuilderType.Armor);
    }

    public setFundamental(id: ResilientRuneType): ItemBuilder<ArmorData> {
        return super.setFundamental(id);
    }

    public build(): ArmorData {
        let item = super.build();

        item.data.resiliencyRune.value = this.fundamentalValue;

        return item;
    }
}

export class ShieldBuilder extends ArmorBuilder {
    public get validMaterials(): IMaterialMap {
        return getMaterialsOfType(BuilderType.Shield);
    }

    public get validRunes(): IRuneMap {
        return getRunesOfType(BuilderType.Shield);
    }
}
