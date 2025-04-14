import { Actor, CollisionType, Engine, SpriteSheet, Vector } from 'excalibur'

import { Resources } from './resources'

export class DrumThrower extends Actor {
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
        x: 96,
        y: 80,
      },
    },
  })
  static pickup = DrumThrower.spriteSheet.getSprite(0, 0)
  static throw = DrumThrower.spriteSheet.getSprite(1, 0)

  constructor(pos: Vector) {
    super({
      name: 'DrumThrower',
      width: 16,
      height: 24,
      pos,
      collisionType: CollisionType.PreventCollision,
      z: 1,
    })
  }

  override onInitialize(_engine: Engine): void {
    this.graphics.add('pickup', DrumThrower.pickup)
    this.graphics.add('throw', DrumThrower.throw)
    this.graphics.use('pickup')
  }
}
