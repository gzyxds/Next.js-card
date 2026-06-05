/**
 * 套餐网格组件（客户端交互）
 *
 * 默认显示 8 个商品，每次点击「加载更多」再增加 8 个。
 */
"use client";

import { useState } from "react";
import type { HaokaProduct } from "@/lib/api/haokavip";
import ProductCard from "@/components/home/ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

/** 每次增量加载数量 */
const STEP = 10;

interface PlansGridProps {
  products: HaokaProduct[];
}

/** 套餐网格（含加载更多按钮） */
export default function PlansGrid({ products }: PlansGridProps) {
  const [count, setCount] = useState(STEP);
  const visible = products.slice(0, count);
  const hasMore = count < products.length;

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {visible.map((plan) => (
          <ProductCard key={plan.product_id} product={plan} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setCount((c) => Math.min(c + STEP, products.length))}
            className="gap-2 px-8"
          >
            <ChevronDown className="size-4" />
            加载更多（已加载 {count} / 共 {products.length} 款）
          </Button>
        </div>
      )}
    </>
  );
}
