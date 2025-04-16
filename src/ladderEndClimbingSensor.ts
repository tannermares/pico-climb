import { Actor, Collider, CollisionType, vec } from 'excalibur'

import { Config } from './config'
import { Ladder } from './ladder'
import { Player } from './player'

export class LadderEndClimbingSensor extends Actor {
  constructor(ladder: Ladder) {
    super({
      name: 'LadderEndClimbingSensor',
      width: 8,
      height: 1,
      pos: vec(0, -ladder.height / 2 - 2),
      collisionType: CollisionType.Passive,
      collisionGroup: Config.colliders.LaddersCanCollideWith,
    })
  }

  override onCollisionStart(_self: Collider, other: Collider): void {
    if (
      other.owner.parent instanceof Player &&
      other.owner.name === 'PlayerLadderSensor' &&
      !other.owner.parent.climbingDown
    ) {
      other.owner.parent.climbingUp = true
      other.owner.parent.bodySensor.graphics.use('endClimbUp')
      Player.endClimbUpAnimation.reset()
    }
  }

  override onCollisionEnd(_self: Collider, other: Collider): void {
    if (
      other.owner.parent instanceof Player &&
      other.owner.name === 'PlayerLadderSensor' &&
      other.owner.parent.climbingDown
    ) {
      other.owner.parent.climbingDown = false
    }
  }
}
