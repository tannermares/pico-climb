import {
  Color,
  Engine,
  Font,
  Label,
  Scene,
  SceneActivationContext,
  Timer,
  vec,
} from 'excalibur'
import { Resources } from './resources'
import { colors } from './colors'
import { Guitarist } from './guitarist'
import { DrumSet } from './drumSet'
import { Singer } from './singer'
import { Level } from './level'

export class Intro extends Scene {
  font = new Font({ family: 'Galaxian', size: 8 })
  highScore = 0
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
    text: String(0).padStart(6, '0'),
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
  guitarist = new Guitarist(vec(88, 200), false)
  drumSet = new DrumSet(vec(108, 204))
  singer = new Singer(vec(128, 200), false)
  arrows = new Label({
    text: 'Arrows:',
    font: this.font,
    pos: vec(52, 224),
    color: Color.fromHex(colors.blue2),
  })
  move = new Label({
    text: 'move',
    font: this.font,
    pos: vec(112, 224),
    color: Color.White,
  })
  space = new Label({
    text: 'Space:',
    font: this.font,
    pos: vec(60, 232),
    color: Color.fromHex(colors.blue2),
  })
  jump = new Label({
    text: 'jump',
    font: this.font,
    pos: vec(112, 232),
    color: Color.White,
  })
  canYouMakeItLabel = new Label({
    text: 'CAN YOU MAKE IT TO WORSHIP?',
    font: this.font,
    pos: vec(4, 112),
    color: Color.White,
  })
  loadTimer = new Timer({
    interval: 4000,
    repeats: false,
    action: () => this.engine.goToScene('level'),
  })

  override onInitialize(_engine: Engine): void {
    this.add(this.oneUpLabel)
    this.oneUpLabel.actions.blink(300, 300, Infinity)
    this.add(this.highScoreLabel)
    this.add(this.scoreCard)
    this.add(this.highScoreCard)
    this.add(this.arrows)
    this.add(this.move)
    this.add(this.space)
    this.add(this.jump)
    this.add(this.guitarist)
    this.add(this.drumSet)
    this.add(this.singer)
    this.add(this.canYouMakeItLabel)

    this.add(this.loadTimer)
  }

  override onActivate(context: SceneActivationContext): void {
    if (context.previousScene instanceof Level) {
      this.scoreCard.text = String(context.previousScene.score).padStart(6, '0')
    }

    const highScore = localStorage.getItem('highScore')
    if (highScore) {
      this.highScore = +highScore
      this.highScoreCard.text = String(this.highScore).padStart(6, '0')
    }

    Resources.Intro.play()
    this.loadTimer.start()
  }
}
