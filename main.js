import * as sc from './sc.js'
import { choose } from './random.js'
import { Sine, FM2 }  from './synth.js'
import { Brown } from './brown.js'
import { Trig, Changed, PulseDivide } from './trig.js'
// global scope for graph creation
window.context = null;
window.master = null;
window.verb = null;
window.bus = null;
window.seed = Date.now(); // or overwrite
const playButton = document.getElementById('play');
const sldrVolume = document.getElementById('volume');
const sldrSpeed = document.getElementById('speed');
const sldrStep = document.getElementById('step');
const sldrG = document.getElementById('g');
const sldrResonance = document.getElementById('resonance');
sldrVolume.value = 0.8;
sldrSpeed.value = 0.4;
sldrStep.value = 0.5;
sldrG.value = 0.3;
sldrResonance.value = 0.5;
sldrVolume.oninput = function() {
  master.gain.value = sc.dbamp(sc.lin(this.value, -30, 6));
};
async function makeResonance(){
  let convolver = context.createConvolver();
  let response  = await fetch('ir/vdsp-darkspace.wav');
  let buffer    = await response.arrayBuffer();
  context.decodeAudioData(buffer, (b) => { convolver.buffer = b }, (e) => { reject(e) });
  return convolver;
}
function init() {
  try {
    window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext;
    context = new AudioContext({ latencyHint: 2048/44100 });
    (async ()=> {
      verb   = await makeResonance();
      master = context.createGain();
      bus    = context.createGain();
      bus.connect(verb);
      verb.connect(master);
      master.connect(context.destination);
      master.gain.value = sc.dbamp(sc.lin(sldrVolume.value, -30, 6));
      setTimeout(function tick(){ loop(); setTimeout(tick, sc.linexp(sldrSpeed.value,0,1,800,80)) }, 1000);
    })();
  } catch(e) { alert(e) }
}
playButton.onclick = function(){
  playButton.remove();
  init();
}

const root = choose([21,22,23,24,25,26]);
const melodicminor = new Uint8Array([0,2,3,5,7,9,11]);
const locrian = new Uint8Array([0,1,3,5,6,8,10]);
const phrygian = new Uint8Array([0,1,3,5,7,8,10]);
const aeolian = new Uint8Array([0,2,3,5,7,8,10]);
const dorian = new Uint8Array([0,2,3,5,7,9,10]);
const ionian = new Uint8Array([0,2,4,5,7,9,11]);
const mixolydian =  new Uint8Array([0,2,4,5,7,9,10]);
const lydian = new Uint8Array([0,2,4,6,7,9,11]);
const mode = [
  // melodicminor,
  locrian,
  phrygian,
  // aeolian,
  // dorian,
  // ionian,
  // mixolydian,
  // lydian
];
const brown = new Brown(30);
const trig0 = Trig();
const trig1 = Trig();
const changed0 = Changed();
const changed1 = Changed();
const mTrig = Trig();
const mPDiv = PulseDivide();
let b = brown.next(
  sc.lin(sldrStep.value,0.05,1.0),
  sc.lin(sldrG.value,0.1,1.1)
);
let m = mode[sc.fastRound(sc.lin2(b[0],0,20))%(mode.length-1)];

function loop() {
  b = brown.next(
    sc.lin(sldrStep.value,0.05,1.0),
    sc.lin(sldrG.value,0.1,1.1)
  );
  if(mPDiv(mTrig(b[1]), 6)) {
    m = mode[sc.fastRound(sc.lin2(b[2],0,20))%(mode.length-1)];
    console.log(m);
  }
  if(trig0(b[10])) {
    const note = sc.deg2key(sc.lin2(b[11],20,30), m) + root;
    if(changed0(note)) {
      FM2(
        sc.midicps(note),
        sc.dbamp(sc.lin2(b[12], -24, -9)),
        b[13],
        sldrResonance.value,
        b[14],
        b[15],
        b[16],
        b[17],
        b[18],
        b[19],
      );
    };
  };
  if(trig1(b[20])) {
    const note = sc.deg2key(sc.lin2(b[21],30,40), m) + root;
    if(changed1(note)) {
      FM2(
        sc.midicps(note),
        sc.dbamp(sc.lin2(b[22], -24, -9)),
        b[23],
        sldrResonance.value,
        b[24],
        b[25],
        b[26],
        b[27],
        b[28],
        b[29]
      );
    };
  };
};
