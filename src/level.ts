import { Engine, Scene, vec } from 'excalibur'
import { Player } from './player'
import { Girder } from './girder'
import { Config } from './config'

export class MyLevel extends Scene {
  override onInitialize(engine: Engine): void {
    const player = new Player()
    this.add(player)

    Config.girders.forEach(([girderX, girderY]) => {
      this.add(new Girder(vec(girderX, girderY)))
    })
  }
}
