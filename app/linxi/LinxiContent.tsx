/**
 * 林夕通信商品列表客户端组件
 *
 * 提供运营商/归属地/套餐时长筛选、无限滚动分页加载、空态处理等交互功能。
 * 接收服务端预计算好的商品数据，避免客户端重复解析。
 */
"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import type { LinxiProductWithMeta, LinxiOperator } from "@/lib/api/linxi";
import { LINXI_OPERATOR_LABEL } from "@/lib/api/linxi";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import { SITE_WIDTH_STYLE, containerClass } from "@/lib/layout";
import {
  Signal,
  ShoppingCart,
  ShieldCheck,
  TrendingUp,
  MapPin,
  RefreshCw,
  Eye,
  ChevronRight,
  Star,
  BadgeCheck,
  Zap,
  Phone,
  User,
  Clock,
} from "lucide-react";

/* ========== Props 类型 ========== */

interface LinxiContentProps {
  products: LinxiProductWithMeta[];
  error: string | null;
}

/* ========== 筛选选项常量 ========== */

const OPERATOR_OPTIONS = [
  { key: "all", label: "全部运营商" },
  ...(["mobile", "telecom", "unicom", "broadcast"] as LinxiOperator[]).map((k) => ({
    key: k,
    label: LINXI_OPERATOR_LABEL[k],
  })),
];

const DURATION_OPTIONS = [
  { key: "all", label: "全部时长" },
  { key: "长期", label: "长期" },
  { key: "4年", label: "4年" },
  { key: "2年", label: "2年" },
  { key: "1年", label: "1年" },
  { key: "6个月", label: "6个月" },
];

/* ========== 页面顶栏优势 ========== */

/** 页面顶部平台优势介绍 */
function AdvantagesSection() {
  const items = [
    {
      icon: ShieldCheck,
      title: "正规渠道直供",
      desc: "直连运营商渠道，确保卡品质量和稳定性",
    },
    {
      icon: TrendingUp,
      title: "佣金秒返/次月返",
      desc: "业内领先佣金比例，助力合作伙伴收益最大化",
    },
    {
      icon: MapPin,
      title: "全国多地覆盖",
      desc: "覆盖全国各省市，满足不同地区用户需求",
    },
    {
      icon: BadgeCheck,
      title: "合规不扣量",
      desc: "订单数据实时同步，确保数据准确无误",
    },
  ];

  return (
    <section className={containerClass("pt-6")} style={SITE_WIDTH_STYLE}>
      <h3 className="mb-4 text-lg font-medium text-gray-800">
        林夕通信号卡平台优势
      </h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.title}
            className="rounded-lg bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-2 flex items-center gap-2 text-blue-600">
              <item.icon className="size-5" />
              <span className="font-semibold text-gray-800">{item.title}</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ========== 筛选栏 ========== */

/** 通用筛选行组件 */
function FilterRow({
  label,
  options,
  activeKey,
  onChange,
  counts,
}: {
  label: string;
  options: { key: string; label: string }[];
  activeKey: string;
  onChange: (key: string) => void;
  counts?: Record<string, number>;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 py-2">
      <span className="relative mr-1 flex items-center pl-3 text-sm font-medium text-gray-600 before:absolute before:left-0 before:top-1/2 before:h-3.5 before:w-[3px] before:-translate-y-1/2 before:rounded-sm before:bg-blue-600">
        {label}
      </span>
      {options.map((opt) => {
        const isActive = activeKey === opt.key;
        const count = counts?.[opt.key];
        if (count !== undefined && count === 0 && opt.key !== "all") return null;

        return (
          <button
            key={opt.key}
            onClick={() => onChange(opt.key)}
            className={`rounded-full border px-3.5 py-1.5 text-xs transition-all duration-300 ${
              isActive
                ? "border-blue-600 bg-blue-600 font-medium text-white shadow-sm shadow-blue-600/20"
                : "border-transparent bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            {opt.label}
            {count !== undefined && (
              <span
                className={`ml-1 text-[11px] ${isActive ? "text-white/80" : "text-gray-400"}`}
              >
                ({count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** 筛选面板 */
function FilterBar({
  activeOperator,
  onOperatorChange,
  activeDuration,
  onDurationChange,
  operatorCounts,
  durationCounts,
}: {
  activeOperator: string;
  onOperatorChange: (k: string) => void;
  activeDuration: string;
  onDurationChange: (k: string) => void;
  operatorCounts: Record<string, number>;
  durationCounts: Record<string, number>;
}) {
  return (
    <div className={containerClass("py-4")} style={SITE_WIDTH_STYLE}>
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <FilterRow
          label="运营商"
          options={OPERATOR_OPTIONS}
          activeKey={activeOperator}
          onChange={onOperatorChange}
          counts={operatorCounts}
        />
        <div className="border-t border-gray-50" />
        <FilterRow
          label="套餐时长"
          options={DURATION_OPTIONS}
          activeKey={activeDuration}
          onChange={onDurationChange}
          counts={durationCounts}
        />
      </div>
    </div>
  );
}

/* ========== 运营商图片角标样式 ========== */

const OPERATOR_OVERLAY: Record<string, string> = {
  mobile: "bg-green-500/80 text-white",
  telecom: "bg-blue-500/80 text-white",
  unicom: "bg-orange-500/80 text-white",
  broadcast: "bg-purple-500/80 text-white",
  unknown: "bg-gray-500/80 text-white",
};

/* ========== 返佣角标 ========== */

const COMMISSION_LABEL: Record<string, { text: string; className: string }> = {
  "0": { text: "次月返", className: "bg-gradient-to-r from-blue-500 to-indigo-500" },
  "1": { text: "秒返", className: "bg-gradient-to-r from-green-500 to-emerald-500" },
  "2": { text: "月月返", className: "bg-gradient-to-r from-purple-500 to-pink-500" },
};

/* ========== 规格参数标签 ========== */

/**
 * 规格参数标签（参考 Product.astro 样式）
 * @param icon - 图标组件
 * @param value - 参数值
 * @param colorClass - 背景与文字颜色类
 */
function SpecTag({
  icon: Icon,
  value,
  colorClass,
}: {
  icon: React.ElementType;
  value: string;
  colorClass: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${colorClass}`}
    >
      <Icon className="size-3.5 shrink-0" />
      <span>{value}</span>
    </span>
  );
}

/* ========== 商品卡片 ========== */

/** 林夕通信商品卡片 */
function LinxiProductCard({ product }: { product: LinxiProductWithMeta }) {
  const overlayClass =
    OPERATOR_OVERLAY[product._operator] || OPERATOR_OVERLAY.unknown;
  const price = product._price;
  const operatorLabel = LINXI_OPERATOR_LABEL[product._operator];
  const commissionBadge = COMMISSION_LABEL[product.shop_money] || COMMISSION_LABEL["0"];

  return (
    <div className="group relative mb-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-600/20 hover:shadow-lg hover:shadow-blue-600/5">
      {/* 商品图片区域 */}
      <Link href={`/linxi/${product.id}`} className="block">
        <div className="relative overflow-hidden bg-gray-100 p-2">
          {product.shop_img ? (
            <div className="aspect-[4/3] overflow-hidden rounded-lg">
              <img
                src={product.shop_img}
                alt={product.shop_name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="aspect-[4/3] rounded-lg bg-gradient-to-br from-gray-50 to-gray-100" />
          )}

          {/* 运营商标签（左上角毛玻璃） */}
          <div
            className={`absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs backdrop-blur-sm ${overlayClass}`}
          >
            <Signal className="size-3" />
            <span className="font-medium">{operatorLabel}</span>
          </div>

          {/* 返佣角标（右上角） */}
          <span
            className={`absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold text-white shadow-sm ${commissionBadge.className}`}
          >
            <Star className="size-3 fill-white" />
            {commissionBadge.text}
          </span>
        </div>
      </Link>

      {/* 内容区域 */}
      <div className="flex flex-col p-4">
        <Link href={`/linxi/${product.id}`} className="flex-1">
          {/* 套餐名称 */}
          <h3 className="mb-3 line-clamp-2 text-sm font-bold leading-snug text-gray-800">
            {product.shop_name}
          </h3>

          {/* 规格参数标签 */}
          <div className="mb-3 h-[52px] overflow-hidden">
            <div className="flex flex-wrap gap-1.5">
              {product._flow && (
                <SpecTag
                  icon={Zap}
                  value={`${product._flow}通用`}
                  colorClass="bg-blue-50 text-blue-600"
                />
              )}
              {product._voice && (
                <SpecTag
                  icon={Phone}
                  value={product._voice}
                  colorClass="bg-green-50 text-green-600"
                />
              )}
              <SpecTag
                icon={User}
                value={`${product.min_age || 18}-${product.max_age || 60}岁`}
                colorClass="bg-gray-100 text-gray-500"
              />
              <SpecTag
                icon={Clock}
                value={product._duration}
                colorClass="bg-orange-50 text-orange-600"
              />
              {/* 特性标签 */}
              {product._tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center rounded-full bg-blue-600/[0.04] px-2.5 py-0.5 text-[11px] font-medium text-blue-600/80"
                >
                  {tag.text}
                </span>
              ))}
            </div>
          </div>

          {/* 套餐描述 */}
          {product.shop_des && (
            <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-gray-400">
              {product.shop_des}
            </p>
          )}
        </Link>

        {/* 分隔线 */}
        <div className="mb-3 border-t border-gray-100" />

        {/* 价格 + 操作按钮 */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex shrink-0 items-baseline gap-1">
            <span className="text-lg font-extrabold text-blue-600">
              {price > 0 ? `¥${price}` : "面议"}
            </span>
            {price > 0 && (
              <span className="text-xs text-gray-400">/月</span>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <Link
              href={`/linxi/${product.id}`}
              className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-2 text-sm font-normal text-gray-700 transition-colors hover:border-blue-600/30 hover:text-blue-600"
            >
              <Eye className="size-4" />
              查看详情
            </Link>
            <a
              href={product._orderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-sm font-normal text-white shadow-sm transition-all duration-200 hover:bg-blue-600/90 hover:shadow-md"
            >
              立即办理
              <ChevronRight className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========== 商品网格 ========== */

/** 每页加载数量 */
const PAGE_SIZE = 12;

/** 商品网格组件（带无限滚动分页） */
function ProductGrid({
  products,
  activeOperator,
  activeDuration,
}: {
  products: LinxiProductWithMeta[];
  activeOperator: string;
  activeDuration: string;
}) {
  /* ===== 筛选逻辑 ===== */
  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (activeOperator !== "all" && p._operator !== activeOperator) return false;
      if (activeDuration !== "all" && p._duration !== activeDuration) return false;
      return true;
    });
  }, [products, activeOperator, activeDuration]);

  /* ===== 分页状态 ===== */
  const filterKey = `${activeOperator}-${activeDuration}`;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // 筛选条件变化时重置分页
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filterKey]);

  const displayed = filtered.slice(0, visibleCount);
  const hasMore = displayed.length < filtered.length;

  /* ===== 无限滚动 ===== */
  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filtered.length));
  }, [filtered.length]);

  useEffect(() => {
    if (!hasMore) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "200px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <Signal className="mb-4 size-12 text-gray-300" />
        <p className="text-base font-medium text-gray-500">暂无符合条件的套餐</p>
        <p className="mt-1 text-sm text-gray-400">请尝试调整筛选条件</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {displayed.map((product) => (
          <LinxiProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* 分页信息 & 自动加载哨兵 */}
      <div className="mt-6 flex flex-col items-center gap-3">
        <p className="text-xs text-gray-400">
          已加载 {displayed.length} / {filtered.length} 件商品
        </p>

        {hasMore && (
          <>
            <div ref={sentinelRef} className="h-1 w-full" />
            <button
              type="button"
              onClick={loadMore}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-600 shadow-sm transition-all hover:border-blue-300 hover:text-blue-600 hover:shadow-md"
            >
              <RefreshCw className="size-4" />
              加载更多（{filtered.length - displayed.length} 件）
            </button>
          </>
        )}

        {!hasMore && filtered.length > 0 && (
          <p className="flex items-center gap-1.5 text-xs text-green-500">
            <span className="inline-block size-1.5 rounded-full bg-green-500" />
            已展示全部 {filtered.length} 件商品
          </p>
        )}
      </div>
    </>
  );
}

/* ========== 统计计数器 ========== */

/**
 * 计算各维度筛选选项的商品数量
 * @param products - 商品列表
 */
function useFilterCounts(products: LinxiProductWithMeta[]) {
  return useMemo(() => {
    const operatorCounts: Record<string, number> = { all: products.length };
    const durationCounts: Record<string, number> = { all: products.length };

    for (const p of products) {
      operatorCounts[p._operator] = (operatorCounts[p._operator] || 0) + 1;
      durationCounts[p._duration] = (durationCounts[p._duration] || 0) + 1;
    }

    return { operatorCounts, durationCounts };
  }, [products]);
}

/* ========== 底部 CTA ========== */

/** 底部引导区 */
function CtaSection() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-14">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl">
          立即申请，免费包邮到家！
        </h2>
        <p className="mb-6 text-sm text-blue-100 sm:text-base">
          正规渠道、7天无理由退换，零风险体验
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://h5.vip12300.cn/index?k=SGpiazRLQVZSREk9"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-blue-600 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
          >
            <ShoppingCart className="size-4" />
            免费申请号卡
          </a>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white transition-all hover:border-white hover:bg-white/10"
          >
            返回首页
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ========== 错误状态 ========== */

/** API 错误展示区块 */
function ErrorBanner({ error }: { error: string }) {
  return (
    <div className={containerClass("py-4")} style={SITE_WIDTH_STYLE}>
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        <span className="font-semibold">数据加载失败：</span>
        {error}
      </div>
    </div>
  );
}

/* ========== 页面主体 ========== */

/** 林夕通信商品列表页主组件 */
export default function LinxiContent({ products, error }: LinxiContentProps) {
  const [activeOperator, setActiveOperator] = useState("all");
  const [activeDuration, setActiveDuration] = useState("all");

  const { operatorCounts, durationCounts } = useFilterCounts(products);

  return (
    <div className="flex min-h-svh flex-col bg-[#f5f7fa]">
      <Header />

      {/* ===== 页面 Banner ===== */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 py-12">
        <div className={containerClass()} style={SITE_WIDTH_STYLE}>
          <div className="flex items-center gap-3">
            <Signal className="size-8 text-blue-200" />
            <div>
              <h1 className="text-2xl font-bold text-white sm:text-3xl">
                林夕通信大流量卡套餐大全
              </h1>
              <p className="mt-1 text-sm text-blue-100">
                正规渠道直供 · 秒返/次月返佣金 · 全国包邮 · 共 {products.length} 款在售套餐
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1">
        {/* 平台优势 */}
        <AdvantagesSection />

        {/* 错误提示 */}
        {error && <ErrorBanner error={error} />}

        {/* 筛选栏 */}
        <FilterBar
          activeOperator={activeOperator}
          onOperatorChange={setActiveOperator}
          activeDuration={activeDuration}
          onDurationChange={setActiveDuration}
          operatorCounts={operatorCounts}
          durationCounts={durationCounts}
        />

        {/* 商品网格 */}
        <div className={containerClass("pb-10")} style={SITE_WIDTH_STYLE}>
          <ProductGrid
            products={products}
            activeOperator={activeOperator}
            activeDuration={activeDuration}
          />
        </div>
      </main>

      {/* 底部 CTA */}
      <CtaSection />
      <Footer />
    </div>
  );
}
