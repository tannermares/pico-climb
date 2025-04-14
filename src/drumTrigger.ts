import {
  Actor,
  Collider,
  CollisionType,
  Color,
  Random,
  Vector,
} from 'excalibur'

import { Drum } from './drum'
import { Config } from './config'

export class DrumTrigger extends Actor {
  constructor(pos: Vector, private type: string, private random: Random) {
    super({
      height: type === 'down' ? 8 : 1,
      width: type === 'down' ? 1 : 8,
      pos,
      collisionType: CollisionType.Passive,
      collisionGroup: Config.colliders.DrumSensorGroup,
      color: Color.Yellow,
    })
  }

  override onCollisionStart(_self: Collider, other: Collider): void {
    if (other.owner instanceof Drum) {
      if (this.type === 'down') {
        if (this.random.bool(0.25)) {
          other.owner.rollDown()

          this.scene?.engine.clock.schedule(() => {
            if (other.owner instanceof Drum) other.owner.continueRolling()
          }, 300)
        }
      } else {
        other.owner.acc = Vector.Zero
        other.owner.vel.y = 0
        other.owner.graphics.use('roll')

        if (this.type === 'right') {
          other.owner.vel.x = 65
        } else {
          other.owner.vel.x = -65
        }
      }
    }
  }
}
