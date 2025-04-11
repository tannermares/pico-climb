import {
  Actor,
  CollisionType,
  Color,
  Engine,
  ImageWrapping,
  SpriteSheet,
  vec,
  Vector,
} from 'excalibur'
import { Config } from './config'
import { Player } from './player'
import { colors } from './colors'
import { DrumTrigger } from './drumTrigger'
import { Level } from './level'
import { Resources } from './resources'
import { Wall } from './wall'

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
    private broken = false
  ) {
    super({
      name: 'Ladder',
      pos,
      width: 8,
      height,
      color: Color.fromHex(colors.blue2),
      collisionType: CollisionType.PreventCollision,
    })
  }

  override onInitialize(engine: Engine): void {
    this.graphics.add('sprite', this.sprite(this.height))
    this.graphics.use('sprite')

    if (!this.sensors) return

    const floorSensor = new Actor({
      name: 'FloorSensor',
      width: 3,
      height: 2,
      pos: vec(0, this.height / 2 - 1),
      collisionType: CollisionType.Passive,
      collisionGroup: Config.colliders.LaddersCanCollideWith,
      // color: Color.Yellow, // DEBUG
      z: 1,
    })
    floorSensor.on('collisionstart', ({ other }) => {
      if (
        other.owner.parent instanceof Player &&
        other.owner.name === 'ladderSensor'
      ) {
        if (other.owner.parent.climbing) other.owner.parent.stopClimbing()

        other.owner.parent.canClimbDown = false
        other.owner.parent.canClimbUp = true
      }
    })
    floorSensor.on('collisionend', ({ other }) => {
      if (
        other.owner.parent instanceof Player &&
        other.owner.name === 'ladderSensor'
      ) {
        other.owner.parent.canClimbUp = false
      }
    })
    this.addChild(floorSensor)

    if (this.broken) {
      const ladderWall = new Actor({
        name: 'LadderWall',
        width: 8,
        height: 2,
        pos: vec(0, -this.height / 2 - 10),
        collisionType: CollisionType.Passive,
        collisionGroup: Config.colliders.LaddersCanCollideWith,
        // color: Color.Yellow, // DEBUG
        z: 1,
      })
      ladderWall.on('collisionstart', ({ other }) => {
        if (
          other.owner.parent instanceof Player &&
          other.owner.name === 'ladderSensor'
        ) {
          other.owner.parent.climbingWall = true
        }
      })
      ladderWall.on('collisionend', ({ other }) => {
        if (
          other.owner.parent instanceof Player &&
          other.owner.name === 'ladderSensor'
        ) {
          if (other.owner.parent.climbing)
            other.owner.parent.climbingWall = false
        }
      })
      this.addChild(ladderWall)
    } else {
      const roofSensor = new Actor({
        name: 'RoofSensor',
        width: 3,
        height: 2,
        pos: vec(0, -this.height / 2 - 10),
        collisionType: CollisionType.Passive,
        collisionGroup: Config.colliders.LaddersCanCollideWith,
        // color: Color.Yellow, // DEBUG
        z: 1,
      })
      roofSensor.on('collisionstart', ({ other }) => {
        if (
          other.owner.parent instanceof Player &&
          other.owner.name === 'ladderSensor'
        ) {
          if (other.owner.parent.climbing) other.owner.parent.stopClimbing()

          other.owner.parent.canClimbUp = false
          other.owner.parent.canClimbDown = true
        }
      })
      roofSensor.on('collisionend', ({ other }) => {
        if (
          other.owner.parent instanceof Player &&
          other.owner.name === 'ladderSensor'
        ) {
          other.owner.parent.canClimbDown = false
        }
      })
      this.addChild(roofSensor)
    }
  }
}
