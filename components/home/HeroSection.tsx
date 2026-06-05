"use client";

/**
 * 首页主视觉区域（HeroSection）
 *
 * 三栏电信风格布局，三栏高度保持一致：
 * - 左栏：品牌价值文案 + CTA 按钮 + 信任指标
 * - 中栏：轮播图展示（自动播放 + 触摸滑动 + 悬停暂停）
 * - 右栏：核心优势 2x2 卡片 + 快捷入口列表 + 运营商底栏
 *
 * 参考设计：参考样式/Hero.astro
 *
 * 高度对齐策略：
 * - 桌面端（xl）：中栏用 xl:flex-1 填充网格拉伸高度
 * - 移动端/平板（< xl）：中栏用 aspect-video 维持 16:9
 */

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SITE_WIDTH_STYLE, containerClass } from "@/lib/layout";
import {
  Gift,
  UserPlus,
  HeadphonesIcon,
  ChevronRight,
  Wifi,
  Package,
  Shuffle,
  Banknote,
  Signal,
  LogIn,
} from "lucide-react";

/* ========== 轮播图配置 ========== */

/** 轮播图自动播放间隔（毫秒） */
const AUTO_PLAY_DELAY = 5000;

/** 最小滑动距离阈值（像素），低于此值不触发切换 */
const MIN_SWIPE_DISTANCE = 50;

/** 轮播图幻灯片数据 */
const CAROUSEL_SLIDES = [
  {
    id: 1,
    gradient: "from-blue-600 via-blue-500 to-indigo-600",
    title: "超大流量套餐",
    subtitle: "月租低至19元，畅享高速5G网络",
  },
  {
    id: 2,
    gradient: "from-indigo-600 via-purple-500 to-pink-500",
    title: "全国通用流量",
    subtitle: "不限APP、不限速，去哪都能用",
  },
  {
    id: 3,
    gradient: "from-teal-500 via-cyan-500 to-blue-500",
    title: "官方正规号卡",
    subtitle: "运营商直发，实名认证，安全可靠",
  },
];

/* ========== 核心优势数据 ========== */

const CORE_ADVANTAGES = [
  {
    label: "19元起",
    desc: "超低月租",
    icon: Banknote,
    bgGradient: "from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10",
    iconColor: "text-orange-500",
  },
  {
    label: "299G",
    desc: "通用流量",
    icon: Wifi,
    bgGradient: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10",
    iconColor: "text-blue-500",
  },
  {
    label: "免费包邮",
    desc: "送到家",
    icon: Package,
    bgGradient: "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10",
    iconColor: "text-green-500",
  },
  {
    label: "四网可选",
    desc: "自由切换",
    icon: Shuffle,
    bgGradient: "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10",
    iconColor: "text-purple-500",
  },
];

/* ========== 快捷入口数据 ========== */

const QUICK_LINKS = [
  {
    label: "代理申请",
    desc: "成为合作伙伴",
    href: "https://haoka.lot-ml.com/plugreg.html?agentid=90925",
    icon: UserPlus,
  },
  {
    label: "登入后台",
    desc: "代理商管理系统",
    href: "https://haoka.lot-ml.com/login.html",
    icon: LogIn,
  },
  {
    label: "联系客服",
    desc: "产品咨询/代理加盟",
    href: "#",
    icon: HeadphonesIcon,
    isModal: true,
  },
];

/* ========== 运营商数据 ========== */

const OPERATORS = [
  { name: "中国移动", short: "移", color: "bg-green-500" },
  { name: "中国电信", short: "电", color: "bg-blue-500" },
  { name: "中国联通", short: "联", color: "bg-orange-500" },
  { name: "中国广电", short: "广", color: "bg-purple-500" },
];

/* ========================================================================================== */

/**
 * 首页主视觉区域组件
 *
 * 三栏等高布局，中栏轮播图在桌面端自动拉伸填充，移动端保持 16:9。
 * 轮播图支持自动播放、触摸滑动和悬停暂停。
 */
export default function HeroSection() {
  /* ===== 轮播图状态 & 引用 ===== */
  const [currentSlide, setCurrentSlide] = useState(0);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [touchStartX, setTouchStartX] = useState(0);

  /** 切换到下一张 */
  const nextSlide = useCallback(
    () =>
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length),
    []
  );

  /* ===== 自动播放 ===== */

  /** 停止自动播放 */
  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);

  /** 启动自动播放 */
  const startAutoPlay = useCallback(() => {
    stopAutoPlay();
    autoPlayRef.current = setInterval(nextSlide, AUTO_PLAY_DELAY);
  }, [nextSlide, stopAutoPlay]);

  /** 重置自动播放计时器（手动切换后重新计时） */
  const resetAutoPlay = useCallback(() => {
    stopAutoPlay();
    startAutoPlay();
  }, [startAutoPlay, stopAutoPlay]);

  // 挂载时启动自动播放，卸载时清除
  useEffect(() => {
    startAutoPlay();
    return stopAutoPlay;
  }, [startAutoPlay, stopAutoPlay]);

  /* ===== 触摸滑动 ===== */

  /** 处理触摸开始 */
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStartX(e.changedTouches[0].screenX);
  }, []);

  /** 处理触摸结束 */
  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const distance = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(distance) < MIN_SWIPE_DISTANCE) return;

      // 向左滑 → 下一张；向右滑 → 上一张
      setCurrentSlide((prev) => {
        if (distance < 0) {
          return (prev + 1) % CAROUSEL_SLIDES.length;
        }
        return (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length;
      });
      resetAutoPlay();
    },
    [touchStartX, resetAutoPlay]
  );

  /* ===== 渲染分割线标题（抽取公共逻辑） ===== */

  /** 渲染带渐变线的区块标题 */
  const renderSectionTitle = (label: string) => (
    <div className="mb-3 flex items-center gap-2">
      <div className="h-px flex-1 bg-gradient-to-r from-blue-600/40 to-transparent" />
      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-600">
        {label}
      </span>
      <div className="h-px flex-1 bg-gradient-to-l from-blue-600/40 to-transparent" />
    </div>
  );

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-b from-white via-blue-50/15 to-white pb-8 pt-8 dark:from-gray-950 dark:via-blue-950/15 dark:to-gray-950 md:pb-10 md:pt-10 lg:pb-12 lg:pt-12"
      role="banner"
      aria-label="首页主区域"
    >
      {/* ===== 背景装饰层 ===== */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-20 h-[900px] w-[900px] rounded-full bg-gradient-to-bl from-blue-600/[0.05] via-blue-400/[0.025] to-transparent blur-3xl dark:from-blue-400/[0.03] dark:via-blue-600/[0.015]" />
        <div className="absolute -bottom-40 -left-24 h-[800px] w-[800px] rounded-full bg-gradient-to-b from-blue-500/[0.05] via-sky-400/[0.025] to-transparent blur-3xl dark:from-blue-400/[0.03]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-blue-100/20 to-blue-100/50 dark:via-blue-950/30 dark:to-blue-950/50" />
      </div>

      <div className={containerClass("relative z-10")} style={SITE_WIDTH_STYLE}>
        {/* 三栏核心网格：items-stretch 确保三栏等高 */}
        <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 xl:grid-cols-[0.75fr_1.7fr_0.75fr] xl:gap-6">
          {/* ======================================================================== */}
          {/* 左栏：品牌价值 + CTA（桌面端位于第1列）                                */}
          {/* ======================================================================== */}
          <div className="flex flex-col max-md:order-2 md:order-1">
            <div className="flex h-full flex-col rounded-2xl border border-gray-100 bg-gradient-to-b from-blue-50/60 to-white p-4 shadow-sm dark:border-gray-800 dark:from-gray-900/60 dark:to-gray-950 sm:p-5">
              {/* 品牌标识徽章 */}
              <div className="mb-5">
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-600/20 bg-blue-600/10 px-3 py-1.5 text-xs font-semibold text-blue-600 backdrop-blur-sm dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-400">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-600/60 opacity-75 dark:bg-blue-400/60" />
                    <span className="relative inline-flex size-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                  </span>
                  运营商官方授权
                </span>
              </div>

              {/* 主标题区 */}
              <h1 className="mb-4 leading-[1.1] tracking-tight">
                <span className="block text-2xl font-black text-gray-900 dark:text-white lg:text-3xl">
                  手机流量卡
                </span>
                <span className="mt-1.5 block text-base font-bold text-gray-500 dark:text-gray-400 lg:text-lg">
                  大流量 · 低月租 · 全网通
                </span>
              </h1>

              {/* 描述 */}
              <p className="mb-5 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                四大运营商官方授权，月租低至19元/月，最高299G通用流量，免费包邮到家。
              </p>

              {/* CTA 按钮组 */}
              <div className="mb-6 flex flex-col gap-2.5">
                {/* 免费申请（光效边框按钮） */}
                <div className="group relative w-full">
                  {/* glow-orbit 边框光效 */}
                  <div
                    className="pointer-events-none absolute -inset-[2px] rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 0%, transparent 35%, #3758F9 45%, #60a5fa 55%, #818cf8 65%, transparent 75%, transparent 100%)",
                      backgroundSize: "200% 100%",
                      WebkitMask:
                        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                      padding: "1.5px",
                      animation: "shimmer 2s ease-in-out infinite",
                    }}
                  />
                  <Link
                    href="https://h5.lot-ml.com/ProductEn/Index/1a654e0b341cadd2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-600/35 active:translate-y-0"
                    aria-label="免费申请流量卡"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <Gift className="relative size-4" />
                    <span className="relative">免费申请</span>
                  </Link>
                </div>
                {/* 代理申请 */}
                <Link
                  href="https://haoka.lot-ml.com/plugreg.html?agentid=90925"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-600/30 hover:bg-blue-600/5 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/5"
                >
                  <UserPlus className="size-4 text-blue-600 dark:text-blue-400" />
                  代理申请
                </Link>
              </div>

              {/* 信任指标（底部对齐） */}
              <div className="mt-auto flex flex-col gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
                {/* 四大运营商头像 */}
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {OPERATORS.map((op) => (
                      <div
                        key={op.name}
                        className={`flex size-6 items-center justify-center rounded-full border-2 border-white text-[8px] font-bold text-white shadow-sm dark:border-gray-900 ${op.color}`}
                        aria-hidden="true"
                      >
                        {op.short}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    四大运营商
                  </span>
                </div>
                {/* 服务保障 */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1.5">
                    <Signal className="size-4 shrink-0 text-blue-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      实名认证
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Package className="size-4 shrink-0 text-green-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      顺丰包邮
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================================== */}
          {/* 中栏：轮播图展示（桌面端填充等高）                                    */}
          {/* ======================================================================== */}
          <div className="flex flex-col max-md:order-1 md:order-2 xl:h-full">
            <div
              className="relative flex w-full flex-1 flex-col justify-center overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl shadow-gray-900/8 dark:border-gray-800 dark:bg-gray-950 sm:p-2"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onMouseEnter={stopAutoPlay}
              onMouseLeave={startAutoPlay}
            >
              {/*
               * 轮播图容器：
               * - < xl：aspect-video 维持 16:9
               * - xl+：flex-1 填充网格拉伸高度
               */}
              <div className="relative aspect-video w-full overflow-hidden rounded-xl xl:aspect-auto xl:flex-1">
                {CAROUSEL_SLIDES.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br transition-opacity duration-500 ease-in-out ${slide.gradient} ${
                      index === currentSlide
                        ? "z-[2] opacity-100"
                        : "z-[1] opacity-0"
                    }`}
                    aria-hidden={index !== currentSlide}
                  >
                    {/* 装饰网格 */}
                    <div
                      className="absolute inset-0 opacity-10 dark:opacity-5"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                      }}
                    />
                    {/* 文案 */}
                    <div className="relative z-10 px-6 text-center text-white">
                      <h3 className="text-xl font-bold sm:text-2xl lg:text-3xl">
                        {slide.title}
                      </h3>
                      <p className="mt-2 text-sm text-white/80 sm:text-base">
                        {slide.subtitle}
                      </p>
                    </div>
                  </div>
                ))}

                {/* 轮播指示器 */}
                <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2 rounded-full bg-black/5 px-2 py-1 dark:bg-white/10">
                  {CAROUSEL_SLIDES.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`cursor-pointer rounded-full border-none p-0 transition-all duration-300 ${
                        index === currentSlide
                          ? "w-10 bg-blue-600 sm:w-12"
                          : "w-6 bg-black/15 hover:bg-blue-600/50 sm:w-8 dark:bg-white/20 dark:hover:bg-blue-400/50"
                      }`}
                      style={{ height: "4px" }}
                      aria-label={`切换到第${index + 1}张图片`}
                      onClick={() => {
                        setCurrentSlide(index);
                        resetAutoPlay();
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================================== */}
          {/* 右栏：核心优势 + 快捷入口 + 运营商底栏（桌面端位于第3列）             */}
          {/* ======================================================================== */}
          <div className="flex flex-col max-md:order-3 md:col-span-2 xl:col-span-1">
            {/* 核心优势 2x2 */}
            <div className="mb-4 lg:mb-5">
              {renderSectionTitle("核心优势")}

              <div className="grid grid-cols-2 gap-2">
                {CORE_ADVANTAGES.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="flex cursor-default items-center gap-2.5 rounded-lg border border-gray-100 bg-white px-3.5 py-3 shadow-sm transition-all duration-300 hover:-translate-y-[3px] hover:border-blue-600/25 hover:shadow-[0_10px_30px_rgba(55,88,249,0.12)] dark:border-gray-800 dark:bg-gray-950 dark:hover:border-blue-500/25 dark:hover:shadow-[0_10px_30px_rgba(59,130,246,0.12)]"
                    >
                      <div
                        className={`flex size-9 shrink-0 items-center justify-center rounded-md bg-gradient-to-br ${item.bgGradient}`}
                      >
                        <Icon className={`size-5 ${item.iconColor}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-extrabold leading-tight text-gray-900 dark:text-white">
                          {item.label}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 快捷入口列表 */}
            <div className="mb-4 lg:mb-5">
              {renderSectionTitle("快捷入口")}

              <div className="flex flex-col gap-2">
                {QUICK_LINKS.map((link) => {
                  const Icon = link.icon;

                  /* 统一入口卡片内容 */
                  const content = (
                    <div className="group flex w-full items-center gap-3 rounded-lg border border-gray-100 bg-white px-3.5 py-3 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-600/25 hover:shadow-md dark:border-gray-800 dark:bg-gray-950 dark:hover:border-blue-500/25">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-blue-600/10 to-blue-500/10 transition-transform duration-200 group-hover:scale-110 dark:from-blue-400/10 dark:to-blue-300/10">
                        <Icon className="size-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
                          {link.label}
                        </p>
                        <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                          {link.desc}
                        </p>
                      </div>
                      <ChevronRight className="size-4 shrink-0 text-gray-300 transition-all group-hover:translate-x-1 group-hover:text-blue-600 dark:text-gray-600 dark:group-hover:text-blue-400" />
                    </div>
                  );

                  // 有真实链接的用 Link，无链接或 # 用 button
                  if (link.href && link.href !== "#") {
                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {content}
                      </Link>
                    );
                  }

                  return (
                    <button
                      key={link.label}
                      type="button"
                      className="w-full"
                      aria-haspopup={link.isModal ? "dialog" : undefined}
                    >
                      {content}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 运营商底栏（底部对齐） */}
            <div className="mt-auto">
              <div className="flex items-center justify-center gap-2 rounded-lg border border-gray-100 bg-gray-50/80 px-3 py-2 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80 sm:gap-3 sm:px-4 sm:py-2.5">
                <div className="flex items-center gap-2 sm:gap-3">
                  {OPERATORS.map((op) => (
                    <span
                      key={op.name}
                      className="text-xs font-bold tracking-wide text-gray-400 transition-all duration-300 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-200 sm:text-sm"
                      title={op.name}
                    >
                      {op.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
