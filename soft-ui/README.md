# Soft UI v0.4

新拟态组件库。浅色为雾灰底板与陶土强调，深色为石墨底板与暖杏强调；两种主题共享 18 个章节、分组目录、搜索、折叠代码、页面组合与动效实验室。

## 材质规则

- 背景和控件来自同一块材质，避免白色卡片浮在灰色背景上。
- 左上受光、右下投影，所有控件使用一致光源。
- 底板、凸起控件、内凹槽采用三档受控阴影；按压转为内阴影。
- 强调色只用于关键操作与状态；文字、焦点、错误说明保持独立可读。
- 材质面板提供强度预设、可键盘操作的原生滑杆、按压开关与文字反馈。

参考 [Plyuto](https://dribbble.com/shots/7994421-Skeuomorph-Mobile-Banking) 和 [Neumorphism.io](https://neumorphism.io/) 的连续表面、双阴影与内凹示例。

## 接入与预览

运行根目录的 `启动组件库.cmd`，从管理页进入。主题地址使用 `index.html?theme=light` 或 `index.html?theme=dark`。

依次加载：`soft-ui.css`、`../raster-ui/docs.css`、`../material-ui.css`、`../material-docs.css`、`../material-refinement.css`；脚本依次为 `raster-ui/catalog-navigation.js`、`material-docs.js`、`material-refinement.js`、`material-ui.js`。现有 HTML 已包含正确顺序。视觉覆盖限定在 Soft UI，交互共用 Material UI，支持减少动态效果。
