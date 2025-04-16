import {
  Actor,
  Animation,
  CollisionType,
  Color,
  Engine,
  SpriteSheet,
} from 'excalibur'
import { Config } from './config'
import { Player } from './player'
import { MusicStand } from './musicStand'
import { Resources } from './resources'

export class SheetMusic extends Actor {
  static spriteSheet = SpriteSheet.fromImageSource({
    image: Resources.SpriteSheet,
    grid: {
      rows: 1,
      columns: 4,
      spriteWidth: 16,
      spriteHeight: 16,
    },
  })
  static sprite = this.spriteSheet.getSprite(0, 0)
  static animation = Animation.fromSpriteSheet(
    this.spriteSheet,
    [0, 1, 2, 3],
    80
  )

  constructor(private musicStand: MusicStand) {
    super({
      name: 'MusicStand',
      width: 16,
      height: 16,
      pos: musicStand.pos,
      collisionType: CollisionType.Passive,
      collisionGroup: Config.colliders.DrumsCanCollideWith,
      z: 1,
      color: Color.ExcaliburBlue,
    })
  }

  override onInitialize(engine: Engine): void {
    this.graphics.add('sprite', SheetMusic.sprite)
    this.graphics.add('animation', SheetMusic.animation)

    this.actions.repeatForever((ctx) => {
      const player = this.musicStand.level.actors.find(
        (a) => a instanceof Player
      )
      if (!player) return ctx.delay(100)

      return ctx
        .moveTo(player.pos, 10)
        .moveBy(20, 0, 10)
        .moveBy(0, -20, 10)
        .moveBy(-20, 0, 10)
        .moveBy(0, 20, 10)
    })
  }
}
