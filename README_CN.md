# chrome-extension: copy-figma-css

figma 复制 CSS 插件，开启此插件激活inspect(检查）tab，便可以在选中元素之后自动根据设置好的规则复制 CSS 代码。

## 已支持功能：
* 自动复制 Figma CSS
* 支持过滤无用注释和不需要的属性
* 支持设置缩放级别、CSS 单位
* 自定义替换规则
* css var/less/sass 变量替换
* 多个项目多个配置

## 使用方法：
* 安装此插件，并固定在扩展栏
* 打开或刷新 figma 设计稿，激活 “检查(inspect)” tab (重要)
* 选中元素，即可自动根据设置的规则复制 css 到剪贴板 （手动复制 css 代码也是会被处理的）
* 若页面提示阻止读取剪贴板权限，点击允许读取，插件只读取 CSS 内容

参考扩展地址: [https://chrome.google.com/webstore/detail/copy-figma-css/npogkncheacjllmfhehhofcacmeigpgl](https://chrome.google.com/webstore/detail/copy-figma-css/npogkncheacjllmfhehhofcacmeigpgl)

## 开发
```shell
# develop
npm run dev
# build
npm run build
```
