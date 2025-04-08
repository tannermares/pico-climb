import {
  Actor,
  CollisionContact,
  CollisionGroupManager,
  CollisionType,
  Color,
  Side,
  Vector,
} from 'excalibur'
import { Player } from './player'

export const GirderCollisionGroup = CollisionGroupManager.create('girder')

export class Girder extends Actor {
  constructor(pos: Vector) {
    super({
      name: 'Girder',
      pos,
      width: 16,
      height: 8,
      color: Color.Red,
      collisionType: CollisionType.Fixed,
      collisionGroup: GirderCollisionGroup,
      z: 1,
    })
  }

  // override onPreCollisionResolve(
  //   self: ex.Collider,
  //   other: ex.Collider,
  //   side: Side,
  //   contact: CollisionContact
  // ): void {
  //   if (other.owner instanceof Player) {
  //     const otherPosDelta = other.owner.pos.sub(other.owner.oldPos)
  //     const otherWasAbovePlatform =
  //       other.bounds.bottom - otherPosDelta.y < self.bounds.top + 1

  //     if (side !== Side.Top || !otherWasAbovePlatform) {
  //       contact.cancel()
  //       return
  //     }
  //   }
  // }
}
