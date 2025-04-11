import {
  Actor,
  Animation,
  AnimationStrategy,
  clamp,
  CollisionType,
  Color,
  Engine,
  Label,
  SpriteSheet,
  vec,
} from 'excalibur'
import { Config } from './config'
import { colors } from './colors'
import { Resources } from './resources'
import { Player } from './player'
import { Level } from './level'

export class Drum extends Actor {
  static spriteSheet = SpriteSheet.fromImageSource({
    image: Resources.SpriteSheet,
    grid: {
      rows: 1,
      columns: 6,
      spriteWidth: 16,
      spriteHeight: 10,
    },
    spacing: {
      originOffset: {
        x: 0,
        y: 22,
      },
    },
  })
  static rollAnimation = Animation.fromSpriteSheet(
    Drum.spriteSheet,
    [0, 1, 2, 3],
    200,
    AnimationStrategy.Loop
  )

  static rollDownAnimation = Animation.fromSpriteSheet(
    Drum.spriteSheet,
    [4, 5],
    200,
    AnimationStrategy.Loop
  )

  constructor(private level: Level) {
    super({
      name: 'Drum',
      pos: vec(18, 79),
      height: 10,
      width: 12,
      collisionType: CollisionType.Active,
      collisionGroup: Config.colliders.DrumsCanCollideWith,
      color: Color.fromHex(colors.orange1),
      vel: vec(65, 0),
    })

    this.on('exitviewport', () => this.kill())
  }
  override onInitialize(engine: Engine): void {
    this.graphics.add('roll', Drum.rollAnimation)
    this.graphics.add('rollDown', Drum.rollDownAnimation)
    this.graphics.use('roll')

    const scoreSensor = new Actor({
      name: 'ScoreSensor',
      width: 2,
      height: 8,
      pos: vec(0, -this.height + 2),
      collisionType: CollisionType.Passive,
      collisionGroup: Config.colliders.DrumsCanCollideWith,
      // color: Color.Yellow, // DEBUG
      z: 1,
    })
    scoreSensor.on('collisionstart', ({ other }) => {
      if (
        other.owner.parent instanceof Player &&
        other.owner.parent.jumping &&
        other.owner.name === 'BodySensor'
      ) {
        this.level.incrementScore(100)
        Resources.Score.play()
        const scoreLabel = new Label({
          pos: vec(other.owner.parent.pos.x - 10, other.owner.parent.pos.y + 3),
          text: '100',
          color: Color.White,
        })
        this.level.add(scoreLabel)
        this.level.engine.clock.schedule(() => scoreLabel.kill(), 1000)
      }
    })

    this.addChild(scoreSensor)
  }

  override onPostUpdate(_engine: Engine): void {
    this.vel.x = clamp(this.vel.x, -65, 65)

    if (this.vel.x < 0) {
      this.graphics.flipHorizontal = true
    } else {
      this.graphics.flipHorizontal = false
    }
  }
}
