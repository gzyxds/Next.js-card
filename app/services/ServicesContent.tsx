/**
 * 自助服务导航页面完整内容组件（ServicesContent）
 *
 * 聚合 172号卡、浩卡联盟、林夕通信等平台的常用自助服务入口。
 * 数据来源：项目根目录 .md 参考文件中的服务链接。
 * 响应式设计，兼容移动端与桌面端。
 *
 * 设计风格与 JoinContent / AboutContent / CooperateContent 保持一致：
 * 根容器 bg-[#f5f7fa]，Hero 白底 + grid 纹理装饰，
 * 各区块交替 bg-white / bg-slate-50，卡片统一 rounded-2xl。
 */
"use client";

import { cn } from "@/lib/utils";
import { SITE_WIDTH_STYLE, containerClass } from "@/lib/layout";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import {
  Compass,
  Store,
  UserPlus,
  LogIn,
  Search,
  MessageSquare,
  Radio,
  Smartphone,
  Wifi,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Layers,
} from "lucide-react";

/* ========== 类型定义 ========== */

/** 单个服务入口 */
interface ServiceItem {
  /** 服务名称 */
  label: string;
  /** 外部链接地址 */
  href: string;
  /** 简短描述 */
  desc: string;
  /** lucide 图标组件 */
  icon: React.ElementType;
  /** 图标容器颜色类（文字色 + 背景色） */
  iconColor?: string;
}

/** 服务平台分组 */
interface ServicePlatform {
  /** 平台名称 */
  name: string;
  /** 平台简介 */
  description: string;
  /** 品牌强调色（Tailwind 文字色类） */
  accentColor: string;
  /** 品牌强调背景色 */
  accentBg: string;
  /** 品牌强调边框色 */
  accentBorder: string;
  /** 该平台下的服务入口列表 */
  services: ServiceItem[];
}

/* ========== 服务平台数据 ========== */

/** 所有自助服务平台数据 */
const PLATFORMS: ServicePlatform[] = [
  {
    name: "172号卡",
    description: "172号卡联盟自助服务，涵盖号卡选购、代理注册、订单追踪等核心功能。",
    accentColor: "text-blue-600",
    accentBg: "bg-blue-50",
    accentBorder: "border-blue-200",
    services: [
      {
        label: "号卡商城",
        href: "https://h5.lot-ml.com/ProductEn/Index/1a654e0b341cadd2",
        desc: "浏览全量号卡套餐，在线选号下单",
        icon: Store,
        iconColor: "text-blue-600 bg-blue-50",
      },
      {
        label: "代理申请",
        href: "https://haoka.lot-ml.com/plugreg.html?agentid=90925",
        desc: "免费注册成为代理商，开启推广分佣",
        icon: UserPlus,
        iconColor: "text-emerald-600 bg-emerald-50",
      },
      {
        label: "登录后台",
        href: "https://haoka.lot-ml.com/login.html",
        desc: "代理商管理后台，查看订单与佣金",
        icon: LogIn,
        iconColor: "text-violet-600 bg-violet-50",
      },
      {
        label: "订单查询",
        href: "https://h5.lot-ml.com/Search/Index",
        desc: "输入手机号查询号卡办理进度",
        icon: Search,
        iconColor: "text-amber-600 bg-amber-50",
      },
    ],
  },
  {
    name: "浩卡联盟",
    description: "浩卡联盟精选品质号卡，提供商城、代理、反馈等一站式服务。",
    accentColor: "text-rose-600",
    accentBg: "bg-rose-50",
    accentBorder: "border-rose-200",
    services: [
      {
        label: "号卡商城",
        href: "https://mp.yapingkeji.com/#/pages/sales_index/my_store?mall_id=AUEQSwr8rvmcWnFhf%2Fnf0g%3D%3D",
        desc: "浩卡精选套餐，品质保障在线办理",
        icon: Store,
        iconColor: "text-rose-600 bg-rose-50",
      },
      {
        label: "代理申请",
        href: "https://s.haokavip.com/u/3792476",
        desc: "加入浩卡联盟代理，享高额佣金",
        icon: UserPlus,
        iconColor: "text-emerald-600 bg-emerald-50",
      },
      {
        label: "订单查询",
        href: "https://mp.yapingkeji.com/#/pages/sales_index/orderSearchentrance?mode=bottom",
        desc: "查询浩卡订单状态与物流信息",
        icon: Search,
        iconColor: "text-amber-600 bg-amber-50",
      },
      {
        label: "意见反馈",
        href: "https://mp.yapingkeji.com/#/pages/feedback/index",
        desc: "提交使用反馈，帮助我们优化服务",
        icon: MessageSquare,
        iconColor: "text-sky-600 bg-sky-50",
      },
    ],
  },
  {
    name: "林夕通信",
    description: "林夕通信号卡服务，提供订单查询及三大运营商自助入口。",
    accentColor: "text-green-600",
    accentBg: "bg-green-50",
    accentBorder: "border-green-200",
    services: [
      {
        label: "订单查询",
        href: "https://h5.vip12300.cn/cha?k=SGpiazRLQVZSREk9",
        desc: "林夕号卡专属订单查询通道",
        icon: Search,
        iconColor: "text-green-600 bg-green-50",
      },
      {
        label: "中国电信查询",
        href: "https://pms.189.cn/cljy-ui/xshkzzfw/xshkzzfw_index?shopid=szs-ah&cmpid=szs-ah",
        desc: "中国电信官方号卡订单自助查询",
        icon: Radio,
        iconColor: "text-blue-600 bg-blue-50",
      },
      {
        label: "中国移动查询",
        href: "https://dev.coc.10086.cn/coc/web/coc2020/cardqueryorder/",
        desc: "中国移动官方号卡订单自助查询",
        icon: Smartphone,
        iconColor: "text-green-600 bg-green-50",
      },
      {
        label: "中国联通查询",
        href: "https://m.10010.com/myorder/",
        desc: "中国联通官方订单查询入口",
        icon: Wifi,
        iconColor: "text-orange-600 bg-orange-50",
      },
    ],
  },
  {
    name: "翼卡云",
    description: "翼卡云流量卡平台，提供在线商城、靓号选购、代理加盟及订单查询等服务。",
    accentColor: "text-cyan-600",
    accentBg: "bg-cyan-50",
    accentBorder: "border-cyan-200",
    services: [
      {
        label: "在线商城",
        href: "https://iot.87haoka.cn/shop#/?promoCode=TpImx3gi&indexFirstGroup=2",
        desc: "浏览全量流量卡套餐，在线选号下单",
        icon: Store,
        iconColor: "text-cyan-600 bg-cyan-50",
      },
      {
        label: "靓号商城",
        href: "https://iot.87haoka.cn/shop/#/?indexFirstGroup=1&promoCode=TpImx3gi",
        desc: "全国手机靓号资源，平台直供",
        icon: Sparkles,
        iconColor: "text-amber-600 bg-amber-50",
      },
      {
        label: "代理申请",
        href: "https://iot.87haoka.cn/r/02237888",
        desc: "申请成为翼卡云代理商，开启推广分佣",
        icon: UserPlus,
        iconColor: "text-emerald-600 bg-emerald-50",
      },
      {
        label: "订单查询",
        href: "https://iot.87haoka.cn/shop#/pages-sub/login/index?promoCode=TpImx3gi",
        desc: "查询翼卡云订单状态与物流信息",
        icon: Search,
        iconColor: "text-sky-600 bg-sky-50",
      },
    ],
  },
];

/** 公共服务入口列表 */
const PUBLIC_SERVICES: ServiceItem[] = [
  {
    label: "一证通查",
    href: "https://getsimnum.caict.ac.cn",
    desc: "工信部官方服务，查询名下所有手机号卡数量",
    icon: ShieldCheck,
    iconColor: "text-slate-600 bg-slate-100",
  },
];

/* ========== Hero 区 ========== */

/** Hero 宣传区（风格与 JoinContent / AboutContent 一致） */
function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* ===== 背景装饰 ===== */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* 右上角大圆（无模糊，与 JoinContent 一致） */}
        <div className="absolute -top-32 -right-32 h-[480px] w-[480px] rounded-full bg-blue-50 blur-3xl" />
        {/* 左下角小圆 */}
        <div className="absolute -bottom-24 -left-24 h-[360px] w-[360px] rounded-full bg-slate-100 blur-3xl" />
        {/* 极淡 grid 网格纹理（与 JoinContent / AboutContent 一致） */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#1d4ed8 1px, transparent 1px), linear-gradient(to right, #1d4ed8 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* 右下角同心圆环 */}
        <div className="absolute right-12 bottom-12 size-56 rounded-full border border-blue-100 opacity-60" />
        <div className="absolute right-24 bottom-24 size-32 rounded-full border border-blue-100 opacity-60" />
      </div>

      <div className={containerClass("relative py-20 md:py-28")} style={SITE_WIDTH_STYLE}>
        <div className="mx-auto max-w-2xl text-center">
          {/* 标签（与项目其他 Hero 保持一致） */}
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-600">
            <Compass className="size-3.5 text-blue-500" />
            一站直达 · 快捷服务
          </div>

          {/* 主标题（字号与 JoinContent / AboutContent 对齐） */}
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            自助服务
            <span className="relative mx-2 inline-block text-blue-600">
              导航
              <span className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-blue-200" />
            </span>
          </h1>

          {/* 副标题 */}
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-gray-500 sm:text-lg">
            聚合多平台号卡自助服务入口，号卡办理、订单查询、代理注册一站直达。
          </p>

          {/* CTA 按钮组 */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#platforms"
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-md shadow-blue-200 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200"
            >
              查看服务平台
              <ArrowRight className="size-4" />
            </a>
            <a
              href="/join"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-7 py-3 text-sm font-medium text-gray-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-600 hover:shadow-md"
            >
              加入代理
            </a>
          </div>

          {/* 核心数据（与 JoinContent / AboutContent 风格一致） */}
          <div className="mt-12 flex items-center justify-center gap-8 sm:gap-14">
            <div className="text-center">
              <div className="text-3xl font-extrabold text-gray-900">{PLATFORMS.length} 大</div>
              <div className="mt-1 text-xs text-gray-400">合作平台</div>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="text-center">
              <div className="text-3xl font-extrabold text-gray-900">
                {PLATFORMS.reduce((acc, p) => acc + p.services.length, 0) + PUBLIC_SERVICES.length}+
              </div>
              <div className="mt-1 text-xs text-gray-400">自助服务入口</div>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="text-center">
              <div className="text-3xl font-extrabold text-gray-900">全程</div>
              <div className="mt-1 text-xs text-gray-400">在线自助</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========== 服务卡片组件 ========== */

/**
 * 单个服务入口卡片
 *
 * 圆角使用微圆角 rounded-lg，保持轻量现代的视觉感受。
 * 所有链接均为外部链接，使用 target="_blank" 新窗口打开。
 */
function ServiceCard({ item }: { item: ServiceItem }) {
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-4 rounded-lg border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
    >
      {/* 图标容器（与项目卡片图标风格一致：size-10 + rounded-xl） */}
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl",
          item.iconColor || "text-slate-600 bg-slate-100"
        )}
      >
        <item.icon className="size-5" />
      </div>

      {/* 文字区域 */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-gray-800 transition-colors group-hover:text-blue-700">
            {item.label}
          </span>
          <ExternalLink className="size-3 shrink-0 text-gray-300 opacity-0 transition-all duration-200 group-hover:text-blue-400 group-hover:opacity-100" />
        </div>
        <span className="mt-0.5 text-xs leading-relaxed text-gray-400">
          {item.desc}
        </span>
      </div>
    </a>
  );
}

/* ========== 平台服务区 ========== */

/**
 * 单个平台服务区域
 *
 * 不再内部嵌套额外的 section 背景，背景由外层 div 交替控制，
 * 避免双重背景色冲突。标题区样式与 AdvantagesSection 标题保持一致。
 */
function PlatformSection({ platform }: { platform: ServicePlatform }) {
  return (
    <div className={containerClass("py-16 md:py-24")} style={SITE_WIDTH_STYLE}>
      {/* ===== 区块标题（与项目其他 Section 标题风格一致） ===== */}
      <div className="mb-12 text-center">
        <div
          className={cn(
            "mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold",
            platform.accentBg,
            platform.accentBorder,
            platform.accentColor
          )}
        >
          <Layers className="size-3.5" />
          {platform.name}
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {platform.name} 服务入口
        </h2>
        <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600" />
        <p className="mx-auto mt-4 max-w-xl text-sm text-gray-500">
          {platform.description}
        </p>
      </div>

      {/* ===== 服务卡片网格 ===== */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {platform.services.map((item) => (
          <ServiceCard key={item.href} item={item} />
        ))}
      </div>
    </div>
  );
}

/* ========== 公共服务区 ========== */

/** 公共服务区域（背景 bg-slate-50，与项目交替区块规范一致） */
function PublicSection() {
  return (
    <section className="bg-slate-50">
      <div className={containerClass("py-16 md:py-24")} style={SITE_WIDTH_STYLE}>
        {/* ===== 区块标题 ===== */}
        <div className="mb-12 text-center">
          <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
            <ShieldCheck className="size-4" />
            官方服务
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            公共服务
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600" />
          <p className="mx-auto mt-4 max-w-xl text-sm text-gray-500">
            工信部及运营商官方提供的通用自助服务
          </p>
        </div>

        {/* ===== 服务卡片网格 ===== */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {PUBLIC_SERVICES.map((item) => (
            <ServiceCard key={item.href} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========== 底部 CTA 区 ========== */

/** 底部快捷入口横幅 */
function BottomCTASection() {
  return (
    <section className="bg-white">
      <div className={containerClass("py-14 md:py-20")} style={SITE_WIDTH_STYLE}>
        <div className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center sm:p-10">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            没找到需要的服务？
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-blue-100">
            成为流量派代理商，获取专属后台与更多推广工具
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/join"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-blue-700 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              立即加入
              <ArrowRight className="size-4" />
            </a>
            <a
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-2.5 text-sm font-medium text-white transition-all hover:border-white/60 hover:bg-white/10"
            >
              了解更多
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========== 页面主组件 ========== */

/** 自助服务导航页面完整内容 */
export default function ServicesContent() {
  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <Header />
      <main>
        <HeroSection />

        {/* ===== 各平台服务区（交替 bg-white / bg-slate-50） ===== */}
        <div id="platforms">
          {PLATFORMS.map((platform, index) => (
            <section
              key={platform.name}
              className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
            >
              <PlatformSection platform={platform} />
            </section>
          ))}
        </div>

        <PublicSection />
        <BottomCTASection />
      </main>
      <Footer />
    </div>
  );
}
