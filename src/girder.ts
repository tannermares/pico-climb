import { Actor, Collider, CollisionType, Color, Side, Vector } from 'excalibur'
import { Player } from './player'
import { Config } from './config'

export class Girder extends Actor {
  constructor(pos: Vector, width = 16) {
    super({
      name: 'Girder',
      pos,
      width,
      height: 8,
      color: Color.Red,
      collisionType: CollisionType.Fixed,
      collisionGroup: Config.colliders.GirderGroup,
      z: 1,
    })
  }

  override onPreCollisionResolve(
    self: Collider,
    other: Collider,
    side: Side
  ): void {
    if (other.owner instanceof Player) {
      const unLevelGround = Math.round(other.bounds.bottom) > self.bounds.top
      const isSideCollision = side === Side.Right || side === Side.Left

      if (
        unLevelGround &&
        isSideCollision &&
        !other.owner.jumping &&
        !other.owner.climbing
      ) {
        other.owner.pos.y -= 1
      }
    }
  }

  override onCollisionStart(
    _self: Collider,
    other: Collider,
    side: Side
  ): void {
    if (
      other.owner instanceof Player &&
      other.owner.vel.y === 0 &&
      side === Side.Top
    ) {
      other.owner.jumping = false
    }
  }
}
