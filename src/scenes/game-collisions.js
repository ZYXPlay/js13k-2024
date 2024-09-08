import { collides } from "../engine/utils";

export function checkCollisions(source, targets) {
  if (!source.isAlive()) return;
  targets.forEach(target => {
    if (source.name === 'enemy' && target.name === 'enemy') return;

    if (target.isAlive() && !source.imune && !target.imune && collides(target, source)) {
      if (source.name == 'ship-bullet' && !target.imune) {
        source.ttl = 0;
        target.hit(1);
      }

      if (source.name == 'ship' && (target.name == 'asteroid' || target.name == 'boss')) {
        source.die();
        source.ttl = 0;
        target.hit(5);
      }

      if (source.name == 'ship' && target.name == 'enemy') {
        target.die();
        target.ttl = 0;
        source.hit(50);
      }

      if (source.name == 'ship' && target.name == 'enemy-bullet') {
        target.ttl = 0;
        source.hit(10);
      }

      if (source.name == 'ship' && target.name == 'powerup' && !target.taken) {
        target.die();
        source.powerUp(target);
      }
    }
  });
}
