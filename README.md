# 任务管理助手 (Task Manager App)

一个功能完整的移动任务管理应用，帮助用户高效组织和跟踪日常任务。应用采用本地存储方案，确保快速响应和离线可用性。

## 功能特性

### 核心功能

- **任务管理**：创建、编辑、删除和查看任务
- **优先级管理**：为任务设置高、中、低三个优先级
- **截止日期**：为任务设置截止日期并进行日期选择
- **任务分类**：将任务分类管理，支持自定义分类
- **完成状态**：标记任务为已完成或待完成
- **分类筛选**：按分类快速筛选和查看任务
- **统计信息**：实时显示总任务数、已完成数和待完成数

### 用户界面

- **首页**：任务列表、统计卡片、分类过滤和浮动操作按钮
- **任务详情**：查看任务完整信息，支持快速完成状态切换
- **创建任务**：便捷的表单界面，支持所有任务属性设置
- **编辑任务**：修改现有任务的所有信息
- **响应式设计**：完全适配移动设备，支持浅色和深色主题

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| **React Native** | 0.81.5 | 跨平台移动应用开发 |
| **Expo** | 54.0 | 开发框架和工具链 |
| **TypeScript** | 5.9 | 类型安全的开发语言 |
| **NativeWind** | 4.2 | Tailwind CSS for React Native |
| **Expo Router** | 6.0 | 应用路由管理 |
| **AsyncStorage** | 1.23 | 本地数据持久化存储 |
| **React Query** | 5.90 | 数据查询和缓存 |

## 项目结构

```
task-manager-app/
├── app/                          # 应用主要代码
│   ├── (tabs)/
│   │   ├── _layout.tsx          # 标签栏布局
│   │   └── index.tsx            # 首页屏幕
│   ├── create-task.tsx          # 创建任务屏幕
│   ├── edit-task.tsx            # 编辑任务屏幕
│   ├── task-detail.tsx          # 任务详情屏幕
│   └── _layout.tsx              # 根布局
├── components/                   # 可复用 UI 组件
│   ├── task-card.tsx            # 任务卡片组件
│   ├── stats-card.tsx           # 统计卡片组件
│   ├── fab.tsx                  # 浮动操作按钮
│   ├── screen-container.tsx     # 屏幕容器组件
│   └── ui/
│       └── icon-symbol.tsx      # 图标映射组件
├── hooks/                        # 自定义 React Hooks
│   ├── use-task-store.ts        # 任务数据管理 Hook
│   ├── use-colors.ts            # 主题颜色 Hook
│   └── use-color-scheme.ts      # 颜色方案检测 Hook
├── lib/                          # 工具和配置
│   ├── utils.ts                 # 工具函数
│   └── trpc.ts                  # API 客户端
├── constants/                    # 常量定义
│   └── theme.ts                 # 主题配置
├── assets/                       # 应用资源
│   └── images/                  # 应用图标和图片
├── design.md                     # 应用设计文档
├── todo.md                       # 开发待办清单
├── app.config.ts                # Expo 应用配置
├── tailwind.config.js           # Tailwind CSS 配置
├── theme.config.js              # 主题色彩配置
└── package.json                 # 项目依赖配置
```

## 快速开始

### 前置要求

- Node.js 18+ 和 npm/pnpm
- Expo CLI（可选，使用 `npx expo` 运行）
- iOS 或 Android 设备/模拟器

### 安装依赖

```bash
# 使用 pnpm（推荐）
pnpm install

# 或使用 npm
npm install
```

### 开发模式

```bash
# 启动开发服务器
pnpm dev

# 或分别启动服务器和 Metro 打包器
pnpm dev:server      # 后端服务器
pnpm dev:metro       # Metro 打包器
```

### 在设备上运行

```bash
# iOS
pnpm ios

# Android
pnpm android

# Web
pnpm dev:metro       # 访问 http://localhost:8081
```

### 生成 QR 码

```bash
pnpm qr
```

使用 Expo Go 应用扫描 QR 码在真实设备上预览应用。

## 数据模型

### Task（任务）

```typescript
interface Task {
  id: string;                           // 唯一标识符
  title: string;                        // 任务标题
  description: string;                  // 任务描述
  priority: 'high' | 'medium' | 'low';  // 优先级
  completed: boolean;                   // 完成状态
  dueDate: string | null;               // 截止日期（ISO 8601 格式）
  category: string;                     // 分类 ID
  createdAt: string;                    // 创建时间
  updatedAt: string;                    // 更新时间
}
```

### Category（分类）

```typescript
interface Category {
  id: string;          // 唯一标识符
  name: string;        // 分类名称
  color: string;       // 分类颜色（十六进制）
}
```

## 颜色方案

### 品牌色

| 颜色 | 浅色模式 | 深色模式 | 用途 |
|------|---------|---------|------|
| Primary | #0a7ea4 | #0a7ea4 | 主要操作按钮、链接 |
| Background | #ffffff | #151718 | 页面背景 |
| Surface | #f5f5f5 | #1e2022 | 卡片、容器背景 |
| Foreground | #11181C | #ECEDEE | 主要文本 |
| Muted | #687076 | #9BA1A6 | 辅助文本 |
| Border | #E5E7EB | #334155 | 边框、分割线 |

### 状态色

| 状态 | 颜色 | 用途 |
|------|------|------|
| Success | #22C55E | 成功、低优先级 |
| Warning | #F59E0B | 警告、中优先级 |
| Error | #EF4444 | 错误、高优先级 |

## 使用指南

### 创建任务

1. 点击首页右下角的 **+** 按钮
2. 填写任务标题（必填）
3. 添加任务描述（可选）
4. 选择优先级（高、中、低）
5. 设置截止日期（可选）
6. 选择任务分类
7. 点击 **保存任务** 按钮

### 编辑任务

1. 在首页点击任务卡片进入详情页
2. 点击 **编辑** 按钮
3. 修改任务信息
4. 点击 **保存修改** 按钮

### 完成任务

**方法一**：在任务卡片上点击复选框
**方法二**：进入任务详情页，点击完成状态切换区域

### 删除任务

1. 进入任务详情页
2. 点击 **删除** 按钮
3. 在确认对话框中选择 **删除**

### 筛选任务

在首页分类栏中点击分类标签，列表会自动更新显示该分类的任务。点击 **全部** 恢复显示所有任务。

## 状态管理

应用使用 **React Context + AsyncStorage** 进行状态管理和数据持久化。所有任务数据都存储在设备本地，无需网络连接。

### useTaskStore Hook

```typescript
const {
  tasks,              // 所有任务数组
  categories,         // 所有分类数组
  isLoading,          // 加载状态
  addTask,            // 添加任务函数
  updateTask,         // 更新任务函数
  deleteTask,         // 删除任务函数
  toggleTask,         // 切换完成状态函数
  addCategory,        // 添加分类函数
  deleteCategory,     // 删除分类函数
  getStats,           // 获取统计信息函数
  getTasksByCategory, // 按分类获取任务函数
} = useTaskStore();
```

## 开发指南

### 添加新屏幕

1. 在 `app/` 目录下创建新的 `.tsx` 文件
2. 使用 `ScreenContainer` 组件包装内容
3. 在 `app/(tabs)/_layout.tsx` 中添加导航配置

### 创建新组件

1. 在 `components/` 目录下创建新的 `.tsx` 文件
2. 使用 Tailwind CSS 类进行样式设计
3. 导出组件供其他文件使用

### 使用主题颜色

```typescript
import { useColors } from '@/hooks/use-colors';

export function MyComponent() {
  const colors = useColors();
  
  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.foreground }}>Hello</Text>
    </View>
  );
}
```

## 性能优化

- 使用 `FlatList` 而不是 `ScrollView` 处理长列表
- 避免在渲染时创建新对象和函数
- 使用 `useMemo` 和 `useCallback` 优化性能
- 定期检查 TypeScript 编译错误

## 测试

```bash
# 运行单元测试
pnpm test

# 类型检查
pnpm check

# 代码格式化
pnpm format

# 代码检查
pnpm lint
```

## 部署

### 构建生产版本

```bash
# 构建 iOS 和 Android 应用
eas build

# 构建 Web 版本
pnpm run build
```

### 发布应用

使用 Expo Application Services (EAS) 发布应用到 App Store 和 Google Play。

## 常见问题

### 数据丢失怎么办？

所有数据存储在设备本地的 AsyncStorage 中。如果需要备份，可以导出任务数据。

### 如何同步多个设备上的数据？

当前版本使用本地存储，不支持跨设备同步。可以通过集成后端服务器来实现此功能。

### 如何修改应用名称？

编辑 `app.config.ts` 文件中的 `appName` 字段。

### 如何修改应用图标？

替换 `assets/images/icon.png` 文件，或在 `app.config.ts` 中更新 `logoUrl`。

## 后续功能计划

- [ ] 推送通知提醒
- [ ] 云数据同步
- [ ] 重复任务支持
- [ ] 任务搜索功能
- [ ] 任务导出功能
- [ ] 用户认证和多设备同步
- [ ] 任务评论和协作功能
- [ ] 任务标签系统

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License - 详见 LICENSE 文件

## 联系方式

- GitHub: https://github.com/ZerCatMr/task-manager-app
- 问题报告: https://github.com/ZerCatMr/task-manager-app/issues

---

**开发者**: Manus AI Agent  
**创建时间**: 2026 年 2 月  
**最后更新**: 2026 年 2 月 6 日
