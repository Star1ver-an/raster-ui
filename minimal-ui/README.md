# Minimal UI 1.0.0

极简主义 Web 组件库。极简的核心是信息选择与视觉比例。减少相互竞争的强调，用尺寸、对齐和留白建立阅读顺序；并非把所有边框删掉，或把文字一味缩小。

## 设计与学习

参考：[Apple AirPods Pro](https://www.apple.com/airpods-pro/)。本库为独立实现的可复用资源，参考作品的商标、素材与专有实现未打包。

- 一屏一个视觉重心，以字阶和间距分配注意力。
- 使用中性底色与单一强调色，正文保持可读。
- 组件对齐同一网格，分隔线只在需要区分内容时出现。

适合：产品官网、内容阅读、专业工具与高品质品牌界面。

避免：把低对比浅灰当作高级感；为了空白而让关键信息离开视线；让同一屏出现多个主操作。

## 接入

复制本目录与相邻的 `design-kit/`，保持相对路径。产品只需核心 CSS、当前风格 CSS 和核心 JS：

```html
<link rel="stylesheet" href="design-kit/core.css">
<link rel="stylesheet" href="minimal-ui/minimal-ui.css">
<script src="design-kit/core.js" defer></script>
<main class="uc-root" data-style="minimal" data-theme="light">
  <button type="button" class="uc-button">保存更改</button>
</main>
```

页面就绪后调用 `UICollection.init(root)`，`root` 为上面的根区域。动态增加独立组件区域后也可对该区域调用；每个区域只绑定一次。

目录所用的 `docs.css`、`catalog.js`、`docs.js`、`styles.js`、`catalog-navigation.js` 是文档依赖，不必进入业务产品。无需包管理器、网络字体、第三方脚本、服务端或构建步骤。

## 组件

18章包括设计基础、风格解析、图标、按钮、表单、选择、筛选、页签、导航、卡片、状态、空状态和加载、弹窗与通知、组合工作台、快速接入、收藏撤销、动效语法、滚动与共享表面。每章均有实际演示与可复制代码。

## 动效

入场以轻微位移与显隐组织阅读，预览展开保持同一对象；反馈短促，避免弹跳与常驻漂浮。

- 入场：12px → 0，260ms，柔和减速。
- 选择：底色或轮廓变化，140ms，不移动周围版式。
- 共享表面：同一预览由局部展开为宽幅，300ms。

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

组合工作台的新建、搜索、状态筛选、归档和撤销在当前浏览器运行；演示数据使用独立键 `ui-collection.minimal.projects.v1`。收藏演示仅当前页面有效。无真实账户、上传或远端保存接口。

## 验证

打开相邻的 [五风格回归验证](../design-kit/tests.html)，点击运行验证。另需手动检查窄屏、焦点、减少动态效果、快速反向滚动与各主题的视觉表现。
