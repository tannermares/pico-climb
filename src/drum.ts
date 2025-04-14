import {
  Actor,
  Animation,
  clamp,
  CollisionType,
  Engine,
  SpriteSheet,
  vec,
  Vector,
} from 'excalibur'
import { Config } from './config'

import { Resources } from './resources'
import { Player } from './player'
import { Level } from './level'

export class Drum extends Actor {
  static couldMultiply = false
  static startMultiplier = false
  static scoreMultiplier = 1
  static maxMultiplier = 1
  static baseScore = 100

  static spriteSheet = SpriteSheet.fromImageSource({
    image: Resources.SpriteSheet,
    grid: {
      rows: 1,
      columns: 6,
      spriteWidth: 16,
      spriteHeight: 10,
    },
    spacing: {
      originOffset: {
        x: 0,
        y: 22,
      },
    },
  })
  static sprite = this.spriteSheet.getSprite(0, 0)
  static rollAnimation = Animation.fromSpriteSheet(
    Drum.spriteSheet,
    [0, 1, 2, 3],
    200
  )

  static rollDownAnimation = Animation.fromSpriteSheet(
    Drum.spriteSheet,
    [4, 5],
    200
  )

  constructor(private level: Level) {
    super({
      name: 'Drum',
      pos: vec(18, 79),
      height: 10,
      width: 12,
      collisionType: CollisionType.Active,
      collisionGroup: Config.colliders.DrumsCanCollideWith,
      vel: vec(65, 0),
    })

    this.on('exitviewport', () => this.kill())
  }

  override onInitialize(_engine: Engine): void {
    this.graphics.add('sprite', Drum.sprite)
    this.graphics.add('roll', Drum.rollAnimation)
    this.graphics.add('rollDown', Drum.rollDownAnimation)
    this.graphics.use('roll')

    const scoreSensor = new Actor({
      name: 'ScoreSensor',
      width: 2,
      height: 8,
      pos: vec(0, -this.height + 2),
      collisionType: CollisionType.Passive,
      collisionGroup: Config.colliders.DrumsCanCollideWith,
    })
    scoreSensor.on('collisionstart', ({ other }) => {
      if (
        other.owner.parent instanceof Player &&
        other.owner.parent.jumping &&
        other.owner.name === 'BodySensor'
      ) {
        if (Drum.couldMultiply) {
          Drum.scoreMultiplier += 2
          Drum.maxMultiplier += 2

          clamp(Drum.scoreMultiplier, 1, 5)
          clamp(Drum.maxMultiplier, 1, 5)
        } else {
          Drum.couldMultiply = true
        }
      }
    })
    scoreSensor.on('collisionend', ({ other }) => {
      if (
        other.owner.parent instanceof Player &&
        other.owner.parent.jumping &&
        other.owner.name === 'BodySensor'
      ) {
        if (Drum.couldMultiply && Drum.scoreMultiplier > 1) {
          Drum.scoreMultiplier -= 2

          clamp(Drum.scoreMultiplier, 1, 5)
        } else {
          this.level.incrementScore(Drum.baseScore * Drum.maxMultiplier)
          Drum.couldMultiply = false
          Drum.maxMultiplier = 1
        }
      }
    })

    this.addChild(scoreSensor)
  }

  override onPostUpdate(_engine: Engine): void {
    this.vel.x = clamp(this.vel.x, -65, 65)

    if (this.vel.x < 0) {
      this.graphics.flipHorizontal = true
    } else {
      this.graphics.flipHorizontal = false
    }
  }

  rollDown() {
    this.graphics.use('rollDown')
    this.acc = Vector.Zero
    this.vel.x = 0
    this.vel.y = 65
    this.body.useGravity = false
    this.body.collisionType = CollisionType.PreventCollision
  }

  continueRolling() {
    this.body.useGravity = true
    this.body.collisionType = CollisionType.Active
  }
}
