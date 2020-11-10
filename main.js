import * as sc from './sc.js'
import { choose } from './random.js'
import { Sample } from './sample.js'
import { Tweed, Felt }  from './synth.js'
import { Brown } from './brown.js'
import { Trig, Changed, PulseDivide } from './trig.js'
// global scope for graph creation
window.AudioContext = window.AudioContext || window.webkitAudioContext;
window.context = null;
window.master = null;
window.verb = null;
window.bus = null;
window.sample1 = null;
window.sample2 = null;
window.seed = Date.now(); // or overwrite
const playButton = document.getElementById('play');
const sldrVolume = document.getElementById('volume');
const sldrSpeed = document.getElementById('speed');
const sldrStep = document.getElementById('step');
const sldrG = document.getElementById('g');
const sldrResonance = document.getElementById('resonance');
sldrVolume.value = 0.8;
sldrSpeed.value = 0.55;
sldrStep.value = 0.8;
sldrG.value = 1;
sldrResonance.value = 0.3;
sldrVolume.oninput = function() {
  master.gain.value = sc.dbamp(sc.lin1(this.value, -30, 6));
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
    context = new AudioContext({ latencyHint: 2048/44100 });
    (async ()=> {
      verb   = await makeResonance();
      sample1 = new Sample(9);
      await sample1.read(28, 84, './sample/tweed/');
      sample2 = new Sample(12);
      await sample2.read(21, 98, './sample/felt/')
      master = context.createGain();
      bus    = context.createGain();
      bus.connect(verb);
      verb.connect(master);
      master.connect(context.destination);
      master.gain.value = sc.dbamp(sc.lin1(sldrVolume.value, -30, 6));
      setTimeout(function tick(){ loop(); setTimeout(tick, sc.linexp(sldrSpeed.value,0,1,800,80)) }, 1000);
    })();
  } catch(e) { alert(e) }
}
playButton.onclick = function(){
  playButton.remove();
  init();
}

const root = 10;
const melodicminor = [0,2,3,5,7,9,11];
const locrian = [0,1,3,5,6,8,10];
const phrygian = [0,1,3,5,7,8,10];
const aeolian = [0,2,3,5,7,8,10];
const dorian = [0,2,3,5,7,9,10];
const ionian = [0,2,4,5,7,9,11];
const mixolydian = [0,2,4,5,7,9,10];
const lydian = [0,2,4,6,7,9,11];
const mode = [
  // melodicminor,
  // locrian,
  // phrygian,
  // aeolian,
  // dorian,
  ionian,
  ionian,
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
  sc.lin1(sldrStep.value,0.05,1.0),
  sc.lin1(sldrG.value,0.1,1.1)
);
let m = mode[sc.round(sc.lin2(b[0],0,20))%(mode.length-1)];

function loop() {
  b = brown.next(
    sc.lin1(sldrStep.value,0.05,1.0),
    sc.lin1(sldrG.value,0.1,1.1)
  );
  if(mPDiv(mTrig(b[1]), 6)) {
    m = mode[sc.round(sc.lin2(b[2],0,20))%(mode.length-1)];
    console.log(m);
  }
  if(trig0(b[10])) {
    const note = sc.deg2key(sc.lin2(b[11],23,40), m) + root;
    if(changed0(note)) {
      Tweed(
        sample1,
        note,
        sc.dbamp(sc.lin2(b[12], 0, 9)),
        b[13],
        sldrResonance.value,
        sc.lin2(b[14], 0.05, 0),
        b[15],
        b[16],
        b[17],
        b[18],
        b[19],
      );
    };
  };
  if(trig1(b[20])) {
    const note = sc.deg2key(sc.lin2(b[21],20,60), m) + root;
    if(changed1(note)) {
      Felt(
        sample2,
        note,
        sc.dbamp(sc.lin2(b[12], 0, 9)),
        (b[13]*10)%1*0.5,
        sldrResonance.value,
        sc.lin2(b[14], 0.1, 0),
        b[15],
        b[16],
        b[17],
        b[18],
        b[19],
      );
    };
  };
};
