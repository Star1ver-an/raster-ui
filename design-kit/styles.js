/* Original design studies; references are learning sources, not runtime dependencies. */
window.UC_STYLES = {
  "minimal": {
    "id": "minimal",
    "name": "Minimal UI",
    "cn": "极简主义",
    "edition": "04 / ESSENTIAL DESIGN",
    "tag": "LESS, WITH PURPOSE",
    "headline": "少一点，\n更清楚。",
    "intro": "让比例建立秩序，让留白容纳重点。每一处细节，都为了更直接的理解。",
    "principle": "取舍先于装饰",
    "essence": "极简的核心是信息选择与视觉比例。减少相互竞争的强调，用尺寸、对齐和留白建立阅读顺序；并非把所有边框删掉，或把文字一味缩小。",
    "fit": "产品官网、内容阅读、专业工具与高品质品牌界面。",
    "avoid": "把低对比浅灰当作高级感；为了空白而让关键信息离开视线；让同一屏出现多个主操作。",
    "rules": [
      "一屏一个视觉重心，以字阶和间距分配注意力。",
      "使用中性底色与单一强调色，正文保持可读。",
      "组件对齐同一网格，分隔线只在需要区分内容时出现。"
    ],
    "motionTitle": "连续，而不喧哗",
    "motionText": "入场以轻微位移与显隐组织阅读，预览展开保持同一对象；反馈短促，避免弹跳与常驻漂浮。",
    "motion": [
      "入场：12px → 0，260ms，柔和减速。",
      "选择：底色或轮廓变化，140ms，不移动周围版式。",
      "共享表面：同一预览由局部展开为宽幅，300ms。"
    ],
    "reference": "Apple AirPods Pro",
    "url": "https://www.apple.com/airpods-pro/",
    "themes": [
      "纸白",
      "墨黑"
    ],
    "defaultTheme": "light",
    "fast": 140,
    "enter": 260,
    "exit": 160,
    "ease": "cubic-bezier(.2,.75,.25,1)",
    "radius": "14px",
    "border": "1px",
    "shadow": "none",
    "colors": [
      "#f7f7f5",
      "#ffffff",
      "#eeefeb",
      "#20221f",
      "#60655d",
      "#d9ddd4",
      "#244c36",
      "#ffffff",
      "#a32932"
    ],
    "dark": [
      "#161817",
      "#222522",
      "#30342f",
      "#f1f3ed",
      "#b8c0b3",
      "#444b40",
      "#b9d8a7",
      "#193020",
      "#ffb4ab"
    ],
    "art": "object",
    "work": "Quiet Studio",
    "projects": [
      "阅读体验重构",
      "品牌产品页",
      "基础组件规范"
    ],
    "distance": 12,
    "shared": 300
  },
  "expressive": {
    "id": "expressive",
    "name": "Expressive UI",
    "cn": "Material 表现力设计",
    "edition": "05 / EXPRESSIVE SYSTEM",
    "tag": "SHAPE, COLOR, MEANING",
    "headline": "有表达，\n有章法。",
    "intro": "用颜色区分角色，用形状建立关系。把丰富的功能，组织成轻松的日常。",
    "principle": "表现力服务可用性",
    "essence": "Material 的精髓是角色明确的设计系统：色彩、容器、形状与动态共同组织信息。表现力来自重点与节奏，不能牺牲熟悉的操作模式。此库是基于其原则的独立 Web 实践。",
    "fit": "任务管理、媒体工具、移动应用与功能较丰富的产品。",
    "avoid": "每个元素使用不同的鲜艳颜色；移除操作标签；用随机形状取代用户熟悉的列表和导航。",
    "rules": [
      "颜色按内容、容器、主要操作分配语义角色。",
      "重点操作用尺寸与形状共同强化，同级组件保持节奏一致。",
      "圆角与容器表达分组，状态变化必须有文字与语义支持。"
    ],
    "motionTitle": "状态之间，有关系",
    "motionText": "选择与完成通过形状变化表达，入场按内容分组交错；运动有轻微的伸缩感，但不拖慢高频操作。",
    "motion": [
      "按压：0.94 → 1，180ms，局部形状回应。",
      "组入场：18px → 0，320ms，组内间隔36ms。",
      "选择反馈：圆角与缩放共同变化，180ms。"
    ],
    "reference": "Google Material 3 Expressive",
    "url": "https://design.google/library/expressive-material-design-google-research",
    "themes": [
      "丁香浅色",
      "深紫夜色"
    ],
    "defaultTheme": "light",
    "fast": 180,
    "enter": 320,
    "exit": 180,
    "ease": "cubic-bezier(.2,.9,.2,1)",
    "radius": "26px",
    "border": "1px",
    "shadow": "0 4px 12px #30224a09",
    "colors": [
      "#faf7ff",
      "#ffffff",
      "#eee6f7",
      "#261d36",
      "#685b78",
      "#d7cbe5",
      "#65508d",
      "#ffffff",
      "#a3293e"
    ],
    "dark": [
      "#19131f",
      "#261f30",
      "#352b41",
      "#f2eafa",
      "#c9bbd6",
      "#51445f",
      "#d1b7f6",
      "#352047",
      "#ffb2c0"
    ],
    "art": "planner",
    "work": "Everyday Planner",
    "projects": [
      "今日计划界面",
      "媒体播放器",
      "个人日历"
    ],
    "distance": 18,
    "shared": 360
  },
  "liquid": {
    "id": "liquid",
    "name": "Liquid UI",
    "cn": "流动玻璃",
    "edition": "06 / OPTICAL LAYERS",
    "tag": "LIGHT THROUGH LAYERS",
    "headline": "让光，\n穿过界面。",
    "intro": "透明的层次，清晰的内容。边缘光与背景色，共同描绘一块轻盈的表面。",
    "principle": "让功能层浮在内容之上",
    "essence": "玻璃的重点是前后关系与环境融合。背景透过材质参与着色，细边高光交代轮廓，实体文字保持清晰。本库以 CSS 透明、模糊和高光近似光学感，不宣称实现系统级实时折射。",
    "fit": "媒体控制、浮动导航、创意工作台和有丰富背景的展示界面。",
    "avoid": "在玻璃之上继续堆叠玻璃；所有区域持续改变模糊强度；让背景纹理穿透到影响文字辨认。",
    "rules": [
      "内容层、玻璃功能层和弹窗层拥有明确的前后顺序。",
      "背景有色彩与形状，控件保持稳定而清楚的对比。",
      "高光沿边缘出现，模糊与透明度有明确边界。"
    ],
    "motionTitle": "同一块表面的延续",
    "motionText": "浮动表面轻微展开、收束，状态通过局部高光确认；以裁剪与位移组织内容，保持正文与点击位置稳定。",
    "motion": [
      "面板入场：8px → 0，300ms，边缘光随表面就位。",
      "共享表面：展开保持对象连续，360ms。",
      "滚动揭示：裁剪从12%收束到0，反向滚动可回退。"
    ],
    "reference": "Apple Liquid Glass",
    "url": "https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/",
    "themes": [
      "晨光玻璃",
      "暮色玻璃"
    ],
    "defaultTheme": "light",
    "fast": 170,
    "enter": 300,
    "exit": 190,
    "ease": "cubic-bezier(.22,.8,.24,1)",
    "radius": "24px",
    "border": "1px",
    "shadow": "0 12px 32px #253a5812,inset 0 1px 0 #ffffffbb",
    "colors": [
      "#eaf1f6",
      "#ffffffc9",
      "#dde8f0",
      "#183247",
      "#4c6579",
      "#a6bccb",
      "#235b80",
      "#ffffff",
      "#9f3546"
    ],
    "dark": [
      "#142739",
      "#223c50e8",
      "#29475e",
      "#edf6ff",
      "#bdcfdf",
      "#54728a",
      "#a7d7fa",
      "#15354b",
      "#ffbdca"
    ],
    "art": "glass",
    "work": "Light Workspace",
    "projects": [
      "浮动媒体控制",
      "透明工作面板",
      "多层内容预览"
    ],
    "distance": 8,
    "shared": 360
  },
  "brutal": {
    "id": "brutal",
    "name": "Brutal UI",
    "cn": "新粗野主义",
    "edition": "07 / BOLD AND DIRECT",
    "tag": "MAKE IT CLEAR. MAKE IT BOLD.",
    "headline": "表达，\n直接一点。",
    "intro": "清楚的边界，果断的对比。用大胆的色块和直接的反馈，让每一步都可辨认。",
    "principle": "直接、诚实、有辨识度",
    "essence": "新粗野主义用清楚的结构、强对比与图形个性建立识别。边框和硬投影共同说明可操作物体，排版可以大胆，功能结构仍然需要稳定。它不等于随机堆色或故意粗糙。",
    "fit": "创作者平台、独立品牌、活动页面与有鲜明个性的工具。",
    "avoid": "过多彩色块争夺注意力；旋转正文或表单；悬停时改变真实布局；为了个性移除焦点与标签。",
    "rules": [
      "黑色轮廓、硬投影和明确色块形成稳定的图形语法。",
      "主标题大胆，说明文字平实，按钮标签直接表达动作。",
      "每组保留一个主要强调色，交互状态有可见的位移关系。"
    ],
    "motionTitle": "按下，就有回应",
    "motionText": "硬投影与按钮位移成对变化，像按下真实的平面模块。短促位移与剪切揭示强化节奏，不使用柔焦或弹性拖尾。",
    "motion": [
      "按压：4px下沉，投影收回，100ms。",
      "入场：12px → 0，200ms；展示区使用剪切揭示。",
      "确认：边界短暂强调，状态先更新，无庆祝等待。"
    ],
    "reference": "Gumroad",
    "url": "https://gumroad.com/",
    "themes": [
      "奶油撞色",
      "黑底霓色"
    ],
    "defaultTheme": "light",
    "fast": 100,
    "enter": 200,
    "exit": 120,
    "ease": "cubic-bezier(.15,.85,.25,1)",
    "radius": "3px",
    "border": "2px",
    "shadow": "5px 5px 0 var(--uc-ink)",
    "colors": [
      "#f7f2e8",
      "#fffdf7",
      "#efe4ce",
      "#22211e",
      "#625c50",
      "#22211e",
      "#e99bd2",
      "#22211e",
      "#a72530"
    ],
    "dark": [
      "#191919",
      "#262626",
      "#38342c",
      "#f5efdf",
      "#c7bfad",
      "#f5efdf",
      "#eaa1d3",
      "#241a22",
      "#ffb3aa"
    ],
    "art": "poster",
    "work": "Independent Club",
    "projects": [
      "创作者商店",
      "独立出版计划",
      "品牌图形工具"
    ],
    "distance": 12,
    "shared": 200
  },
  "spatial": {
    "id": "spatial",
    "name": "Spatial UI",
    "cn": "沉浸式 3D",
    "edition": "08 / SPATIAL EXPERIENCES",
    "tag": "ENTER A DIFFERENT DIMENSION",
    "headline": "从界面，\n走进空间。",
    "intro": "以空间建立方向，以交互连接探索。让内容拥有深度，让动作带来可理解的变化。",
    "principle": "交互是空间的控制方式",
    "essence": "沉浸式 3D 的核心是可探索的空间与连续反馈。镜头、物体、排版与输入共同建立叙事，而不是在普通页面上放一个不停旋转的模型。本库提供轻量 CSS 3D 场景与组件，不包含 Lusion 的 WebGL 物理引擎。",
    "fit": "创意作品集、产品结构演示、品牌体验和动效实验室。",
    "avoid": "用沉浸演出阻挡导航；持续旋转造成干扰；把按钮文字一起倾斜；将普通业务输入放入复杂镜头运动。",
    "rules": [
      "3D 主体承担展示，文字与主要操作保持在稳定平面。",
      "输入与空间变化有对应关系，支持拖动或滑杆等价操作。",
      "场景具有初态、可回退过程与明确终点，减少动态时静态可读。"
    ],
    "motionTitle": "把探索交给用户",
    "motionText": "鼠标或滑杆控制局部场景方向，滚动控制深度与旋转。场景在输入时响应，离开后归位，不让装饰无限运动。",
    "motion": [
      "入场：24px → 0，420ms，场景和说明分层。",
      "空间交互：局部±10°倾斜，文本保持平面。",
      "滚动驱动：深度与转角映射0–100%，可逆、可停留。"
    ],
    "reference": "Lusion v3",
    "url": "https://www.thenerodesign.com/project/lusion",
    "themes": [
      "日光展厅",
      "深空展厅"
    ],
    "defaultTheme": "dark",
    "fast": 180,
    "enter": 420,
    "exit": 220,
    "ease": "cubic-bezier(.16,1,.3,1)",
    "radius": "18px",
    "border": "1px",
    "shadow": "0 10px 30px #05071418",
    "colors": [
      "#f0f1f6",
      "#ffffff",
      "#e4e7f0",
      "#1b2032",
      "#5e667e",
      "#bdc3d2",
      "#384dba",
      "#ffffff",
      "#a52b46"
    ],
    "dark": [
      "#12151e",
      "#1c2130",
      "#272e40",
      "#f1f4ff",
      "#b1bbd0",
      "#404b65",
      "#b9e75a",
      "#1d2a07",
      "#ffb6c8"
    ],
    "art": "space",
    "work": "Dimension Studio",
    "projects": [
      "空间产品预览",
      "交互展览入口",
      "品牌场景叙事"
    ],
    "distance": 24,
    "shared": 420
  }
};
