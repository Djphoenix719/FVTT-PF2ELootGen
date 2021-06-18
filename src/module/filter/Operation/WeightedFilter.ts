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

import { ItemData } from '../../../types/Items';
import { EqualityType } from '../EqualityType';
import { ISpecification } from '../ISpecification';

export abstract class WeightedFilter<T extends number | string | boolean> implements ISpecification<ItemData> {
    private readonly selector: string;
    private readonly desiredValue: T;
    private readonly equality: EqualityType;
    public readonly weight: number;

    // constructor is protected here so we can type them properly, and extend with type specific functions later
    protected constructor(selector: string, desiredValue: T, weight: number, equalityType: EqualityType) {
        this.selector = selector;
        this.desiredValue = desiredValue;
        this.weight = weight;
        this.equality = equalityType;
    }

    /**
     * Get a value from a data path, e.g. a series of period separated property keys.
     * @param data The data to fetch the value from.
     * @protected
     */
    protected getValue(data: ItemData): T {
        const path: string[] = this.selector.split('.');

        let current: any = data;
        while (path.length > 0) {
            const key = path.shift();
            current = current[key];
        }
        return current;
    }

    protected compareTo(value: T): boolean {
        switch (this.equality) {
            case EqualityType.EqualTo:
                return value === this.desiredValue;
            case EqualityType.LessThan:
                return value < this.desiredValue;
            case EqualityType.LessThanEqualTo:
                return value <= this.desiredValue;
            case EqualityType.GreaterThan:
                return value > this.desiredValue;
            case EqualityType.GreaterThanEqualTo:
                return value >= this.desiredValue;
            case EqualityType.LocaleInvariant:
                return value.toLocaleString().localeCompare(this.desiredValue.toLocaleString()) === 0;
        }
    }

    /**
     * Return true if this operation is satisfied by the data.
     * @param data The data to test.
     */
    public isSatisfiedBy(data: ItemData): boolean {
        return this.compareTo(this.getValue(data));
    }
}
