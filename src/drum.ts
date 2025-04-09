import {
  Actor,
  Collider,
  CollisionContact,
  CollisionType,
  Color,
  Side,
  vec,
} from 'excalibur'
import { Config } from './config'
import { Wall } from './wall'

export class Drum extends Actor {
  constructor() {
    super({
      name: 'Drum',
      pos: vec(32, 68),
      radius: 5,
      collisionType: CollisionType.Active,
      // collisionGroup: Config.colliders.DrumsCanCollideWith,
      color: Color.Orange,
      vel: vec(8, 0),
      rotation: 8,
    })
  }
}
