export function setUnion(a: Set<any>, b: Set<any>) {
    return new Set([...Array.from(a), ...Array.from(b)]);
}
export function setIntersection(a: Set<any>, b: Set<any>) {
    return new Set([...Array.from(a)].filter(x => b.has(x)));
}
export function setDifference(a: Set<any>, b: Set<any>) {
    return new Set([...Array.from(a)].filter(x => !b.has(x)));
}
