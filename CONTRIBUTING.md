# 贡献指南 | Contributing Guide

感谢您对 MoodFlow 的关注！我们欢迎各种形式的贡献，包括但不限于：

Thank you for your interest in MoodFlow! We welcome all forms of contributions, including but not limited to:

- 🐛 报告 Bug | Reporting bugs
- 💡 提出新功能建议 | Suggesting new features
- 📝 改进文档 | Improving documentation
- 🔧 提交代码修复 | Submitting bug fixes
- ✨ 添加新功能 | Adding new features

## 🚀 快速开始 | Quick Start

### 1. Fork 仓库 | Fork the Repository

点击右上角的 "Fork" 按钮，将项目 Fork 到您的 GitHub 账户。

Click the "Fork" button in the top right to fork the project to your GitHub account.

### 2. 克隆仓库 | Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/moodflow.git
cd moodflow
```

### 3. 安装依赖 | Install Dependencies

```bash
npm install
```

### 4. 启动开发服务器 | Start Development Server

```bash
npm run dev
```

访问 http://localhost:5173/ 查看应用。

Visit http://localhost:5173/ to see the app.

## 📋 开发规范 | Development Guidelines

### 代码风格 | Code Style

- 使用 **TypeScript** 严格模式
- 遵循 **ESLint** 和 **Prettier** 配置
- 组件使用函数式组件 + Hooks
- 类型定义放在 `src/types/` 目录

### 提交规范 | Commit Convention

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

We use [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type 类型：**

- `feat`: 新功能 | New feature
- `fix`: 修复 Bug | Bug fix
- `docs`: 文档更新 | Documentation
- `style`: 代码格式 | Code style (formatting, missing semi colons, etc)
- `refactor`: 重构 | Refactoring
- `perf`: 性能优化 | Performance improvements
- `test`: 测试 | Adding tests
- `chore`: 构建/工具 | Build process or auxiliary tool changes

**示例 | Examples：**

```bash
feat(mood): add new mood type "excited"
fix(checkin): resolve 1-hour limit logic bug
docs(readme): update installation guide
style(components): format with prettier
```

### 分支策略 | Branch Strategy

- `main`: 稳定版本分支 | Stable release branch
- `develop`: 开发分支 | Development branch
- `feature/*`: 功能分支 | Feature branches
- `fix/*`: 修复分支 | Bug fix branches

## 📝 提交 Pull Request

### 步骤 | Steps

1. **创建分支 | Create Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **提交更改 | Commit Changes**
   ```bash
   git add .
   git commit -m "feat(scope): your commit message"
   ```

3. **推送到 Fork | Push to Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **创建 PR | Create Pull Request**
   - 在 GitHub 上创建 PR 到 `develop` 分支
   - 填写 PR 模板，描述改动内容
   - 关联相关 Issue（如果有）

### PR 要求 | PR Requirements

- [ ] 代码通过所有测试 | Code passes all tests
- [ ] 添加必要的测试 | Add necessary tests
- [ ] 更新相关文档 | Update relevant documentation
- [ ] 遵循代码规范 | Follow code style guidelines
- [ ] PR 描述清晰 | Clear PR description

## 🐛 报告 Bug

### 提交前检查 | Before Submitting

- 搜索现有 Issue，避免重复报告
- 确认使用的是最新版本
- 尝试在干净环境中复现问题

### Bug 报告模板 | Bug Report Template

```markdown
**描述问题 | Description**
清晰简洁地描述 Bug

**复现步骤 | Steps to Reproduce**
1. 进入 '...'
2. 点击 '...'
3. 看到错误

**期望行为 | Expected Behavior**
描述期望的正确行为

**截图 | Screenshots**
如有必要，添加截图

**环境信息 | Environment**
- OS: [e.g. macOS, Windows, iOS]
- Browser: [e.g. Chrome, Safari]
- Version: [e.g. 22]

**其他信息 | Additional Context**
其他相关信息
```

## 💡 建议新功能

### 功能建议模板 | Feature Request Template

```markdown
**功能描述 | Feature Description**
清晰描述您想要的功能

**使用场景 | Use Case**
描述这个功能的使用场景

**期望解决方案 | Proposed Solution**
描述您期望的实现方式

**替代方案 | Alternatives**
描述您考虑过的替代方案

**其他信息 | Additional Context**
其他相关信息或截图
```

## 🏗️ 项目结构 | Project Structure

```
src/
├── components/          # 可复用组件 | Reusable components
│   ├── ui/             # UI 基础组件 | Base UI components
│   └── ...
├── sections/           # 页面区块 | Page sections
│   ├── MoodSelector.tsx
│   ├── SceneSelector.tsx
│   └── ...
├── hooks/              # 自定义 Hooks | Custom hooks
├── data/               # 静态数据 | Static data
├── types/              # 类型定义 | Type definitions
├── lib/                # 工具函数 | Utility functions
└── test/               # 测试文件 | Test files
```

## 📞 联系我们 | Contact Us

- 💬 加入讨论：GitHub Discussions
- 🐦 关注 Twitter：[@MoodFlowApp](https://twitter.com/moodflowapp)
- 📧 邮件联系：zenbalasmith@gmail.com

## ❤️ 贡献者 | Contributors

感谢所有为 MoodFlow 做出贡献的人！

Thanks to all the contributors who have helped make MoodFlow better!

<a href="https://github.com/yourusername/moodflow/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=yourusername/moodflow" />
</a>

---

**再次感谢您的贡献！ | Thank you again for your contribution!** 🎉
