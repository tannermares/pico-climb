import { Actor, Collider, CollisionType, vec } from 'excalibur'

import { Config } from './config'
import { Level } from './level'

export class WinTrigger extends Actor {
  constructor(private level: Level) {
    super({
      name: 'WinTrigger',
      width: 8,
      height: 2,
      pos: vec(132, 50),
      collisionType: CollisionType.Passive,
      collisionGroup: Config.colliders.LaddersCanCollideWith,
    })
  }

  override onCollisionStart(_self: Collider, _other: Collider): void {
    this.level.triggerWin()
  }
}
