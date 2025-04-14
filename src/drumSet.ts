import { Actor, CollisionType, Engine, SpriteSheet, Vector } from 'excalibur'

import { Resources } from './resources'

export class DrumSet extends Actor {
  static spriteSheet = SpriteSheet.fromImageSource({
    image: Resources.SpriteSheet,
    grid: {
      rows: 1,
      columns: 1,
      spriteWidth: 24,
      spriteHeight: 16,
    },
    spacing: {
      originOffset: {
        x: 64,
        y: 64,
      },
    },
  })
  static sprite = DrumSet.spriteSheet.getSprite(0, 0)

  constructor(pos: Vector) {
    super({
      name: 'Guitarist',
      width: 16,
      height: 24,
      pos,
      collisionType: CollisionType.PreventCollision,
      z: 1,
    })
  }

  override onInitialize(_engine: Engine): void {
    this.graphics.add('sprite', DrumSet.sprite)
    this.graphics.use('sprite')
  }
}
