# UI Collection

三套独立材质的 Web 组件库，以及统一的静态展示管理页。

打开根目录 [`index.html`](index.html) 进入组件库管理：风格预览、名称 / 风格搜索、分类、收藏、卡片 / 列表、主题选择与页面地址复制。收藏与视图偏好只保存在当前浏览器；不需要后端账户。

- [Raster UI](raster-ui/index.html)：灰绿像素，18 个章节。
- [Soft UI](soft-ui/index.html)：精致新拟态，18 个章节，浅色 / 深色。
- [Surface UI](surface-ui/index.html)：玻璃材质，18 个章节，柔雾磨砂 / 液态彩光。

三套库共用顶部工具栏、侧栏搜索与分组目录、介绍与快速入口、编号章节、折叠代码、页面组合、接入说明和动效实验室的文档格式。材质库保留柔和的动效，不依赖像素交互脚本。

## 本地预览启动

在源码目录双击 `启动组件库.cmd`，会在后台启动本机预览服务并打开管理页。重复双击会复用已运行的服务，不会重复启动。

也可以在项目目录运行：

```powershell
python scripts/preview.py
```

`127.0.0.1:8765` 是本机地址，电脑重启或预览进程结束后，需要重新双击启动入口。它不是已经发布的 GitHub Pages 在线网址。预览日志位于 `.qa/preview-server.log`。

## Raster UI

灰绿基调、整数格点、克制的像素粒子。一套可直接在浏览器中查看、交互和复用的 Web 组件库。

当前版本：**v0.4.0**。保留灰绿与整数格点的视觉身份，强化信息层级、键盘交互与页面组合。组件目录与工作台已整合为一个入口，提供桌面与窄屏预览。

## 打开体验

下载或克隆本仓库后，直接用浏览器打开 [`raster-ui/index.html`](raster-ui/index.html)。无需安装依赖，无外部字体或第三方脚本。

## 统一入口

只需打开 [`raster-ui/index.html`](raster-ui/index.html)：设计基础、点阵字标与数字、完整组件、交互工作台、接入说明和动效实验室均在同页。

工作台支持概览 / 项目 / 资源 / 设置、搜索与筛选、卡片 / 列表、新建项目、状态修改、归档与移出归档。项目保存在当前浏览器中，并沿用原型的本地存储键；旧原型里已保存的数据可以继续使用。紧凑间距和预览宽度仅作用于当前页面。

`raster-grid.html` 与 `raster-ui/examples/workspace.html` 只保留兼容跳转，均指向组件库的 `#composition`，不再包含重复的界面、样式或业务逻辑。

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

组件文档中的演示状态刷新后恢复；交互工作台的项目数据与动效偏好保存在浏览器本地。

## 文件导航

| 入口 | 内容 |
| --- | --- |
| [`raster-ui/index.html`](raster-ui/index.html) | 设计基础、组件、接入与可选动效实验室 |
| [`raster-ui/index.html#composition`](raster-ui/index.html#composition) | 同页交互工作台；自适应与 390 px 预览 |
| [`raster-ui/workspace.js`](raster-ui/workspace.js) / [`workspace.css`](raster-ui/workspace.css) | 唯一工作台模板、交互与组合布局 |
| [`raster-ui/raster-ui.css`](raster-ui/raster-ui.css) | 设计变量、组件样式、响应式规则 |
| [`raster-ui/raster-ui.js`](raster-ui/raster-ui.js) | 交互、图标与粒子 API |
| [`raster-ui/tokens.json`](raster-ui/tokens.json) | 视觉、动效与粒子规则数据 |
| [`raster-ui/README.md`](raster-ui/README.md) | 接入方法、交互规则和完整 API 说明 |
| `raster-grid.html` / `raster-ui/examples/workspace.html` | 兼容旧网址，自动转到同页工作台 |

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

## Material UI 材质探索

`soft-ui` 和 `surface-ui` 共用根目录的 Material UI 层（当前 **v0.4.0**）。它对齐像素组件库的组织方式：6 个分组、18 个章节、组件搜索、每章可复制用法、键盘筛选 / 页签、焦点可见、目录滚动高亮，以及独立的材质动效实验室。

Soft UI 使用同色底板与控件、统一左上光源，以及凸起 / 内凹 / 按压三种表面角色；浅色为雾灰与陶土强调，深色为石墨与暖杏强调。Surface UI 使用半透明表面、背景模糊、细边高光和单向投影，分别呈现柔雾磨砂与深色彩光。两套材质均提供可操作的旋钮面板：预设、原生滑杆和状态开关。

设计学习参考：[Plyuto 原始作品](https://dribbble.com/shots/7994421-Skeuomorph-Mobile-Banking)、[Neumorphism.io 的凸起与内凹生成器](https://neumorphism.io/)。本次将连续材质、双向明暗阴影与一致光源落实到组件；文字、焦点与错误提示独立表达状态，避免仅靠低对比阴影传递信息。

| 入口 | 内容 |
| --- | --- |
| [`soft-ui/index.html`](soft-ui/index.html) | Precision Neumorphism 完整组件目录 |
| [`surface-ui/index.html`](surface-ui/index.html) | Frosted Glass / Liquid Glass 完整组件目录 |
| [`material-ui.css`](material-ui.css) | 共享布局、状态、响应式和各材质主题变量 |
| [`material-ui.js`](material-ui.js) | 共享模板、交互、搜索、键盘支持和动效 API |
| [`material-refinement.css`](material-refinement.css) / [JS](material-refinement.js) | 四种主题的最终材质规则与可交互材质面板 |

## GitHub Pages 静态展示

仓库根目录的 `index.html` 是展示入口。所有本地资源、子库入口与返回链接均使用相对路径，支持 `https://<账户>.github.io/<仓库>/` 形式的项目站点。

1. 将源码提交到仓库 `master` 分支。
2. 在仓库 **Settings → Pages → Build and deployment** 中，将 **Source** 设为 **GitHub Actions**。
3. 推送 `master` 后，工作流 **Deploy UI Collection** 自动构建并部署；也可在 Actions 中手动运行。
4. 部署完成后，从 Actions 的 `github-pages` environment 打开实际发布地址。

工作流遵循 [GitHub Pages 自定义工作流说明](https://docs.github.com/zh/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。此处提供代码与工作流配置，不表示仓库 Pages 已启用或部署已完成。

本地构建：

```powershell
python scripts/build-site.py
python -m http.server 8765 --directory dist --bind 127.0.0.1
```

构建脚本只复制明确列出的页面和静态资源，验证 HTML 中的本地文件链接，排除本机预览地址与工作区截图，输出 `dist/` 和 `UI-Collection-static.zip`。发布包内不含 Git 元数据、QA 截图或浏览器本地项目数据。ZIP 可解压后由任意静态服务器托管；GitHub Actions 直接发布 `dist/`。

### 维护入口

- `collection.js`：三套库的元数据、主题入口、搜索与收藏行为。
- `collection.css`：管理页视觉与响应式布局。
- `material-docs.js` / `material-docs.css`：材质库的统一文档格式，布局复用 `raster-ui/docs.css`。
- `material-ui.js` / `material-ui.css`：共享材质组件及独立动效。
- `material-refinement.js` / `material-refinement.css`：最终材质规则、阴影层次与材质面板；CSS 最后加载。
- `raster-ui/catalog-navigation.js`：三套文档共享的实际滚动定位、目录高亮和吸顶尺寸测量。手机只固定搜索与目录，顶部工具栏随页面滚动。
- `.github/workflows/pages.yml`：GitHub Pages 的构建与部署。
