# dsh-vditor-composer

> GitHub 仓库 `dsh-vditor` —— 用 Vditor 接管 DSH Web 聊天输入的插件

用 **Vditor 3.11.3（IR 即时渲染模式）** 接管 DSH Web 的聊天输入卡片，并把用户消息渲染为完整 Markdown。

## 功能

### 输入卡片（替换 `conversation.composer.bar` 槽，保留 hero 其余界面）

- Vditor IR 编辑器：Markdown 即时渲染、代码块高亮（monokai）、KaTeX 数学公式、Mermaid 图表
- 斜杠命令菜单：`/goal` `/compact` `/permission` `/plan` `/export` `/feedback` `/model`（实时过滤）
- `@` 文件引用菜单：工作区文件递归搜索（深度 ≤5，最多 30 条，跳过 node_modules/.git/.dsh-*）
- 附件胶囊：通过系统文件选择器（Host PowerShell OpenFileDialog）选取文件，**仅引用路径**（不拷贝、不插入 `@`），发送时路径附入消息文本
- 粘贴剪贴板图片：自动落盘到工作区 `.dsh-assets/` 并生成路径胶囊
- 复刻原版工具栏：模型选择（含推理等级）、权限菜单、命令目录、上下文用量环（含明细）、任务栏、统计行、DeepSeek 余额行
- 动态 placeholder：hero 新建会话「描述你想要构建的内容」、计划模式、会话不可用、database-helper 三态、默认「给智能体发消息」
- 代码块语言徽标：hover 时右下角显示（深色底白字，伪元素实现，不破坏 Vditor IR 的编辑 DOM）

### 用户消息气泡（替换 `conversation.chat.node` 的 `user`/`steering` key）

- `Vditor.preview` 渲染：代码块高亮 + 语言徽标 + 复制按钮（hover 显示）、KaTeX、Mermaid
- 仿 dsh-better-markdown 的安全策略：链接白名单（http/https/mailto，`target=_blank`）、图片仅外链
- 主题自适应：`--dsw-alias-bg-base` 亮度检测 + 主题切换监听

## 架构

- **Host（lib/index.js）**：`/plugins/vditor-composer` 前缀路由（webServer）
  - `POST /save-upload`：base64 → 工作区 `.dsh-assets`（PowerShell stdin 写入）
  - `POST /pick-files`：系统文件选择器，返回绝对路径列表
  - `GET /atfile-search`：工作区文件递归搜索
- **Client（lib/client.js）**：`window.__ModuleLoader__.load` 模块，注入 `timer`/`slots`
- Vditor 从 `https://unpkg.com/vditor@3.11.3` 动态加载（需联网）

## 安装（Profile 挂载）

在 profile 目录（如 `~/.dsh/profiles/web`）：

```sh
pnpm add "file:path/to/dsh-vditor-composer"
```

然后在 profile 的 `package.json` 的 `dsh.profile.bundles` 数组中加入 `"dsh-vditor-composer"`，重启 DSH 生效。

## 说明

- 原版输入框由 `conversation.composer.bar` 槽（priority 0）提供，本插件以 priority -10 注册仅替换输入卡片。
- 附件只是路径引用：模型需要自行读取文件内容。
- 若同时启用本插件的动态（会话内）版本，会与正式版重复注册同一槽位，请停用其中一个。

## License

[MIT](./LICENSE)
