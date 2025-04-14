import {
  Color,
  Engine,
  Font,
  Keys,
  Label,
  Random,
  Scene,
  Timer,
  vec,
} from 'excalibur'
import { Player } from './player'
import { Girder } from './girder'
import { Config } from './config'
import { Wall } from './wall'
import { Ladder } from './ladder'
import { DrumFactory } from './drumFactory'
import { colors } from './colors'
import { DrumTrigger } from './drumTrigger'
import { Resources } from './resources'
import { StaticDrum } from './staticDrum'
import { BonusLabel } from './bonusLabel'
import { DrumCloset } from './drumCloset'
import { PlayerLife } from './playerLife'
import { Guitarist } from './guitarist'
import { Singer } from './singer'
import { DrumSet } from './drumSet'

export class Level extends Scene {
  rand = new Random()
  score = 0
  highScore = 0
  bonus = 5000
  drumFactory = new DrumFactory(this)
  player = new Player(this)
  font = new Font({ family: 'Galaxian', size: 8 })
  oneUpLabel = new Label({
    text: '1UP',
    font: this.font,
    pos: vec(24, 0),
    color: Color.fromHex(colors.blue2),
  })
  highScoreLabel = new Label({
    text: 'HIGH SCORE',
    font: this.font,
    pos: vec(72, 0),
    color: Color.fromHex(colors.blue2),
  })
  scoreCard = new Label({
    text: String(this.score).padStart(6, '0'),
    font: this.font,
    pos: vec(8, 8),
    color: Color.White,
  })
  highScoreCard = new Label({
    text: String(this.highScore).padStart(6, '0'),
    font: this.font,
    pos: vec(88, 8),
    color: Color.White,
  })
  drumCloset = new DrumCloset()
  bonusLabel = new BonusLabel()
  bonusScore = new Label({
    text: `${this.bonus}`,
    font: this.font,
    pos: vec(172, 44),
    color: Color.fromHex(colors.blue3),
  })
  throwingDrum = new StaticDrum(vec(16, 66))
  drumOffTimer = new Timer({
    interval: 3000,
    repeats: true,
    action: () => {
      this.throwingDrum.graphics.isVisible = false
      this.engine.clock.schedule(
        () => (this.throwingDrum.graphics.isVisible = true),
        1500
      )
    },
  })
  oneUpTimer = new Timer({
    interval: 300,
    repeats: true,
    action: () => {
      this.oneUpLabel.graphics.isVisible = !this.oneUpLabel.graphics.isVisible
    },
  })
  bonusTimer = new Timer({
    interval: 3000,
    repeats: true,
    action: () => {
      this.bonus -= 100
      this.bonusScore.text = `${this.bonus}`
    },
  })
  guitarist = new Guitarist(vec(80, 40))
  drumSet = new DrumSet(vec(100, 44))
  singer = new Singer(vec(120, 40))

  override onInitialize(engine: Engine): void {
    this.add(this.player)

    Config.walls.forEach((pos) => this.add(new Wall(pos)))

    this.add(new Girder(vec(56, 252), 112))
    Config.girders.forEach((pos) => this.add(new Girder(pos)))

    // Brown girders
    this.add(new Girder(vec(72, 88), 144, true))
    Config.groundGirders.forEach((pos) => this.add(new Girder(pos, 16, true)))

    Config.ladders.forEach(({ pos, height, sensors, broken }) =>
      this.add(new Ladder(pos, height, sensors, broken))
    )

    // Drums
    Config.drumDownTriggers.forEach((pos) =>
      this.add(new DrumTrigger(pos, 'down', this.rand))
    )
    Config.drumLeftTriggers.forEach((pos) =>
      this.add(new DrumTrigger(pos, 'left', this.rand))
    )
    Config.drumRightTriggers.forEach((pos) =>
      this.add(new DrumTrigger(pos, 'right', this.rand))
    )
    Config.drumSlowTriggers.forEach((pos) =>
      this.add(new DrumTrigger(pos, 'slow', this.rand))
    )

    // Decorations
    this.add(this.guitarist)
    this.add(this.drumSet)
    this.add(this.singer)
    this.add(this.drumCloset)
    this.add(this.throwingDrum)
    this.add(new StaticDrum(vec(16, 78)))

    // Labels
    this.add(this.oneUpLabel)
    this.add(this.highScoreLabel)
    this.add(this.scoreCard)
    this.add(this.highScoreCard)

    const highScore = localStorage.getItem('highScore')
    if (highScore) {
      this.highScore = +highScore
      this.setHighScore(this.highScore)
    } else {
      this.setHighScore(0)
    }

    this.add(this.bonusLabel)
    this.add(this.bonusScore)

    this.add(this.drumOffTimer)
    this.add(this.bonusTimer)
    this.add(this.oneUpTimer)

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
    Resources.BackgroundMusic.loop = true
    Resources.BackgroundMusic.play()

    this.reset()
  }

  override onDeactivate(): void {
    Resources.BackgroundMusic.stop()

    this.stop()
  }

  reset() {
    this.actors.forEach((actor) => {
      if (actor.name === 'Lives') actor.kill()
    })
    new Array(this.player.lives).fill(0).forEach((n, i) => {
      this.add(new PlayerLife(vec(8 * i + 12, 24)))
    })

    this.bonus = 5000
    this.bonusScore.text = `${5000}`

    this.oneUpTimer.reset()
    this.bonusTimer.reset()
    this.drumOffTimer.reset()
    this.drumFactory.reset()

    this.start()
  }

  start() {
    this.oneUpTimer.start()
    this.bonusTimer.start()
    this.drumOffTimer.start()
    this.drumFactory.start()

    this.player.start()
  }

  stop() {
    this.oneUpTimer.stop()
    this.bonusTimer.stop()
    this.drumOffTimer.stop()
    this.drumFactory.stop()

    this.player.stop()
  }

  incrementScore(score: number) {
    Resources.Score.play()

    this.score += score
    this.scoreCard.text = String(this.score).padStart(6, '0')
    this.setHighScore(this.score)

    const scoreLabel = new Label({
      pos: vec(this.player.pos.x - 10, this.player.pos.y + 3),
      text: `${score}`,
      color: Color.White,
    })
    this.add(scoreLabel)
    this.engine.clock.schedule(() => scoreLabel.kill(), 1000)
  }

  setHighScore(score: number) {
    if (score > this.highScore) {
      localStorage.setItem('highScore', this.score.toString())
      this.highScore = score
    }
    this.highScoreCard.text = String(this.highScore).padStart(6, '0')
  }
}
