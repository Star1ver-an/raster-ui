# Liquid UI 1.0.0

流动玻璃 Web 组件库。玻璃的重点是前后关系与环境融合。背景透过材质参与着色，细边高光交代轮廓，实体文字保持清晰。本库以 CSS 透明、模糊和高光近似光学感，不宣称实现系统级实时折射。

## 设计与学习

参考：[Apple Liquid Glass](https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/)。本库为独立实现的可复用资源，参考作品的商标、素材与专有实现未打包。

- 内容层、玻璃功能层和弹窗层拥有明确的前后顺序。
- 背景有色彩与形状，控件保持稳定而清楚的对比。
- 高光沿边缘出现，模糊与透明度有明确边界。

适合：媒体控制、浮动导航、创意工作台和有丰富背景的展示界面。

避免：在玻璃之上继续堆叠玻璃；所有区域持续改变模糊强度；让背景纹理穿透到影响文字辨认。

## 接入

复制本目录与相邻的 `design-kit/`，保持相对路径。产品只需核心 CSS、当前风格 CSS 和核心 JS：

```html
<link rel="stylesheet" href="design-kit/core.css">
<link rel="stylesheet" href="liquid-ui/liquid-ui.css">
<script src="design-kit/core.js" defer></script>
<main class="uc-root" data-style="liquid" data-theme="light">
  <button type="button" class="uc-button">保存更改</button>
</main>
```

页面就绪后调用 `UICollection.init(root)`，`root` 为上面的根区域。动态增加独立组件区域后也可对该区域调用；每个区域只绑定一次。

目录所用的 `docs.css`、`catalog.js`、`docs.js`、`styles.js`、`catalog-navigation.js` 是文档依赖，不必进入业务产品。无需包管理器、网络字体、第三方脚本、服务端或构建步骤。

## 组件

18章包括设计基础、风格解析、图标、按钮、表单、选择、筛选、页签、导航、卡片、状态、空状态和加载、弹窗与通知、组合工作台、快速接入、收藏撤销、动效语法、滚动与共享表面。每章均有实际演示与可复制代码。

## 动效

浮动表面轻微展开、收束，状态通过局部高光确认；以裁剪与位移组织内容，保持正文与点击位置稳定。

- 面板入场：8px → 0，300ms，边缘光随表面就位。
- 共享表面：展开保持对象连续，360ms。
- 滚动揭示：裁剪从12%收束到0，反向滚动可回退。

上述时长是项目设计参数，不是原作参数。数值在 `tokens.json` 和风格 CSS 中保持一致。系统减少动态效果优先于本地 auto，reduced 时取消运行中的动画并保留终态和操作反馈。

## API

```js
const root = document.querySelector('.uc-root');
UICollection.init(root);
UICollection.setMotion(root, 'reduced'); // auto / reduced
await UICollection.reveal(panel);
await UICollection.feedback(button, 'press'); // press / error
UICollection.setLoading(button, true, '正在保存');
try { await saveData(); } finally { UICollection.setLoading(button, false); }
UICollection.openDialog(dialog, button);
await UICollection.closeDialog(dialog); // true=已关闭；false=被重新打开打断
const notice = UICollection.toast('已保存', {context:root});
notice.dismiss();
UICollection.toast('暂时无法完成', {context:root,error:true,action:{label:'重试',onClick:retry}});
await UICollection.transition(preview, () => preview.classList.toggle('is-expanded'));
```

`uc:tabchange` 与 `uc:change` 冒泡并携带 `detail.value`；`uc:motionchange` 携带 reduced 与 preference。页签使用唯一的 aria-controls / 面板 ID，方向键和 Home / End 可切换，禁用项跳过。

`feedback()` 不改变业务状态。`setLoading()` 恢复原 disabled、aria-busy 与 aria-label。动画可替换，不为动画延迟业务结果。关闭弹窗支持 Esc 和焦点恢复；错误通知持续显示，操作失败可重试，焦点或鼠标进入通知会暂停倒计时。

组合工作台的新建、搜索、状态筛选、归档和撤销在当前浏览器运行；演示数据使用独立键 `ui-collection.liquid.projects.v1`。收藏演示仅当前页面有效。无真实账户、上传或远端保存接口。

## 验证

打开相邻的 [五风格回归验证](../design-kit/tests.html)，点击运行验证。另需手动检查窄屏、焦点、减少动态效果、快速反向滚动与各主题的视觉表现。
