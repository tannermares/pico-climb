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
      rows: 16,
      columns: 16,
      spriteWidth: 16,
      spriteHeight: 16,
    },
  })
  static rollAnimation = Animation.fromSpriteSheetCoordinates({
    spriteSheet: Drum.spriteSheet,
    durationPerFrame: 200,
    frameCoordinates: [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
    ],
  })

  static rollDownAnimation = Animation.fromSpriteSheetCoordinates({
    spriteSheet: Drum.spriteSheet,
    durationPerFrame: 200,
    frameCoordinates: [
      { x: 4, y: 1 },
      { x: 5, y: 1 },
    ],
  })

  constructor() {
    super({
      name: 'Drum',
      pos: vec(50, 79),
      height: 10,
      width: 12,
      collisionType: CollisionType.Active,
      collisionGroup: Config.colliders.DrumsCanCollideWith,
      color: Color.fromHex(colors.orange1),
      vel: vec(65, 0),
      anchor: vec(0.5, 0.8125),
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
