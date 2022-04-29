import * as vars from './vars/index.js';

window.COPY_FIGMA_CSS = {
  allAttr: [
    'width',
    'height',
    'margin',
    'padding',
    'font-weight',
    'font-size',
    'color',
    'line-height',
    'border',
    'border-radius',
    'background',
    'background-color',
    'box-shadow',
    'text-shadow',
  ],
  // 初始设置
  settings: {
    enabled: true,
    attrs: [
      'font-weight',
      'font-size',
      'line-height',
      'color',
      'border',
      'border-radius',
      'background',
      'background-color',
      'box-shadow',
      'text-shadow',
    ],
    unit: 'px',
    scale: 1,
    border1pxEnabled: true,
    fixFontWeight: true,
    varsEnabled: false,
    vars: [
      {
        name: 'patient-uni',
        str: vars.PatientUniStr.trim(),
        editable: false,
      },
      {
        name: 'medsaas',
        str: vars.MedsaasStr.trim(),
        editable: true,
      }
    ]
  },
};
