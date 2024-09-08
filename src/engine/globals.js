import { dataAssets } from "./assets";
import { zzfxP } from "./zzfx";

export const player = {
  player: null,
  play(index) {
    this.player = zzfxP(...dataAssets[index]);
  },
  stop() {
    this.player && this.player.stop();
  },
  setLoop(loop) {
    this.player && (this.player.loop = loop);
  }
};