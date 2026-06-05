# Next.js Better Auth 模板

基于 Next.js 16、Better Auth、shadcn/ui 和 Supabase PostgreSQL 的认证入门模板。

## 功能

- **邮箱密码登录** — 支持邮箱 + 密码的注册和登录
- **OAuth 社交登录** — 内置 GitHub、Google、Discord、Slack 支持
- **动态 Provider 发现** — 只需少量代码即可接入新的 OAuth 提供商
- **路由保护** — 通过 `proxy.ts` 检查 Cookie + 服务端 session 校验，双重保护受限页面
- **用户仪表盘** — 展示用户信息和 session 详情

## 技术栈

| 层级 | 技术 |
|---|---|
| 框架 | [Next.js 16](https://nextjs.org/) (App Router) |
| 认证 | [Better Auth](https://www.better-auth.com/) |
| UI | [shadcn/ui](https://ui.shadcn.com/) + [Tailwind CSS 4](https://tailwindcss.com/) |
| 数据库 | [Supabase](https://supabase.com/) PostgreSQL |
| ORM | [Drizzle ORM](https://orm.drizzle.team/) |

## 项目结构

```
proxy.ts                         # 路由拦截器（基于 Cookie 的登录检查）
drizzle.config.ts                # Drizzle Kit 配置
app/
  api/auth/[...all]/route.ts     # Better Auth API 路由
  (public)/
    login/                       # 登录页
    register/                    # 注册页
  (protected)/
    dashboard/                   # 用户仪表盘（服务端鉴权）
  page.tsx                       # 首页
  not-found.tsx                  # 404 页面
  layout.tsx                     # 根布局
  globals.css                    # 全局样式（Tailwind + shadcn 主题）
components/
  auth/
    social-login-button.tsx      # 动态 OAuth 按钮
    provider-icons.tsx           # Provider SVG 图标
    logout-button.tsx            # 登出按钮
  ui/                            # shadcn/ui 组件
lib/
  auth.ts                        # Better Auth 服务端配置
  auth-client.ts                 # Better Auth 客户端
  providers.ts                   # OAuth Provider 动态发现
  db/
    index.ts                     # Drizzle 数据库实例
    schema.ts                    # 数据库表结构
  utils.ts                       # 工具函数（cn）
```

## 快速开始

### 前置要求

- Node.js 18+
- 一个 [Supabase](https://supabase.com/) 项目（用于 PostgreSQL 数据库）

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制示例文件，填入你自己的配置：

```bash
cp .env.example .env
```

```env
# 数据库（PostgreSQL 连接字符串）
DATABASE_URL=postgresql://user:password@host:port/database

# Better Auth
BETTER_AUTH_SECRET=至少32个字符的密钥
BETTER_AUTH_URL=http://localhost:3000  # 生产环境请改为实际域名

# OAuth 提供商（填入即启用，留空则禁用）
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
SLACK_CLIENT_ID=
SLACK_CLIENT_SECRET=
```

### 3. 同步数据库结构

```bash
npm run db:push
```

### 4. 启动开发服务器

```bash
npm run dev
```

打开 `http://localhost:3000` 查看效果。

## 添加新的 OAuth 提供商

本模板支持动态 Provider 发现。以添加 Twitter 为例：

1. 在 `.env` 中添加对应的 `clientId` 和 `clientSecret`：

   ```env
   TWITTER_CLIENT_ID=your-client-id
   TWITTER_CLIENT_SECRET=your-client-secret
   ```

2. 在 `lib/providers.ts` 的 `allProviders` 数组中注册该 Provider。

3. 在 `components/auth/provider-icons.tsx` 中添加对应图标。

完成后，登录和注册页会自动显示新的社交登录按钮。

## 可用脚本

| 命令 | 说明 |
|---|---|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run start` | 启动生产服务器 |
| `npm run lint` | 运行 ESLint 检查 |
| `npm run db:generate` | 生成 Drizzle 迁移文件 |
| `npm run db:migrate` | 执行 Drizzle 迁移 |
| `npm run db:push` | 直接推送表结构到数据库 |
| `npm run db:studio` | 打开 Drizzle Studio（数据库可视化工具） |

## 路由一览

| 路径 | 需要登录 | 说明 |
|---|---|---|
| `/` | 否 | 首页 |
| `/login` | 否 | 登录页（已登录自动跳转 `/dashboard`） |
| `/register` | 否 | 注册页（已登录自动跳转 `/dashboard`） |
| `/dashboard` | 是 | 用户仪表盘（未登录跳转 `/login`） |

## 许可证

MIT
