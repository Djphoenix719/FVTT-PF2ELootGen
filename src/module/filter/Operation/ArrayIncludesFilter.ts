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

import { WeightedFilter } from './WeightedFilter';
import { EqualityType } from '../EqualityType';
import { ItemData } from '../../../types/Items';

export class ArrayIncludesFilter extends WeightedFilter<string> {
    constructor(selector: string, desiredValue: string, weight: number) {
        super(selector, desiredValue, weight, EqualityType.EqualTo);
    }

    protected getValue(data: ItemData): string {
        const value = super.getValue(data);
        if (Array.isArray(value)) {
            return value.includes(this.desiredValue) ? this.desiredValue : undefined;
        }
        return undefined;
    }
}
