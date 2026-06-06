/**
 * 172号卡 APP 下载推广页面完整内容组件（DownloadContent）
 *
 * 展示 172号卡移动应用的下载入口页面，包含：
 * - 左侧：APP 名称、描述、核心特性列表
 * - 右侧：手机模型与截图展示
 * - 下载按钮组（iOS App Store + Android 应用宝）
 * - 评分与下载量统计数据
 * - 底部 APP 界面截图无限滚动展示区
 *
 * 设计风格与项目整体保持一致：白底为主、blue-600 品牌色、
 * 蓝紫渐变 CTA、响应式网格布局。
 * 参考样式来源：参考样式/Download.astro。
 */
"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { SITE_WIDTH_STYLE, containerClass } from "@/lib/layout";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import { Check, Star, ArrowRight, Award } from "lucide-react";

/* ========== 类型定义 ========== */

/** APP 核心特性项 */
interface AppFeature {
    /** 特性标题 */
    title: string;
    /** 特性描述 */
    description: string;
}

/** 下载渠道按钮配置 */
interface DownloadChannel {
    /** 按钮标签 */
    label: string;
    /** 副标签 */
    subLabel: string;
    /** 下载链接 */
    href: string;
    /** 是否为 iOS 渠道 */
    isIOS: boolean;
}

/* ========== 数据配置 ========== */

/** 172号卡 APP 核心特性列表 */
const APP_FEATURES: AppFeature[] = [
    {
        title: "运营商直签",
        description: "具备与运营商官方合作的资质，号卡来源正规",
    },
    {
        title: "订单管理系统",
        description: "支持实时上传订单、追踪激活状态",
    },
    {
        title: "高激活率快速提现",
        description: "转化率高、资金到账快，适合推广者赚钱",
    },
    {
        title: "系统稳定性",
        description: "流畅、安全的操作体验，适合长期使用",
    },
];

/** 下载渠道配置 */
const DOWNLOAD_CHANNELS: DownloadChannel[] = [
    {
        label: "App Store",
        subLabel: "Download on the",
        href: "https://apps.apple.com/cn/app/172%E5%8F%B7%E5%8D%A1/id6471650035",
        isIOS: true,
    },
    {
        label: "Android",
        subLabel: "Download",
        href: "https://sj.qq.com/appdetail/com.canghai.haoka",
        isIOS: false,
    },
];

/**
 * APP 界面截图列表
 *
 * 用于底部无限滚动展示区，图片需放置在 public/assets/images/app-screenshots/ 目录下。
 * 当前使用占位图片路径，上线前替换为实际截图。
 */
const APP_SCREENSHOTS: { src: string; alt: string }[] = [
    { src: "/assets/images/app-screenshots/shot_1.jpg", alt: "首页界面" },
    { src: "/assets/images/app-screenshots/shot_2.jpg", alt: "订单管理" },
    { src: "/assets/images/app-screenshots/shot_3.jpg", alt: "收益统计" },
    { src: "/assets/images/app-screenshots/shot_4.jpg", alt: "个人中心" },
    { src: "/assets/images/app-screenshots/shot_5.jpg", alt: "我的页面" },
];

/* ========== 下载按钮 SVG 图标 ========== */

/** Apple App Store 图标（内联 SVG） */
function AppleIcon() {
    return (
        <svg className="size-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09998 22C7.78998 22.05 6.79998 20.68 5.95998 19.47C4.24998 17 2.93998 12.45 4.69998 9.39C5.56998 7.87 7.12998 6.91 8.81998 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.35 4.26 13 3.5Z" />
        </svg>
    );
}

/** Android / Google Play 图标（内联 SVG） */
function AndroidIcon() {
    return (
        <svg className="size-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M3 20.5V3.50002C3 2.91002 3.34 2.39002 3.84 2.15002L13.69 12L3.84 21.85C3.34 21.6 3 21.09 3 20.5ZM16.81 15.12L6.05 21.34L14.54 12.85L16.81 15.12ZM20.16 10.81C20.5 11.08 20.75 11.5 20.75 12C20.75 12.5 20.53 12.9 20.18 13.18L17.89 14.5L15.39 12L17.89 9.50002L20.16 10.81ZM6.05 2.66002L16.81 8.88002L14.54 11.15L6.05 2.66002Z" />
        </svg>
    );
}

/* ========== 特性列表项 ========== */

/**
 * 单个特性条目组件
 *
 * 左侧蓝色圆形对勾图标 + 右侧标题与描述文字。
 * 使用 lucide Check 图标替代内联 SVG。
 */
function FeatureItem({ feature }: { feature: AppFeature }) {
    return (
        <div className="flex items-start space-x-4">
            {/* 蓝色圆形对勾图标 */}
            <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-600">
                <Check className="size-3 text-white" strokeWidth={3} />
            </div>
            {/* 文字区 */}
            <div>
                <h3 className="font-semibold text-slate-800">{feature.title}</h3>
                <p className="mt-0.5 text-sm leading-relaxed text-slate-500">
                    {feature.description}
                </p>
            </div>
        </div>
    );
}

/* ========== 下载渠道按钮 ========== */

/**
 * 单个下载渠道按钮
 *
 * iOS 使用黑色背景（模拟 App Store 风格），
 * Android 使用 blue-600（品牌色），hover 时加深并上浮。
 */
function DownloadButton({ channel }: { channel: DownloadChannel }) {
    return (
        <a
            href={channel.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "group flex items-center justify-center gap-3 rounded-xl px-8 py-4 font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg",
                channel.isIOS
                    ? "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-slate-900/20"
                    : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-600/25"
            )}
        >
            {channel.isIOS ? <AppleIcon /> : <AndroidIcon />}
            <div className="text-left">
                <div className="text-xs opacity-80">{channel.subLabel}</div>
                <div className="-mt-0.5 text-base font-semibold">{channel.label}</div>
            </div>
        </a>
    );
}

/* ========== 评分与统计区域 ========== */

/** 评分与下载量统计展示 */
function StatsBar() {
    return (
        <div className="flex items-center gap-8 border-t border-slate-100 pt-6">
            {/* 星级评分 */}
            <div className="flex items-center gap-2">
                {/* 五颗星 */}
                <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="size-4 fill-current" />
                    ))}
                </div>
                <div className="text-slate-800">
                    <span className="font-bold">4.9</span>
                    <span className="ml-1 text-sm text-slate-400">(10,000+ 评价)</span>
                </div>
            </div>

            {/* 下载量 */}
            <div className="text-slate-800">
                <span className="font-bold">1M+</span>
                <span className="ml-1 text-sm text-slate-400">下载量</span>
            </div>
        </div>
    );
}

/* ========== 手机展示区域 ========== */

/**
 * 右侧手机模型展示区
 *
 * 使用装饰性圆环背景 + 应用图片展示。
 * 当前使用 172.png 作为占位图，可替换为实际手机截图 mockup。
 */
function PhoneShowcase() {
    return (
        <div className="flex justify-center lg:justify-end">
            <div className="relative">
                {/* 背景装饰圆环 */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
                    <div className="size-80 rounded-full border border-blue-100 opacity-30" />
                </div>
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
                    <div className="size-96 rounded-full border border-slate-100 opacity-20" />
                </div>

                {/* 手机展示图片 */}
                <div className="relative z-10">
                    <Image
                        src="/spread/172.png"
                        alt="172号卡 APP 界面展示"
                        width={340}
                        height={600}
                        className="object-contain"
                        priority
                    />
                </div>
            </div>
        </div>
    );
}

/* ========== 底部截图滚动展示 ========== */

/**
 * APP 界面截图无限滚动展示区
 *
 * 使用 CSS 动画实现水平无限循环滚动。
 * 截图卡片采用白色圆角卡片包裹，模拟手机边框效果。
 * 动画定义于 globals.css 中的 animate-scroll-smooth。
 */
function ScreenshotGallery() {
    return (
        <div className="mt-20 lg:mt-24">
            {/* 标题区域 */}
            <div className="mb-12 text-center">
                {/* 小标签 */}
                <div className="mb-4 inline-flex items-center">
                    <div className="mr-3 h-6 w-1 rounded-full bg-blue-600" />
                    <span className="text-sm font-medium uppercase tracking-wider text-slate-500">
                        应用界面展示
                    </span>
                </div>
                <h2 className="mb-4 text-3xl font-bold text-slate-800 lg:text-4xl">
                    精美界面设计
                </h2>
                <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-500">
                    沉浸式体验 172号卡APP 的现代化界面设计，每一个细节都经过精心打磨
                </p>
            </div>

            {/* 滚动展示区域 */}
            <div className="relative">
                <div className="overflow-hidden">
                    <div className="flex gap-6 animate-scroll-smooth">
                        {/* 渲染两遍截图列表以实现无缝循环 */}
                        {[...APP_SCREENSHOTS, ...APP_SCREENSHOTS].map((shot, index) => (
                            <div key={`${shot.src}-${index}`} className="shrink-0">
                                {/* 手机外框卡片 */}
                                <div className="flex h-[480px] w-[270px] items-center justify-center rounded-3xl border border-slate-100 bg-white p-2 shadow-lg">
                                    <Image
                                        src={shot.src}
                                        alt={shot.alt}
                                        width={254}
                                        height={464}
                                        className="h-full w-full rounded-2xl object-contain"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ========== Hero 标签行 ========== */

/** 小型标签装饰行（蓝色竖线 + 大写文字） */
function SectionTag({ label }: { label: string }) {
    return (
        <div className="inline-flex items-center">
            <div className="mr-3 h-6 w-1 rounded-full bg-blue-600" />
            <span className="text-sm font-medium uppercase tracking-wider text-slate-500">
                {label}
            </span>
        </div>
    );
}

/* ========== 页面主组件 ========== */

/**
 * 172号卡 APP 下载推广页面完整内容
 *
 * 布局：顶部导航 → Hero 双栏区（左文字 + 右手机）→ 截图滚动画廊 → 底部
 *
 * 响应式：
 * - 移动端（<768px）：单列堆叠，手机展示居中
 * - 桌面端（≥1024px）：双栏并排布局
 */
export default function DownloadContent() {
    return (
        <div className="flex min-h-svh flex-col bg-white">
            <Header />

            <main className="flex-1">
                {/* ===== Hero 主区域：双栏布局 ===== */}
                <section className="relative overflow-hidden bg-white py-16 lg:py-24">
                    {/* 背景几何装饰 */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                        {/* 右上角简约圆 */}
                        <div className="absolute right-10 top-20 size-32 rounded-full border border-blue-100 opacity-30" />
                        {/* 左下角旋转方块 */}
                        <div className="absolute bottom-20 left-10 size-24 rotate-45 rounded-lg bg-blue-50 opacity-40" />
                        {/* 竖直细线 */}
                        <div className="absolute left-1/4 top-1/2 h-16 w-0.5 bg-blue-200 opacity-20" />
                        {/* 水平细线 */}
                        <div className="absolute right-1/3 top-1/3 h-0.5 w-16 bg-blue-200 opacity-20" />
                    </div>

                    <div className={containerClass("relative z-10")} style={SITE_WIDTH_STYLE}>
                        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
                            {/* ===== 左侧内容区域 ===== */}
                            <div className="space-y-8">
                                {/* 标签 */}
                                <SectionTag label="移动应用体验" />

                                {/* 主标题 */}
                                <div className="space-y-4">
                                    <h1 className="text-4xl font-bold leading-tight text-slate-800 lg:text-5xl xl:text-6xl">
                                        172<span className="text-blue-600">号卡</span>
                                    </h1>
                                    <p className="max-w-lg text-lg leading-relaxed text-slate-500">
                                        体验全新设计的移动应用，享受简洁高效的操作界面和智能化的功能体验。
                                    </p>
                                </div>

                                {/* 核心特性列表 */}
                                <div className="space-y-6">
                                    {APP_FEATURES.map((feature) => (
                                        <FeatureItem key={feature.title} feature={feature} />
                                    ))}
                                </div>

                                {/* 下载按钮组 */}
                                <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                                    {DOWNLOAD_CHANNELS.map((channel) => (
                                        <DownloadButton key={channel.label} channel={channel} />
                                    ))}
                                </div>

                                {/* 评分与统计 */}
                                <StatsBar />
                            </div>

                            {/* ===== 右侧手机展示区域 ===== */}
                            <PhoneShowcase />
                        </div>

                        {/* ===== 底部截图滚动展示 ===== */}
                        <ScreenshotGallery />
                    </div>
                </section>

                {/* ===== 底部 CTA 横幅 ===== */}
                <section className="bg-slate-50">
                    <div className={containerClass("py-14 md:py-20")} style={SITE_WIDTH_STYLE}>
                        <div className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center sm:p-10">
                            <div className="mb-4 inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90">
                                <Award className="mr-1.5 size-4" />
                                合作伙伴
                            </div>
                            <h2 className="text-2xl font-bold text-white sm:text-3xl">
                                成为 172号卡 推广代理
                            </h2>
                            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-blue-100">
                                注册即享高额分佣，专业运营指导，助您快速开启号卡推广之旅
                            </p>
                            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                                <a
                                    href="https://haoka.lot-ml.com/plugreg.html?agentid=90925"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-blue-700 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
                                >
                                    立即注册
                                    <ArrowRight className="size-4" />
                                </a>
                                <a
                                    href="/join"
                                    className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-2.5 text-sm font-medium text-white transition-all hover:border-white/60 hover:bg-white/10"
                                >
                                    了解更多
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
