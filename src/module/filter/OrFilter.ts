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

import { AbstractFilter } from './AbstractFilter';
import { ItemData } from '../../types/Items';
import { ISpecification } from './ISpecification';

export class OrFilter extends AbstractFilter {
    public constructor(children?: ISpecification<ItemData>[]) {
        super(children);
    }

    public isSatisfiedBy(data: ItemData): boolean {
        for (const child of this.children) {
            if (child.isSatisfiedBy(data)) {
                return true;
            }
        }
        return false;
    }
}
