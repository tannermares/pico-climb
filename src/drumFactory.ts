import { Timer, vec } from 'excalibur'

import { Drum } from './drum'
import { Level } from './level'

export class DrumFactory {
  private timer: Timer

  constructor(private level: Level) {
    this.timer = new Timer({
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
