// seed must be defined globally window.seed
// mulberry32
export const rand = () => {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
}

export const exprand = (lo, hi) => lo * Math.exp(Math.log(hi / lo) * rand());

export const choose = array => array[Math.floor(rand() * array.length)];

export const whoose = array => array[Math.floor(rand() * array.length)];
