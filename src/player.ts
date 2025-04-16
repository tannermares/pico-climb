import {
  Actor,
  Animation,
  AnimationStrategy,
  CollisionType,
  Color,
  Engine,
  Keys,
  SpriteSheet,
  Timer,
  vec,
  Vector,
} from 'excalibur'
import { Config } from './config'
import { Resources } from './resources'
import { Level } from './level'
import { PlayerBodySensor } from './playerBodySensor'

export class Player extends Actor {
  static speed = 30
  static jumpStrength = 50
  static baseScore = 100
  static spriteSheet = SpriteSheet.fromImageSource({
    image: Resources.SpriteSheet,
    grid: {
      rows: 1,
      columns: 11,
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
  static walkAnimation = Animation.fromSpriteSheetCoordinates({
    spriteSheet: Player.spriteSheet,
    frameCoordinates: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 0 },
      { x: 2, y: 0 },
    ],
    durationPerFrame: 300,
  })
  static climbAnimation = Animation.fromSpriteSheet(
    Player.spriteSheet,
    [4, 5],
    300
  )
  static endClimbUpAnimation = Animation.fromSpriteSheetCoordinates({
    spriteSheet: Player.spriteSheet,
    frameCoordinates: [
      { x: 6, y: 0 },
      { x: 7, y: 0 },
      { x: 8, y: 0 },
      { x: 9, y: 0 },
      { x: 10, y: 0 },
    ],
    durationPerFrame: 80,
  })
  static startClimbDownAnimation = Animation.fromSpriteSheetCoordinates({
    spriteSheet: Player.spriteSheet,
    frameCoordinates: [
      { x: 10, y: 0 },
      { x: 9, y: 0 },
      { x: 8, y: 0 },
      { x: 7, y: 0 },
      { x: 6, y: 0 },
    ],
    durationPerFrame: 80,
  })
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

  playing = false
  canClimbUp = false
  canClimbDown = false
  climbing = false
  climbingUp = false
  climbingDown = false
  climbingWall = false
  jumping = false
  falling = false
  scoreMultiplier = 1
  maxMultiplier = 1
  level: Level
  bodySensor = new PlayerBodySensor()
  climbingEndSensor = new Actor({
    name: 'PlayerClimbingEndSensor',
    width: 3,
    height: 2,
    pos: vec(0, -7),
    collisionType: CollisionType.Passive,
    collisionGroup: Config.colliders.LadderSensorGroup,
    color: Color.Yellow,
  })
  ladderSensor = new Actor({
    name: 'PlayerLadderSensor',
    width: 3,
    height: 2,
    collisionType: CollisionType.Passive,
    collisionGroup: Config.colliders.LadderSensorGroup,
  })
  multiplyTimer = new Timer({
    interval: 300,
    action: () =>
      this.level.incrementScore(Player.baseScore * this.maxMultiplier),
  })
  girdersTouching = 0

  static startingPoint = vec(36, 248)
  // static startingPoint = vec(117, 210) // Score testing

  constructor(level: Level) {
    super({
      name: 'PlayerFeet',
      pos: Player.startingPoint,
      width: 5,
      height: 2,
      collisionType: CollisionType.Active,
      collisionGroup: Config.colliders.FeetCanCollideWith,
    })

    this.level = level
  }

  override onInitialize(_engine: Engine): void {
    this.addChild(this.bodySensor)
    this.addChild(this.ladderSensor)

    this.level.add(this.multiplyTimer)
  }

  override onPostUpdate(engine: Engine): void {
    if (!this.playing) return

    const keys = engine.input.keyboard

    if (this.jumping) {
      this.bodySensor.graphics.use('jump')
      return
    }

    if (this.falling) {
      this.vel.x = 0
      this.bodySensor.graphics.use('jump')
      return
    }

    // Special Climbing Down Animation
    if (
      this.climbingDown &&
      !(
        Player.startClimbDownAnimation.currentFrameIndex ===
        Player.startClimbDownAnimation.frames.length - 1
      )
    ) {
      this.vel.x = 0
      this.bodySensor.graphics.use('startClimbDown')

      if (keys.wasPressed(Keys.Up)) {
        const nextFrame =
          (Player.startClimbDownAnimation.currentFrameIndex - 1) %
          Player.startClimbDownAnimation.frames.length
        Player.startClimbDownAnimation.goToFrame(nextFrame)
      }

      if (keys.wasPressed(Keys.Down)) {
        const nextFrame =
          (Player.startClimbDownAnimation.currentFrameIndex + 1) %
          Player.startClimbDownAnimation.frames.length
        Player.startClimbDownAnimation.goToFrame(nextFrame)
      }

      if (keys.isHeld(Keys.Up)) {
        this.bodySensor.graphics.use('climb')
        Player.climbAnimation.play()
        this.playClimbSound()
        this.vel.y = -Player.speed
      } else if (keys.isHeld(Keys.Down)) {
        Player.startClimbDownAnimation.play()
        this.playClimbSound()
        this.vel.y = Player.speed
      } else {
        Player.startClimbDownAnimation.pause()
        this.vel.y = 0
      }

      return
    }

    if (
      this.climbingUp &&
      !(
        Player.endClimbUpAnimation.currentFrameIndex ===
        Player.endClimbUpAnimation.frames.length
      )
    ) {
      this.vel.x = 0
      this.bodySensor.graphics.use('endClimbUp')

      if (keys.wasPressed(Keys.Up)) {
        const nextFrame =
          (Player.endClimbUpAnimation.currentFrameIndex + 1) %
          Player.endClimbUpAnimation.frames.length
        Player.endClimbUpAnimation.goToFrame(nextFrame)
      }

      if (keys.wasPressed(Keys.Down)) {
        const nextFrame =
          (Player.endClimbUpAnimation.currentFrameIndex - 1) %
          Player.endClimbUpAnimation.frames.length
        Player.endClimbUpAnimation.goToFrame(nextFrame)
      }

      if (keys.isHeld(Keys.Up)) {
        Player.endClimbUpAnimation.play()
        this.playClimbSound()
        this.vel.y = -Player.speed
      } else if (keys.isHeld(Keys.Down)) {
        this.bodySensor.graphics.use('climb')
        Player.climbAnimation.play()
        this.playClimbSound()
        this.vel.y = Player.speed
      } else {
        Player.endClimbUpAnimation.pause()
        this.vel.y = 0
      }

      return
    }

    if (this.climbing) {
      this.vel.x = 0
      this.bodySensor.graphics.use('climb')

      if (keys.wasPressed(Keys.Up) || keys.wasPressed(Keys.Down)) {
        const nextFrame =
          (Player.climbAnimation.currentFrameIndex + 1) %
          Player.climbAnimation.frames.length
        Player.climbAnimation.goToFrame(nextFrame)
      }

      if (keys.isHeld(Keys.Up)) {
        if (this.climbingWall) {
          Player.climbAnimation.pause()
          this.vel.y = 0
        } else {
          Player.climbAnimation.play()
          this.playClimbSound()
          this.vel.y = -Player.speed
        }
      } else if (keys.isHeld(Keys.Down)) {
        Player.climbAnimation.play()
        this.playClimbSound()
        this.vel.y = Player.speed
      } else {
        Player.climbAnimation.pause()
        this.vel.y = 0
      }
      return
    }

    this.bodySensor.graphics.use('run')
    if (keys.wasPressed(Keys.Right) || keys.wasPressed(Keys.Left)) {
      const nextFrame =
        (Player.runAnimation.currentFrameIndex + 1) %
        Player.runAnimation.frames.length
      Player.runAnimation.goToFrame(nextFrame)
    }

    // Normal Movement
    if (keys.isHeld(Keys.Right)) {
      this.vel.x = Player.speed
      Player.runAnimation.play()
      this.bodySensor.graphics.flipHorizontal = true
    } else if (keys.isHeld(Keys.Left)) {
      this.vel.x = -Player.speed
      Player.runAnimation.play()
      this.bodySensor.graphics.flipHorizontal = false
    } else {
      this.vel.x = 0
      Player.runAnimation.pause()
    }

    // Sounds
    if (this.vel.x !== 0) {
      this.playRunSound()
    }

    // Jump
    if (this.vel.y === 0 && keys.wasPressed(Keys.Space)) {
      Resources.Jump.play()
      this.vel.y = -Player.jumpStrength
      this.jumping = true
    }

    // Climbing Up
    if (
      this.canClimbUp &&
      keys.wasPressed(Keys.Up) &&
      !(keys.isHeld(Keys.Left) || keys.isHeld(Keys.Right))
    ) {
      this.startClimbing()
    }

    // Climbing Down
    if (
      this.canClimbDown &&
      keys.wasPressed(Keys.Down) &&
      !(keys.isHeld(Keys.Left) || keys.isHeld(Keys.Right))
    ) {
      this.climbingDown = true
      this.bodySensor.graphics.use('startClimbDown')
      Player.startClimbDownAnimation.reset()

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
    this.climbingUp = false
    this.climbingDown = false
    this.vel = Vector.Zero
    this.body.useGravity = true
    this.body.collisionType = CollisionType.Active
    Player.runAnimation.reset()
  }

  start() {
    this.playing = true
  }

  stop() {
    this.playing = false
    this.body.useGravity = false
    this.vel = Vector.Zero
    this.acc = Vector.Zero
    const anim = this.bodySensor.graphics.current
    if (anim instanceof Animation && anim.strategy === AnimationStrategy.Loop)
      anim.pause()
  }

  reset() {
    this.canClimbUp = false
    this.canClimbDown = false
    this.climbingWall = false
    this.jumping = false
    this.falling = false
    this.stopClimbing()
    this.pos = Player.startingPoint
    this.bodySensor.graphics.flipHorizontal = true
  }

  triggerDeath() {
    this.bodySensor.graphics.use('death')
    const anim = this.bodySensor.graphics.current
    if (anim instanceof Animation) anim.reset()
  }

  playRunSound() {
    if (Resources.Walk1.isPlaying() || Resources.Walk2.isPlaying()) return

    if (this.level.rand.bool(0.75)) {
      Resources.Walk1.play()
    } else {
      Resources.Walk2.play()
    }
  }

  playClimbSound() {
    if (Resources.Climb1.isPlaying() || Resources.Climb2.isPlaying()) return

    if (this.level.rand.bool(0.75)) {
      Resources.Climb1.play()
    } else {
      Resources.Climb2.play()
    }
  }
}
