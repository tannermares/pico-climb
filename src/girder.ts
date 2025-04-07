import { Actor, CollisionType, Color, Vector } from 'excalibur'

export class Girder extends Actor {
  constructor(pos: Vector) {
    super({
      name: 'Girder',
      pos,
      width: 16,
      height: 8,
      color: Color.Red,
      collisionType: CollisionType.Fixed,
    })
  }
}
