import { Actor, CollisionType, Engine, SpriteSheet, Vector } from 'excalibur'

import { Resources } from './resources'

export class Score extends Actor {
  static spriteSheet = SpriteSheet.fromImageSource({
    image: Resources.SpriteSheet,
    grid: {
      rows: 1,
      columns: 5,
      spriteWidth: 16,
      spriteHeight: 16,
    },
    spacing: {
      originOffset: {
        x: 0,
        y: 160,
      },
    },
  })
  static sprite100 = Score.spriteSheet.getSprite(0, 0)
  static sprite300 = Score.spriteSheet.getSprite(2, 0)
  static sprite500 = Score.spriteSheet.getSprite(3, 0)

  constructor(
    pos: Vector,
    private score: number,
  ) {
    super({
      name: 'Score',
      width: 16,
      height: 16,
      pos,
      collisionType: CollisionType.PreventCollision,
    })
  }

  override onInitialize(engine: Engine): void {
    this.graphics.add('sprite100', Score.sprite100)
    this.graphics.add('sprite300', Score.sprite300)
    this.graphics.add('sprite500', Score.sprite500)

    if (this.score === 100) {
      this.graphics.use('sprite100')
    } else if (this.score === 300) {
      this.graphics.use('sprite300')
    } else {
      this.graphics.use('sprite500')
    }

    engine.clock.schedule(() => this.kill(), 1500)
  }
}
