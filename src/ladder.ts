import { Actor, Collider, CollisionType, Color, Side, Vector } from 'excalibur'
import { Player } from './player'

export class Ladder extends Actor {
  constructor(pos: Vector, height: number) {
    super({
      name: 'Ladder',
      pos,
      width: 8,
      height,
      color: Color.Azure,
      collisionType: CollisionType.Passive,
    })
  }

  override onCollisionEnd(self: Collider, other: Collider): void {
    if (other.owner instanceof Player && other.owner.climbing) {
      other.owner.stopClimbing()
    }
  }
}
