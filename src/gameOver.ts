import {
  Actor,
  CollisionType,
  Color,
  Engine,
  ExcaliburGraphicsContext,
  Font,
  Keys,
  Label,
  Scene,
  SceneActivationContext,
  vec,
} from 'excalibur'
import { Player } from './player'
import { Girder } from './girder'
import { Config } from './config'
import { Wall } from './wall'
import { Ladder } from './ladder'
import { colors } from './colors'

export class GameOver extends Scene {
  override onInitialize(engine: Engine): void {
    Config.walls.forEach((pos) => this.add(new Wall(pos)))

    this.add(new Girder(vec(72, 88), 144))
    this.add(new Girder(vec(56, 252), 112))

    Config.girders.forEach((pos) => this.add(new Girder(pos)))
    Config.ladders.forEach(({ pos, height }) =>
      this.add(new Ladder(pos, height))
    )

    Config.drums.forEach((pos) => {
      this.add(
        new Actor({
          height: 16,
          width: 8,
          pos,
          color: Color.fromHex(colors.orange1),
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

    this.add(
      new Actor({
        height: 30,
        width: 100,
        pos: vec(110, 180),
        color: Color.fromHex(colors.gray6),
        z: 2,
      })
    )

    this.add(
      new Label({
        text: 'GAME OVER',
        font: new Font({ family: 'Galaxian', size: 8 }),
        pos: vec(72, 180),
        color: Color.Azure,
        z: 3,
      })
    )
  }

  override onActivate(): void {
    this.engine.input.keyboard.on('press', ({ key }) => {
      if (key === Keys.Enter) {
        this.engine.goToScene('intro')
      }
    })
  }
}
