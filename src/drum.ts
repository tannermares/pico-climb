import { Actor, Animation, clamp, CollisionType, Engine, SpriteSheet, vec, Vector } from 'excalibur'

import { Config } from './config'
import { Resources } from './resources'
import { DrumScoreSensor } from './drumScoreSensor'
import { Level } from './level'

export class Drum extends Actor {
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
  static rollAnimation = Animation.fromSpriteSheet(Drum.spriteSheet, [0, 1, 2, 3], 200)
  static rollDownAnimation = Animation.fromSpriteSheet(Drum.spriteSheet, [4, 5], 200)

  scoreSensor = new DrumScoreSensor(this)

  constructor(private level: Level) {
    super({
      name: 'Drum',
      pos: vec(40, 79),
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

    this.addChild(this.scoreSensor)
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
    if (this.level.stopped) return

    this.body.useGravity = true
    this.body.collisionType = CollisionType.Active
  }

  stop() {
    this.acc = Vector.Zero
    this.vel = Vector.Zero
    this.body.useGravity = false
    Drum.rollAnimation.pause()
    Drum.rollDownAnimation.pause()
  }
}
