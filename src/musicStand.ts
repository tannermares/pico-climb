import {
  Actor,
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
      columns: 1,
      spriteWidth: 16,
      spriteHeight: 16,
    },
  })
  static sprite = this.spriteSheet.getSprite(0, 0)

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

  override onInitialize(engine: Engine): void {
    this.graphics.add('sprite', MusicStand.sprite)
    this.level.add(this.timer)
  }

  spawnSheet() {
    this.level.add(new SheetMusic(this))
  }

  start() {
    this.timer.start()
    this.level.engine.clock.schedule(() => this.spawnSheet(), 1500)
  }

  stop() {
    this.timer.stop()

    this.level.actors.forEach((actor) => {
      if (actor instanceof SheetMusic) {
        actor.actions.clearActions()
        actor.graphics.use('sprite')
      }
    })
  }

  reset() {
    this.timer.stop()

    this.level.actors.forEach((actor) => {
      if (actor instanceof SheetMusic) actor.kill()
    })
  }
}
