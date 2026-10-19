# Surface UI v0.4

玻璃材质组件库，包含柔雾磨砂与深色液态彩光两种主题。共享 18 个章节、分组目录、搜索、折叠代码、页面组合与动效实验室。

## 材质规则

- 背景提供柔和色彩，半透明表面让颜色透过，背景模糊建立空间层次。
- 细边高光表达玻璃边缘，采用单向投影，避免套用新拟态的双阴影。
- 正文区使用更稳定的透明度与清楚的文字颜色；深色主题同步调整前景、边缘与语义色。
- 材质面板的彩色物体位于玻璃之后，用真实 `backdrop-filter` 模糊呈现透光效果；预设、滑杆与开关可操作。

## 接入与预览

运行根目录的 `启动组件库.cmd`，从管理页进入。主题地址使用 `index.html?style=frosted` 或 `index.html?style=clear`。

页面先加载本目录基础 CSS，再加载共享 `raster-ui/docs.css`、`material-ui.css`、`material-docs.css` 和最后的 `material-refinement.css`；脚本依次为 `raster-ui/catalog-navigation.js`、`material-docs.js`、`material-refinement.js`、`material-ui.js`。现有 HTML 已包含正确顺序。材质覆盖限定在玻璃主题，交互共用 Material UI，支持减少动态效果。
