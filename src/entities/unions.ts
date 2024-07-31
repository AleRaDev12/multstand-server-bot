export const Painting = {
  None: 'Без обработки',
  GrindingOnly: 'Только шлифовка',
  Lac: 'Шлифовка, лак',
  WhiteLac: 'Шлифовка, белая эмаль, лак',
  BlackLac: 'Шлифовка, чёрная эмаль, лак',
};
export type PaintingType = (typeof Painting)[keyof typeof Painting];

export const Tripod = {
  No: 'Без штатива',
  Set1: 'Комплект №1',
  Set2: 'Комплект №2',
  Set3: 'Комплект №3',
};
export type TripodType = (typeof Tripod)[keyof typeof Tripod];

export const Led = {
  Economy: 'Эконом',
  Premium: 'Премиум',
};

const Stand2D = {
  mTM15: 'TM15',
  mTL15: 'TL15',
  m2DMLite: '2D-M-Lite',
  mTMLite: 'T-Lite',
};

const Stand3D = {
  m3DM5: '3D-M-5',
  m3DL5: '3D-L-5',
};

export const StandModel = {
  ...Stand2D,
  ...Stand3D,
};
export type StandModelType = (typeof StandModel)[keyof typeof StandModel];

export const LedStripModel = {
  seastar12v1: 'Seastar 12v -lm 12W -CRI',
  seastar24v1: 'Seastar 24v -lm 12W -CRI',
  arlight24v19913: 'Arlight 19913 24v 1250lm 10W 85CRI',
  arlight24v24534: 'Arlight 24534 24v 1800lm 12W 85CRI',
  arlight24v21451: 'Arlight 21451 24v 1000lm 10W 98CRI',
};
export type LedStripModelType =
  (typeof LedStripModel)[keyof typeof LedStripModel];
