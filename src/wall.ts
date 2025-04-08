import { Actor, CollisionType, EdgeCollider, Vector } from 'excalibur'

export class Wall extends Actor {
  constructor(begin: Vector, end: Vector) {
    super({
      name: 'Wall',
      collider: new EdgeCollider({ begin, end }),
      collisionType: CollisionType.Fixed,
    })
  }
}
