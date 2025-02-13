// export function getObjectByKey<K extends keyof any, T>(
//     objects: { [key in K]: T }[],
//     key: K
// ): T | null {
//     for (const obj of objects) {
//         if (obj[key]) {
//             return obj[key];
//         }
//     }
//     return null;
// }

// export function getObjectByIndex<T>(
//     objects: { [key in any]: T }[],
//     index: number
// ): T | null {
//     const obj = objects[index];
//     if (obj) {
//         return Object.values(obj)[0] || null;
//     }
//     return null;
// }

// export function getKeyByObject<K extends keyof any>(
//     objects: { [key in K]: any }[],
//     value: any
// ): K | null {
//     for (const obj of objects) {
//         for (const [key, val] of Object.entries(obj)) {
//             if (val === value) {
//                 return key as K;
//             }
//         }
//     }
//     return null;
// }

// export function getKeys<K extends keyof any>(
//     objects: { [key in K]: any }[]
// ): K[] {
//     const keys: K[] = [];
//     for (const obj of objects) {
//         keys.push(...(Object.keys(obj) as K[]));
//     }
//     return keys;
// }
