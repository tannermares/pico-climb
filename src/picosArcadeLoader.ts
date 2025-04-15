import { Color, DefaultLoader, Future, Util } from 'excalibur'
import { logo } from './loaderLogo'
const { DrawUtil } = Util

export class PicosArcadeLoader extends DefaultLoader {
  public backgroundColor = '#181425'
  public loadingBarColor: Color = new Color(255, 255, 255, 1)

  public logo = logo
  public logoWidth: number = 512
  public logoHeight: number = 561

  protected _imageElement!: HTMLImageElement
  protected _imageLoaded: Future<void> = new Future()
  protected get _image() {
    if (!this._imageElement) {
      this._imageElement = new Image()
      this._imageElement.onload = () => this._imageLoaded.resolve()
      this._imageElement.src = this.logo
    }

    return this._imageElement
  }

  public override onDraw(ctx: CanvasRenderingContext2D) {
    const canvasHeight = this.engine.canvasHeight / this.engine.pixelRatio
    const canvasWidth = this.engine.canvasWidth / this.engine.pixelRatio

    // draw background
    ctx.fillStyle = this.backgroundColor
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    // draw logo
    const width = Math.min(this.logoWidth, canvasWidth * 0.3)
    let logoY = width * 2.25
    let logoX = canvasWidth / 2 - width / 2

    const imageHeight = Math.floor(width * (this.logoHeight / this.logoWidth)) // OG height/width factor
    const oldAntialias = this.engine.screen.antialiasing
    this.engine.screen.antialiasing = true
    ctx.drawImage(
      this._image,
      0,
      0,
      this.logoWidth,
      this.logoHeight,
      logoX,
      logoY - imageHeight - 20,
      width,
      imageHeight,
    )

    // draw progress bar
    let loadingX = logoX
    let loadingY = canvasHeight - canvasHeight / 3

    const rouglyAPixel = canvasWidth / 224

    const progress = width * this.progress
    const margin = rouglyAPixel * 1.5
    const progressWidth = progress - margin * 2
    const outlineHeight = rouglyAPixel * 12
    const height = outlineHeight - margin * 2

    ctx.lineWidth = rouglyAPixel

    DrawUtil.roundRect(ctx, loadingX, loadingY, width, outlineHeight, 0, this.loadingBarColor)
    DrawUtil.roundRect(
      ctx,
      loadingX + margin,
      loadingY + margin,
      progressWidth > 10 ? progressWidth : 10,
      height,
      0,
      null,
      this.loadingBarColor,
    )

    // reset antialiasing to original value
    this.engine.screen.antialiasing = oldAntialias
  }
}
