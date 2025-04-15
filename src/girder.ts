import {
  Actor,
  Collider,
  CollisionType,
  Color,
  Engine,
  ImageWrapping,
  Side,
  SpriteSheet,
  Vector,
} from 'excalibur'
import { Player } from './player'
import { Config } from './config'
import { colors } from './colors'
import { Resources } from './resources'

export class Girder extends Actor {
  static spriteSheet = SpriteSheet.fromImageSource({
    image: Resources.SpriteSheet,
    grid: {
      rows: 16,
      columns: 16,
      spriteWidth: 16,
      spriteHeight: 8,
    },
  })
  static sprite = Girder.spriteSheet.getSprite(1, 5)
  tiledSprite = (width: number) =>
    Girder.spriteSheet.getTiledSprite(1, 5, {
      width,
      height: 8,
      wrapping: {
        x: ImageWrapping.Repeat,
        y: ImageWrapping.Clamp,
      },
    })

  static altSprite = Girder.spriteSheet.getSprite(1, 4)
  tiledAltSprite = (width: number) =>
    Girder.spriteSheet.getTiledSprite(1, 4, {
      width,
      height: 8,
      wrapping: {
        x: ImageWrapping.Repeat,
        y: ImageWrapping.Clamp,
      },
    })

  constructor(pos: Vector, width = 16, private alt = false) {
    super({
      name: 'Girder',
      pos,
      width,
      height: 8,
      color: Color.fromHex(colors.cherry1),
      collisionType: CollisionType.Fixed,
      collisionGroup: Config.colliders.GirderGroup,
    })
  }

  override onInitialize(_engine: Engine): void {
    this.graphics.add(
      'sprite',
      this.width === 16
        ? this.alt
          ? Girder.altSprite
          : Girder.sprite
        : this.alt
        ? this.tiledAltSprite(this.width)
        : this.tiledSprite(this.width)
    )
    this.graphics.use('sprite')
  }

  override onPreCollisionResolve(
    self: Collider,
    other: Collider,
    side: Side
  ): void {
    if (other.owner instanceof Player) {
      const unLevelGround = Math.round(other.bounds.bottom) > self.bounds.top
      const isSideCollision = side === Side.Right || side === Side.Left

      if (
        unLevelGround &&
        isSideCollision &&
        !other.owner.jumping &&
        !other.owner.climbing
      ) {
        other.owner.pos.y -= 1
      }
    }
  }

  override onCollisionStart(
    _self: Collider,
    other: Collider,
    side: Side
  ): void {
    if (
      other.owner instanceof Player &&
      other.owner.vel.y === 0 &&
      side === Side.Top
    ) {
      other.owner.jumping = false
      other.owner.falling = false
      other.owner.fallTimer.stop()
    }
  }
}
