import { Actor, CollisionType, Engine, SpriteSheet, vec } from 'excalibur'

import { Resources } from './resources'

export class Logo extends Actor {
  static spriteSheet = SpriteSheet.fromImageSource({
    image: Resources.SpriteSheet,
    grid: {
      rows: 1,
      columns: 1,
      spriteWidth: 160,
      spriteHeight: 96,
    },
    spacing: {
      originOffset: {
        x: 96,
        y: 160,
      },
    },
  })
  static sprite = Logo.spriteSheet.getSprite(0, 0)

  constructor() {
    super({
      name: 'Logo',
      width: 160,
      height: 96,
      pos: vec(112, 96),
      collisionType: CollisionType.PreventCollision,
    })
  }

  override onInitialize(_engine: Engine): void {
    this.graphics.add('sprite', Logo.sprite)
    this.graphics.use('sprite')
  }
}
