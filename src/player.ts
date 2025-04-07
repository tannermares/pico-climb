import {
  Actor,
  clamp,
  CollisionType,
  Color,
  Engine,
  Keys,
  vec,
} from 'excalibur'
import { Girder } from './girder'

export class Player extends Actor {
  jumping = false

  constructor() {
    super({
      name: 'Player',
      pos: vec(16, 240),
      width: 16,
      height: 16,
      color: Color.ExcaliburBlue,
      collisionType: CollisionType.Active,
    })
  }

  public update(engine: Engine): void {
    if (!this.jumping && engine.input.keyboard.isHeld(Keys.X)) {
      this.vel.y -= 100
      this.jumping = true
    } else {
      this.acc.y = 300
      if (this.vel.y === 0) this.jumping = false
    }

    if (engine.input.keyboard.isHeld(Keys.Right)) {
      this.acc.x = 100
    } else if (engine.input.keyboard.isHeld(Keys.Left)) {
      this.acc.x = -100
    } else {
      this.acc.x = 0
    }
  }
}
