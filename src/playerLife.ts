import { Actor, CollisionType, Engine, SpriteSheet, Vector } from 'excalibur'

import { Resources } from './resources'

export class PlayerLife extends Actor {
  static spriteSheet = SpriteSheet.fromImageSource({
    image: Resources.SpriteSheet,
    grid: {
      rows: 1,
      columns: 1,
      spriteWidth: 8,
      spriteHeight: 8,
    },
    spacing: {
      originOffset: {
        x: 0,
        y: 32,
      },
    },
  })
  static sprite = PlayerLife.spriteSheet.getSprite(0, 0)

  constructor(pos: Vector) {
    super({
      name: 'PlayerLife',
      height: 8,
      width: 8,
      pos,
      collisionType: CollisionType.PreventCollision,
    })
  }

  override onInitialize(engine: Engine): void {
    this.graphics.add('sprite', PlayerLife.sprite)
    this.graphics.use('sprite')
  }
}
