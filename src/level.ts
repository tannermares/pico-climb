import {
  Actor,
  CollisionType,
  Color,
  Engine,
  ExcaliburGraphicsContext,
  Font,
  Keys,
  Label,
  Random,
  Scene,
  vec,
} from 'excalibur'
import { Player } from './player'
import { Girder } from './girder'
import { Config } from './config'
import { Wall } from './wall'
import { Ladder } from './ladder'
import { DrumFactory } from './drumFactory'
import { Drum } from './drum'
import { DrumSensor } from './drumSensor'

export class Level extends Scene {
  random = new Random()
  pipeFactory = new DrumFactory(this, this.random)

  override onInitialize(engine: Engine): void {
    const player = new Player()
    this.add(player)

    Config.walls.forEach((pos) => {
      this.add(new Wall(pos))
    })

    const flatTopGirder = new Actor({
      height: 8,
      width: 144,
      pos: vec(72, 88),
      color: Color.Red,
      collisionType: CollisionType.Fixed,
      collisionGroup: Config.colliders.GirderGroup,
    })
    flatTopGirder.on('collisionstart', ({ other }) => {
      if (other.owner instanceof Player) other.owner.jumping = false
    })
    this.add(flatTopGirder)

    const flatFloorGirder = new Actor({
      height: 8,
      width: 112,
      pos: vec(56, 252),
      color: Color.Red,
      collisionType: CollisionType.Fixed,
      collisionGroup: Config.colliders.GirderGroup,
    })
    flatFloorGirder.on('collisionstart', ({ other }) => {
      if (other.owner instanceof Player) other.owner.jumping = false
    })
    this.add(flatFloorGirder)

    Config.girders.forEach((pos) => {
      this.add(new Girder(pos))
    })

    Config.ladders.forEach(({ pos, height }) => {
      this.add(new Ladder(pos, height))
    })

    Config.drumSensors.forEach((pos) => {
      this.add(new DrumSensor(pos))
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

    this.pipeFactory.start()

    const drumKiller = new Actor({
      height: 16,
      width: 1,
      pos: vec(0, 240),
      collisionType: CollisionType.Passive,
    })
    drumKiller.on('collisionend', ({ other }) => {
      if (other.owner instanceof Drum) other.owner.kill()
    })
    this.add(drumKiller)
  }

  override onActivate(): void {
    const player = this.actors.find((actor) => actor instanceof Player)

    this.actors.forEach((actor) => {
      if (actor.name === 'Lives') actor.kill()
    })

    if (player)
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

    this.engine.input.keyboard.on('press', ({ key }) => {
      if (key === Keys.P) {
        if (this.engine.isRunning()) {
          this.engine.stop()
        } else {
          this.engine.start()
        }
      }
    })
  }
}
