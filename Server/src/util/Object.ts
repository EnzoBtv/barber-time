export function hasKey<O>(object: O, key: keyof any): key is keyof O {
    return key in object;
}
