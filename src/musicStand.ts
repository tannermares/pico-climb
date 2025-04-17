import {
  Actor,
  Animation,
  AnimationStrategy,
  CollisionType,
  Color,
  Engine,
  SpriteSheet,
  Timer,
  vec,
} from 'excalibur'
import { Level } from './level'
import { SheetMusic } from './sheetMusic'
import { colors } from './colors'
import { Resources } from './resources'

export class MusicStand extends Actor {
  static spriteSheet = SpriteSheet.fromImageSource({
    image: Resources.SpriteSheet,
    grid: {
      rows: 1,
      columns: 3,
      spriteWidth: 16,
      spriteHeight: 16,
    },
    spacing: {
      originOffset: {
        x: 128,
        y: 32,
      },
    },
  })
  static sprite = this.spriteSheet.getSprite(0, 0)
  static animation = Animation.fromSpriteSheet(
    this.spriteSheet,
    [0, 1, 2],
    200,
    AnimationStrategy.Freeze
  )

  level: Level
  timer = new Timer({
    interval: 75000,
    repeats: true,
    action: () => this.spawnSheet(),
  })

  constructor(level: Level) {
    super({
      name: 'MusicStand',
      pos: vec(24, 240),
      width: 16,
      height: 16,
      collisionType: CollisionType.PreventCollision,
      color: Color.fromHex(colors.blue3),
      z: 1,
    })

    this.level = level
  }

  override onInitialize(_engine: Engine): void {
    this.graphics.add('sprite', MusicStand.sprite)
    this.graphics.add('animation', MusicStand.animation)
    this.graphics.use('sprite')
    this.level.add(this.timer)
  }

  spawnSheet() {
    this.graphics.use('animation')
    this.level.engine.clock.schedule(() => {
      this.graphics.use('sprite')
      MusicStand.animation.reset()
      this.level.add(new SheetMusic(this))
    }, 600)
  }

  start() {
    SheetMusic.animation.play()
    this.timer.start()
    this.level.engine.clock.schedule(() => this.spawnSheet(), 5000)
  }

  stop() {
    this.timer.stop()

    this.level.actors.forEach((actor) => {
      if (actor instanceof SheetMusic) actor.stop()
    })
  }

  reset() {
    this.timer.stop()

    this.level.actors.forEach((actor) => {
      if (actor instanceof SheetMusic) actor.kill()
    })
  }
}
