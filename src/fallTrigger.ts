import { Actor, Collider, CollisionType, Vector } from 'excalibur'

import { Config } from './config'
import { Player } from './player'

export class FallTrigger extends Actor {
  constructor(pos: Vector) {
    super({
      height: 1,
      width: 16,
      pos,
      collisionType: CollisionType.Passive,
      collisionGroup: Config.colliders.WallGroup,
    })
  }

  override onCollisionStart(_self: Collider, other: Collider): void {
    if (other.owner instanceof Player && other.owner.name === 'PlayerFeet')
      other.owner.falling = true
  }
}
