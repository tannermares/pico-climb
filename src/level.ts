import {
  Actor,
  Color,
  Engine,
  Font,
  Keys,
  Label,
  Scene,
  vec,
  Vector,
} from 'excalibur'
import { Player } from './player'
import { Girder } from './girder'
import { Config } from './config'
import { Wall } from './wall'
import { Ladder } from './ladder'
import { DrumFactory } from './drumFactory'
import { DrumSensor } from './drumSensor'
import { colors } from './colors'

export class Level extends Scene {
  bonus = 4500
  pipeFactory = new DrumFactory(this)
  player = new Player(this)
  dk = new Actor({
    height: 32,
    width: 32,
    pos: vec(32, 68),
    color: Color.fromHex(colors.clay1),
  })
  pauline = new Actor({
    height: 24,
    width: 16,
    pos: vec(72, 40),
    color: Color.fromHex(colors.purple3),
  })
  helpLabel = new Label({
    text: 'HELP!',
    font: new Font({ family: 'Galaxian', size: 4 }),
    pos: vec(80, 28),
    color: Color.fromHex(colors.blue3),
  })
  font = new Font({ family: 'Galaxian', size: 8 })
  otherFont = new Font({ family: 'comic-sans', size: 8 })
  highScoreLabel = new Label({
    text: 'HIGH SCORE',
    font: this.font,
    pos: vec(72, 0),
    color: Color.fromHex(colors.cherry1),
  })
  currentScore = new Label({
    text: '000000',
    font: this.font,
    pos: vec(8, 8),
    color: Color.White,
  })
  highScore = new Label({
    text: '000000',
    font: this.font,
    pos: vec(88, 8),
    color: Color.White,
  })
  levelLabel = new Label({
    text: 'L=01',
    font: this.font,
    pos: vec(172, 24),
    color: Color.fromHex(colors.blue1),
  })
  bonusLabel = new Label({
    text: 'BONUS',
    font: this.otherFont,
    pos: vec(172, 32),
    color: Color.fromHex(colors.blue1),
  })
  bonusScore = new Label({
    text: `${this.bonus}`,
    font: this.font,
    pos: vec(172, 44),
    color: Color.fromHex(colors.blue3),
  })
  staticDrum = (pos: Vector) =>
    new Actor({
      height: 16,
      width: 8,
      pos,
      color: Color.fromHex(colors.orange1),
    })

  override onInitialize(engine: Engine): void {
    this.add(this.player)

    Config.walls.forEach((pos) => this.add(new Wall(pos)))

    this.add(new Girder(vec(72, 88), 144))
    this.add(new Girder(vec(56, 252), 112))
    Config.girders.forEach((pos) => this.add(new Girder(pos)))

    Config.ladders.forEach(({ pos, height }) =>
      this.add(new Ladder(pos, height))
    )

    Config.drumSensors.forEach((pos) => this.add(new DrumSensor(pos)))
    Config.drums.forEach((pos) => this.add(this.staticDrum(pos)))

    // Placeholder DK and Pauline
    this.add(this.dk)
    this.add(this.pauline)

    // Labels
    this.add(this.helpLabel)
    this.add(this.highScoreLabel)
    this.add(this.currentScore)
    this.add(this.highScore)
    this.add(this.levelLabel)
    this.add(this.bonusLabel)
    this.add(this.bonusScore)

    this.pipeFactory.start()

    engine.input.keyboard.on('press', ({ key }) => {
      if (key === Keys.P) {
        if (engine.isRunning()) {
          engine.stop()
        } else {
          engine.start()
        }
      }
    })
  }

  override onActivate(): void {
    const player = this.actors.find((actor) => actor instanceof Player)

    this.actors.forEach((actor) => {
      if (actor.name === 'Lives') actor.kill()
    })

    if (player) {
      player.start()
      new Array(player.lives).fill(0).forEach((n, i) => {
        this.add(
          new Actor({
            name: 'Lives',
            height: 8,
            width: 8,
            pos: vec(10 * (i + 1) + 2, 24),
            color: Color.White,
          })
        )
      })
    }
  }
}
