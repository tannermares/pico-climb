import { Actor, clamp, CollisionType, Color, Engine, vec } from 'excalibur'
import { Config } from './config'

export class Drum extends Actor {
  constructor() {
    super({
      name: 'Drum',
      pos: vec(50, 79),
      height: 10,
      width: 12,
      collisionType: CollisionType.Active,
      collisionGroup: Config.colliders.DrumsCanCollideWith,
      color: Color.fromHex('#f77622'),
      vel: vec(65, 0),
    })

    this.on('exitviewport', () => this.kill())
  }

  override onPostUpdate(_engine: Engine): void {
    this.vel.x = clamp(this.vel.x, -65, 65)
  }
}
