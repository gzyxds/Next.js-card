/**
 * 浩卡联盟商品展示页面/haoka
 */

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { HaokaProduct, Operator, LocationType, DurationType } from "@/lib/api/haokavip";
import {
  mapOperator,
  OPERATOR_LABEL,
  parseLocation,
  parseDuration,
  parseTags,
} from "@/lib/api/haokavip";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import { SITE_WIDTH_STYLE, containerClass } from "@/lib/layout";
import ProductCard from "@/components/home/ProductCard";
import {
  Signal,
  ChevronRight,
  ArrowRight,
  ShoppingCart,
  ShieldCheck,
  TrendingUp,
  MapPin,
  RefreshCw,
} from "lucide-react";

/* ========== 类型定义 ========== */

interface HaokaContentProps {
  products: HaokaProduct[];
  error: string | null;
}

/** 商品携带的筛选维度 */
interface ProductMeta {
  provider: Operator;
  location: LocationType;
  shipping: string;
  duration: DurationType;
}

/* ========== 筛选选项常量 ========== */

const OPERATOR_OPTIONS = [
  { key: "all" as const, label: "全部运营商" },
  ...(["mobile", "telecom", "unicom", "broadcast"] as Operator[]).map((k) => ({
    key: k,
    label: OPERATOR_LABEL[k],
  })),
];

const DURATION_OPTIONS = [
  { key: "all" as const, label: "全部时长" },
  { key: "长期" as DurationType, label: "长期" },
  { key: "2年" as DurationType, label: "2年" },
  { key: "1年" as DurationType, label: "1年" },
];

/* ========== 页面顶栏优势 ========== */

function AdvantagesSection() {
  const items = [
    { icon: ShieldCheck, title: "一级代理卡品", desc: "直连运营商渠道，确保卡品质量和稳定性" },
    { icon: TrendingUp, title: "超高分销佣金", desc: "业内领先的佣金比例，助力合作伙伴收益最大化" },
    { icon: MapPin, title: "卡品全国覆盖", desc: "覆盖全国各省市，满足不同地区用户需求" },
    { icon: RefreshCw, title: "实时回传不扣量", desc: "订单实时同步，确保数据准确无误" },
  ];

  return (
    <section className={containerClass("pt-6")} style={SITE_WIDTH_STYLE}>
      <h3 className="mb-4 text-lg font-medium text-gray-800">亚平科技号卡供应链优势</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.title} className="rounded-lg bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
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
              <span className={`ml-1 text-[11px] ${isActive ? "text-white/80" : "text-gray-400"}`}>
                ({count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function FilterBar({
  activeOperator,
  onOperatorChange,
  activeLocation,
  onLocationChange,
  activeDuration,
  onDurationChange,
  operatorCounts,
  locationOptions,
  locationCounts,
}: {
  activeOperator: string;
  onOperatorChange: (k: string) => void;
  activeLocation: string;
  onLocationChange: (k: string) => void;
  activeDuration: string;
  onDurationChange: (k: string) => void;
  operatorCounts: Record<string, number>;
  locationOptions: { key: string; label: string }[];
  locationCounts: Record<string, number>;
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
          label="归属地"
          options={locationOptions}
          activeKey={activeLocation}
          onChange={onLocationChange}
          counts={locationCounts}
        />
        <div className="border-t border-gray-50" />
        <FilterRow
          label="套餐时长"
          options={DURATION_OPTIONS}
          activeKey={activeDuration}
          onChange={onDurationChange}
        />
      </div>
    </div>
  );
}

/* ========== 商品网格 ========== */

function ProductGrid({
  products,
  activeOperator,
  activeLocation,
  activeDuration,
}: {
  products: HaokaProduct[];
  activeOperator: string;
  activeLocation: string;
  activeDuration: string;
}) {
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const meta = getProductMeta(p);
      if (activeOperator !== "all" && meta.provider !== activeOperator) return false;
      if (activeLocation !== "all" && meta.location !== activeLocation && meta.shipping !== activeLocation) return false;
      if (activeDuration !== "all" && meta.duration !== activeDuration) return false;
      return true;
    });
  }, [products, activeOperator, activeLocation, activeDuration]);

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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {filtered.map((product) => (
        <ProductCard
          key={product.product_id}
          product={product}
          provider={mapOperator(product.product_name)}
        />
      ))}
    </div>
  );
}

/* ========== 商品元数据工具 ========== */

function getProductMeta(product: HaokaProduct): ProductMeta {
  return {
    provider: mapOperator(product.product_name),
    location: parseLocation(product.product_name).location,
    shipping: parseLocation(product.product_name).shipping,
    duration: parseDuration(product.product_name),
  };
}

/* ========== 底部 CTA ========== */

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
            href="https://www.haokavip.com/page.html#/usercenter"
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
            返回首页 <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ========== 错误页面 ========== */

function ErrorPage({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f5f7fa]">
      <Header />
      <main className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <Signal className="mx-auto mb-4 size-12 text-red-300" />
          <h2 className="mb-1 text-lg font-semibold text-gray-700">数据加载失败</h2>
          <p className="text-sm text-gray-400">{message}</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

/* ========== 主入口 ========== */

export default function HaokaContent({ products, error }: HaokaContentProps) {
  const [activeOperator, setActiveOperator] = useState("all");
  const [activeLocation, setActiveLocation] = useState("all");
  const [activeDuration, setActiveDuration] = useState("all");

  /** 计算各维度统计数据 */
  const { operatorCounts, locationOptions, locationCounts } = useMemo(() => {
    const opCounts: Record<string, number> = { all: products.length, mobile: 0, telecom: 0, unicom: 0, broadcast: 0 };
    const locCounts: Record<string, number> = { all: products.length };
    const locSet = new Set<string>();

    products.forEach((p) => {
      const meta = getProductMeta(p);
      // 运营商
      if (opCounts[meta.provider] !== undefined) opCounts[meta.provider]++;
      // 归属地
      locSet.add(meta.location);
      locCounts[meta.location] = (locCounts[meta.location] || 0) + 1;
    });

    const locOpts = [
      { key: "all", label: "全部归属地" },
      ...Array.from(locSet)
        .sort()
        .filter((k) => locCounts[k] > 0)
        .map((k) => ({ key: k, label: k })),
    ];

    return { operatorCounts: opCounts, locationOptions: locOpts, locationCounts: locCounts };
  }, [products]);

  if (error) return <ErrorPage message={error} />;

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <Header />
      <main>
        <AdvantagesSection />
        <FilterBar
          activeOperator={activeOperator}
          onOperatorChange={setActiveOperator}
          activeLocation={activeLocation}
          onLocationChange={setActiveLocation}
          activeDuration={activeDuration}
          onDurationChange={setActiveDuration}
          operatorCounts={operatorCounts}
          locationOptions={locationOptions}
          locationCounts={locationCounts}
        />
        <section className={containerClass("pb-10")} style={SITE_WIDTH_STYLE}>
          <ProductGrid
            products={products}
            activeOperator={activeOperator}
            activeLocation={activeLocation}
            activeDuration={activeDuration}
          />
        </section>
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
