const allAttrs = [
  'width',
  'height',
  'font-weight',
  'font-size',
  'color',
  'line-height',
  'letter-spacing',
  'border',
  'border-radius',
  'background',
  'background-color',
  'box-shadow',
  'text-shadow',
  'filter',
];
const disableAttrs = 'position,top,left,bottom,right,font-family,font-style,display,order,flex,flex-grow,flex-shink,flex-direction,align-items,justify-content,gap,mix-blend-mode'.split(',');

const defaultConfig = {
  id: 0,
  name: 'config',
  enabled: true,
  attrs: [...allAttrs],
  disableAttrsStr: disableAttrs.join(','),
  unit: 'px',
  scale: 1,
  border1pxEnabled: true,
  fixFontWeight: true,
  varEnable: false,
  varStr: '',
  customEnable: true,
  customFromStr: '/font-weight: (500|600|800|900)/\n/font-weight: (100|200|300|400|normal)/\n/background: url(.*)/',
  customToStr: 'font-weight: 700\n\n',
};
const CONFIG = {
  allAttrs,
  units: ['px', 'rpx', 'rem', 'pt', 'em', 'vw', 'vh'],
  scales: [1, 2, 3, 0.5],
  // 初始设置
  settings: [
    {
      ...defaultConfig,
    },
    {
      ...defaultConfig,
      id: 1,
      name: 'config 1',
      attrs: [...allAttrs],
    },
  ],
};

export default CONFIG;
