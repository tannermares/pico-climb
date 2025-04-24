import { ScreenShader, Shader, VertexLayout } from 'excalibur'
import crtShader from './crtShader'

export default class CrtPostProcessor implements ex.PostProcessor {
  private _shader!: ScreenShader

  initialize(gl: WebGL2RenderingContext): void {
    this._shader = new ScreenShader(gl, crtShader)
  }

  getLayout(): VertexLayout {
    return this._shader.getLayout()
  }

  getShader(): Shader {
    return this._shader.getShader()
  }
}
