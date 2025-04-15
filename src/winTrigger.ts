import { Actor, Collider, CollisionType, Color, vec } from 'excalibur'

import { Config } from './config'
import { Level } from './level'

export class WinTrigger extends Actor {
  constructor(private level: Level) {
    super({
      name: 'WinTrigger',
      width: 8,
      height: 2,
      pos: vec(132, 51),
      collisionType: CollisionType.Passive,
      collisionGroup: Config.colliders.FeetCanCollideWith,
      color: Color.Yellow,
    })
  }

  override onCollisionStart(_self: Collider, _other: Collider): void {
    this.level.triggerWin()
  }
}
