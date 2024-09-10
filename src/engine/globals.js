import { dataAssets } from "./assets";
import { zzfxP, zzfxX } from "./zzfx";

export const player = {
  node: null,
  playing: false,
  buffer: null,
  async set(song) {
    const isPlaying = !!this.node;
    if (isPlaying) {
      await this.stop();
    }
    this.buffer = dataAssets[song];

    if (isPlaying) {
      await this.start();
    } else {
      // ready.
    }
  },
  async start() {
    if (this.node) return;
    this.node = zzfxP(...this.buffer);
    this.node.loop = true;
    await zzfxX.resume();
    this.playing = true;
  },
  async stop() {
    if (!this.node) return;
    this.node.stop();
    this.node.disconnect();
    this.node = null;
    this.playing = false;
  },
};
