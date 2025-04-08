import {
  Actor,
  CollisionGroupManager,
  CollisionType,
  Color,
  Vector,
} from 'excalibur'

export const LadderCollisionGroup = CollisionGroupManager.create('ladder')

export class Ladder extends Actor {
  constructor(pos: Vector, height: number) {
    super({
      name: 'Ladder',
      pos,
      width: 8,
      height,
      color: Color.Azure,
      collisionType: CollisionType.Passive,
      collisionGroup: LadderCollisionGroup,
    })
  }
}
