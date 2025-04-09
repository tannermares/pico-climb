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
      color: Color.Azure,
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
      collisionGroup: Config.colliders.LadderGroup,
      color: Color.Yellow,
      z: 1,
    })

    this.addChild(floorSensor)

    floorSensor.on('collisionstart', ({ other, self }) => {
      if (other.owner.parent instanceof Player) {
        if (other.owner.parent.climbing) {
          other.owner.parent.canClimbDown = false
          other.owner.parent.stopClimbing()
        }
        other.owner.parent.canClimbUp = true
      }
    })

    floorSensor.on('collisionend', ({ other, self }) => {
      if (other.owner.parent instanceof Player) {
        other.owner.parent.canClimbUp = false
      }
    })

    const roofSensor = new Actor({
      name: 'RoofSensor',
      width: 3,
      height: 1,
      pos: vec(0, -this.height / 2),
      collisionType: CollisionType.Passive,
      collisionGroup: Config.colliders.LadderGroup,
      color: Color.Yellow,
      z: 1,
    })

    this.addChild(roofSensor)

    roofSensor.on('collisionstart', ({ other, self }) => {
      if (other.owner.parent instanceof Player) {
        if (other.owner.parent.climbing) {
          other.owner.parent.canClimbUp = false
          other.owner.parent.stopClimbing()
        }
        other.owner.parent.canClimbDown = true
      }
    })

    roofSensor.on('collisionend', ({ other, self }) => {
      if (other.owner.parent instanceof Player) {
        other.owner.parent.canClimbDown = false
      }
    })
  }
}
