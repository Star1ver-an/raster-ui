# Raster UI

灰绿基调、整数格点、克制的像素粒子。一套可直接在浏览器中查看、交互和复用的 Web 组件库。

当前版本：**v0.3.0**。视觉方向仍可继续迭代；当前提供桌面与移动网页演示，不代表已完成原生 App 或小程序适配。

## 打开体验

下载或克隆本仓库后，直接用浏览器打开 [`raster-ui/index.html`](raster-ui/index.html)。无需安装依赖，无外部字体或第三方脚本。

组件目录提供：

- 按钮、表单、选择控件、导航、页签、卡片、弹窗与通知。
- 收藏、失败重试、撤销，以及键盘和焦点管理演示。
- 边缘迸发、颗粒归位、粒子归档三种效果，支持标准与轻量密度。
- 系统及用户的减少动态效果设置，窄屏重排和触摸尺寸规则。

演示数据仅保留在当前页面，刷新后恢复。动效偏好保存在浏览器本地。

## 文件导航

| 入口 | 内容 |
| --- | --- |
| [`raster-ui/index.html`](raster-ui/index.html) | 组件目录与粒子效果比较 |
| [`raster-ui/examples/workspace.html`](raster-ui/examples/workspace.html) | 使用组件库组合的页面示例 |
| [`raster-ui/raster-ui.css`](raster-ui/raster-ui.css) | 设计变量、组件样式、响应式规则 |
| [`raster-ui/raster-ui.js`](raster-ui/raster-ui.js) | 交互、图标与粒子 API |
| [`raster-ui/tokens.json`](raster-ui/tokens.json) | 视觉、动效与粒子规则数据 |
| [`raster-ui/README.md`](raster-ui/README.md) | 接入方法、交互规则和完整 API 说明 |
| [`raster-grid.html`](raster-grid.html) | 初始视觉方向的独立 HTML 原型 |

## 接入

```html
<link rel="stylesheet" href="raster-ui/raster-ui.css">
<script src="raster-ui/raster-ui.js" defer></script>

<main class="rg-root">
  <button class="rg-button">保存更改</button>
</main>
```

只需引入核心 CSS 和 JS；文档站的 `docs.*` 与 `motion-lab.*` 不必进入产品。实际业务请求、账户与数据存储由接入方提供。

## 验证

在浏览器中打开以下页面并点击“运行验证”：

- [`交互验证`](raster-ui/tests/motion.html)：焦点恢复、动画取消、弹窗竞态、加载与撤销。
- [`粒子验证`](raster-ui/tests/particles.html)：绘制边界、保护区域、画布回收、数量限制与减少动态效果。

仓库保留源码与验证页面，生成的 ZIP 压缩包和本地检查截图不纳入版本管理。
