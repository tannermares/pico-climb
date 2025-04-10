import {
  Color,
  Engine,
  ExcaliburGraphicsContext,
  Font,
  Label,
  Scene,
  Timer,
  vec,
} from 'excalibur'

export class Intro extends Scene {
  override onInitialize(engine: Engine): void {
    this.add(
      new Label({
        text: 'HOW HIGH CAN YOU GET',
        font: new Font({ family: 'Galaxian', size: 8 }),
        pos: vec(60, 128),
        color: Color.White,
      })
    )

    this.add(
      new Timer({
        interval: 3000,
        repeats: false,
        action: () => this.engine.goToScene('start'),
      })
    )
  }

  override onPostDraw(_ctx: ExcaliburGraphicsContext, elapsed: number): void {
    this.timers[0].start()
  }
}
