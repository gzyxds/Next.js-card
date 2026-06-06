"use client";

/**
 * 首页主视觉区域（HeroSection）
 *
 * 响应式三段式布局：
 * - 移动端（<md）：轮播图 → 左侧菜单横向滚动条 → 核心优势 2x2 → 快捷入口
 * - 平板（md~lg）：左侧菜单纵向（紧凑）+ 轮播图 + 右侧快捷入口
 * - 桌面（≥lg）：左侧菜单 + 轮播图 + 右侧快捷入口（完整三栏）
 * - 底部：合作运营商品牌栏（全端显示，移动端精简）
 */

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SITE_WIDTH_STYLE, containerClass } from "@/lib/layout";
import CustomerServiceModal, { type CustomerServiceModalHandle } from "@/components/home/CustomerServiceModal";
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
    image: "/HeroSection/1mfx.png",
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
  { icon: Smartphone, title: "172号卡", subtitle: "店铺口碑4.98", href: "/lotml" },
  { icon: CreditCard, title: "浩卡联盟", subtitle: "号卡精选商城", href: "/haoka" },
  { icon: Wifi, title: "林夕号卡", subtitle: "万千号卡 尽在林夕", href: "/linxi" },
  { icon: Package, title: "生活优惠", subtitle: "外卖红包、打车券、电影票折扣", href: "/cps" },
  { icon: Tag, title: "代理加盟", subtitle: "零门槛 · 高佣金 · 全国招募", href: "/join" },
  { icon: ShoppingCart, title: "自助服务", subtitle: "一站直达 · 快捷服务", href: "/services" },
  { icon: UserCircle, title: "关于我们", subtitle: "携手共赢 · 信赖之选", href: "#" },
];

/* ========== 核心优势 2x2 ========== */

const CORE_ADVANTAGES = [
  { icon: Banknote, title: "19元起", subtitle: "超低月租", color: "text-orange-500", bg: "bg-orange-50" },
  { icon: Signal, title: "299G", subtitle: "通用流量", color: "text-blue-500", bg: "bg-blue-50" },
  { icon: Package, title: "免费包邮", subtitle: "送到家", color: "text-green-500", bg: "bg-green-50" },
  { icon: ShieldCheck, title: "四网可选", subtitle: "自由切换", color: "text-purple-500", bg: "bg-purple-50" },
];

/* ========== 右侧快捷入口 ========== */

const RIGHT_LINKS = [
  {
    icon: UserPlus,
    label: "代理申请",
    subtitle: "成为合作伙伴",
    href: "https://s.haokavip.com/u/3792476",
    isExternal: true,
  },
  {
    icon: LogIn,
    label: "登入后台",
    subtitle: "代理商管理系统",
    href: "https://www.haokavip.com/page.html#/register?code=1698006",
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
  { name: "移动", color: "bg-green-500" },
  { name: "电信", color: "bg-blue-500" },
  { name: "联通", color: "bg-orange-500" },
  { name: "广电", color: "bg-purple-500" },
];

/* ========== 合作品牌 ========== */

const BRANDS = [
  { src: "/cooperate/中国移动.webp", alt: "中国移动" },
  { src: "/cooperate/中国联通.webp", alt: "中国联通" },
  { src: "/cooperate/中国电信.webp", alt: "中国电信" },
  { src: "/cooperate/中国广电.webp", alt: "中国广电" },
  { src: "/cooperate/京东物流.webp", alt: "京东物流" },
  { src: "/cooperate/顺丰速运.webp", alt: "顺丰速运" },
];

/* ========== 快捷入口 Item（复用于多端） ========== */

/** 快捷入口单项，支持 Link 和 button 两种形态 */
function QuickLinkItem({
  link,
  onClick,
}: {
  link: (typeof RIGHT_LINKS)[number];
  onClick?: () => void;
}) {
  const Icon = link.icon;
  const cls = "group flex w-full items-center gap-3 rounded-md bg-white/80 px-4 py-3.5 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:shadow-md";

  const inner = (
    <>
      <div className="flex shrink-0 items-center justify-center rounded-md bg-blue-50 transition-transform group-hover:scale-110 size-8">
        <Icon className="text-blue-600 size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold transition-colors group-hover:text-blue-600 text-sm">
          {link.label}
        </p>
        <p className="truncate text-xs text-muted-foreground">{link.subtitle}</p>
      </div>
      <ArrowRight className="shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-blue-600 size-4" />
    </>
  );

  if (link.label === "联系客服") {
    return (
      <button type="button" className={cls} onClick={onClick}>
        {inner}
      </button>
    );
  }
  return (
    <Link
      href={link.href}
      target={link.isExternal ? "_blank" : undefined}
      rel={link.isExternal ? "noopener noreferrer" : undefined}
      className={cls}
    >
      {inner}
    </Link>
  );
}

/* ========================================================================================== */

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const modalRef = useRef<CustomerServiceModalHandle>(null);
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

  /* ===== 监听全局自定义事件，允许其他组件（如 FAQSection）触发弹窗 ===== */
  useEffect(() => {
    const handler = () => modalRef.current?.open();
    window.addEventListener("open-customer-modal", handler);
    return () => window.removeEventListener("open-customer-modal", handler);
  }, []);

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
        if (distance < 0) return (prev + 1) % CAROUSEL_SLIDES.length;
        return (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length;
      });
      resetAutoPlay();
    },
    [touchStartX, resetAutoPlay]
  );

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-white"
      role="banner"
      aria-label="首页主区域"
    >
      {/* ===== SEO 核心 H1 标题（包含高搜索指数关键词） ===== */}
      <h1 className="sr-only">
        流量派 - 手机大流量卡在线办理，电信/联通/移动/广电19元29元低月租大流量卡推荐
      </h1>

      {/* ===== 背景装饰层 ===== */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 h-[700px] w-[700px] rounded-full bg-blue-50/60 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-[600px] w-[600px] rounded-full bg-indigo-50/40 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/20 blur-3xl" />
        <div className="absolute top-1/3 -right-16 h-[300px] w-[300px] rounded-full bg-amber-50/50 blur-2xl" />
        {/* 科技网格纹理 */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(circle, #3b82f6 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className={containerClass("py-6 sm:py-8 md:py-10 lg:py-12")} style={SITE_WIDTH_STYLE}>

        {/* ======================================================================== */}
        {/* 移动端：左侧菜单横向滚动条（<md 专属）                                    */}
        {/* ======================================================================== */}
        <div className="mb-3 md:hidden">
          {/* 头部标签 */}
          <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-blue-600">
            <span className="inline-block size-1.5 rounded-full bg-blue-600" />
            网上营业厅
          </div>
          {/* 横向滚动菜单，隐藏滚动条 */}
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {LEFT_MENU.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group flex shrink-0 flex-col items-center gap-1.5 rounded-xl border border-gray-100 bg-white/80 px-3 py-2.5 shadow-sm backdrop-blur-sm transition-all hover:border-blue-200 hover:bg-blue-50/70 active:scale-95"
                >
                  <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 transition-transform group-hover:scale-110">
                    <Icon className="size-4 text-blue-600" />
                  </div>
                  <span className="whitespace-nowrap text-[11px] font-medium text-gray-700 group-hover:text-blue-600">
                    {item.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ======================================================================== */}
        {/* 主体三栏：lg 三列 | md 两列（左菜单+轮播 / 右侧）| <md 单列               */}
        {/* ======================================================================== */}
        <div className="grid gap-4 md:gap-5 md:grid-cols-[200px_1fr_260px] lg:grid-cols-[220px_1fr_280px] lg:items-stretch">

          {/* -------------------------------------------------------------------- */}
          {/* 左侧：垂直业务导航菜单（md+ 均显示）                                   */}
          {/* -------------------------------------------------------------------- */}
          <div className="hidden md:flex md:flex-col">
            <div className="flex h-full flex-col overflow-hidden rounded-md border border-gray-100 bg-white/80 shadow-sm backdrop-blur-sm">
              {/* 菜单头部 */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3">
                <span className="text-sm font-semibold tracking-wide text-white">网上营业厅</span>
              </div>
              {/* 菜单列表，flex-1 撑满高度 */}
              <nav className="flex flex-1 flex-col divide-y divide-gray-50">
                {LEFT_MENU.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="group flex flex-1 items-center gap-2.5 px-3.5 py-0 transition-colors hover:bg-blue-50/70 lg:gap-3 lg:px-4"
                    >
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 transition-transform group-hover:scale-110 lg:size-8">
                        <Icon className="size-3.5 text-blue-600 lg:size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium lg:text-sm">{item.title}</p>
                        <p className="hidden truncate text-[11px] text-muted-foreground lg:block">
                          {item.subtitle}
                        </p>
                      </div>
                      <ChevronRight className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* -------------------------------------------------------------------- */}
          {/* 中间：轮播主视觉（全端显示）                                           */}
          {/* -------------------------------------------------------------------- */}
          <div className="flex flex-col lg:h-full">
            {/* 轮播图 */}
            <div
              className="relative overflow-hidden rounded-md lg:flex-1"
              style={{ minHeight: "clamp(160px, 30vw, 320px)" }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onMouseEnter={stopAutoPlay}
              onMouseLeave={startAutoPlay}
            >
              {CAROUSEL_SLIDES.map((slide, index) => (
                <Link
                  key={slide.id}
                  href="/haoka"
                  className={`absolute inset-0 block transition-opacity duration-500 ease-in-out ${index === currentSlide ? "z-[2] opacity-100" : "z-[1] opacity-0"
                    }`}
                  aria-hidden={index !== currentSlide}
                >
                  <Image
                    src={slide.image}
                    alt={`手机大流量卡推荐 - ${slide.title}`}
                    fill
                    className="object-cover"
                    loading={index === 0 ? "eager" : "lazy"}
                    priority={index === 0}
                  />
                </Link>
              ))}

              {/* 轮播指示器 */}
              <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
                {CAROUSEL_SLIDES.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    style={{ height: "6px" }}
                    className={`cursor-pointer rounded-full border-none p-0 transition-all duration-300 ${index === currentSlide ? "w-5 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
                      }`}
                    aria-label={`切换到第${index + 1}张`}
                    onClick={() => {
                      setCurrentSlide(index);
                      resetAutoPlay();
                    }}
                  />
                ))}
              </div>
            </div>

            {/* 移动端：核心优势 + 快捷入口（<md 显示在轮播图下方） */}
            <div className="mt-3 space-y-2.5 md:hidden">
              {/* 核心优势 2x2 */}
              <div className="grid grid-cols-2 gap-2">
                {CORE_ADVANTAGES.map((adv) => {
                  const Icon = adv.icon;
                  return (
                    <div
                      key={adv.title}
                      className="flex items-center gap-2.5 rounded-md border border-gray-100 bg-white/80 px-3 py-2.5 shadow-sm backdrop-blur-sm"
                    >
                      <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${adv.bg}`}>
                        <Icon className={`size-4 ${adv.color}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold leading-tight">{adv.title}</p>
                        <p className="truncate text-xs text-muted-foreground">{adv.subtitle}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 快捷入口 */}
              <div className="flex flex-col gap-2">
                {RIGHT_LINKS.map((link) => (
                  <QuickLinkItem
                    key={link.label}
                    link={link}
                    onClick={link.label === "联系客服" ? () => modalRef.current?.open() : undefined}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------------- */}
          {/* 右侧：核心优势 + 快捷入口 + 运营商底栏（md+ 显示）                     */}
          {/* -------------------------------------------------------------------- */}
          <div className="hidden md:flex md:flex-col md:gap-4 lg:h-full lg:gap-5">
            {/* 核心优势 2x2 */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-blue-500/40 to-transparent" />
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-600">
                  核心优势
                </span>
                <div className="h-px flex-1 bg-gradient-to-l from-blue-500/40 to-transparent" />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {CORE_ADVANTAGES.map((adv) => {
                  const Icon = adv.icon;
                  return (
                    <div
                      key={adv.title}
                      className="flex items-center gap-2 rounded-md border border-gray-100 bg-white/80 px-2.5 py-3 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:shadow-md lg:gap-2.5 lg:px-3"
                    >
                      <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${adv.bg} lg:size-9`}>
                        <Icon className={`size-4 lg:size-5 ${adv.color}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold leading-tight lg:text-sm">{adv.title}</p>
                        <p className="truncate text-[11px] text-muted-foreground lg:text-xs">{adv.subtitle}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 快捷入口列表 */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-blue-500/40 to-transparent" />
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-600">
                  快捷入口
                </span>
                <div className="h-px flex-1 bg-gradient-to-l from-blue-500/40 to-transparent" />
              </div>
              <div className="flex flex-col gap-2.5">
                {RIGHT_LINKS.map((link) => (
                  <QuickLinkItem
                    key={link.label}
                    link={link}
                    onClick={link.label === "联系客服" ? () => modalRef.current?.open() : undefined}
                  />
                ))}
              </div>
            </div>

            {/* 运营商 Logo 底栏 */}
            <div className="mt-auto rounded-md border border-gray-100 bg-gray-50/60 px-3 py-2.5">
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5">
                {OPERATORS.map((op) => (
                  <div
                    key={op.name}
                    className="flex items-center gap-1.5 opacity-60 transition-opacity hover:opacity-100"
                  >
                    <span className={`inline-block size-2 rounded-full ${op.color}`} />
                    <span className="text-xs font-medium">{op.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================================== */}
        {/* 底部：合作运营商品牌栏（全端显示）                                        */}
        {/* ======================================================================== */}
        <div className="mt-4 overflow-hidden rounded-md border border-gray-100 bg-white/80 shadow-sm backdrop-blur-sm md:mt-5">
          {/* 移动端：两行精简版 */}
          <div className="flex flex-col items-center gap-3 px-4 py-3 md:hidden">
            {/* 运营商标签 */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                合作运营商
              </span>
              {OPERATORS.map((op) => (
                <div
                  key={op.name}
                  className="flex items-center gap-1 rounded-full border bg-white/60 px-2.5 py-0.5 backdrop-blur-sm"
                >
                  <span className={`inline-block size-1.5 rounded-full ${op.color}`} />
                  <span className="text-[11px] font-medium">{op.name}</span>
                </div>
              ))}
            </div>
            {/* 品牌 Logo */}
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {BRANDS.map((brand) => (
                <Image
                  key={brand.alt}
                  src={brand.src}
                  alt={brand.alt}
                  width={100}
                  height={28}
                  loading="lazy"
                  className="h-7 w-auto object-contain opacity-80"
                  title={brand.alt}
                />
              ))}
            </div>
          </div>

          {/* 平板+桌面：单行完整版 */}
          <div className="hidden md:flex md:items-center md:justify-between px-5 py-3.5">
            {/* 运营商标签 */}
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                合作运营商
              </span>
              <div className="flex items-center gap-2">
                {OPERATORS.map((op) => (
                  <div
                    key={op.name}
                    className="flex items-center gap-1.5 rounded-full border bg-white/60 px-2.5 py-1 backdrop-blur-sm"
                  >
                    <span className={`inline-block size-2 rounded-full ${op.color}`} />
                    <span className="text-xs font-medium">{op.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 品牌 Logo */}
            <div className="flex items-center gap-4">
              {BRANDS.map((brand) => (
                <Image
                  key={brand.alt}
                  src={brand.src}
                  alt={brand.alt}
                  width={100}
                  height={36}
                  loading="lazy"
                  className="h-9 w-auto object-contain opacity-75 transition-opacity hover:opacity-100"
                  title={brand.alt}
                />
              ))}
            </div>

            {/* 数据统计 */}
            <div className="flex gap-5">
              <div className="flex flex-col items-center">
                <span className="text-base font-bold text-foreground">100万+</span>
                <span className="text-[11px] text-muted-foreground">用户信赖</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-base font-bold text-foreground">300+</span>
                <span className="text-[11px] text-muted-foreground">城市覆盖</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-base font-bold text-foreground">4.9分</span>
                <span className="text-[11px] text-muted-foreground">用户好评</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 客服弹窗 */}
      <CustomerServiceModal ref={modalRef} />
    </section>
  );
}
