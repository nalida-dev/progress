import * as d3 from 'd3';

export function setUnion(a: Set<any>, b: Set<any>) {
    return new Set([...Array.from(a), ...Array.from(b)]);
}
export function setIntersection(a: Set<any>, b: Set<any>) {
    return new Set([...Array.from(a)].filter(x => b.has(x)));
}
export function setDifference(a: Set<any>, b: Set<any>) {
    return new Set([...Array.from(a)].filter(x => !b.has(x)));
}

function simpleHash(s: string) {
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
        const char = s.charCodeAt(i);
        hash *= 727;
        hash += char * 173;
    }
    return hash;
}

export function nameToColor(name: string) {
    return d3.interpolateRainbow(simpleHash(name) % 100000 / 100000);
}
