import { CollisionGroup, CollisionGroupManager, vec } from 'excalibur'

const DrumSensorGroup = CollisionGroupManager.create('drumSensorGroup')
const GirderGroup = CollisionGroupManager.create('girder')
const LadderSensorGroup = CollisionGroupManager.create('ladderSensorGroup')
const PlayerGroup = CollisionGroupManager.create('player')
const WallGroup = CollisionGroupManager.create('wall')
const WinGroup = CollisionGroupManager.create('win')

const DrumsCanCollideWith = CollisionGroup.collidesWith([
  DrumSensorGroup,
  GirderGroup,
  PlayerGroup,
])
const FeetCanCollideWith = CollisionGroup.collidesWith([
  GirderGroup,
  WallGroup,
  WinGroup,
])
const LaddersCanCollideWith = CollisionGroup.collidesWith([LadderSensorGroup])

export const Config = {
  girders: [
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
  ],
  groundGirders: [
    vec(152, 89),
    vec(168, 90),
    vec(184, 91),
    vec(200, 92),

    vec(80, 56),
    vec(96, 56),
    vec(112, 56),
    vec(128, 56),
  ],
  ladders: [
    { pos: vec(84, 223), height: 4, sensors: false, broken: false },
    { pos: vec(84, 244), height: 8, sensors: true, broken: true },
    { pos: vec(188, 235), height: 16, sensors: true, broken: false },

    { pos: vec(36, 202), height: 16, sensors: true, broken: false },
    { pos: vec(100, 202), height: 24, sensors: true, broken: false },

    { pos: vec(68, 157), height: 6, sensors: false, broken: false },
    { pos: vec(68, 180), height: 8, sensors: true, broken: true },
    { pos: vec(116, 169), height: 24, sensors: true, broken: false },
    { pos: vec(188, 169), height: 16, sensors: true, broken: false },

    { pos: vec(36, 136), height: 16, sensors: true, broken: false },
    { pos: vec(76, 136), height: 20, sensors: true, broken: false },
    { pos: vec(172, 124), height: 8, sensors: false, broken: false },
    { pos: vec(172, 148), height: 8, sensors: true, broken: true },

    { pos: vec(92, 94), height: 4, sensors: false, broken: false },
    { pos: vec(92, 111), height: 12, sensors: true, broken: true },
    { pos: vec(188, 103), height: 16, sensors: true, broken: false },

    { pos: vec(132, 72), height: 24, sensors: true, broken: false },
  ],
  walls: [vec(0, 128), vec(224, 128)],
  drumSlowTriggers: [
    vec(192, 212),
    vec(32, 179),
    vec(192, 146),
    vec(32, 113),
    vec(192, 80),
  ],
  drumDownTriggers: [
    vec(98, 80),
    vec(194, 84),

    vec(30, 117),
    vec(70, 114),
    vec(167, 108),

    vec(72, 142),
    vec(122, 145),
    vec(194, 150),

    vec(30, 183),
    vec(95, 179),

    vec(89, 210),
    vec(194, 216),
  ],
  drumLeftTriggers: [
    vec(92, 116),
    vec(188, 110),

    vec(68, 183),
    vec(116, 180),
    vec(188, 176),

    vec(84, 247),
    vec(188, 242),
  ],
  drumRightTriggers: [
    vec(36, 143),
    vec(76, 145),
    vec(172, 151),

    vec(36, 209),
    vec(100, 213),
  ],
  colliders: {
    DrumsCanCollideWith,
    DrumSensorGroup,
    FeetCanCollideWith,
    GirderGroup,
    LaddersCanCollideWith,
    LadderSensorGroup,
    PlayerGroup,
    WallGroup,
    WinGroup,
  },
} as const
