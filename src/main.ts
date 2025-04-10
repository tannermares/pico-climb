import { Color, DisplayMode, Engine, FadeInOut, vec } from 'excalibur'

import { GameOver } from './gameOver'
import { Intro } from './intro'
import { Level } from './level'
import { loader } from './resources'
import { colors } from './colors'

const game = new Engine({
  width: 224,
  height: 256,
  backgroundColor: Color.fromHex(colors.gray6),
  displayMode: DisplayMode.FitScreen,
  pixelArt: true,
  scenes: { level: Level, intro: Intro, gameOver: GameOver },
  physics: { gravity: vec(0, 100) },
})

game
  .start('level', {
    loader,
    // inTransition: new FadeInOut({
    //   duration: 1000,
    //   direction: 'in',
    //   color: Color.ExcaliburBlue,
    // }),
  })
  .then(() => {})
