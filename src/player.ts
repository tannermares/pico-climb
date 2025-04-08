import {
  Actor,
  CollisionGroup,
  CollisionGroupManager,
  CollisionType,
  Color,
  Engine,
  Keys,
  Side,
  vec,
} from 'excalibur'
import { Girder, GirderCollisionGroup } from './girder'
import { Ladder, LadderCollisionGroup } from './ladder'

export const playerCollisionGroup = CollisionGroupManager.create('player')
const feetCanCollideWith = CollisionGroup.collidesWith([GirderCollisionGroup])
const laddersCanCollideWith = CollisionGroup.collidesWith([
  LadderCollisionGroup,
])

export class Player extends Actor {
  canClimb = false
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
      collisionGroup: playerCollisionGroup,
      z: 2,
    })
  }

  override onInitialize(engine: ex.Engine): void {
    const footSensor = new Actor({
      name: 'FootSensor',
      width: 12,
      height: 2,
      pos: vec(0, this.height / 2 - 1),
      collisionType: CollisionType.Passive,
      collisionGroup: feetCanCollideWith,
      color: Color.Blue,
      z: this.z,
    })

    footSensor.on('collisionstart', ({ self, other, side }) => {
      if (other.owner instanceof Girder) {
        // if (this.vel.y === 0) {
        this.jumping = false
        this.stopClimbing()
        // }

        const otherIsAbove = self.bounds.bottom > other.bounds.top
        const isSideCollision = side === Side.Right || side === Side.Left
        if (
          otherIsAbove &&
          isSideCollision &&
          !this.jumping &&
          !this.climbing
        ) {
          this.pos.y -= 1
        }
      }
    })

    this.addChild(footSensor)

    const ladderSensor = new Actor({
      name: 'LadderSensor',
      width: 4,
      height: 12,
      pos: vec(0, 0),
      collisionType: CollisionType.Passive,
      collisionGroup: laddersCanCollideWith,
      color: Color.Yellow,
      z: this.z,
    })

    ladderSensor.on('collisionstart', (evt) => {
      if (evt.other instanceof Ladder) this.canClimb = true
    })

    ladderSensor.on('collisionend', (evt) => {
      if (evt.other instanceof Ladder) this.canClimb = false
    })

    this.addChild(ladderSensor)
  }

  override onPreUpdate(engine: Engine): void {
    const keys = engine.input.keyboard

    const speed = 50
    const jumpStrength = 200

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
      if (!this.climbing && !this.jumping && keys.wasPressed(Keys.X)) {
        this.vel.y = -jumpStrength
        this.jumping = true
      }

      // Try to climb
      if (
        !this.jumping &&
        this.canClimb &&
        (keys.wasPressed(Keys.Up) || keys.wasPressed(Keys.Down))
      ) {
        this.startClimbing()
      }
    }
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
