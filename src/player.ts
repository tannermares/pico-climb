import {
  Actor,
  Animation,
  AnimationStrategy,
  CollisionType,
  Engine,
  Keys,
  SpriteSheet,
  Timer,
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
      rows: 1,
      columns: 9,
      spriteWidth: 16,
      spriteHeight: 16,
    },
  })
  static deathSpriteSheet = SpriteSheet.fromImageSource({
    image: Resources.SpriteSheet,
    grid: {
      rows: 1,
      columns: 5,
      spriteWidth: 16,
      spriteHeight: 16,
    },
    spacing: {
      originOffset: {
        x: 128,
        y: 16,
      },
    },
  })
  static startSprite = Player.spriteSheet.getSprite(0, 0)
  static jumpSprite = Player.spriteSheet.getSprite(3, 0)
  static runAnimation = Animation.fromSpriteSheetCoordinates({
    spriteSheet: Player.spriteSheet,
    frameCoordinates: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 0 },
      { x: 2, y: 0 },
    ],
    durationPerFrame: 80,
  })
  static walkAnimation = Animation.fromSpriteSheet(
    Player.spriteSheet,
    [0, 1, 0, 2],
    300
  )
  static climbAnimation = Animation.fromSpriteSheet(
    Player.spriteSheet,
    [4, 5],
    300
  )
  static deathAnimation = Animation.fromSpriteSheetCoordinates({
    spriteSheet: Player.deathSpriteSheet,
    frameCoordinates: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 4, y: 0 },
    ],
    durationPerFrame: 100,
    strategy: AnimationStrategy.Freeze,
  })

  static climbSprite1 = Player.spriteSheet.getSprite(4, 0)
  static climbSprite2 = Player.spriteSheet.getSprite(5, 0)
  static startingPoint = vec(16, 248)
  // static startingPoint = vec(130, 80) // Score testing
  // static startingPoint = vec(130, 200) // Barrel testing

  playing = false
  canClimbUp = false
  canClimbDown = false
  climbing = false
  climbingWall = false
  jumping = false
  falling = true
  _bodySensor!: Actor
  _ladderSensor!: Actor
  _fallingSensor!: Actor
  startSprite!: ex.Sprite
  fallTimer = new Timer({
    interval: 300,
    repeats: false,
    action: () => {
      this.falling = true
    },
  })

  constructor(private level: Level) {
    super({
      name: 'PlayerFeet',
      pos: Player.startingPoint,
      width: 5,
      height: 2,
      collisionType: CollisionType.Active,
      collisionGroup: Config.colliders.FeetCanCollideWith,
    })
  }

  override onInitialize(_engine: Engine): void {
    this._bodySensor = new Actor({
      name: 'BodySensor',
      width: 8,
      height: 8,
      pos: vec(0, -7),
      collisionType: CollisionType.Passive,
      collisionGroup: Config.colliders.PlayerGroup,
    })
    this._bodySensor.on('collisionstart', ({ other }) => {
      if (other.owner instanceof Drum) {
        other.owner.acc = Vector.Zero
        other.owner.vel = Vector.Zero
        other.owner.body.useGravity = false
        this.level.triggerDeath()
      }
    })
    this.addChild(this._bodySensor)

    this._ladderSensor = new Actor({
      name: 'PlayerLadderSensor',
      width: 3,
      height: 2,
      collisionType: CollisionType.Passive,
      collisionGroup: Config.colliders.LadderSensorGroup,
      // color: Color.Yellow, // DEBUG
    })
    this.addChild(this._ladderSensor)

    // this._fallingSensor = new Actor({
    //   name: 'PlayerFallingSensor',
    //   width: 3,
    //   height: 2,
    //   pos: vec(0, 4),
    //   collisionType: CollisionType.Passive,
    //   collisionGroup: Config.colliders.FeetCanCollideWith,
    //   color: Color.Yellow, // DEBUG
    // })
    // this.addChild(this._fallingSensor)

    this._bodySensor.graphics.add('start', Player.startSprite)
    this._bodySensor.graphics.add('run', Player.runAnimation)
    this._bodySensor.graphics.add('walk', Player.walkAnimation)
    this._bodySensor.graphics.add('jump', Player.jumpSprite)
    this._bodySensor.graphics.add('climb', Player.climbAnimation)
    this._bodySensor.graphics.add('climb1', Player.climbSprite1)
    this._bodySensor.graphics.add('climb2', Player.climbSprite2)
    this._bodySensor.graphics.add('death', Player.deathAnimation)

    this._bodySensor.graphics.use('start')
    this._bodySensor.graphics.flipHorizontal = true

    this.level.add(this.fallTimer)
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
        if (this.climbingWall) {
          this._bodySensor.graphics.use('climb1')
          this.vel.y = 0
        } else {
          if (!(Resources.Walk1.isPlaying() || Resources.Walk2.isPlaying()))
            this.level.rand.bool(0.75)
              ? Resources.Walk1.play()
              : Resources.Walk2.play()
          this._bodySensor.graphics.use('climb')
          this.vel.y = -speed
        }
      } else if (keys.isHeld(Keys.Down)) {
        if (!(Resources.Walk1.isPlaying() || Resources.Walk2.isPlaying()))
          this.level.rand.bool(0.75)
            ? Resources.Walk1.play()
            : Resources.Walk2.play()
        this._bodySensor.graphics.use('climb')
        this.vel.y = speed
      } else {
        this._bodySensor.graphics.use('climb1')
        this.vel.y = 0
      }
      return
    }

    if (this.vel.y > 0) {
      if (!this.falling && !this.fallTimer.isRunning) {
        this.fallTimer.start()
      } else {
        if (this.falling) {
          this.vel.x = 0
          // this._bodySensor.graphics.use('jump')
          return
        }
      }
    }

    // Normal Movement
    if (keys.isHeld(Keys.Right)) {
      this.vel.x = speed
    } else if (keys.isHeld(Keys.Left)) {
      this.vel.x = -speed
    } else {
      this.vel.x = 0
    }

    // Animations
    if (this.vel.x === 0) {
      this._bodySensor.graphics.use('start')
    } else {
      this._bodySensor.graphics.use('run')
      this._bodySensor.graphics.flipHorizontal = this.vel.x > 0
      const anim = this._bodySensor.graphics.current
      if (anim instanceof Animation) anim.play()
    }

    // Sounds
    if (this.vel.x !== 0) {
      if (!(Resources.Walk1.isPlaying() || Resources.Walk2.isPlaying()))
        this.level.rand.bool(0.75)
          ? Resources.Walk1.play()
          : Resources.Walk2.play()
    }

    // Jump
    if (this.vel.y === 0 && keys.wasPressed(Keys.Space)) {
      Resources.Jump.play()
      this.vel.y = -jumpStrength
      this.jumping = true
    }

    // Try to climb up
    if (
      this.canClimbUp &&
      keys.wasPressed(Keys.Up) &&
      !(keys.isHeld(Keys.Left) || keys.isHeld(Keys.Right))
    ) {
      this.startClimbing()
    }

    if (
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
    this.body.collisionType = CollisionType.Passive
  }

  stopClimbing() {
    this.climbing = false
    this.vel = Vector.Zero
    this.body.useGravity = true
    this.body.collisionType = CollisionType.Active
  }

  start() {
    this.playing = true
  }

  stop() {
    this.playing = false
    this.body.useGravity = false
    this.vel = Vector.Zero
    this.acc = Vector.Zero
    const anim = this._bodySensor.graphics.current
    if (anim instanceof Animation && anim.strategy === AnimationStrategy.Loop)
      anim.pause()
  }

  reset() {
    this.canClimbUp = false
    this.canClimbDown = false
    this.climbingWall = false
    this.jumping = false
    this.stopClimbing()
    this.pos = Player.startingPoint
    this._bodySensor.graphics.flipHorizontal = true
  }

  triggerDeath() {
    this._bodySensor.graphics.use('death')
    const anim = this._bodySensor.graphics.current
    if (anim instanceof Animation) anim.reset()
  }
}
