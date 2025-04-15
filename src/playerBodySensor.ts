import { Actor, Collider, CollisionType, Engine, vec, Vector } from 'excalibur'

import { Config } from './config'
import { Drum } from './drum'
import { Player } from './player'

export class PlayerBodySensor extends Actor {
  constructor() {
    super({
      name: 'BodySensor',
      width: 8,
      height: 8,
      pos: vec(0, -7),
      collisionType: CollisionType.Passive,
      collisionGroup: Config.colliders.PlayerGroup,
    })
  }

  override onInitialize(_engine: Engine): void {
    this.graphics.add('start', Player.startSprite)
    this.graphics.add('run', Player.runAnimation)
    this.graphics.add('walk', Player.walkAnimation)
    this.graphics.add('jump', Player.jumpSprite)
    this.graphics.add('climb', Player.climbAnimation)
    this.graphics.add('endClimbUp', Player.endClimbUpAnimation)
    this.graphics.add('startClimbDown', Player.startClimbDownAnimation)
    this.graphics.add('death', Player.deathAnimation)

    this.graphics.use('run')
    this.graphics.flipHorizontal = true

    Player.endClimbUpAnimation.pause()
    Player.startClimbDownAnimation.pause()
  }

  override onCollisionStart(_self: Collider, other: Collider): void {
    if (other.owner instanceof Drum) {
      other.owner.acc = Vector.Zero
      other.owner.vel = Vector.Zero
      other.owner.body.useGravity = false
      if (this.parent instanceof Player) this.parent.level.triggerDeath()
    }
  }
}
