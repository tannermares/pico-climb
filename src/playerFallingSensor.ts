import { Actor, Collider, CollisionType, vec } from 'excalibur'

import { Config } from './config'
import { Girder } from './girder'
import { Player } from './player'

export class PlayerFallingSensor extends Actor {
  constructor() {
    super({
      name: 'PlayerFallingSensor',
      width: 1,
      height: 4,
      pos: vec(0, 4),
      collisionType: CollisionType.Passive,
      collisionGroup: Config.colliders.FeetCanCollideWith,
    })
  }

  override onCollisionStart(self: Collider, other: Collider): void {
    if (other.owner instanceof Girder && self.owner.parent instanceof Player) {
      self.owner.parent.girdersTouching++
    }
  }

  override onCollisionEnd(self: Collider, other: Collider): void {
    if (other.owner instanceof Girder && self.owner.parent instanceof Player) {
      self.owner.parent.girdersTouching--
      if (
        self.owner.parent.girdersTouching === 0 &&
        !(self.owner.parent.jumping || self.owner.parent.climbing)
      )
        self.owner.parent.falling = true
    }
  }
}
