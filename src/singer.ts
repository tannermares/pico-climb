import {
  Actor,
  Animation,
  AnimationStrategy,
  CollisionType,
  Engine,
  SpriteSheet,
  Vector,
} from 'excalibur'

import { Resources } from './resources'

export class Singer extends Actor {
  static spriteSheet = SpriteSheet.fromImageSource({
    image: Resources.SpriteSheet,
    grid: {
      rows: 1,
      columns: 2,
      spriteWidth: 16,
      spriteHeight: 24,
    },
    spacing: {
      originOffset: {
        x: 56,
        y: 104,
      },
    },
  })
  static sprite = Singer.spriteSheet.getSprite(0, 0)
  static animation = Animation.fromSpriteSheet(
    Singer.spriteSheet,
    [0, 1],
    200,
    AnimationStrategy.Loop
  )

  constructor(pos: Vector) {
    super({
      name: 'Singer',
      width: 16,
      height: 24,
      pos,
      collisionType: CollisionType.PreventCollision,
    })
  }

  override onInitialize(_engine: Engine): void {
    this.graphics.add('sprite', Singer.sprite)
    this.graphics.add('animation', Singer.animation)
    this.graphics.use('animation')
  }
}
