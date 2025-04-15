import {
  // DefaultLoader,
  FontSource,
  ImageSource,
  Loader,
  Sound,
} from 'excalibur'

export const Resources = {
  Font: new FontSource('./fonts/Galaxian1979.ttf', 'Galaxian'),
  SpriteSheet: new ImageSource('./images/spritesheet.png'),

  // Sounds
  Death: new Sound('./sounds/death.ogg'),
  Hit: new Sound('./sounds/hit.wav'),
  Intro: new Sound('./sounds/intro.ogg'),
  Jump: new Sound('./sounds/jump.wav'),
  Score: new Sound('./sounds/score.wav'),
  Walk1: new Sound('./sounds/walk1.wav'),
  Walk2: new Sound('./sounds/walk2.wav'),
  Win: new Sound('./sounds/win.ogg'),

  // Music
  BackgroundMusic: new Sound('./sounds/bg-music.ogg'),
} as const

export const loader = new Loader()
for (const res of Object.values(Resources)) {
  loader.addResource(res)
}
