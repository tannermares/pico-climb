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

    Config.girders.forEach(([girderX, girderY]) => {
      this.add(new Girder(vec(girderX, girderY)))
    })
  }
}
