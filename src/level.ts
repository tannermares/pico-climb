import {
  Actor,
  Color,
  Engine,
  Font,
  FontUnit,
  Label,
  Scene,
  vec,
} from 'excalibur'
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

    Config.barrels.forEach((pos) => {
      this.add(
        new Actor({
          height: 16,
          width: 8,
          pos,
          color: Color.Orange,
        })
      )
    })

    this.add(
      new Actor({
        height: 32,
        width: 32,
        pos: vec(32, 68),
        color: Color.Brown,
      })
    )

    this.add(
      new Actor({
        height: 24,
        width: 16,
        pos: vec(72, 40),
        color: Color.Pink,
      })
    )
    this.add(
      new Label({
        text: 'HELP!',
        font: new Font({ family: 'Galaxian', size: 4 }),
        pos: vec(80, 28),
        color: Color.Cyan,
      })
    )
    this.add(
      new Label({
        text: 'HIGH SCORE',
        font: new Font({ family: 'Galaxian', size: 8 }),
        pos: vec(72, 0),
        color: Color.Red,
      })
    )
    this.add(
      new Label({
        text: '000000',
        font: new Font({ family: 'Galaxian', size: 8 }),
        pos: vec(8, 8),
        color: Color.White,
      })
    )
    this.add(
      new Label({
        text: '000000',
        font: new Font({ family: 'Galaxian', size: 8 }),
        pos: vec(88, 8),
        color: Color.White,
      })
    )
    this.add(
      new Label({
        text: 'L=01',
        font: new Font({ family: 'Galaxian', size: 8 }),
        pos: vec(172, 24),
        color: Color.Blue,
      })
    )

    new Array(player.lives).fill(0).forEach((n, i) => {
      this.add(
        new Actor({
          height: 8,
          width: 8,
          pos: vec(10 * (i + 1) + 2, 24),
          color: Color.White,
        })
      )
    })
  }
}
