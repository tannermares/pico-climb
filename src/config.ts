import { CollisionGroup, CollisionGroupManager, vec } from 'excalibur'
import { Wall } from './wall'

const DrumGroup = CollisionGroupManager.create('drum')
const FootGroup = CollisionGroupManager.create('foot')
const GirderGroup = CollisionGroupManager.create('girder')
const LadderGroup = CollisionGroupManager.create('ladder')
const LadderSensorGroup = CollisionGroupManager.create('ladderSensor')
const PlayerGroup = CollisionGroupManager.create('player')
const WallGroup = CollisionGroupManager.create('wall')

const DrumsCanCollideWith = CollisionGroup.collidesWith([
  DrumGroup,
  GirderGroup,
  PlayerGroup,
  WallGroup,
])
const FeetCanCollideWith = CollisionGroup.collidesWith([GirderGroup, WallGroup])
const GirdersCanCollideWith = CollisionGroup.collidesWith([FootGroup])
const LaddersCanCollideWith = CollisionGroup.collidesWith([FootGroup])
const LaddersSensorCanCollideWith = CollisionGroup.collidesWith([LadderGroup])
const PlayersCanCollideWith = CollisionGroup.collidesWith([
  PlayerGroup,
  WallGroup,
  DrumGroup,
])
const WallsCollideWith = CollisionGroup.collidesWith([
  PlayerGroup,
  FootGroup,
  DrumGroup,
])

export const Config = {
  girders: [
    vec(8, 252),
    vec(24, 252),
    vec(40, 252),
    vec(56, 252),
    vec(72, 252),
    vec(88, 252),
    vec(104, 252),
    vec(120, 251),
    vec(136, 250),
    vec(152, 249),
    vec(168, 248),
    vec(184, 247),
    vec(200, 246),
    vec(216, 245),

    vec(8, 212),
    vec(24, 213),
    vec(40, 214),
    vec(56, 215),
    vec(72, 216),
    vec(88, 217),
    vec(104, 218),
    vec(120, 219),
    vec(136, 220),
    vec(152, 221),
    vec(168, 222),
    vec(184, 223),
    vec(200, 224),

    vec(24, 191),
    vec(40, 190),
    vec(56, 189),
    vec(72, 188),
    vec(88, 187),
    vec(104, 186),
    vec(120, 185),
    vec(136, 184),
    vec(152, 183),
    vec(168, 182),
    vec(184, 181),
    vec(200, 180),
    vec(216, 179),

    vec(8, 146),
    vec(24, 147),
    vec(40, 148),
    vec(56, 149),
    vec(72, 150),
    vec(88, 151),
    vec(104, 152),
    vec(120, 153),
    vec(136, 154),
    vec(152, 155),
    vec(168, 156),
    vec(184, 157),
    vec(200, 158),

    vec(24, 125),
    vec(40, 124),
    vec(56, 123),
    vec(72, 122),
    vec(88, 121),
    vec(104, 120),
    vec(120, 119),
    vec(136, 118),
    vec(152, 117),
    vec(168, 116),
    vec(184, 115),
    vec(200, 114),
    vec(216, 113),

    vec(8, 88),
    vec(24, 88),
    vec(40, 88),
    vec(56, 88),
    vec(72, 88),
    vec(88, 88),
    vec(104, 88),
    vec(120, 88),
    vec(136, 88),
    vec(152, 89),
    vec(168, 90),
    vec(184, 91),
    vec(200, 92),

    vec(72, 56),
    vec(88, 56),
    vec(104, 56),
    vec(120, 56),
    vec(136, 56),
    vec(152, 56),
  ],
  ladders: [
    { pos: vec(84, 223), height: 4 },
    { pos: vec(84, 244), height: 8 },
    { pos: vec(188, 231), height: 24 },

    { pos: vec(36, 198), height: 24 },
    { pos: vec(100, 198), height: 32 },

    { pos: vec(68, 157), height: 6 },
    { pos: vec(68, 180), height: 8 },
    { pos: vec(116, 165), height: 32 },
    { pos: vec(188, 165), height: 24 },

    { pos: vec(36, 132), height: 24 },
    { pos: vec(76, 132), height: 28 },
    { pos: vec(172, 124), height: 8 },
    { pos: vec(172, 148), height: 8 },

    { pos: vec(92, 94), height: 4 },
    { pos: vec(92, 111), height: 12 },
    { pos: vec(188, 99), height: 24 },

    { pos: vec(44, 56), height: 56 },
    { pos: vec(60, 56), height: 56 },
    { pos: vec(132, 68), height: 32 },
  ],
  barrels: [vec(4, 60), vec(12, 60), vec(4, 76), vec(12, 76)],
  walls: [vec(0, 128), vec(224, 128)],
  // walls: [
  //   [vec(0, 0), vec(0, 256)],
  //   [vec(224, 0), vec(224, 256)],
  // ],
  colliders: {
    DrumGroup,
    DrumsCanCollideWith,
    FeetCanCollideWith,
    FootGroup,
    GirderGroup,
    GirdersCanCollideWith,
    LadderGroup,
    LaddersCanCollideWith,
    LadderSensorGroup,
    LaddersSensorCanCollideWith,
    PlayerGroup,
    PlayersCanCollideWith,
    WallGroup,
    WallsCollideWith,
  },
} as const
