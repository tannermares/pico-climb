import {
  Actor,
  Animation,
  AnimationStrategy,
  CollisionType,
  Color,
  Engine,
  Keys,
  SpriteSheet,
  vec,
  Vector,
} from 'excalibur'
import { Config } from './config'
import { Drum } from './drum'
import { Resources } from './resources'
import { Level } from './level'

export class Player extends Actor {
  static spriteSheet = SpriteSheet.fromImageSource({
    image: Resources.SpriteSheet,
    grid: {
      rows: 16,
      columns: 16,
      spriteWidth: 16,
      spriteHeight: 16,
    },
  })
  static startSprite = Player.spriteSheet.getSprite(0, 0)
  static jumpSprite = Player.spriteSheet.getSprite(1, 0)
  static runAnimation = Animation.fromSpriteSheet(
    Player.spriteSheet,
    [0, 1, 0, 2],
    80,
    AnimationStrategy.Loop
  )
  static climbAnimation = Animation.fromSpriteSheet(
    Player.spriteSheet,
    [3, 4],
    300,
    AnimationStrategy.Loop
  )
  static climbSprite1 = Player.spriteSheet.getSprite(3, 0)
  static climbSprite2 = Player.spriteSheet.getSprite(4, 0)

  playing = false
  lives = 3
  canClimbUp = false
  canClimbDown = false
  climbing = false
  jumping = false
  _bodySensor!: Actor
  _ladderSensor!: Actor
  startSprite!: ex.Sprite

  constructor(private level: Level) {
    super({
      name: 'PlayerFeet',
      pos: vec(16, 244),
      width: 5,
      height: 2,
      // color: Color.Brown, // DEBUG
      collisionType: CollisionType.Active,
      collisionGroup: Config.colliders.FeetCanCollideWith,
      z: 2,
    })
  }

  override onInitialize(engine: Engine): void {
    this._bodySensor = new Actor({
      name: 'BodySensor',
      width: 8,
      height: 8,
      pos: vec(0, -7),
      collisionType: CollisionType.Passive,
      collisionGroup: Config.colliders.PlayerGroup,
      color: Color.White, // DEBUG
      z: -1,
    })
    this._bodySensor.on('collisionstart', ({ other }) => {
      if (other.owner instanceof Drum) {
        if (this.lives === 1) {
          this.level.engine.goToScene('gameOver')
          this.level.pipeFactory.reset()
          this.reset()
        } else {
          this.lives -= 1
          this.level.engine.goToScene('intro')
          this.level.pipeFactory.reset()
          this.reset()
        }
      }
    })
    this.addChild(this._bodySensor)

    this._ladderSensor = new Actor({
      name: 'ladderSensor',
      width: 3,
      height: 1,
      collisionType: CollisionType.Passive,
      collisionGroup: Config.colliders.LadderSensorGroup,
      // color: Color.Yellow, // DEBUG
      z: 1,
    })
    this.addChild(this._ladderSensor)

    this._bodySensor.graphics.add('start', Player.startSprite)
    this._bodySensor.graphics.add('run', Player.runAnimation)
    this._bodySensor.graphics.add('jump', Player.jumpSprite)
    this._bodySensor.graphics.add('climb', Player.climbAnimation)
    this._bodySensor.graphics.add('climb1', Player.climbSprite1)
    this._bodySensor.graphics.add('climb2', Player.climbSprite2)

    this._bodySensor.graphics.use('start')
    this._bodySensor.graphics.flipHorizontal = true
  }

  override onPostUpdate(engine: Engine): void {
    if (!this.playing) return

    const keys = engine.input.keyboard
    const speed = 30
    const jumpStrength = 50

    if (this.jumping) {
      this._bodySensor.graphics.use('jump')
      return
    }

    if (this.climbing) {
      this.vel.x = 0

      if (keys.isHeld(Keys.Up)) {
        this._bodySensor.graphics.use('climb')
        this.vel.y = -speed
      } else if (keys.isHeld(Keys.Down)) {
        this._bodySensor.graphics.use('climb')
        this.vel.y = speed
      } else {
        this._bodySensor.graphics.use('climb1')
        this.vel.y = 0
      }
      return
    }

    // Normal Movement
    if (keys.isHeld(Keys.Right)) {
      this.vel.x = speed
      this._bodySensor.graphics.use('run')
      this._bodySensor.graphics.flipHorizontal = true
    } else if (keys.isHeld(Keys.Left)) {
      this._bodySensor.graphics.use('run')
      this._bodySensor.graphics.flipHorizontal = false
      this.vel.x = -speed
    } else {
      this._bodySensor.graphics.use('start')
      this.vel.x = 0
    }

    // Jump
    if (!this.jumping && this.vel.y === 0 && keys.wasPressed(Keys.X)) {
      this.vel.y = -jumpStrength
      this.jumping = true
    }

    // Try to climb up
    if (
      !this.jumping &&
      this.canClimbUp &&
      keys.wasPressed(Keys.Up) &&
      !(keys.isHeld(Keys.Left) || keys.isHeld(Keys.Right))
    ) {
      this.startClimbing()
    }

    if (
      !this.jumping &&
      this.canClimbDown &&
      keys.wasPressed(Keys.Down) &&
      !(keys.isHeld(Keys.Left) || keys.isHeld(Keys.Right))
    ) {
      this.startClimbing()
    }
  }

  startClimbing() {
    this.climbing = true
    this.body.useGravity = false
    this.body.collisionType = CollisionType.PreventCollision
  }

  stopClimbing() {
    this.climbing = false
    this.vel = Vector.Zero
    this.body.useGravity = true
    this.body.collisionType = CollisionType.Active
  }

  start() {
    this.playing = true
    this.pos = vec(16, 244)
  }

  stop() {
    this.playing = false
    this.vel = Vector.Zero
    this.acc = Vector.Zero
  }

  reset() {
    this.pos = vec(16, 244)
    this.graphics.flipHorizontal = true
    this.stop()
  }
}
