import {
  Color,
  Engine,
  Font,
  KeyEvent,
  Keys,
  Label,
  Scene,
  Timer,
  vec,
} from 'excalibur'

import { colors } from './colors'
import { Guitarist } from './guitarist'
import { Singer } from './singer'
import { DrumSet } from './drumSet'
import { Logo } from './logo'

export class Start extends Scene {
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
  logo = new Logo()
  pressEnter = new Label({
    text: 'Press Enter',
    font: this.font,
    pos: vec(62, 168),
    color: Color.White,
  })
  guitarist = new Guitarist(vec(88, 200), false)
  drumSet = new DrumSet(vec(108, 204))
  singer = new Singer(vec(128, 200), false)
  copyRightLabel = new Label({
    text: '© 2025',
    font: this.font,
    pos: vec(78, 224),
    color: Color.White,
  })
  companyLabel = new Label({
    text: 'Planning Center Inc.',
    font: this.font,
    pos: vec(30, 232),
    color: Color.White,
  })

  oneUpTimer = new Timer({
    interval: 300,
    repeats: true,
    action: () => {
      this.pressEnter.graphics.isVisible = !this.pressEnter.graphics.isVisible
      this.oneUpLabel.graphics.isVisible = !this.oneUpLabel.graphics.isVisible
    },
  })
  boundGoToIntro = this.goToIntro.bind(this)

  override onInitialize(engine: Engine): void {
    this.add(this.oneUpLabel)
    this.add(this.highScoreLabel)
    this.add(this.scoreCard)
    this.add(this.highScoreCard)
    this.add(this.logo)
    this.add(this.pressEnter)
    this.add(this.guitarist)
    this.add(this.drumSet)
    this.add(this.singer)
    this.add(this.copyRightLabel)
    this.add(this.companyLabel)

    this.add(this.oneUpTimer)
    this.oneUpTimer.start()

    const highScore = localStorage.getItem('highScore')
    if (highScore) {
      this.highScore = +highScore
      this.highScoreCard.text = String(this.highScore).padStart(6, '0')
    }
  }

  override onActivate(): void {
    this.engine.input.keyboard.on('press', this.boundGoToIntro)
  }

  override onDeactivate(): void {
    this.engine.input.keyboard.off('press', this.boundGoToIntro)
  }

  goToIntro({ key }: KeyEvent) {
    if (key === Keys.Enter) this.engine.goToScene('intro')
  }
}
