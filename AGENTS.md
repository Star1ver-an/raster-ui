# 项目协作规则

## 动效设计基准

涉及本项目动效、交互反馈、转场、滚动或动效实验室的设计与实现前，先阅读 `docs/motion-foundation.md`，再核对对应组件文档和源码。该文档将用户指定的视频参考转化为本项目的动效设计基石，应持续用于后续设计和评审。

区分视频中观察到的内容、项目已有实现和后续设计起点；不要把参考示例写成已完成的功能。保留 Raster、Soft、Surface 各自的材质运动语言，并处理减少动态效果与动画打断。用户的新要求优先于默认设计规则。

## 五种新增设计语言

涉及 Minimal、Expressive、Liquid、Brutal、Spatial UI 时，先阅读 `docs/style-studies.md` 和对应目录的 README / tokens.json。核心组件在 `design-kit/core.*`；目录、组合工作台和实验室在 `design-kit/catalog.js` / `docs.js`。保持 18 章文档格式，更新集合元数据与静态打包名单；核心交互改动后运行 `design-kit/tests.html`。

## 图片查看规则

用户说明：本机 DeepSeek Responses 兼容接口在同一轮并发调用多个 `view_image` 时，可能让会话持续报错。

- 一次工具调用只查看一张图片；需要多张时顺序查看，看完一张再调用下一次。
- 不把两个及以上的 `view_image` 放入同一个并发工具批次。
- 对比候选图时先记录上一张的结论，再查看下一张。

## 跨会话消息规则

用户说明：本机 DeepSeek 供应商下，`send_message_to_thread` 可能向目标会话写入缺少 `call_id` 的记录，导致持续失败。

- 不使用 `send_message_to_thread` 向其他已有会话发消息。
- 需要已有会话继续工作时，让用户在对应会话中直接发消息。
