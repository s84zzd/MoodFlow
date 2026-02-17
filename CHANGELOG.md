# Changelog | 更新日志

All notable changes to this project will be documented in this file.

本项目所有重要变更都将记录在此文件中。

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/lang/zh-CN/).

## [Unreleased] | 未发布

### Added | 新增
- 准备开源发布
- 添加 MIT 许可证
- 完善中英文 README
- 添加贡献指南
- 添加 Issue 模板

## [1.0.0] - 2026-02-16

### Added | 新增

#### 🎭 核心功能 | Core Features
- **情绪打卡系统** - 支持9种情绪状态（焦虑、忧郁、快乐、懊悔、平静、期待、满足、怀疑、压力）
- **场景选择** - 6大生活场景（居家、独处、工作、通勤、恋爱、社交）
- **1小时打卡限制** - 智能提醒避免无效重复记录
- **强制打卡** - 支持覆盖旧记录功能

#### 🎯 活动推荐 | Activity Recommendations
- 基于情绪+场景的智能活动推荐
- 每个场景配备4+心理调节活动
- 涵盖呼吸练习、冥想、 journaling、运动、音乐疗愈等

#### 🤖 AI 情绪助手 | AI Mood Assistant
- 情绪趋势分析（改善/恶化/稳定/混合）
- 个性化建议（避免重复、负面情绪预警）
- 6种情绪 × 6条建议的知识库

#### 📊 数据统计 | Data Statistics
- 近7天情绪分布彩虹饼图
- 近4周情绪趋势分析
- TOP情绪统计
- CSV数据导出

#### 👤 个人中心 | Profile
- **成就系统** - 8个成就徽章 + 5个里程碑
- **个人资料** - 昵称、简介、隐私设置
- **设置页面** - 账号绑定、通知、数据管理

#### 💬 社交分享 | Social Sharing
- 每日心语分享
- 邀请好友奖励机制
- 个人主页链接分享

#### 📚 知识科普 | Knowledge
- 9种情绪详细定义
- 身体感受、触发因素、调节建议
- 情绪颜色 emoji 统一标识

### Technical | 技术实现

#### 🏗️ 架构 | Architecture
- React 19.2 + TypeScript 5.9
- Vite 7.2 构建工具
- Tailwind CSS 3.4 样式
- Radix UI + shadcn/ui 组件库

#### 📁 项目结构 | Project Structure
```
src/
├── components/     # 可复用组件
├── sections/       # 页面区块
├── hooks/          # 自定义 Hooks
├── data/           # 静态数据
├── types/          # 类型定义
└── lib/            # 工具函数
```

#### 🎨 设计特色 | Design
- 温暖粉色系配色
- 玻璃拟态效果
- 流畅动画过渡
- 响应式布局

### Data | 数据

#### 💾 存储 | Storage
- localStorage 本地持久化
- 无需注册登录
- 隐私优先设计

#### 📈 统计能力 | Statistics
- 情绪分布分析
- 连续打卡追踪
- 趋势可视化

---

## 版本说明 | Version Guide

- **MAJOR** - 不兼容的 API 修改
- **MINOR** - 向下兼容的功能新增
- **PATCH** - 向下兼容的问题修复

---

## 贡献者 | Contributors

感谢所有为 MoodFlow 做出贡献的人！

Thanks to all contributors who have helped make MoodFlow better! 🎉
