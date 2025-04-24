import { Actor, CollisionType, Engine, SpriteSheet, Timer, vec } from 'excalibur'

import { Resources } from './resources'
import { Level } from './level'
import { Drum } from './drum'

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
  static grabSprite = DrumThrower.spriteSheet.getSprite(0, 0)
  static holdSprite = DrumThrower.spriteSheet.getSprite(3, 0)
  static throwSprite = DrumThrower.spriteSheet.getSprite(1, 0)

  timer = new Timer({
    interval: 500,
    repeats: true,
    action: () => this.updateStuff(),
  })
  currentFrameIndex = 4
  frames = ['grab', 'hold', 'throw', 'sprite', 'sprite', 'sprite']

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
    this.graphics.add('grab', DrumThrower.grabSprite)
    this.graphics.add('hold', DrumThrower.holdSprite)
    this.graphics.add('throw', DrumThrower.throwSprite)
    this.graphics.use(this.frames[this.currentFrameIndex])

    this.level.add(this.timer)
  }

  updateStuff() {
    this.currentFrameIndex = (this.currentFrameIndex + 1) % this.frames.length

    this.graphics.use(this.frames[this.currentFrameIndex])

    if (this.currentFrameIndex === 1) {
      this.level.throwingDrum.graphics.isVisible = false
    } else if (this.currentFrameIndex === 2) {
      this.level.add(new Drum(this.level))
    } else if (this.currentFrameIndex === 4) {
      this.level.throwingDrum.graphics.isVisible = true
    }
  }

  start() {
    Drum.rollAnimation.play()
    Drum.rollDownAnimation.play()
    this.level.engine.clock.schedule(() => this.timer.start(), 1000)
  }

  stop() {
    this.timer.stop()
    this.graphics.use('sprite')

    this.level.actors.forEach(actor => {
      if (actor instanceof Drum) actor.stop()
    })
  }

  reset() {
    this.timer.stop()

    this.level.actors.forEach(actor => {
      if (actor instanceof Drum) actor.kill()
    })
  }
}
