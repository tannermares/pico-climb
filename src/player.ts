import { Actor, CollisionType, Color, Engine, Keys, vec } from 'excalibur'
import { Girder } from './girder'

export class Player extends Actor {
  jumping = false

  constructor() {
    super({
      name: 'Player',
      pos: vec(16, 240),
      width: 16,
      height: 16,
      color: Color.White,
      collisionType: CollisionType.Active,
      z: 1,
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

    if (otherActor instanceof Girder) {
      // Resets jump when hitting floor & stops sticky ceiling
      if (this.vel.y >= 0 && this.pos.y < otherActor.pos.y) {
        this.jumping = false
      }

      // Check if we're walking into the side of a girder
      const playerBounds = this.collider.bounds
      const girderBounds = otherActor.collider.bounds

      const playerIsToLeft = playerBounds.right <= girderBounds.left + 2
      const playerIsToRight = playerBounds.left >= girderBounds.right - 2

      const above = this.pos.y + 8 > otherActor.pos.y - 4

      const isSideCollision =
        (playerIsToLeft || playerIsToRight) && !this.jumping && above

      if (isSideCollision) {
        this.pos.y -= 1 // Bump up a pixel
      }
    }
  }
}
