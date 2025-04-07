import {
  Actor,
  clamp,
  Collider,
  CollisionContact,
  CollisionStartEvent,
  CollisionType,
  Color,
  Engine,
  Keys,
  Side,
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

  public onPostUpdate(engine: Engine): void {
    const input = engine.input.keyboard

    const speed = 50
    const jumpStrength = 200

    if (input.isHeld(Keys.Right)) {
      this.vel.x = speed
    } else if (input.isHeld(Keys.Left)) {
      this.vel.x = -speed
    } else {
      this.vel.x = 0
    }

    if (!this.jumping && input.wasPressed(Keys.X)) {
      this.vel.y = -jumpStrength
      this.jumping = true
    }
  }

  override onCollisionStart(_self: ex.Collider, other: ex.Collider): void {
    const otherActor = other.owner

    if (
      otherActor instanceof Girder &&
      this.vel.y >= 0 &&
      this.pos.y < otherActor.pos.y
    ) {
      this.jumping = false
    }
  }
}
