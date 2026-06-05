/**
 * 共享商品卡片组件
 *
 * 首页套餐区 / 浩卡列表页 共用同一套卡片设计。
 * 修改此处即可全局统一商品卡片的展示样式。
 */
"use client";

import Link from "next/link";
import type { HaokaProduct, HaokaProductWithMeta, Operator } from "@/lib/api/haokavip";
import { mapOperator, OPERATOR_LABEL } from "@/lib/api/haokavip";
import { Button } from "@/components/ui/button";
import { Eye, ChevronRight, Star } from "lucide-react";

/* ========== 商品标签 ========== */

interface ProductTagsProps {
  /** 预计算标签列表（优先使用，避免客户端解析） */
  tags: { text: string; className: string }[];
  max?: number;
}

/** 商品标签列表（彩色药丸） */
export function ProductTags({ tags, max }: ProductTagsProps) {
  const displayTags = max ? tags.slice(0, max) : tags;
  if (displayTags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag, i) => (
        <span key={i} className={`inline-block rounded border px-2 py-0.5 text-[11px] leading-relaxed ${tag.className}`}>
          {tag.text}
        </span>
      ))}
    </div>
  );
}

/* ========== 运营商配色 ========== */

const OPERATOR_STYLE: Record<string, { badge: string; dot: string }> = {
  mobile:  { badge: "bg-green-100 text-green-700", dot: "bg-green-500" },
  telecom: { badge: "bg-blue-100 text-blue-700",   dot: "bg-blue-500" },
  unicom:  { badge: "bg-orange-100 text-orange-700", dot: "bg-orange-500" },
  broadcast: { badge: "bg-purple-100 text-purple-700", dot: "bg-purple-500" },
  unknown: { badge: "bg-gray-100 text-gray-600", dot: "bg-gray-400" },
};

/* ========== 商品卡片 ========== */

interface ProductCardProps {
  product: HaokaProduct;
  provider?: Operator;
}

/** 商品卡片（含图片/标签/价格/按钮） */
export default function ProductCard({ product, provider }: ProductCardProps) {
  const prov = provider || mapOperator(product.product_name);
  const price = product.product_name.match(/(\d+\.?\d*)元/)?.[1] || "?";
  const isTop = product.top_flag === 1;
  const opStyle = OPERATOR_STYLE[prov] || OPERATOR_STYLE.unknown;

  return (
    <div
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-100/80 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
      data-provider={prov}
    >
      {/* 图片区域 */}
      <Link href={`/haoka/${product.product_id}`} className="block">
        {product.product_image ? (
          <div className="relative aspect-square w-full overflow-hidden bg-gray-50 p-2">
            <img
              src={product.product_image}
              alt={product.product_name}
              className="h-full w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            {/* 推荐角标 */}
            {isTop && (
              <span className="absolute left-0 top-0 inline-flex items-center gap-1 rounded-br-lg bg-gradient-to-r from-amber-500 to-orange-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
                <Star className="size-3 fill-white" /> 推荐
              </span>
            )}
          </div>
        ) : (
          <div className="aspect-square w-full bg-gradient-to-br from-gray-50 to-gray-100" />
        )}
      </Link>

      {/* 内容区域 */}
      <div className="flex flex-1 flex-col p-3.5">
        <Link href={`/haoka/${product.product_id}`} className="flex-1">
          {/* 运营商标签（彩色） */}
          <div className="mb-2 flex items-center gap-1.5">
            <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold ${opStyle.badge}`}>
              <span className={`inline-block size-1.5 rounded-full ${opStyle.dot}`} />
              {OPERATOR_LABEL[prov]}
            </span>
          </div>

          {/* 标题 */}
          <h3 className="mb-1.5 line-clamp-2 text-sm font-medium leading-snug text-gray-800">
            {product.product_name.replace(/【.*?】/g, "").trim()}
          </h3>

          {/* 价格 */}
          <div className="mb-2.5 flex items-baseline gap-1">
            <span className="text-2xl font-extrabold tracking-tight text-blue-600">
              ¥{price}
            </span>
            <span className="text-[11px] text-gray-400">/月</span>
          </div>

          {/* 标签（使用预计算数据，避免客户端解析） */}
          <ProductTags
            tags={(product as HaokaProductWithMeta)._tags}
            max={4}
          />
        </Link>

        {/* 分隔线 */}
        <div className="my-2.5 border-t border-gray-50" />

        {/* 操作按钮 — 单排白+蓝 */}
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1 text-xs" asChild>
            <Link href={`/haoka/${product.product_id}`}>
              <Eye className="size-3.5" />
              查看详情
            </Link>
          </Button>
          <Button size="sm" className="flex-1 bg-blue-600 text-xs text-white hover:bg-blue-700" asChild>
            <a href={product.product_link} target="_blank" rel="noopener noreferrer">
              立即办理 <ChevronRight className="size-3.5" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
