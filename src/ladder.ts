import { Actor, CollisionType, Color, Engine, vec, Vector } from 'excalibur'
import { Config } from './config'
import { Player } from './player'

export class Ladder extends Actor {
  constructor(pos: Vector, height: number) {
    super({
      name: 'Ladder',
      pos,
      width: 8,
      height,
      color: Color.fromHex('#0099db'),
      collisionType: CollisionType.PreventCollision,
    })
  }

  override onInitialize(engine: Engine): void {
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

    this.addChild(floorSensor)

    floorSensor.on('collisionstart', ({ other }) => {
      if (
        other.owner.parent instanceof Player &&
        other.owner.name === 'ladderSensor'
      ) {
        if (other.owner.parent.climbing) {
          other.owner.parent.canClimbDown = false
          other.owner.parent.stopClimbing()
        }
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

    const roofSensor = new Actor({
      name: 'RoofSensor',
      width: 3,
      height: 1,
      pos: vec(0, -this.height / 2 - 1),
      collisionType: CollisionType.Passive,
      collisionGroup: Config.colliders.LaddersCanCollideWith,
      // color: Color.Yellow, // DEBUG
      z: 1,
    })

    this.addChild(roofSensor)

    roofSensor.on('collisionstart', ({ other }) => {
      if (
        other.owner.parent instanceof Player &&
        other.owner.name === 'ladderSensor'
      ) {
        if (other.owner.parent.climbing) {
          other.owner.parent.canClimbUp = false
          other.owner.parent.stopClimbing()
        }
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
  }
}
