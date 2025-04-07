import {
  Actor,
  CollisionType,
  EdgeCollider,
  Engine,
  Scene,
  vec,
  Vector,
} from 'excalibur'
import { Player } from './player'
import { Girder } from './girder'
import { Config } from './config'

export class MyLevel extends Scene {
  override onInitialize(engine: Engine): void {
    const player = new Player()
    this.add(player)

    const wallActor1 = new Actor({
      collider: new EdgeCollider({ begin: vec(0, 0), end: vec(0, 256) }),
      collisionType: CollisionType.Fixed,
    })

    const wallActor2 = new Actor({
      collider: new EdgeCollider({ begin: vec(224, 0), end: vec(224, 256) }),
      collisionType: CollisionType.Fixed,
    })

    this.add(wallActor1)
    this.add(wallActor2)

    // Collision Layers
    const startingPlatform = new Actor({
      collider: new EdgeCollider({ begin: vec(0, 248), end: vec(112, 248) }),
      collisionType: CollisionType.Fixed,
    })
    const startingSlope = new Actor({
      collider: new EdgeCollider({ begin: vec(112, 249), end: vec(224, 241) }),
      collisionType: CollisionType.Fixed,
    })

    this.add(startingPlatform)
    this.add(startingSlope)

    // Visual Girders
    Config.girders.forEach(([girderX, girderY]) => {
      this.add(new Girder(vec(girderX, girderY)))
    })
  }
}
