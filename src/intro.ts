import {
  Color,
  Engine,
  ExcaliburGraphicsContext,
  Font,
  Label,
  Scene,
  SceneActivationContext,
  Timer,
  vec,
} from 'excalibur'
import { Resources } from './resources'

export class Intro extends Scene {
  override onInitialize(engine: Engine): void {
    this.add(
      new Label({
        text: 'CAN YOU MAKE IT TO WORSHIP',
        font: new Font({ family: 'Galaxian', size: 8 }),
        pos: vec(8, 128),
        color: Color.White,
      })
    )

    this.add(
      new Timer({
        interval: 3000,
        repeats: false,
        action: () => this.engine.goToScene('level'),
      })
    )
  }

  override onActivate(context: SceneActivationContext<unknown>): void {
    Resources.Intro.play()
  }

  override onPostDraw(_ctx: ExcaliburGraphicsContext, elapsed: number): void {
    this.timers[0].start()
  }
}
