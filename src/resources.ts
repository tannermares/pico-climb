import { FontSource, ImageSource, Loader } from 'excalibur'

export const Resources = {
  Sword: new ImageSource('./images/sword.png'),
  Font: new FontSource('/fonts/Galaxian1979.ttf', 'Galaxian'),
} as const

export const loader = new Loader()
for (const res of Object.values(Resources)) {
  loader.addResource(res)
}
