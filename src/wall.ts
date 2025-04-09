import { Actor, Collider, CollisionType, EdgeCollider, Vector } from 'excalibur'
import { Config } from './config'
import { Drum } from './drum'

export class Wall extends Actor {
  constructor(pos: Vector) {
    super({
      name: 'Wall',
      width: 1,
      height: 256,
      pos,
      // collider: new EdgeCollider({ begin, end }),
      collisionType: CollisionType.Fixed,
      // collisionGroup: Config.colliders.WallsCollideWith,
    })
  }

  override onPreCollisionResolve(other: Collider, self: Collider): void {
    if (self.owner instanceof Drum) {
      self.owner.vel.x = -self.owner.vel.x
    }
  }
}
