import {
  Actor,
  Animation,
  CollisionType,
  Engine,
  SpriteSheet,
  vec,
} from 'excalibur'

import { Resources } from './resources'
import { Level } from './level'

export class DrumThrower extends Actor {
  static spriteSheet = SpriteSheet.fromImageSource({
    image: Resources.SpriteSheet,
    grid: {
      rows: 1,
      columns: 4,
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
  static sprite = DrumThrower.spriteSheet.getSprite(2, 0)
  static animation = Animation.fromSpriteSheetCoordinates({
    spriteSheet: DrumThrower.spriteSheet,
    frameCoordinates: [
      { x: 2, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 0 },
      { x: 0, y: 0 },
      { x: 3, y: 0 },
      { x: 1, y: 0 },
    ],
    durationPerFrame: 500,
  })

  constructor(private level: Level) {
    super({
      name: 'DrumThrower',
      width: 16,
      height: 24,
      pos: vec(30, 72),
      collisionType: CollisionType.PreventCollision,
      z: 1,
    })
  }

  override onInitialize(_engine: Engine): void {
    this.graphics.add('sprite', DrumThrower.sprite)
    this.graphics.add('animation', DrumThrower.animation)
    this.graphics.use('sprite')
  }

  start() {
    // this.graphics.use('animation')
    this.level.engine.clock.schedule(() => this.graphics.use('animation'), 500)
  }

  stop() {
    this.graphics.use('sprite')
  }

  reset() {
    DrumThrower.animation.reset()
  }
}
