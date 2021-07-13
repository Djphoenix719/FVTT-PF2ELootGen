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
import { PF2EItem } from '../../types/PF2E';

export abstract class FilterGroup implements ISpecification<PF2EItem> {
    protected children: ISpecification<PF2EItem>[];

    protected constructor(children?: ISpecification<PF2EItem>[]) {
        if (children === undefined) {
            children = [];
        }

        this.children = children;
    }

    public abstract isSatisfiedBy(data: PF2EItem): boolean;

    public and(other: ISpecification<PF2EItem>): ISpecification<PF2EItem> {
        return new AndGroup([this, other]);
    }

    public not(other?: ISpecification<PF2EItem>): ISpecification<PF2EItem> {
        return new NotGroup(this);
    }

    public or(other: ISpecification<PF2EItem>): ISpecification<PF2EItem> {
        return new OrGroup([this, other]);
    }

    public addChildren(others: ISpecification<PF2EItem> | ISpecification<PF2EItem>[]) {
        if (!Array.isArray(others)) {
            others = [others];
        }
        this.children.push(...others);
    }
}

export class AndGroup extends FilterGroup {
    public constructor(children?: ISpecification<PF2EItem>[]) {
        super(children);
    }

    public isSatisfiedBy(data: PF2EItem): boolean {
        for (const child of this.children) {
            if (!child.isSatisfiedBy(data)) {
                return false;
            }
        }
        return true;
    }
}

export class NotGroup extends FilterGroup {
    public constructor(filter: ISpecification<PF2EItem>) {
        super([filter]);
    }

    public isSatisfiedBy(data: PF2EItem): boolean {
        return !this.children[0].isSatisfiedBy(data);
    }
}

export class OrGroup extends FilterGroup {
    public constructor(children?: ISpecification<PF2EItem>[]) {
        super(children);
    }

    public isSatisfiedBy(data: PF2EItem): boolean {
        for (const child of this.children) {
            if (child.isSatisfiedBy(data)) {
                return true;
            }
        }
        return false;
    }
}
