// very fast round
export const round = a => (a + (a > 0 ? 0.5 : -0.5)) << 0;
// fast int division
export const idiv = (a, b) => a / b >> 0;

// degree to midi key
export const deg2key = (degree, mode) => {
  const size = mode.length;
  const deg = round(degree);
  return (12 * idiv(deg, size)) + mode[deg % size];
};

export const fold = (x, lo, hi) => {
  const mod = (x, y) => ((x % y) + y) % y;
  x -= lo;
  const r = hi - lo;
  const w = mod(x, r);
  return (mod(x / r, 2) > 1) ? (hi - w) : (lo + w);
};
// bipolar out
export const fold2 = a => fold(a, -1, 1);

export const midiratio = midi => Math.pow(2.0, midi * 0.083333333333);

export const midicps = midi => 440. * Math.pow(2.0, (midi - 69.0) * 0.083333333333);

export const cpsmidi = cps => Math.log2(cps * 0.002272727272727272727272727) * 12. + 69.;

export const dbamp = db => Math.pow(10, db * 0.05);

export const ampdb = amp => Math.log10(amp) * 20.;

export const linlin = (x, a, b, c, d) => {
  if (x <= a) {
    return c;
  }
  if (x >= b) {
    return d;
  }
  return (x - a) / (b - a) * (d - c) + c;
};
// unipolar in
export const lin1 = (x, lo, hi) => linlin(x, 0, 1, lo, hi);
// bipolar in
export const lin2 = (x, lo, hi) => linlin(x, -1, 1, lo, hi);

export const linexp = (x, a, b, c, d) => {
  if (x <= a) {
    return c;
  }
  if (x >= b) {
    return d;
  }
  return Math.pow(d / c, (x - a) / (b - a)) * c;
};
