import { Color, DisplayMode, Engine, vec } from 'excalibur'

import { GameOver } from './gameOver'
import { Intro } from './intro'
import { Level } from './level'
import { loader } from './resources'
import { colors } from './colors'
import { Start } from './start'

const game = new Engine({
  width: 224,
  height: 256,
  backgroundColor: Color.fromHex(colors.gray6),
  displayMode: DisplayMode.FitScreen,
  pixelArt: true,
  antialiasing: false,
  scenes: { start: Start, level: Level, intro: Intro, gameOver: GameOver },
  physics: { gravity: vec(0, 100) },
})

game.start('start', { loader })
