# 灵感收纳盒 · Inspiration Inbox

> 一个**本地优先、端到端加密同步**的多模态精神档案库。把转瞬即逝的文字、图片、链接收进「冷库 / 工作台 / 内核」三层空间。
> 纯前端单文件 HTML，零框架、零后端、零注册，可安装为三端离线应用。

**▶ 在线试用**：https://shuieryigoko-del.github.io/Inspiration-Inbox/
（手机/电脑浏览器打开 → 顶栏「📲安装App」可装到主屏幕；iPad 请用 Safari）

## 功能

- 三层空间：冷库（原始素材）/ 工作台（加工中）/ 内核（沉淀成品）
- 多模态碎片：文字、图片（本地 Canvas 压缩）、链接（正文 URL 自动可点击）
- 标签 + 实时搜索、瀑布流、毛玻璃抽屉详情、日/夜双模式
- 数据安全：IndexedDB 本地存储；JSON 一键导入导出；自动备份（授权文件夹静默备份 / 系统分享 / 下载三级降级）
- PWA：安装后全屏独立运行，**断网可开可用**，新版本在线时自动提示更新
- **三端端到端加密云同步**：GitHub Gist 只存密文（PBKDF2 15 万次 + AES-256-GCM），LWW + 墓碑合并，回前台/45 秒自动同步
- 安全：用户内容全部 textContent/createElement 渲染，URL 协议白名单，XSS 自测通过

## 技术栈

原生 HTML + CSS + Vanilla JS（单文件，无构建链）· IndexedDB · Service Worker · Web Crypto API · GitHub Pages/Gist

## 开发过程实录（含失败、报错与返工，全程可追溯）

| 版本 | 日期 | 内容 |
|---|---|---|
| v1.0 | 10-29 | 六层架构 MVP：三空间、碎片 CRUD、瀑布流、搜索、抽屉、日夜、图片压缩、导入导出、自动备份 |
| v1.1 | 10-29 | **真机返工①**：iOS 输入框 <16px 聚焦自动放大 → 统一 16px；系统分享导出；PWA 安装按钮 |
| v1.2 | 10-29 | GitHub Pages + PWA；**返工②**：Service Worker 缓存策略导致三端收不到更新 → HTML 改网络优先 + 更新提示 |
| v1.3 | 10-30 | 云同步层：Gist + AES-GCM/PBKDF2、LWW 合并、墓碑、自动发现、加密自测 |
| v1.3.1–1.3.3 | 10-30 | **返工③**：安卓安装无反应/容器无桌面权限 → 引导式安装与 iOS Safari 图文指引 |
| v1.3.4 | 10-30 | **返工④**：iPad 碎片增多右侧列白块（iOS Safari CSS columns 渲染缺陷）→ 瀑布流 flex 分列重写；回前台自动同步 |
| v1.3.5 | 10-30 | **返工⑤**：电脑同步比手机慢 → 定位 API 60 秒缓存与缺失回前台触发 → no-store + 45 秒轮询 + focus 事件 |
| v1.4 | 10-30 | 正文 URL 自动渲染为安全可点击链接（协议白名单、防误触），六项浏览器验收 |

- 每个版本均有 git tag，且完整单文件快照归档于 [`backups/code/`](backups/code)；
- 设计宪法、阶段提示词（含被否决方案）、技术架构、备份指南、同类产品调研见 [`docs/`](docs)。

## 目录

```
app/                 应用本体（index.html + sw.js + manifest + icons）
docs/                产品与技术文档 7 份（md + docx）
backups/code/        每个版本的单文件快照
index.html           仓库根跳转页
```

## 隐私模型

本地优先（local-first）：本地数据库永远是主体，断网全部记录功能可用；开启同步后云端只存在密文，同步密码不可找回（零知识架构，与 Joplin / Standard Notes 同一信任模型）。
