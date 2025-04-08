import { Color, Engine, Font, FontUnit, Label, Scene, vec } from 'excalibur'
import { Player } from './player'
import { Girder } from './girder'
import { Config } from './config'
import { Wall } from './wall'
import { Ladder } from './ladder'

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

    Config.ladders.forEach(({ pos, height }) => {
      this.add(new Ladder(pos, height))
    })

    this.add(
      new Label({ text: 'HIGH SCORE', pos: vec(100, 12), color: Color.Red })
    )
    this.add(
      new Label({ text: '000000', pos: vec(12, 20), color: Color.White })
    )
    this.add(
      new Label({ text: '000000', pos: vec(100, 20), color: Color.White })
    )
  }
}
