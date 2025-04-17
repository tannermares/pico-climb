import { Color, DisplayMode, Engine, Keys, vec } from 'excalibur'

import { Intro } from './intro'
import { Level } from './level'
import { loader } from './resources'
import { colors } from './colors'
import { Start } from './start'
import CrtPostProcessor from './crtPostProcessor'

const game = new Engine({
  width: 224,
  height: 256,
  backgroundColor: Color.fromHex(colors.gray6),
  displayMode: DisplayMode.FitScreen,
  pixelArt: true,
  antialiasing: false,
  scenes: { start: Start, level: Level, intro: Intro },
  physics: { gravity: vec(0, 100) },
})

const crtPostProcessor = new CrtPostProcessor()
game.graphicsContext.addPostProcessor(crtPostProcessor)

game.input.keyboard.on('press', ({ key }) => {
  if (key === Keys.P) {
    if (game.isRunning()) {
      game.stop()
    } else {
      game.start()
    }
  }
})

game.start(loader).then(() => {
  game.goToScene('start')
})
