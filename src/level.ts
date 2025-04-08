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
import { Wall } from './wall'

export class MyLevel extends Scene {
  override onInitialize(engine: Engine): void {
    const player = new Player()
    this.add(player)

    Config.walls.forEach(([begin, end]) => {
      this.add(new Wall(begin, end))
    })

    Config.girders.forEach((pos) => {
      this.add(new Girder(pos))
    })
  }
}
