"use client";

/**
 * 首页主视觉区域（HeroSection）
 *
 * 172号卡风格三栏布局：
 * - 左侧：品牌价值展示（标题/描述/CTA/信任指标）
 * - 中间：大幅轮播主视觉 + 移动端快捷入口
 * - 右侧：快捷入口（代理申请/登入后台/联系客服）+ 运营商底栏
 *
 * 文案参考 Hero.astro 左右栏设计
 */

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SITE_WIDTH_STYLE, containerClass } from "@/lib/layout";
import {
  ArrowRight,
  Banknote,
  ChevronRight,
  CreditCard,
  LogIn,
  MessageCircle,
  Package,
  ShieldCheck,
  ShoppingCart,
  Signal,
  Smartphone,
  Tag,
  UserCircle,
  UserPlus,
  Wifi,
} from "lucide-react";

/* ========== 轮播图配置 ========== */

const AUTO_PLAY_DELAY = 5000;
const MIN_SWIPE_DISTANCE = 50;

const CAROUSEL_SLIDES = [
  {
    id: 1,
    image: "/HeroSection/hero.jpg",
    title: "超大流量套餐",
    subtitle: "月租低至19元，畅享高速5G网络",
    tag: "热门推荐",
  },
  {
    id: 2,
    image: "/HeroSection/hero-1.jpg",
    title: "全国通用流量",
    subtitle: "不限APP、不限速，去哪都能用",
    tag: "爆款套餐",
  },
  {
    id: 3,
    image: "/HeroSection/hero-2.jpg",
    title: "官方正规号卡",
    subtitle: "运营商直发，实名认证，安全可靠",
    tag: "品质保障",
  },
];

/* ========== 左侧垂直菜单 ========== */

const LEFT_MENU = [
  {
    icon: Smartphone,
    title: "172号卡",
    subtitle: "店铺口碑4.98",
    href: "#",
  },
  {
    icon: CreditCard,
    title: "浩卡联盟",
    subtitle: "号卡精选商城",
    href: "#",
  },
  {
    icon: Wifi,
    title: "林夕号卡",
    subtitle: "万千号卡 尽在林夕",
    href: "/haoka",
  },
  {
    icon: Package,
    title: "办业务",
    subtitle: "流量业务 数据业务",
    href: "#",
  },
  {
    icon: Tag,
    title: "选号码",
    subtitle: "普通号码 5G畅享卡",
    href: "/haoka",
  },
  {
    icon: ShoppingCart,
    title: "挑配件",
    subtitle: "手机配件 智能家居",
    href: "#",
  },
  {
    icon: UserCircle,
    title: "我的移动",
    subtitle: "商品订单 账单查询",
    href: "#",
  },
];

/* ========== 核心优势 2x2 ========== */
/* 参考 Hero.astro 核心优势文案 */

const CORE_ADVANTAGES = [
  { icon: Banknote, title: "19元起", subtitle: "超低月租", color: "text-orange-500", bg: "bg-gradient-to-br from-orange-50 to-orange-100" },
  { icon: Signal, title: "299G", subtitle: "通用流量", color: "text-blue-500", bg: "bg-gradient-to-br from-blue-50 to-blue-100" },
  { icon: Package, title: "免费包邮", subtitle: "送到家", color: "text-green-500", bg: "bg-gradient-to-br from-green-50 to-green-100" },
  { icon: ShieldCheck, title: "四网可选", subtitle: "自由切换", color: "text-purple-500", bg: "bg-gradient-to-br from-purple-50 to-purple-100" },
];

/* ========== 右侧快捷入口 ========== */
/* 参考 Hero.astro 快捷入口文案 */

const RIGHT_LINKS = [
  {
    icon: UserPlus,
    label: "代理申请",
    subtitle: "成为合作伙伴",
    href: "https://haoka.lot-ml.com/plugreg.html?agentid=90925",
    isExternal: true,
  },
  {
    icon: LogIn,
    label: "登入后台",
    subtitle: "代理商管理系统",
    href: "https://haoka.lot-ml.com/login.html",
    isExternal: true,
  },
  {
    icon: MessageCircle,
    label: "联系客服",
    subtitle: "产品咨询/代理加盟",
    href: "#",
    isExternal: false,
  },
];

/* ========== 运营商标识 ========== */

const OPERATORS = [
  { name: "移动", short: "移", color: "bg-green-500" },
  { name: "电信", short: "电", color: "bg-blue-500" },
  { name: "联通", short: "联", color: "bg-orange-500" },
  { name: "广电", short: "广", color: "bg-purple-500" },
];

/* ========================================================================================== */

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [touchStartX, setTouchStartX] = useState(0);

  /** 切换到下一张幻灯片 */
  const nextSlide = useCallback(
    () => setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length),
    []
  );

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

  /** 重置自动播放计时器 */
  const resetAutoPlay = useCallback(() => {
    stopAutoPlay();
    startAutoPlay();
  }, [startAutoPlay, stopAutoPlay]);

  useEffect(() => {
    startAutoPlay();
    return stopAutoPlay;
  }, [startAutoPlay, stopAutoPlay]);

  /** 触摸开始：记录起始 X 坐标 */
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStartX(e.changedTouches[0].screenX);
  }, []);

  /** 触摸结束：根据滑动方向切换幻灯片 */
  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const distance = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(distance) < MIN_SWIPE_DISTANCE) return;

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

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-b from-background via-blue-50/10 to-background"
      role="banner"
      aria-label="首页主区域"
    >
      {/* 背景装饰 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-32 -right-20 h-[600px] w-[600px] rounded-full bg-gradient-to-bl from-blue-600/[0.03] via-transparent to-transparent blur-3xl" />
      </div>

      <div className={containerClass("py-6 sm:py-8 md:py-10 lg:py-12")} style={SITE_WIDTH_STYLE}>
        {/* 响应式布局：lg → 三栏，md → 轮播+右侧，<md → 单列 */}
        <div className="grid gap-4 md:gap-5 md:grid-cols-[1fr_280px] lg:grid-cols-[220px_1fr_280px] lg:items-stretch">
          {/* ======================================================================== */}
          {/* 左侧：垂直业务导航菜单（仅 ≥lg 显示） */}
          {/* ======================================================================== */}
          <div className="hidden lg:flex lg:flex-col">
            <div className="flex h-full flex-col overflow-hidden rounded-md border bg-card shadow-sm">
              {/* 菜单头部 */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3.5">
                <span className="font-semibold text-white tracking-wide">网上营业厅</span>
              </div>
              {/* 菜单列表，flex-1 撑满剩余高度 */}
              <nav className="flex flex-1 flex-col divide-y divide-border">
                {LEFT_MENU.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="group flex flex-1 items-center gap-3 px-4 py-2 transition-colors hover:bg-blue-50/70"
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded bg-blue-500/10 transition-transform group-hover:scale-110">
                        <Icon className="size-4 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {item.subtitle}
                        </p>
                      </div>
                      <ChevronRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* ======================================================================== */}
          {/* 中间：轮播主视觉 + 移动端/平板适配内容 */}
          {/* ======================================================================== */}
          <div className="flex flex-col lg:h-full">
            {/* 轮播图 — 各端适配最小高度 */}
            <div
              className="relative overflow-hidden rounded-md min-h-[180px] sm:min-h-[220px] md:min-h-[240px] lg:flex-1"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onMouseEnter={stopAutoPlay}
              onMouseLeave={startAutoPlay}
            >
              {CAROUSEL_SLIDES.map((slide, index) => (
                <Link
                  key={slide.id}
                  href="/haoka"
                  className={`absolute inset-0 block transition-opacity duration-500 ease-in-out ${
                    index === currentSlide
                      ? "z-[2] opacity-100"
                      : "z-[1] opacity-0"
                  }`}
                  aria-hidden={index !== currentSlide}
                >
                  {/* 背景图片铺满 */}
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="absolute inset-0 size-full object-cover"
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"}
                  />
                </Link>
              ))}

                {/* 指示器 */}
                <div className="absolute bottom-3 sm:bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 sm:gap-2">
                  {CAROUSEL_SLIDES.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`cursor-pointer rounded-full border-none p-0 transition-all duration-300 ${
                        index === currentSlide
                          ? "w-5 sm:w-6 bg-white"
                          : "w-2 bg-white/40 hover:bg-white/70"
                      }`}
                      style={{ height: "6px" }}
                      aria-label={`切换到第${index + 1}张`}
                      onClick={() => {
                        setCurrentSlide(index);
                        resetAutoPlay();
                      }}
                    />
                  ))}
                </div>
            </div>

            {/* 移动端 + 平板(<lg)：核心优势 2x2 + 快捷入口 */}
            <div className="mt-4 space-y-4 lg:hidden">
              {/* 核心优势 2x2 */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {CORE_ADVANTAGES.map((adv) => {
                  const Icon = adv.icon;
                  return (
                    <div
                      key={adv.title}
                      className="flex items-center gap-2.5 sm:gap-3 rounded-md bg-card px-3 sm:px-3.5 py-2.5 sm:py-3 shadow-sm"
                    >
                      <div className={`flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-md ${adv.bg}`}>
                        <Icon className={`size-3.5 sm:size-4 ${adv.color}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-bold leading-tight">{adv.title}</p>
                        <p className="truncate text-[11px] sm:text-xs text-muted-foreground">{adv.subtitle}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 快捷入口链接 */}
              {RIGHT_LINKS.map((link) => {
                const Icon = link.icon;
                const content = (
                  <>
                    <div className="flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-blue-500/10 to-blue-500/10 transition-transform group-hover:scale-110">
                      <Icon className="size-3.5 sm:size-4 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-semibold transition-colors group-hover:text-blue-600">
                        {link.label}
                      </p>
                      <p className="truncate text-[11px] sm:text-xs text-muted-foreground">{link.subtitle}</p>
                    </div>
                    <ArrowRight className="size-3.5 sm:size-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-blue-600" />
                  </>
                );

                return link.label === "联系客服" ? (
                  <button
                    key={link.label}
                    type="button"
                    className="group flex w-full items-center gap-2.5 sm:gap-3 rounded-md bg-card px-3 sm:px-4 py-3 sm:py-3.5 text-left shadow-sm transition-all hover:bg-blue-50/50 active:scale-95"
                  >
                    {content}
                  </button>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    target={link.isExternal ? "_blank" : undefined}
                    rel={link.isExternal ? "noopener noreferrer" : undefined}
                    className="group flex w-full items-center gap-2.5 sm:gap-3 rounded-md bg-card px-3 sm:px-4 py-3 sm:py-3.5 shadow-sm transition-all hover:bg-blue-50/50 active:scale-95"
                  >
                    {content}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ======================================================================== */}
          {/* 右侧：核心优势 2x2 + 快捷入口列表 + 运营商底栏（≥md 显示） */}
          {/* ======================================================================== */}
          <div className="hidden md:flex md:flex-col gap-4 md:gap-5 lg:h-full">
            {/* 核心优势 2x2 */}
            <div className="flex flex-col rounded-md">
              {/* 分隔标题 */}
              <div className="mb-4 flex items-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-blue-500/40 to-transparent" />
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-600">
                  核心优势
                </span>
                <div className="h-px flex-1 bg-gradient-to-l from-blue-500/40 to-transparent" />
              </div>

              {/* 2x2 核心优势卡片 */}
              <div className="grid grid-cols-2 gap-3">
                {CORE_ADVANTAGES.map((adv) => {
                  const Icon = adv.icon;
                  return (
                    <div
                      key={adv.title}
                      className="flex items-center gap-2.5 rounded-md bg-background px-3 py-3.5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div
                        className={`flex size-9 shrink-0 items-center justify-center rounded-md ${adv.bg}`}
                      >
                        <Icon className={`size-5 ${adv.color}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-extrabold leading-tight">{adv.title}</p>
                        <p className="truncate text-xs text-muted-foreground">{adv.subtitle}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 快捷入口列表 */}
            <div className="flex flex-col rounded-md">
              {/* 分隔标题 */}
              <div className="mb-4 flex items-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-blue-500/40 to-transparent" />
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-600">
                  快捷入口
                </span>
                <div className="h-px flex-1 bg-gradient-to-l from-blue-500/40 to-transparent" />
              </div>

              {/* 快捷入口列表 */}
              <div className="flex flex-col gap-3">
                {RIGHT_LINKS.map((link) => {
                  const Icon = link.icon;
                  const content = (
                    <>
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-blue-500/10 to-blue-500/10 transition-transform group-hover:scale-110">
                        <Icon className="size-4 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold transition-colors group-hover:text-blue-600">
                          {link.label}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">{link.subtitle}</p>
                      </div>
                      <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-blue-600" />
                    </>
                  );

                  /* 联系客服使用 button（弹窗触发） */
                  return link.label === "联系客服" ? (
                    <button
                      key={link.label}
                      type="button"
                      className="group flex w-full items-center gap-3 rounded-md bg-background px-4 py-3.5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                    >
                      {content}
                    </button>
                  ) : (
                    <Link
                      key={link.label}
                      href={link.href}
                      target={link.isExternal ? "_blank" : undefined}
                      rel={link.isExternal ? "noopener noreferrer" : undefined}
                      className="group flex w-full items-center gap-3 rounded-md bg-background px-4 py-3.5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                    >
                      {content}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* 运营商 Logo 底栏 */}
            <div className="mt-auto">
              <div className="flex items-center justify-center gap-3 rounded-md bg-muted/30 px-4 py-2.5 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  {OPERATORS.map((op) => (
                    <div
                      key={op.name}
                      className="flex items-center gap-1.5 opacity-60 transition-all hover:opacity-100"
                      title={op.name}
                    >
                      <span className={`inline-block size-2.5 rounded-full ${op.color}`} />
                      <span className="text-xs font-medium">{op.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================================== */}
        {/* 底部：运营商合作标识 + 数据统计 */}
        {/* ======================================================================== */}
        <div className="mt-4 md:mt-5 overflow-hidden rounded-md border bg-card shadow-sm">
          <div className="flex flex-col divide-y divide-border sm:flex-row sm:divide-x sm:divide-y-0 md:items-center md:justify-between">
            {/* 运营商标识 */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 px-4 sm:px-5 py-3 sm:py-4">
              <span className="text-[11px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                合作运营商
              </span>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {OPERATORS.map((op) => (
                  <div
                    key={op.name}
                    className="flex items-center gap-1 sm:gap-1.5 rounded-full border bg-background px-2 sm:px-2.5 py-0.5 sm:py-1"
                    title={op.name}
                  >
                    <span className={`inline-block size-1.5 sm:size-2 rounded-full ${op.color}`} />
                    <span className="text-[11px] sm:text-xs font-medium">{op.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 数据统计 */}
            <div className="flex divide-x divide-border px-4 sm:px-4 py-3 sm:py-4 justify-around sm:justify-normal">
              <div className="flex flex-col items-center px-3 sm:px-4 first:pl-0">
                <span className="text-base sm:text-lg font-bold text-foreground">100万+</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground">用户信赖</span>
              </div>
              <div className="flex flex-col items-center px-3 sm:px-4">
                <span className="text-base sm:text-lg font-bold text-foreground">300+</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground">城市覆盖</span>
              </div>
              <div className="flex flex-col items-center px-3 sm:px-4 last:pr-0">
                <span className="text-base sm:text-lg font-bold text-foreground">4.9分</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground">用户好评</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
