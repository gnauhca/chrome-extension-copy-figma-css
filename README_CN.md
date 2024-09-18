# chrome-extension: copy-figma-css

figma 复制 CSS 插件，开启此插件激活inspect(检查）tab，便可以在选中元素之后自动根据设置好的规则复制 CSS 代码。
> 自动复制功能已失效，请手动复制

## 已支持功能：
* 自动复制 Figma CSS (已失效，请手动复制)
* 支持过滤无用注释和不需要的属性
* 支持设置缩放级别、CSS 单位
* 自定义替换规则
* CSS var/less/sass 变量替换
* 支持多个配置

## 使用方法：
* 安装此插件，并固定在扩展栏
* 打开或刷新 figma 设计稿
* 手动复制 CSS 代码，代码就会按照规则修改后写入剪贴板
* 若页面提示阻止读取剪贴板权限，点击允许读取，插件只读取 CSS 内容

参考扩展地址: [https://chrome.google.com/webstore/detail/copy-figma-css/npogkncheacjllmfhehhofcacmeigpgl](https://chrome.google.com/webstore/detail/copy-figma-css/npogkncheacjllmfhehhofcacmeigpgl)

## 开发
```shell
# develop
npm run dev
# build
npm run build
```
