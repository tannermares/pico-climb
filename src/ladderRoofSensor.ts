import { Actor, Collider, CollisionType, vec } from 'excalibur'

import { Config } from './config'
import { Ladder } from './ladder'
import { Player } from './player'

export class LadderRoofSensor extends Actor {
  constructor(ladder: Ladder) {
    super({
      name: 'LadderRoofSensor',
      width: 3,
      height: 2,
      pos: vec(0, -ladder.height / 2 - 10),
      collisionType: CollisionType.Passive,
      collisionGroup: Config.colliders.LaddersCanCollideWith,
    })
  }

  override onCollisionStart(_self: Collider, other: Collider): void {
    if (other.owner.parent instanceof Player && other.owner.name === 'PlayerLadderSensor') {
      if (other.owner.parent.climbing) other.owner.parent.stopClimbing()

      other.owner.parent.canClimbUp = false
      other.owner.parent.canClimbDown = true
    }
  }

  override onCollisionEnd(_self: Collider, other: Collider): void {
    if (other.owner.parent instanceof Player && other.owner.name === 'PlayerLadderSensor') {
      other.owner.parent.canClimbDown = false
    }
  }
}
