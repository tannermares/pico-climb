import { DefaultLoader, FontSource, ImageSource, Loader } from 'excalibur'

export const Resources = {
  Font: new FontSource('/fonts/Galaxian1979.ttf', 'Galaxian'),
  SpriteSheet: new ImageSource('/images/spritesheet.png'),
} as const

export const loader = new DefaultLoader()
for (const res of Object.values(Resources)) {
  loader.addResource(res)
}
