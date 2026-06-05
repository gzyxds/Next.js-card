/**
 * LotML 商品列表客户端组件
 *
 * 提供运营商/套餐时长筛选、无限滚动分页加载、空态处理等交互功能。
 * 接收服务端预计算好的商品数据，避免客户端重复解析。
 */
"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import type { LotMLProductWithMeta, LotMLOperator } from "@/lib/api/lotml-utils";
import { LOTML_OPERATOR_LABEL } from "@/lib/api/lotml-utils";
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

/* ========== 类型 ========== */

interface LotMLContentProps {
  products: LotMLProductWithMeta[];
  error: string | null;
}

/* ========== 筛选选项 ========== */

const OPERATOR_OPTIONS = [
  { key: "all", label: "全部运营商" },
  ...(["mobile", "telecom", "unicom", "broadcast"] as LotMLOperator[]).map(
    (k) => ({ key: k, label: LOTML_OPERATOR_LABEL[k] }),
  ),
];

const DURATION_OPTIONS = [
  { key: "all", label: "全部时长" },
  { key: "长期", label: "长期" },
  { key: "20年", label: "20年" },
  { key: "2年", label: "2年" },
  { key: "1年", label: "1年" },
  { key: "6个月", label: "6个月" },
];

/* ========== 返佣角标 ========== */

/** 页面顶部平台优势介绍 */
function AdvantagesSection() {
  const items = [
    {
      icon: ShieldCheck,
      title: "一级代理正规渠道",
      desc: "直连运营商，卡品质量稳定有保障",
    },
    {
      icon: TrendingUp,
      title: "秒返/次月返佣金",
      desc: "业内领先佣金，支持秒到账模式",
    },
    {
      icon: MapPin,
      title: "多省归属地可选",
      desc: "部分套餐支持选号、收货地归属",
    },
    {
      icon: BadgeCheck,
      title: "实名合规不扣量",
      desc: "订单数据实时同步，数据准确透明",
    },
  ];

  return (
    <section className={containerClass("pt-6")} style={SITE_WIDTH_STYLE}>
      <h3 className="mb-4 text-lg font-medium text-gray-800">
        号卡联盟平台优势
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

/** 通用筛选行 */
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
        // 数量为 0 的非全部选项不显示
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
  activeArea,
  onAreaChange,
  activeFlow,
  onFlowChange,
  operatorCounts,
  durationCounts,
  areaOptions,
  flowOptions,
}: {
  activeOperator: string;
  onOperatorChange: (k: string) => void;
  activeDuration: string;
  onDurationChange: (k: string) => void;
  activeArea: string;
  onAreaChange: (k: string) => void;
  activeFlow: string;
  onFlowChange: (k: string) => void;
  operatorCounts: Record<string, number>;
  durationCounts: Record<string, number>;
  areaOptions: { key: string; label: string }[];
  flowOptions: { key: string; label: string }[];
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
        <div className="border-t border-gray-50" />
        <FilterRow
          label="所属地区"
          options={areaOptions}
          activeKey={activeArea}
          onChange={onAreaChange}
        />
        <div className="border-t border-gray-50" />
        <FilterRow
          label="可用流量"
          options={flowOptions}
          activeKey={activeFlow}
          onChange={onFlowChange}
        />
      </div>
    </div>
  );
}

/* ========== 商品卡片 ========== */

/**
 * 返佣角标配置
 */
const COMMISSION_BADGE: Record<string, { label: string; className: string }> = {
  秒返: {
    label: "秒返",
    className: "bg-gradient-to-r from-green-500 to-emerald-500",
  },
  次月返: {
    label: "次月返",
    className: "bg-gradient-to-r from-blue-500 to-indigo-500",
  },
};

/** 运营商图片角标样式（毛玻璃 + 品牌色背景） */
const OPERATOR_OVERLAY: Record<string, string> = {
  mobile: "bg-green-500/80 text-white",
  telecom: "bg-blue-500/80 text-white",
  unicom: "bg-orange-500/80 text-white",
  broadcast: "bg-purple-500/80 text-white",
  unknown: "bg-gray-500/80 text-white",
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

/** LotML 商品卡片（参考 Product.astro 统一设计） */
function LotMLProductCard({ product }: { product: LotMLProductWithMeta }) {
  const overlayClass =
    OPERATOR_OVERLAY[product._operator] || OPERATOR_OVERLAY.unknown;
  const price = product._price;
  const operatorLabel = LOTML_OPERATOR_LABEL[product._operator];
  const commissionBadge = COMMISSION_BADGE[product.BackMoneyType];

  // 精简标签：返佣类型 / 选号 / 归属地
  const visibleTags = product._tags.filter(
    (t) =>
      t.text === product.BackMoneyType ||
      t.text === product.area ||
      t.text === "可选号" ||
      t.text === "收货地归属",
  );

  return (
    <div className="group relative mb-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-600/20 hover:shadow-lg hover:shadow-blue-600/5">
      {/* 商品图片区域 */}
      <Link href={`/lotml/${product.productID}`} className="block">
        <div className="relative overflow-hidden bg-gray-100 p-2">
          {product.mainPic ? (
            <div className="aspect-[4/3] overflow-hidden rounded-lg">
              <img
                src={product.mainPic}
                alt={product.productName}
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
          {commissionBadge && (
            <span
              className={`absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold text-white shadow-sm ${commissionBadge.className}`}
            >
              <Star className="size-3 fill-white" />
              {commissionBadge.label}
            </span>
          )}
        </div>
      </Link>

      {/* 内容区域 */}
      <div className="flex flex-col p-4">
        <Link href={`/lotml/${product.productID}`} className="flex-1">
          {/* 套餐名称 */}
          <h3 className="mb-3 line-clamp-2 text-sm font-bold leading-snug text-gray-800">
            {product.productName}
          </h3>

          {/* 规格参数标签（统一两行显示，含特性标签） */}
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
                value={`${product.Age1 || 18}-${product.Age2 || 60}岁`}
                colorClass="bg-gray-100 text-gray-500"
              />
              <SpecTag
                icon={Clock}
                value={product._duration}
                colorClass="bg-orange-50 text-orange-600"
              />
              {/* 特性标签（rounded-full，与规格标签在同一容器） */}
              {visibleTags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center rounded-full bg-blue-600/[0.04] px-2.5 py-0.5 text-[11px] font-medium text-blue-600/80"
                >
                  {tag.text}
                </span>
              ))}
            </div>
          </div>

          {/* 套餐说明（Taocan 优先，Rule 兜底，参考 Product.astro） */}
          {(product.Taocan || product.Rule) && (
            <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-gray-400">
              {product.Taocan || product.Rule?.slice(0, 60)}
            </p>
          )}
        </Link>

        {/* 分隔线 */}
        <div className="mb-3 border-t border-gray-100" />

        {/* 价格 + 操作按钮（价格 shrink-0 避免被挤压） */}
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
              href={`/lotml/${product.productID}`}
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
  activeArea,
  activeFlow,
}: {
  products: LotMLProductWithMeta[];
  activeOperator: string;
  activeDuration: string;
  activeArea: string;
  activeFlow: string;
}) {
  /* ===== 筛选逻辑 ===== */
  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (activeOperator !== "all" && p._operator !== activeOperator) return false;
      if (activeDuration !== "all" && p._duration !== activeDuration) return false;
      if (activeArea !== "all" && p.area !== activeArea) return false;
      if (activeFlow !== "all") {
        // 按流量范围匹配：_flow 为 "100GB" 等形式
        const flowNum = parseInt(p._flow);
        if (isNaN(flowNum)) return false;
        const [min, max] = activeFlow.split("-").map(Number);
        if (max) return flowNum >= min && flowNum <= max;
        return flowNum >= min;
      }
      return true;
    });
  }, [products, activeOperator, activeDuration, activeArea, activeFlow]);

  /* ===== 分页状态 ===== */
  const filterKey = `${activeOperator}-${activeDuration}-${activeArea}-${activeFlow}`;
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
        // 哨兵进入视口时自动加载更多
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
          <LotMLProductCard key={product.productID} product={product} />
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
 * 计算各维度筛选选项的商品数量 + 动态生成地区/流量选项
 * @param products - 商品列表
 */
function useFilterCounts(products: LotMLProductWithMeta[]) {
  return useMemo(() => {
    const operatorCounts: Record<string, number> = { all: products.length };
    const durationCounts: Record<string, number> = { all: products.length };

    /** 地区选项（去重并只取前 20 个） */
    const areaSet = new Map<string, number>();
    /** 流量数值集合 */
    const flowNums = new Set<number>();

    for (const p of products) {
      operatorCounts[p._operator] = (operatorCounts[p._operator] || 0) + 1;
      durationCounts[p._duration] = (durationCounts[p._duration] || 0) + 1;

      // 地区统计
      if (p.area) {
        areaSet.set(p.area, (areaSet.get(p.area) || 0) + 1);
      }

      // 流量数值收集
      if (p._flow) {
        const num = parseInt(p._flow);
        if (!isNaN(num)) flowNums.add(num);
      }
    }

    // 生成地区选项（按商品数降序，限制 20 个）
    const areaOptions = [
      { key: "all", label: "全部地区" },
      ...[...areaSet.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([area]) => ({ key: area, label: area })),
    ];

    // 生成流量范围选项
    const sortedFlows = [...flowNums].sort((a, b) => a - b);
    const flowOptions: { key: string; label: string }[] = [
      { key: "all", label: "全部流量" },
    ];
    for (const f of sortedFlows) {
      flowOptions.push({
        key: `${f}-${f + 99}`,
        label: `${f}G以上`,
      });
    }

    return { operatorCounts, durationCounts, areaOptions, flowOptions };
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
          正规一级代理渠道，7天无理由退换，零风险体验
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://haokawx.lot-ml.com/ProductEn/Index/1a654e0b341cadd2"
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

/** LotML 商品列表页主组件 */
export default function LotMLContent({ products, error }: LotMLContentProps) {
  const [activeOperator, setActiveOperator] = useState("all");
  const [activeDuration, setActiveDuration] = useState("all");
  const [activeArea, setActiveArea] = useState("all");
  const [activeFlow, setActiveFlow] = useState("all");

  const { operatorCounts, durationCounts, areaOptions, flowOptions } =
    useFilterCounts(products);

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
                172号卡联盟套餐大全
              </h1>
              <p className="mt-1 text-sm text-blue-100">
                一级代理直供 · 秒返佣金 · 全国包邮 · 共 {products.length} 款在售套餐
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
          activeArea={activeArea}
          onAreaChange={setActiveArea}
          activeFlow={activeFlow}
          onFlowChange={setActiveFlow}
          operatorCounts={operatorCounts}
          durationCounts={durationCounts}
          areaOptions={areaOptions}
          flowOptions={flowOptions}
        />

        {/* 商品网格 */}
        <div className={containerClass("pb-10")} style={SITE_WIDTH_STYLE}>
          <ProductGrid
            products={products}
            activeOperator={activeOperator}
            activeDuration={activeDuration}
            activeArea={activeArea}
            activeFlow={activeFlow}
          />
        </div>
      </main>

      {/* 底部 CTA */}
      <CtaSection />
      <Footer />
    </div>
  );
}
