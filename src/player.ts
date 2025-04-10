import {
  Actor,
  CollisionType,
  Color,
  Engine,
  Keys,
  vec,
  Vector,
} from 'excalibur'
import { Config } from './config'
import { Drum } from './drum'

export class Player extends Actor {
  lives = 3
  canClimbUp = false
  canClimbDown = false
  climbing = false
  jumping = false

  constructor() {
    super({
      name: 'PlayerFeet',
      pos: vec(16, 248),
      width: 8,
      height: 1,
      color: Color.Brown,
      collisionType: CollisionType.Active,
      collisionGroup: Config.colliders.FeetCanCollideWith,
      z: 2,
    })
  }

  override onInitialize(engine: Engine): void {
    const bodySensor = new Actor({
      name: 'BodySensor',
      width: 8,
      height: 16,
      pos: vec(0, -16 / 2),
      collisionType: CollisionType.Passive,
      collisionGroup: Config.colliders.PlayersCanCollideWith,
      color: Color.White,
      z: -1,
    })

    bodySensor.on('collisionstart', ({ other }) => {
      if (other.owner instanceof Drum) {
        if (this.lives === 1) {
          this.scene?.engine.goToScene('gameOver')
        } else {
          this.lives -= 1
          this.scene?.engine.goToScene('intro')
          this.scene?.actors.forEach((actor) => {
            if (actor instanceof Drum) actor.kill()
          })
          this.reset()
        }
      }
    })

    this.addChild(bodySensor)

    const ladderSensor = new Actor({
      name: 'ladderSensor',
      width: 3,
      height: 1,
      collisionType: CollisionType.Passive,
      collisionGroup: Config.colliders.LaddersSensorCanCollideWith,
      color: Color.Yellow,
      z: 1,
    })

    this.addChild(ladderSensor)
  }

  override onPreUpdate(engine: Engine): void {
    const keys = engine.input.keyboard

    const speed = 50
    const jumpStrength = 50

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
      if (!this.jumping && this.canClimbUp && keys.wasPressed(Keys.Up)) {
        this.startClimbing()
      }

      // Try to climb down
      if (!this.jumping && this.canClimbDown && keys.wasPressed(Keys.Down)) {
        this.startClimbing()
      }
    }
  }

  startClimbing() {
    this.climbing = true
    this.body.useGravity = false
    this.body.collisionType = CollisionType.PreventCollision
  }

  stopClimbing() {
    this.climbing = false
    this.vel = Vector.Zero
    this.body.useGravity = true
    this.body.collisionType = CollisionType.Active
  }

  reset() {
    this.pos = vec(16, 248)
  }
}
