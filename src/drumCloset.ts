import { Actor, CollisionType, Engine, SpriteSheet, vec } from 'excalibur'

import { Resources } from './resources'

export class DrumCloset extends Actor {
  static spriteSheet = SpriteSheet.fromImageSource({
    image: Resources.SpriteSheet,
    grid: {
      rows: 1,
      columns: 1,
      spriteWidth: 24,
      spriteHeight: 40,
    },
    spacing: {
      originOffset: {
        x: 96,
        y: 16,
      },
    },
  })
  static sprite = DrumCloset.spriteSheet.getSprite(0, 0)

  constructor() {
    super({
      name: 'DrumCloset',
      width: 24,
      height: 40,
      pos: vec(20, 64),
      collisionType: CollisionType.PreventCollision,
    })
  }

  override onInitialize(engine: Engine): void {
    this.graphics.add('sprite', DrumCloset.sprite)
    this.graphics.use('sprite')
  }
}
