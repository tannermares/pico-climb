import {
  Actor,
  Animation,
  AnimationStrategy,
  clamp,
  CollisionType,
  Color,
  Engine,
  range,
  SpriteSheet,
  vec,
} from 'excalibur'
import { Config } from './config'
import { colors } from './colors'
import { Resources } from './resources'

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
  static rollAnimation = Animation.fromSpriteSheet(
    Drum.spriteSheet,
    [0, 1, 2, 3],
    200,
    AnimationStrategy.Loop
  )

  static rollDownAnimation = Animation.fromSpriteSheet(
    Drum.spriteSheet,
    [4, 5],
    200,
    AnimationStrategy.Loop
  )

  constructor() {
    super({
      name: 'Drum',
      pos: vec(20, 79),
      height: 10,
      width: 12,
      collisionType: CollisionType.Active,
      collisionGroup: Config.colliders.DrumsCanCollideWith,
      color: Color.fromHex(colors.orange1),
      vel: vec(65, 0),
    })

    this.on('exitviewport', () => this.kill())
  }
  override onInitialize(engine: Engine): void {
    this.graphics.add('roll', Drum.rollAnimation)
    this.graphics.add('rollDown', Drum.rollDownAnimation)
    this.graphics.use('roll')
  }

  override onPostUpdate(_engine: Engine): void {
    this.vel.x = clamp(this.vel.x, -65, 65)

    if (this.vel.x < 0) {
      this.graphics.flipHorizontal = true
    } else {
      this.graphics.flipHorizontal = false
    }
  }
}
