import { Actor, CollisionType, Color, Engine, SpriteSheet, vec } from 'excalibur'

import { colors } from './colors'
import { Resources } from './resources'

export class BonusLabel extends Actor {
  static spriteSheet = SpriteSheet.fromImageSource({
    image: Resources.SpriteSheet,
    grid: {
      rows: 1,
      columns: 1,
      spriteWidth: 48,
      spriteHeight: 24,
    },
    spacing: {
      originOffset: {
        x: 32,
        y: 32,
      },
    },
  })
  static sprite = BonusLabel.spriteSheet.getSprite(0, 0)

  constructor() {
    super({
      name: 'BonusLabel',
      width: 48,
      height: 24,
      color: Color.fromHex(colors.orange1),
      pos: vec(189, 45),
      collisionType: CollisionType.PreventCollision,
    })
  }

  override onInitialize(engine: Engine): void {
    this.graphics.add('sprite', BonusLabel.sprite)
    this.graphics.use('sprite')
  }
}
