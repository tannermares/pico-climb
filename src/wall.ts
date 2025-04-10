import { Actor, CollisionType, Vector } from 'excalibur'

import { Config } from './config'

export class Wall extends Actor {
  constructor(pos: Vector) {
    super({
      name: 'Wall',
      width: 1,
      height: 256,
      pos,
      collisionType: CollisionType.Fixed,
      collisionGroup: Config.colliders.WallGroup,
    })
  }
}
