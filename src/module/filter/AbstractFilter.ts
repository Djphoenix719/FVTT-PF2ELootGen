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

import { ISpecification } from './ISpecification';
import { ItemData } from '../../types/Items';

export abstract class AbstractFilter implements ISpecification<ItemData> {
    protected children: ISpecification<ItemData>[];

    protected constructor(children?: ISpecification<ItemData>[]) {
        if (children === undefined) {
            children = [];
        }

        this.children = children;
    }

    public abstract isSatisfiedBy(data: ItemData): boolean;

    public and(other: ISpecification<ItemData>): ISpecification<ItemData> {
        return new AndFilter([this, other]);
    }

    public not(other?: ISpecification<ItemData>): ISpecification<ItemData> {
        return new NotFilter(this);
    }

    public or(other: ISpecification<ItemData>): ISpecification<ItemData> {
        return new OrFilter([this, other]);
    }

    public addChildren(others: ISpecification<ItemData> | ISpecification<ItemData>[]) {
        if (!Array.isArray(others)) {
            others = [others];
        }
        this.children.push(...others);
    }
}

export class AndFilter extends AbstractFilter {
    public constructor(children?: ISpecification<ItemData>[]) {
        super(children);
    }

    public isSatisfiedBy(data: ItemData): boolean {
        for (const child of this.children) {
            if (!child.isSatisfiedBy(data)) {
                return false;
            }
        }
        return true;
    }
}

export class NotFilter extends AbstractFilter {
    public constructor(filter: ISpecification<ItemData>) {
        super([filter]);
    }

    public isSatisfiedBy(data: ItemData): boolean {
        return !this.children[0].isSatisfiedBy(data);
    }
}

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
