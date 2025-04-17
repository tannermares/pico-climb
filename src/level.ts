import {
  Actor,
  Color,
  Engine,
  Font,
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
import { DrumThrower } from './drumThrower'
import { WinTrigger } from './winTrigger'
import { Score } from './score'
import { FallTrigger } from './fallTrigger'
import { MusicStand } from './musicStand'

export class Level extends Scene {
  rand = new Random()
  win = false
  lives = 3
  score = 0
  highScore = 0
  bonus = 5000
  drumFactory = new DrumFactory(this)
  musicStand = new MusicStand(this)
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
  staticDrum = new StaticDrum(vec(16, 78))
  throwingDrum = new StaticDrum(vec(16, 66))
  drumThrower = new DrumThrower(this)
  drumOffTimer = new Timer({
    interval: 2000,
    // repeats: true,
    action: () => {
      this.drumThrower.graphics.use('animation')
      this.throwingDrum.graphics.isVisible = false
      this.engine.clock.schedule(() => {
        // this.drumThrower.graphics.use('pickup')
        this.throwingDrum.graphics.isVisible = true
      }, 1500)
    },
  })
  bonusTimer = new Timer({
    interval: 3000,
    repeats: true,
    action: () => {
      this.bonus -= 100
      this.bonusScore.text = `${this.bonus}`

      if (this.bonus === 0) this.triggerDeath()
    },
  })
  guitarist = new Guitarist(vec(80, 40))
  drumSet = new DrumSet(vec(100, 44))
  singer = new Singer(vec(120, 40))
  winTrigger = new WinTrigger(this)
  gameOverOverlay = new Actor({
    height: 40,
    width: 112,
    pos: vec(112, 180),
    color: Color.fromHex(colors.gray6),
    z: 2,
    visible: false,
  })
  gameOverLabel = new Label({
    text: 'GAME  OVER',
    font: this.font,
    pos: vec(70, 177),
    color: Color.fromHex(colors.blue3),
    z: 3,
    visible: false,
  })

  override onInitialize(engine: Engine): void {
    this.add(this.player)
    this.add(this.winTrigger)
    this.add(this.musicStand)

    Config.walls.forEach((pos) => this.add(new Wall(pos)))
    Config.fallTriggers.forEach((pos) => this.add(new FallTrigger(pos)))

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
    this.add(this.drumThrower)
    this.add(this.staticDrum)

    // Labels
    this.add(this.oneUpLabel)
    this.oneUpLabel.actions.blink(300, 300, Infinity)
    this.add(this.highScoreLabel)
    this.add(this.scoreCard)
    this.add(this.highScoreCard)
    this.add(this.gameOverOverlay)
    this.add(this.gameOverLabel)

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

    Resources.BackgroundMusic.loop = true
  }

  override onActivate(): void {
    Resources.BackgroundMusic.play()

    this.reset()
  }

  override onDeactivate(): void {
    Resources.BackgroundMusic.stop()

    this.stop()
  }

  reset() {
    this.actors.forEach((actor) => {
      if (actor.name === 'PlayerLife') actor.kill()
    })
    new Array(this.lives - 1).fill(0).forEach((n, i) => {
      this.add(new PlayerLife(vec(8 * i + 12, 24)))
    })

    this.bonus = 5000
    this.bonusScore.text = `${5000}`

    this.bonusTimer.reset()
    this.drumOffTimer.reset()
    this.musicStand.reset()
    this.drumThrower.reset()
    this.drumFactory.reset()
    this.player.reset()

    this.start()
  }

  start() {
    this.bonusTimer.start()
    this.drumOffTimer.start()
    this.musicStand.start()
    this.drumThrower.start()
    this.drumFactory.start()
    this.player.start()
  }

  stop() {
    Resources.BackgroundMusic.stop()

    this.bonusTimer.stop()
    this.drumOffTimer.stop()
    this.drumThrower.stop()
    this.musicStand.stop()
    this.drumFactory.stop()
    this.player.stop()
  }

  incrementScore(score: number) {
    Resources.Score.play()

    this.score += score
    this.scoreCard.text = String(this.score).padStart(6, '0')
    this.setHighScore(this.score)

    const scoreLabel = new Score(
      vec(this.player.pos.x, this.player.pos.y + 8),
      score
    )
    this.add(scoreLabel)
  }

  setHighScore(score: number) {
    if (score > this.highScore) {
      localStorage.setItem('highScore', this.score.toString())
      this.highScore = score
    }
    this.highScoreCard.text = String(this.highScore).padStart(6, '0')
  }

  triggerDeath() {
    this.stop()
    this.player.stop()
    Resources.Hit.play()

    this.engine.clock.schedule(() => {
      this.drumFactory.reset()
      this.musicStand.reset()
      Resources.Death.play()
      this.player.triggerDeath()
    }, 1000)

    this.engine.clock.schedule(() => {
      if (this.lives === 1) {
        this.triggerGameOver()
      } else {
        this.lives -= 1
        this.engine.goToScene('intro')
      }
    }, 5000)
  }

  triggerWin() {
    if (this.win) return

    this.win = true
    this.stop()
    this.player.stop()
    this.musicStand.reset()
    this.drumFactory.reset()
    Resources.BackgroundMusic.stop()
    Resources.Win.play()

    this.player.bodySensor.graphics.use('walk')
    this.player.bodySensor.graphics.flipHorizontal = false
    this.player.actions.moveTo(vec(101, 50), 12)

    this.engine.clock.schedule(() => this.triggerGameOver(), 8000)
  }

  triggerGameOver() {
    this.stop()
    this.musicStand.reset()
    this.drumFactory.reset()
    Resources.BackgroundMusic.stop()

    this.engine.clock.schedule(() => {
      this.engine.goToScene('start')
      this.win = false
      this.lives = 3
      this.score = 0
      this.gameOverOverlay.graphics.isVisible = false
      this.gameOverLabel.graphics.isVisible = false
    }, 5000)

    this.gameOverOverlay.graphics.isVisible = true
    this.gameOverLabel.graphics.isVisible = true

    this.addBonus()
  }

  addBonus() {
    this.score += this.bonus
    this.scoreCard.text = String(this.score).padStart(6, '0')
    this.setHighScore(this.score)
  }
}
