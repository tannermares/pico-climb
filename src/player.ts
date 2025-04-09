import { Actor, CollisionType, Color, Engine, Keys, vec } from 'excalibur'
import { Ladder } from './ladder'

export class Player extends Actor {
  climbing = false
  jumping = false

  constructor() {
    super({
      name: 'Player',
      pos: vec(16, 240),
      width: 16,
      height: 16,
      color: Color.White,
      collisionType: CollisionType.Active,
      z: 2,
    })
  }

  // override onInitialize(engine: Engine): void {
  //   const footSensor = new Actor({
  //     name: 'FootSensor',
  //     width: 16,
  //     height: 2,
  //     pos: vec(0, this.height / 2 - 1),
  //     collisionType: CollisionType.Passive,
  //     collisionGroup: feetCanCollideWith,
  //     color: Color.Brown,
  //   })

  //   this.addChild(footSensor)
  // }

  override onPreUpdate(engine: Engine): void {
    const keys = engine.input.keyboard

    const speed = 50
    const jumpStrength = 100

    if (this.climbing) {
      this.vel.x = 0

      if (keys.isHeld(Keys.Up)) {
        this.vel.y = -speed
      } else if (keys.isHeld(Keys.Down)) {
        this.vel.y = speed
      } else {
        this.vel.y = 0
      }
    } else {
      // Normal Movement
      if (keys.isHeld(Keys.Right)) {
        this.vel.x = speed
      } else if (keys.isHeld(Keys.Left)) {
        this.vel.x = -speed
      } else {
        this.vel.x = 0
      }

      // Jump
      if (
        !this.climbing &&
        !this.jumping &&
        this.vel.y === 0 &&
        keys.wasPressed(Keys.X)
      ) {
        this.vel.y = -jumpStrength
        this.jumping = true
      }

      // Try to climb up
      if (!this.jumping && keys.wasPressed(Keys.Up)) {
        if (this.canClimb(engine)) this.startClimbing()
      }

      // Try to climb down
      if (!this.jumping && keys.wasPressed(Keys.Down)) {
        if (this.canClimb(engine, true)) this.startClimbing()
      }
    }
  }

  canClimb(engine: Engine, requireTop = false): boolean {
    const playerBounds = this.collider.bounds
    const margin = 2

    const ladders = engine.currentScene.actors.filter(
      (actor): actor is Ladder => actor instanceof Ladder
    )

    return (
      ladders.some((ladder) => {
        const ladderBounds = ladder.collider.bounds

        const horizontallyAligned =
          playerBounds.center.x > ladderBounds.left + margin &&
          playerBounds.center.x < ladderBounds.right - margin

        if (!horizontallyAligned) return false

        const verticallyOverlapping =
          playerBounds.bottom >= ladderBounds.top &&
          playerBounds.top <= ladderBounds.bottom

        if (!verticallyOverlapping) return false

        if (requireTop) {
          return Math.abs(playerBounds.bottom - ladderBounds.top) <= 2
        }

        return true
      }) ?? null
    )
  }

  startClimbing() {
    this.climbing = true
    this.body.useGravity = false
  }

  stopClimbing() {
    this.climbing = false
    this.body.useGravity = true
  }
}
