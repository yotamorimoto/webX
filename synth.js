class Panner {
  constructor(pan) {
    // safari has no stereo panner
    if (context.createStereoPanner) {
        this.node = context.createStereoPanner();
        this.node.pan.value = pan;
    } else {
        this.node = context.createPanner();
        this.node.panningModel = 'equalpower';
        this.node.setPosition(pan, 0, 1 - Math.abs(pan));
    }
    return this.node
  }
}
class EGPerc {
  constructor(level=1, offset=0) {
    this.vca = context.createGain();
    this.level = level;
    this.offset = offset;
  }
  trigger(attack, release) {
    const now = context.currentTime;
    this.vca.gain.setValueAtTime(this.offset, now);
    this.vca.gain.linearRampToValueAtTime(this.level, now + attack);
    this.vca.gain.exponentialRampToValueAtTime(Math.max(0.0001, this.offset), now + attack + release);
  }
}
function set_xfade(a, b, fade) {
  a.gain.value = Math.cos(fade * 0.5*Math.PI);
  b.gain.value = Math.cos((1.0-fade) * 0.5*Math.PI);
}
function connect(...nodes) {
  for (let i=0; i<nodes.length-1; i++) {
    nodes[i].connect(nodes[i+1]);
  }
}
function disposeAt(time, ...nodes) {
  const now = context.currentTime + time;
  for (let n in nodes) { n.stop(now) }
  setTimeout(function(){
    for (let n in nodes) { n.disconnect() }
  }, now*1000+1000);
}

export function Sine(freq,amp,pan,res) {
  const vco = context.createOscillator();
  const out = context.createGain();
  const env = new EGPerc(amp);
  const panner = new Panner(pan);
  vco.frequency.value = freq;
  set_xfade(out, bus, res);
  connect(vco, env.vca, panner, out, master);
  connect(panner, bus);
  vco.start();
  env.trigger(0.01, 1.5);
  // gc
  disposeAt(2, vco);
}

export function FM2(freq,amp,pan,res,u,v,w,x,y,z) {
  const car = context.createOscillator();
  const mod = context.createOscillator();
  const out = context.createGain();
  const idx = new EGPerc(u*600+700, z*200+220);
  const env = new EGPerc(amp);
  const panner = new Panner(pan);
  car.frequency.value = freq;
  mod.frequency.value = freq * [2, 1.5, 1][Math.round(w+1)];
  set_xfade(out, bus, res);
  connect(mod, idx.vca, car.frequency);
  connect(car, env.vca, panner, out, master);
  connect(panner, bus);
  car.start();
  mod.start();
  idx.trigger(x*x+0.01, 2);
  env.trigger(v*v+0.01, 2);
  // gc
  disposeAt(3, car, mod);
}
