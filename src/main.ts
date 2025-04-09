import { Color, DisplayMode, Engine, FadeInOut, vec } from 'excalibur'
import { loader } from './resources'
import { MyLevel } from './level'

const game = new Engine({
  width: 224,
  height: 256,
  backgroundColor: Color.Black,
  displayMode: DisplayMode.FitScreen,
  pixelArt: true,
  scenes: { start: MyLevel },
  physics: { gravity: vec(0, 400) },
})

game
  .start('start', {
    // loader,
    // inTransition: new FadeInOut({
    //   duration: 1000,
    //   direction: 'in',
    //   color: Color.ExcaliburBlue,
    // }),
  })
  .then(() => {})
