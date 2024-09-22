import { imageAssets } from "../engine/assets";
import { emit } from "../engine/events";
import { gameObject } from "../engine/game-object";
import { onKey } from "../engine/keyboard";
import { scene } from "../engine/scene";
import { text } from "../engine/text";

export default function playerScene() {
  onKey('m', () => {
    s.player.muted = !s.player.muted;
    s.player.togglePlay();
  });

  const infoText = text({
    x: 8,
    y: 8,
    text: '',
    color: 'lightgreen',
  });

  const keyText = text({
    x: 7,
    y: 240 - 15,
    text: 'M',
    color: 'lightgreen',
    update() {
      const fontName = this.color === 'lightgreen' ? 'font-lightgreen.png' : 'font-red.png';
      this.spritesheet = imageAssets[fontName];
      this.advance();
    }
  });

  const player = gameObject({
    x: 4,
    y: 240 - 18,
    width: 16,
    height: 16,
    playing: false,
    update() {
      this.advance();
    },
    draw() {
      const { context: ctx } = this;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.fillStyle = 'black';
      ctx.fillRect(2, 2, this.width - 4, this.height - 4);

      if (!BassoonTracker.isPlaying()) {
        return;
      }

      ctx.fillStyle = 'white';
      ctx.fillRect(14, 0, this.width + 1, this.height);
      ctx.fillStyle = 'black';
      ctx.fillRect(16, 2, this.width - 3, this.height - 4);

      var scopeWidth = this.width - 4;
      var scopeHeight = 5;
  
			s.player.analyser.fftSize = 64;
			var bufferLength = s.player.analyser.frequencyBinCount;
			var dataArray = new Uint8Array(bufferLength);

			var lowTreshold = 10;
			var highTreshold = 20;
			var max = bufferLength-highTreshold;

			var visualBufferLength = bufferLength - lowTreshold - highTreshold;

			s.player.analyser.getByteFrequencyData(dataArray);

			var barWidth = (scopeWidth - visualBufferLength) / visualBufferLength;
			var barHeight;
			var wx = 17;

      ctx.fillStyle = 'white';
			// only display range
			for(var i = lowTreshold; i < max; i++) {
				barHeight = dataArray[i] * (scopeHeight + (i * 2.5)) / 750;
				ctx.fillRect(wx,scopeHeight-barHeight + 8,barWidth,barHeight);

				wx += barWidth + 1;
			}

    },
  });
  const s = scene({
    frame: 0,
    children: [
      infoText,
      player,
      keyText,
    ],
    update() {
      if (BassoonTracker.isPlaying()) {
        this.player.time = new Date().getTime() - this.player.startTime;
      }

      if (this.player.startTime) {
        this.player.state = BassoonTracker.getStateAtTime(this.player.time);
      }

      const currentPos = this.player.state?.songPos * this.player.patternLength + this.player.state?.patternPos;
      if (currentPos >= this.player.songLength) {
        emit('song-end');
      }
      this.player.state?.songPos && (infoText.text = `POS: ${currentPos}:${this.player.songLength}`);
    },
    player: {
      tracks: [],
      currentTrack: 0,
      startTime: 0,
      time: 0,
      song: '',
      patternLength: 0,
      songLength: 0,
      state: null,
      muted: false,
      analyser: BassoonTracker.audio.context.createAnalyser(),
      play(tracks) {
        tracks && (this.tracks = tracks);
        // check if tracks is string.
        if (typeof tracks === 'string') {
          this.tracks = [tracks];
        }

        BassoonTracker.load(this.tracks[this.currentTrack], false, () => {
          this.song = BassoonTracker.getSong();
          this.patternLength = this.song.patterns[this.song.patternTable[0]].length;
          this.songLength = this.song.length * this.patternLength;
          !this.muted && this.togglePlay();
        });
      },
      stop() {
        BassoonTracker.stop();
      },
      togglePlay() {
        BassoonTracker.togglePlay();
        if (BassoonTracker.isPlaying()) {
          this.startTime = new Date().getTime();
        }
        keyText.color = BassoonTracker.isPlaying() ? 'lightgreen' : 'red';
      }
    },
  });

  s.player.analyser.smoothingTimeConstant = 0.85;
  BassoonTracker.audio.cutOffVolume.connect(s.player.analyser);

  return s;
}
