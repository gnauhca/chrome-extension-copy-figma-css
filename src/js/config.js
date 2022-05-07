import * as vars from './vars/index.js';

const CONFIG = {
  allAttrs: [
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
  units: ["px", "rpx", "rem", "pt", "em"],
  scales: [1, 2, 0.5],
  // 初始设置
  settings: [
    {
      name: 'default',
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
      varEnable: false,
      varStr: vars.PatientUniStr.trim(),
      
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
        },
      ],
    },
    {
      name: 'default 2',
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
      varEnable: false,
      varStr: vars.PatientUniStr.trim(),

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
        },
      ],
    },
  ],
};

export default CONFIG;
