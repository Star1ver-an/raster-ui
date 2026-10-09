# Raster UI

灰绿基调、整数格点、克制的像素粒子。一套可直接在浏览器中查看、交互和复用的 Web 组件库。

当前版本：**v0.4.0**。保留灰绿与整数格点的视觉身份，强化信息层级、键盘交互与页面组合。提供桌面和移动网页示例；不包含原生 App 或小程序适配。

## 打开体验

下载或克隆本仓库后，直接用浏览器打开 [`raster-ui/index.html`](raster-ui/index.html)。无需安装依赖，无外部字体或第三方脚本。

## v0.4 更新

- 文档先讲设计基础和控件，再展示页面组合；动效实验室放在最后，并提供快速开始入口。
- 项目示例支持卡片 / 列表、局部紧凑间距、明确的总数 / 筛选数，以及跟随实际操作的当前项目标记。
- 表单错误留在字段下方，保留输入与原生有效性约束；取消后再次打开仍保留草稿。
- 嵌套页签与动态初始化相互隔离；异步通知动作和模态内通知改善焦点与重试行为。

组件目录提供：

- 按钮、表单、选择控件、导航、页签、卡片、弹窗与通知。
- 收藏、失败重试、撤销，以及键盘和焦点管理演示。
- 边缘迸发、颗粒归位、粒子归档三种效果，支持标准与轻量密度。
- 系统及用户的减少动态效果设置，窄屏重排和触摸尺寸规则。

项目和显示方式仅保留在当前页面，刷新后恢复。动效偏好保存在浏览器本地。

## 文件导航

| 入口 | 内容 |
| --- | --- |
| [`raster-ui/index.html`](raster-ui/index.html) | 设计基础、组件、接入与可选动效实验室 |
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
  <button type="button" class="rg-button">保存更改</button>
</main>
```

只需引入核心 CSS 和 JS；文档站的 `docs.*` 与 `motion-lab.*` 不必进入产品。实际业务请求、账户与数据存储由接入方提供。

## 验证

在浏览器中打开以下页面并点击“运行验证”：

- [`v0.4 回归验证`](raster-ui/tests/regression.html)：嵌套控件、动态初始化、表单按钮、模态通知、异步重试与通知主题来源。
- [`交互验证`](raster-ui/tests/motion.html)：页签 / 筛选、焦点恢复、动画取消、弹窗竞态、加载与异步通知动作。
- [`粒子验证`](raster-ui/tests/particles.html)：绘制边界、保护区域、画布回收、数量限制与减少动态效果。

验证页面是可重复运行的检查工具，不代表所有浏览器、读屏器或真实触摸设备都已覆盖。组合页还需手动检查空白提交、纠错后重试、取消后重开、筛选计数，以及 390 px 窄屏导航。

仓库保留源码与验证页面，生成的 ZIP 压缩包和本地检查截图不纳入版本管理。
