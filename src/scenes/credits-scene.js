import { scene } from "../engine/scene";
import { text } from "../engine/text";
import { delay } from "../engine/utils";
import { emit } from "../engine/events";
import { onKey } from "../engine/keyboard";
import starfield from "../entities/starfield";

export default function creditsScene() {
  onKey(['enter'], () => {
    emit('change-scene', 'menu', { reset: false });
  });

  const starPool = starfield(1);

  const creditsText = text({
    x: 128,
    y: 240,
    text: 'GAME BY\nMARCO FERNANDES\n\n\nGRAPHICS BY\nKENNEY.NL\n\n\nMUSIC\n\nSTART SCREEN\nDEPP\n\nGAME\nJUKEBOX\n\nGAME OVER\nDEPP\n\n\nSOUND EFFECTS\n\nZAPSPLAT.COM\n\n\nTHANKS FOR PLAYING!',
    color: 'white',
    align: 'center',
    dy: -0.5,
  });

  return scene({
    id: 'loading',
    frame: 0,
    children: [starPool, creditsText],
  });
};