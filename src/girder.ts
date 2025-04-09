import {
  Actor,
  Collider,
  CollisionContact,
  CollisionType,
  Color,
  Side,
  Vector,
} from 'excalibur'
import { Player } from './player'

export class Girder extends Actor {
  constructor(pos: Vector) {
    super({
      name: 'Girder',
      pos,
      width: 16,
      height: 8,
      color: Color.Red,
      collisionType: CollisionType.Fixed,
      // z: 1,
    })
  }

  override onPreCollisionResolve(
    self: ex.Collider,
    other: ex.Collider,
    side: Side,
    contact: CollisionContact
  ): void {
    if (other.owner instanceof Player) {
      const otherPosDelta = other.owner.pos.sub(other.owner.oldPos)
      const otherWasAbovePlatform =
        other.bounds.bottom - otherPosDelta.y < self.bounds.top + 1
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

      if (side !== Side.Top || !otherWasAbovePlatform || other.owner.climbing) {
        contact.cancel()
        return
      }
    }
  }

  override onCollisionStart(
    _self: Collider,
    other: Collider,
    _side: Side
  ): void {
    if (other.owner instanceof Player) {
      other.owner.jumping = false
      other.owner.stopClimbing()
    }
  }
}
