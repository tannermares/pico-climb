import { Actor, CollisionType, Engine, ImageWrapping, SpriteSheet, Vector } from 'excalibur'

import { Resources } from './resources'
import { LadderFloorSensor } from './ladderFloorSensor'
import { LadderWallSensor } from './ladderWallSensor'
import { LadderRoofSensor } from './ladderRoofSensor'
import { LadderEndClimbingSensor } from './ladderEndClimbingSensor'

export class Ladder extends Actor {
  static spriteSheet = SpriteSheet.fromImageSource({
    image: Resources.SpriteSheet,
    grid: {
      rows: 32,
      columns: 32,
      spriteWidth: 8,
      spriteHeight: 8,
    },
  })
  sprite = (height: number) =>
    Ladder.spriteSheet.getTiledSprite(1, 4, {
      width: 8,
      height,
      wrapping: {
        x: ImageWrapping.Clamp,
        y: ImageWrapping.Repeat,
      },
    })

  constructor(
    pos: Vector,
    height: number,
    private sensors = true,
    private broken = false,
  ) {
    super({
      name: 'Ladder',
      pos,
      width: 8,
      height,
      collisionType: CollisionType.PreventCollision,
    })
  }

  override onInitialize(_engine: Engine): void {
    this.graphics.add('sprite', this.sprite(this.height))
    this.graphics.use('sprite')

    if (!this.sensors) return

    this.addChild(new LadderFloorSensor(this))

    if (this.broken) {
      this.addChild(new LadderWallSensor(this))
    } else {
      this.addChild(new LadderEndClimbingSensor(this))
      this.addChild(new LadderRoofSensor(this))
    }
  }
}
