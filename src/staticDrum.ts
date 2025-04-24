import { Actor, CollisionType, Color, Engine, SpriteSheet, vec, Vector } from 'excalibur'

import { colors } from './colors'
import { Resources } from './resources'

export class StaticDrum extends Actor {
  static spriteSheet = SpriteSheet.fromImageSource({
    image: Resources.SpriteSheet,
    grid: {
      rows: 16,
      columns: 16,
      spriteWidth: 16,
      spriteHeight: 16,
    },
  })
  static sprite = StaticDrum.spriteSheet.getSprite(5, 1)

  constructor(pos: Vector) {
    super({
      name: 'StaticDrum',
      width: 10,
      height: 12,
      color: Color.fromHex(colors.orange1),
      pos,
      collisionType: CollisionType.PreventCollision,
      anchor: vec(0.5, 0.8125),
      rotation: Math.PI / 2,
    })
  }

  override onInitialize(engine: Engine): void {
    this.graphics.add('sprite', StaticDrum.sprite)
    this.graphics.use('sprite')
  }
}
