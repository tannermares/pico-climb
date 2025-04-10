import { Actor, Collider, CollisionType, Color, Vector } from 'excalibur'

import { Drum } from './drum'

export class DrumSensor extends Actor {
  constructor(pos: Vector) {
    super({
      height: 16,
      width: 1,
      pos,
      color: Color.Yellow,
      collisionType: CollisionType.Passive,
    })
  }

  override onCollisionStart(_self: Collider, other: Collider): void {
    if (other.owner instanceof Drum) {
      const sign = Math.sign(other.owner.vel.x)
      other.owner.acc.x = 60 * sign * -1
    }
  }
}
