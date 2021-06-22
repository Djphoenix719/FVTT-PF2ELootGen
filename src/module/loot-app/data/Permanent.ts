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

import { SourceType, TableSource, GenType, tableStoreId, ordinalNumber } from './DataSource';
import { INamed } from './Mixins';
import { RollableTablesPack } from './RollableTables';

export interface PermanentSource extends TableSource, INamed {}

// const leveledSources = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
// ordered 1st through 20th level
const tableIds: string[] = [
    'JyDn13oc0MdLjpyw',
    'q6hhGYSee35XxKE8',
    'Ow2zoRUSX0s7JjMo',
    'k0Al2PJni2NTtdIY',
    'k5bG37570BbflxR2',
    '9xol7FdCfaU585WR',
    'r8F8mI2BZU6nOMQB',
    'QoEkRoteKJwHHVRd',
    'AJOYeeeF3E8UC7KF',
    'W0qudblot2Z9Vu86',
    'ood552HB1onSdJFS',
    'uzkmxRIn4CtzfP47',
    'eo7kjM8xv6KD5h5q',
    'cBpFoBUNSApkvP6L',
    'X2QkgnYrda4mV5v3',
    'J7XfeVrfUj72IkRY',
    '0jlGmwn6YGqsfG1q',
    '6FmhLLYH94xhucIs',
    'gkdB45QC0u1WeiRA',
    'NOkobOGi0nqsboHI',
];
const permanentSourceTemplate = (level: number): PermanentSource => {
    return {
        id: tableIds[level],
        storeId: tableStoreId(tableIds[level]),
        name: `${ordinalNumber(level + 1)}-Level`,
        tableSource: RollableTablesPack,
        sourceType: SourceType.Table,
        itemType: GenType.Permanent,
        weight: 1,
        enabled: true,
    };
};

export const permanentSources: Record<string, PermanentSource> = tableIds.reduce(
    (prev, curr, indx) =>
        mergeObject(prev, {
            [tableStoreId(curr)]: permanentSourceTemplate(indx),
        }),
    {},
);
