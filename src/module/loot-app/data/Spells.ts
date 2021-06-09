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

export interface IPackDef {
    id: string;
    name: string;
}
export const SPELL_PACKS: IPackDef[] = [
    {
        id: 'pf2e.spells-srd',
        name: 'SRD Spells',
    },
];

export const SCROLL_TEMPLATE_SLUGS: Record<number, string> = {
    1: 'scroll-of-1st-level',
    2: 'scroll-of-2nd-level',
    3: 'scroll-of-3rd-level',
    4: 'scroll-of-4th-level',
    5: 'scroll-of-5th-level',
    6: 'scroll-of-6th-level',
    7: 'scroll-of-7th-level',
    8: 'scroll-of-8th-level',
    9: 'scroll-of-9th-level',
    0: 'scroll-of-10th-level',
};
