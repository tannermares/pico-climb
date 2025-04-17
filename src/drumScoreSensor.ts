import { Actor, clamp, Collider, CollisionType, vec } from 'excalibur'

import { Config } from './config'
import { Drum } from './drum'
import { Player } from './player'

export class DrumScoreSensor extends Actor {
  constructor(drum: Drum) {
    super({
      name: 'ScoreSensor',
      width: 2,
      height: 12,
      pos: vec(0, -drum.height + 2),
      collisionType: CollisionType.Passive,
      collisionGroup: Config.colliders.DrumsCanCollideWith,
    })
  }

  override onCollisionStart(_self: Collider, other: Collider): void {
    if (
      other.owner.parent instanceof Player &&
      other.owner.parent.jumping &&
      other.owner.name === 'BodySensor'
    ) {
      if (other.owner.parent.multiplyTimer.isRunning) {
        other.owner.parent.scoreMultiplier += 2
        other.owner.parent.maxMultiplier += 2

        clamp(other.owner.parent.scoreMultiplier, 1, 5)
        clamp(other.owner.parent.maxMultiplier, 1, 5)
        other.owner.parent.multiplyTimer.reset()
      } else {
        other.owner.parent.multiplyTimer.start()
      }
    }
  }
}
