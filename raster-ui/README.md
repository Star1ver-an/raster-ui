# Raster UI · v0.4.0

从 `raster-grid.html` 的灰绿像素界面提炼的 Web 组件基础库。本版强化层级与密度，保留灰绿、整数格点和局部像素标记；组件目录、工作台与原型已合并为一个入口。

双击 `index.html` 查看完整组件库，目录中的“交互工作台”直接展示组合页面。`examples/workspace.html` 和根目录的 `raster-grid.html` 只做兼容跳转。所有文件均在本地，无网络字体、第三方脚本或安装步骤。

## v0.4 的使用顺序

1. 在目录查看设计基础、图标和基础控件。
2. 复制语义 HTML，接入实际数据处理；明确写出按钮的 `type`。
3. 用工作空间示例检查表单、筛选、卡片 / 列表和移动导航。
4. 有明确反馈需求时，再选择可选动效；文档的实验室不是产品依赖。

默认间距保持舒适。表单、操作和密度都是 Web 组件能力，原生端和业务存储仍由接入方负责。

## 文件

| 文件 | 用途 |
| --- | --- |
| `raster-ui.css` | 设计变量、组件样式、状态、窄屏规则 |
| `raster-ui.js` | 图标、筛选、页签、弹窗、通知与加载 API |
| `tokens.json` | CSS 变量和视觉规则，便于其他工具读取 |
| `index.html` / `docs.css` / `docs.js` | 可交互组件目录；不必复制到产品中 |
| `motion-lab.css` / `motion-lab.js` | 文档站的交互体验区；不必复制到产品中 |
| `tests/motion.html` | 在浏览器运行交互边界验证 |
| `tests/regression.html` | v0.4 的嵌套控件、动态初始化、通知与主题来源回归 |
| `tests/particles.html` | 验证粒子绘制、范围、回收与减少动态模式 |
| `workspace.js` / `workspace.css` | 同页工作台的唯一模板、交互与组合布局；不含重复组件样式 |
| `examples/workspace.html` | 兼容跳转到 `index.html#composition` |

## 接入

```html
<link rel="stylesheet" href="raster-ui.css">
<script src="raster-ui.js" defer></script>

<main class="rg-root">
  <button type="button" class="rg-button">保存更改</button>
</main>
```

页面或组件根区域需有 `rg-root`。CSS 变量使用 `--rg-` 前缀，组件使用 `rg-` 前缀。无需引入文档站的 `docs.css`、`docs.js`。

图标和交互组件需要 JavaScript。核心脚本在页面准备好后自动初始化；动态插入新组件后调用 `RasterUI.init(container)`，可以重复调用；更新已初始化页签 / 筛选的子项后也可再次调用，初始化本身不派发选择事件。其他框架可使用同一套语义 HTML/CSS；本版不包含 React、Vue、原生 App 或小程序专用封装。

## 组件与状态

| 组件 | 主要类 / 标记 | 提供的状态 |
| --- | --- | --- |
| 按钮 / 图标按钮 | `rg-button`、`--secondary`、`--quiet`、`--danger`、`--icon` | 默认、悬停、按下、焦点、禁用、加载 |
| 输入 / 搜索 / 多行 / 选择 | `rg-field`、`rg-input`、`rg-search`、`rg-textarea`、`rg-select` | 默认、焦点、只读、禁用、错误 |
| 复选 / 单选 | `rg-check` + 原生 input | 未选、已选、部分选中、焦点、禁用 |
| 开关 | `rg-switch` + checkbox `role="switch"` | 开、关、焦点、禁用 |
| 分段筛选 | `rg-segmented` + `data-rg-segmented` | 互斥选中、焦点、禁用 |
| 内容页签 | `rg-tabs` + `data-rg-tabs` | 选中面板、键盘操作、禁用 |
| 侧栏 / 底部导航 | `rg-nav` / `rg-bottom-nav` | 悬停、焦点、`aria-current="page"` |
| 卡片 / 列表条目 | `rg-card-grid`、`rg-card`、`rg-list-item` | 默认、选中、悬停、焦点、窄屏重排 |
| 状态 / 标签 / 提示 | `rg-status`、`rg-tag`、`rg-alert` | 待开始、进行中、完成、错误、警告 |
| 空状态 / 加载 / 骨架 | `rg-empty`、`rg-loader`、`rg-skeleton` | 有文案与出口的空状态、减少动态效果 |
| 弹窗 / 轻提示 | `rg-dialog`、`RasterUI.toast()` | 原生焦点管理、关闭、提示计时与暂停 |

`data-state="hover|pressed|focus"` 仅用于文档中固定展示状态。产品中使用实际鼠标、键盘及原生 `disabled`、`aria-busy`，不要永久锁住这些展示属性。

## 交互 API

```js
RasterUI.init(container); // 自动初始化之外的动态内容

// 返回 SVG DOM 节点。图标名必须存在，尺寸只支持 24 / 48 / 72。
container.append(RasterUI.icon('folder', { size: 48, label: '文件夹' }));

RasterUI.openDialog('entry-dialog');
await RasterUI.closeDialog('entry-dialog', 'saved');

const notice = RasterUI.toast('已保存', { duration: 4500 });
notice.dismiss();
RasterUI.toast('暂时无法保存', { variant: 'error', duration: 0 });

// 异步业务可显式保留来源区域的主题，不依赖完成时的焦点位置。
const source = document.getElementById('save-button'); // 当前页面中已挂载的元素
RasterUI.toast('已保存', { context: source });

RasterUI.setLoading(button, true, '正在保存');
try { await saveYourData(); }
finally { RasterUI.setLoading(button, false); }
```

`setLoading` 会保存并恢复按钮原本的禁用状态、`aria-label` 与 `aria-busy`；不修改其内部结构。`toast` 以纯文本写入内容，不解析传入的 HTML。鼠标悬停、键盘聚焦和异步动作执行期间暂停消失计时；`duration: 0` 表示持续显示。通知动作失败后保留同一条通知和重试入口，直到成功或手动关闭。

`context` 是可选的当前文档已挂载 `Element`，用于在创建时读取该区域的 `--rg-*` 主题变量；默认取当前焦点来源。非法、已移除或其他文档的元素会抛出 `TypeError`。这个选项不移动焦点；打开的模态弹窗始终决定通知的实际宿主和焦点范围，即使 `context` 在弹窗外。

| 事件 | 触发元素 | `event.detail` |
| --- | --- | --- |
| `rg:change` | 分段筛选容器 | `{ value }` |
| `rg:tabchange` | 页签容器 | `{ value, panel }` |
| `rg:dialogchange` | 原生 dialog | `{ open, value? }` |
| `rg:motionchange` | document | `{ preference, reduced }` |

事件冒泡，可由业务页面监听。导航、卡片的路由和实际数据处理由接入方提供；这些组件不预设业务。

## 可访问性与键盘

- 保留原生 button、input、select、textarea、dialog。非提交按钮写 `type="button"`；表单提交写 `type="submit"`。纯图标按钮必须有明确的 `aria-label`。
- 表单使用可见 `.rg-label`。初始化会把它与控件关联；帮助和错误文案通过 `aria-describedby` 指向。失败时设置 `aria-invalid="true"`，同时更新错误文字。
- 分段筛选和页签使用左右方向键、Home、End 切换；禁用项会跳过。嵌套组只管理自身直接归属的控件与面板。页签的 `aria-controls` 与面板 ID 必须唯一且对应。
- 动态删除或禁用当前项后调用 `init(group)`，会选中第一个可用项；全部禁用时清空选择并隐藏页签面板。
- 弹窗使用 `showModal()`，原生限制焦点，Esc 可关闭并返回触发按钮；仅带 `data-rg-dismiss-outside` 的弹窗允许点击遮罩关闭。
- 复选框半选通过 `data-rg-indeterminate` 初始化；后续业务联动应更新 input 的 `indeterminate` 属性。
- 不使用颜色作为状态的唯一说明。提供 `prefers-reduced-motion` 与基础 `forced-colors` 处理。
- 自带验证页面用于复查键盘与浏览器交互，不代表所有浏览器、真实触摸设备或读屏器都已覆盖，也不宣称完成独立的无障碍合规审计。

## 视觉与响应规则

- 图标基准为 24 × 24，使用整数坐标与正交轮廓。显示为 24、48、72 px，避免模糊或不均匀缩放。
- 阶梯以 4 px 步进；分隔线 1 px、主框架 3 px。像素字形仅用于短编号或标识，不用于中文长正文。
- 默认控件高 48 px；小控件 40 px。紧凑密度默认控件 40 px、小控件 36 px；粗指针设备的可操作目标保持至少 44 px。正文 16 px，标签 14 px，元信息 12 px。
- 卡片组在视口宽度不超过 640 px 时改为单列条目；`.rg-card-grid--list` 可在更宽屏幕中主动使用列表排布。选中标记只应跟随当前业务选择，不按数组第一个条目推断。断点是本版起点，接入实际内容后继续验证。
- 底部导航包含安全区内边距，但不自动固定定位。固定时需在内容区预留导航高度；轻提示也应避让导航。
- `.rg-grayscale` 可挂在根元素，检查无强调色的辨识度；业务主题通过变量覆盖。
- 画布底上的次要文字使用 `--rg-muted-canvas`，浅色内容面上的次要文字可用 `--rg-muted`。错误与警告保留文字和语义色，不只靠颜色区分。

### 局部密度与列表

```html
<section data-rg-density="compact">
  <!-- 只影响本区域；不加标记时使用舒适密度。 -->
  <div class="rg-card-grid rg-card-grid--list">
    <button type="button" class="rg-card">项目内容</button>
  </div>
</section>
```

也可使用 `.rg-density-compact`。密度调整控件与内容间距，不缩小正文字号或整数倍率图标；可读取 `tokens.json` 中的间距、层级与密度数据。像素轮廓和主要操作承担重点，普通内容用细分隔线组织。

### 原位表单验证

`index.html#composition`（源码 `workspace.js`）展示页面层的完整实现，核心库不代替业务验证。示例表单使用 `novalidate` 关闭浏览器自动浮层，同时保留 `required`、`maxlength`、`validity` 和 `checkValidity()`：

- 提交时检查所有字段，名称使用 `setCustomValidity()` 拒绝纯空格；不调用 `reportValidity()`。
- 错误通过字段下方持久文字、`aria-describedby` 和 `aria-invalid` 表达，聚焦第一个无效字段。
- 输入后重新检查已出错字段；不清空其他字段，不因关闭弹窗丢弃草稿；成功创建后才重置。
- 表单提交按钮只运行一次；关闭过程被打断时保留草稿，不创建重复记录。

## 基础交互与可选动效：落格、定位、确认

动效延续灰绿像素界面的整数格点、局部阶梯与清晰状态。短动作直接回应，不加入整页转场、放大弹跳、拖尾或声音。状态先更新，动画只帮助识别变化，不延迟可用内容。

| 操作 | 体验规则 | 像素反馈 |
| --- | --- | --- |
| 按下 | 默认、悬停、键盘焦点、忙碌各自可识别 | 2 px 下沉与分步归位，80 ms |
| 切换筛选 / 页签 | 立即切换；重复选择不重新派发事件；方向键可操作 | 底边 4 → 2 → 0 px 收束，160 ms；内容 8 → 4 → 0 px 入位 |
| 开关 / 复选 | 原生语义，整行标签可点击 | 开关每步 4 px；勾选标记短促落位 |
| 打开 / 关闭弹窗 | 原生焦点约束、Esc 关闭、返回触发按钮 | 入场 12 → 8 → 4 → 0 px，200 ms；退场 0 → 4 → 8 px，120 ms |
| 成功 | 明确更新按钮与结果区域；普通通知不抢焦点 | 局部底边确认，240 ms；通知分步入位 |
| 失败 | 保留输入与原内容，提供原因和重试入口 | 仅错误控件左右各 4 px，一次，160 ms；另有错误文字 |
| 等待 | 防止重复提交，保留操作名称与忙碌语义 | 三个 4 px 方块轮换；真实结果一到就结束 |
| 撤销 | 对可逆操作提供就近出口，不增加确认弹窗 | 结果恢复原位；通知中的动作避免重复触发 |

体验区使用一篇设计随笔演示收藏、失败重试、移除和撤销。720 ms 的模拟等待只存在于 `motion-lab.js`，用于观察状态；组件核心不会人为推迟业务请求。该演示不保存收藏数据、不调用网络、不定义未来业务。

移动网页中的阅读区域改为单列，收藏为整行 48 px 主操作，收藏结果紧随内容。触摸设备不依赖悬停。文本不逐字入场，输入过程中不反复播放动画。

### 复用动效

```js
await RasterUI.feedback(button, 'success'); // press / select / success / error
await RasterUI.reveal(panel);
await RasterUI.reveal(list, { children: '.rg-list-item' });

RasterUI.toast('已加入稍后阅读', {
  duration: 8000,
  action: {
    label: '撤销',
    onClick: async () => {
      await undoYourSave(); // 由业务实现
      updateYourView();
    }
  }
});

RasterUI.setMotion('reduced'); // 'auto' 跟随系统，'reduced' 主动减少
const { preference, reduced } = RasterUI.getMotion();
```

同一元素的新动画取消旧动画，避免连点累积。列表只对前 12 项播放入场，错峰 24 ms，最大错峰 96 ms。业务状态与可见性由接入方管理；`reveal()` 只负责已经显示的内容入场。`feedback()` 本身不设置错误文案、ARIA 状态或业务结果。

`--rg-motion-press / select / enter / exit / confirm` 可覆盖时长，核心 JS 在元素上读取这些 CSS 变量。`--rg-motion-step: 4px` 是格点参考值，位移关键帧使用固定整数，不支持任意缩放。为保持完整格点，调整时长而不要改成平滑缓动。

### 动态偏好与焦点

减少动态模式停止 CSS 循环、过渡与 JS 位移；正在播放的动画立即取消，但操作结果、选中态、忙碌文字和弹窗功能保留。系统减少动态效果优先，`auto` 不会强制覆盖系统选择。手动偏好仅保存在本地 `raster-ui.motion`；同源页面同步，存储不可用时仍可使用当前页。

通知在悬停或键盘焦点进入时暂停倒计时；离开后接着计时。撤销回调执行期间禁用动作按钮并暂停计时，失败时保留原通知供重试。键盘关闭通知后尽量返回原操作位置。模态内触发的通知归属于该弹窗；关闭弹窗时清理通知，避免焦点落到已关闭区域。支持 Popover API 的浏览器使用 manual popover 保持通知可见。业务可能发生后续变更时，应像体验区一样检查版本，避免旧撤销覆盖新结果。

`closeDialog()` 从 v0.2 起返回 `Promise<boolean>`：退场并关闭返回 `true`，已关闭或被重新打开打断返回 `false`。可 `await` 后进行后续操作；焦点恢复通过原生关闭事件完成。使用原生 `form method="dialog"` 时同样经过退场。动态偏好改变不会延迟关闭。

### 验证

先运行 `tests/regression.html`，检查 v0.4 的嵌套页签 / 筛选、动态增删和禁用项、表单内控件、异步通知重试、模态焦点与显式通知主题来源。它与以下原有验证互补；浏览器中的实际结果为准，本说明不预先宣称通过。

打开 `tests/motion.html` 并点击“运行验证”，检查动画替换、筛选事件、关闭后重开竞态、焦点返回、原生表单提交、加载状态恢复、撤销去重和减少动态效果。测试结束后恢复原动态偏好。文档体验区可手动开启“下次收藏模拟失败”，检验保留内容与重试。

## 可选像素粒子：短暂的视觉重点

在原有小幅控件动效上增加三个可选效果。文档末尾的实验室提供“像素粒子探索”，可切换标准 / 轻量密度并反复播放。收藏演示已接入归档效果；普通点击、输入和失败状态不自动播放庆祝粒子。

| 效果 | 表达 | 时长 | 适用位置 |
| --- | --- | --- | --- |
| `burst` 边缘迸发 | 颗粒从控件边缘外扩，阶梯框角同时展开 | 720 ms | 重要操作成功，明确的完成时刻 |
| `assemble` 颗粒归位 | 散落颗粒吸附至边缘，组成临时轮廓 | 820 ms | 新增内容、首次展开的关键面板 |
| `transfer` 粒子归档 | 方块沿弧线逐格进入目标，抵达时框角确认 | 880 ms | 收藏、归档或可见的内容移动 |

粒子采用 2 / 4 / 6 px 方块，位置按 2 px 对齐；不模糊、不发光、不旋转、不常驻漂浮。颜色只取现有深绿、强调绿和灰绿。保留原有页面视觉，动效只在操作发生时短暂加强。

```js
const playback = RasterUI.particles(button, {
  effect: 'burst',          // burst / assemble / transfer
  intensity: 'balanced',   // balanced / soft
  boundary: panel          // 可选：限制在指定元素的矩形内
});
await playback.finished;   // 正常结束 true；取消 / 未播放 false
playback.cancel();          // 可重复调用

RasterUI.particles(saveButton, { effect: 'transfer', to: savedItem });
RasterUI.particles(newItem, { effect: 'assemble', intensity: 'soft' });
```

目标先显示，再调用粒子；API 不改变业务状态、不移动元素，也不隐藏文字。`boundary` 未指定时，查找最近的 `data-rg-particle-boundary`；没有该标记则以视口为范围。给固定导航、关键操作区添加 `data-rg-particle-exclude`，可防止粒子盖住这些区域；库的轻提示自动避让。

归档目标不可见、中心在视口外或被标记的保护区域覆盖时，退回源位置迸发。减少动态效果时完全不创建画布。效果结束移除画布，不运行空闲绘制循环；滚动、改变窗口大小或离开当前标签页会立即清理，避免颗粒滞留在错误位置。连续触发同一来源替换旧效果，最多同时保留两组。

单组迸发 / 归位的标准密度为桌面 24 颗、窄屏 16 颗，轻量为 14 / 10 颗；归档再减少至上述数量的 60%（向上取整），避免通道拥挤。全局上限为桌面 48 颗、窄屏 32 颗，框角为单独的辅助轮廓。CSS 像素画布按设备倍率渲染，倍率最高 2，限制绘制开销。

本轮建议以“粒子归档”承担有去向的主要操作，迸发留给重要完成时刻，归位用于少量新内容。文档中的选择用于比较效果，不代表所有页面都应同时使用三种动效。

验证入口：`tests/particles.html`。覆盖真实像素绘制、指定边界、保护区域、指针穿透、焦点、画布回收、快速连点、数量限制、目标不可见的回退、滚动清理与减少动态效果。原有交互验证位于 `tests/motion.html`。

## 本版边界

这是可直接复用的 Web 组件基础库与文档，并非已经完成全部终端适配的设计系统。组合页数据仅用于演示，刷新恢复；不包含账户、后端、路由框架、数据同步、复杂表格和原生端实现。未来业务确定后，再增加所需组件与流程。

## 工作台整合

`index.html` 是唯一 UI 入口，不再用 iframe 加载另一份页面。工作台复用核心控件，组合层只有 `workspace.js` 和 `workspace.css`；其表单、卡片、通知和弹窗调用同一套 RasterUI API。

原型的概览、资源、状态修改、归档与移出归档、项目类型，以及点阵字标 / 数字已迁入。保留 `raster-grid.projects.v1` 存储键以承接旧项目数据；存储不可用时会显示提示并保留当前页数据。项目会在刷新后恢复；筛选、显示方式和紧凑间距为当前页状态。灰度与动态偏好统一使用组件库已有设置。

`RasterWorkspace.bitmap(text, label)` 返回点阵 SVG（支持 RASTER GRID 字母与数字），`RasterWorkspace.template` 提供一份工作台模板，`RasterWorkspace.mount(root)` 在 `RasterUI.init(root)` 后挂载工作台行为。模板使用固定 ID，每页仅挂载一次。
