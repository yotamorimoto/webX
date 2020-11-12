import { series, midiratio } from './sc.js'

export class Sample {
  constructor(n) {
    this.buffers = new Array(n);
    this.map = new Array(128);
  }
  read(lowest, highest, path) {
    const dict = new Array(this.buffers.length);
    const up = 2;
    const down = 4;
    const interval = up + 1 + down;
    async function load2(buffers, map) {
      for (let i=0; i<buffers.length; i++) {
        let res = await fetch(path + i + '.mp3');
        let buf = await res.arrayBuffer();
        context.decodeAudioData(buf, (b)=>{buffers[i]=b}, (e)=>{reject(e)});
        buf = res = null;
      };
      for (let i=0,note=lowest; i<buffers.length; i++,note+=interval) {
        dict[i] = new Array(note, series(note-down, note+up+1));
        if (note == lowest) dict[i] = new Array(note, series(0, lowest+up+1));
        if (note == highest) dict[i] = new Array(note, series(highest-down, 128));
      }
      let bufindex = 0;
      for (const item of dict) {
        for (const note of item[1]) {
          map[note] = new Array(bufindex, midiratio(note - item[0]));
        }
        bufindex++;
      }
    };
    return load2(this.buffers, this.map);
  }
  trash() { this.buffers = this.map = null }
}
