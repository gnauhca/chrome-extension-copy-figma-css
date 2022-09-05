const locales = {
  en: {
    enable: 'Enable',
    scale: 'Scale',
    unit: 'Unit',
    ignore1px: "Don't scale 1px",
    ignoreAttrs: 'Exclude attrs',
    ignoreAttrsTip: 'Separated by commas, text node will ignore width&height',
    customReplace: 'Custom replacement',
    customReplaceFrom: 'When Match',
    customReplaceTo: 'Replace with',
    customReplacePlaceholder1: 'When match',
    customReplacePlaceholder2: 'Replace content',
    var: 'Variables',
    varPlaceholder: 'Support sass less cssvar Example: @primary-color: #abc;',

    help: {
      title: 'Guide',
      content: [
        '1 Open the figma design file',
        ['Activate the “inspect” tab', ' (will try to activate by default)'],
        '3 Select a node and the css is automatically copied'
      ],
    },
    customReplaceHelp: {
      title: 'Custom replacement',
      content: [
        '1 One rule per line, the upper box is the matching rule, and the lower box is the replacement content',
        '2 Starts with / is regx match, otherwise is normal str matching',
        '3 The default rule means:(you can delete it and custom)'
      ],
      contentExtra: [
        'Font weight greater than or equal to 500 is replaced by 700',
        'Font weight less than 400 or normal will be ignored',
        'Background with url will be ignored'
      ],
    },
  },
  zh: {
    enable: '启用',
    scale: '缩放',
    unit: '单位',
    ignore1px: '不缩放 1px',
    ignoreAttrs: '忽略属性',
    ignoreAttrsTip: '英文逗号隔开，文本内容会默认忽略 width,height',
    customReplace: '自定义替换',
    customReplaceFrom: '当匹配到',
    customReplaceTo: '替换为',
    customReplacePlaceholder1: '匹配规则',
    customReplacePlaceholder2: '替换内容',
    var: '变量',
    varPlaceholder: '支持 sass less cssvar 例：@primary-color: #abc;',

    help: {
      title: '使用说明',
      content: [
        '1 打开 figma 设计稿',
        ['激活 “检查(inspect)” tab', '，打开设计稿会默认尝试激活'],
        '3 选中元素，样式即自动复制到剪贴板'
      ],
    },
    customReplaceHelp: {
      title: '自定义替换',
      content: [
        '1 一行一个替换规则，上面框为匹配规则，下面框为替换内容',
        '2 支持正则匹配，非 / 开头则普通匹配',
        '3 默认规则作用是：'
      ],
      contentExtra: [
        '字重大于等于 500 替换成 700',
        '忽略小于 400 或为 normal 的字重',
        '忽略带有 url 的 background'
      ],
    },
  },
};
export default locales;
