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

export class Guitarist extends Actor {
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
        y: 80,
      },
    },
  })
  static sprite = Guitarist.spriteSheet.getSprite(0, 0)
  static animation = Animation.fromSpriteSheet(
    Guitarist.spriteSheet,
    [0, 1],
    200,
    AnimationStrategy.Loop
  )

  constructor(pos: Vector) {
    super({
      name: 'Guitarist',
      width: 16,
      height: 24,
      pos,
      collisionType: CollisionType.PreventCollision,
    })
  }

  override onInitialize(_engine: Engine): void {
    this.graphics.add('sprite', Guitarist.sprite)
    this.graphics.add('animation', Guitarist.animation)
    this.graphics.use('animation')
  }
}
