import { Random, Timer, vec } from 'excalibur'
import { MyLevel } from './level'
import { Drum } from './drum'

export class DrumFactory {
  private timer: Timer

  constructor(private level: MyLevel, private random: Random) {
    this.timer = new Timer({
      // random: this.random,
      // randomRange: [1000, 3000],
      interval: 3000,
      repeats: true,
      action: () => this.spawnDrums(),
    })

    this.level.add(this.timer)
  }

  spawnDrums() {
    this.level.add(new Drum())
  }

  start() {
    this.timer.start()
  }

  reset() {
    for (const actor of this.level.actors) {
      if (actor instanceof Drum) actor.kill()
    }
  }

  stop() {
    this.timer.stop()

    for (const actor of this.level.actors) {
      if (actor instanceof Drum) actor.vel = vec(0, 0)
    }
  }
}
