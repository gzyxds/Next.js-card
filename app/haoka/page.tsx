/**
 * 浩卡联盟商品展示页面
 *
 * 展示浩卡联盟平台的多运营商号卡套餐，支持运营商分类筛选。
 * 数据来源：浩卡联盟分销系统 /open/api/product
 */
import { fetchHaokaProducts, type HaokaProduct } from "@/lib/api/haokavip";
import HaokaContent from "./HaokaContent";

export const metadata = {
  title: "浩卡联盟号卡 | 电信/移动/联通/广电大流量卡精选",
  description:
    "浩卡联盟精选号卡，电信/移动/联通/广电19元-39元大流量套餐，全国通用不限速，正规渠道免费申请包邮到家",
  keywords:
    "浩卡联盟,流量卡,大流量卡,19元流量卡,29元流量卡,电信流量卡,移动流量卡,联通流量卡,广电流量卡",
};

export default async function HaokaPage() {
  let products: HaokaProduct[] = [];
  let error: string | null = null;

  try {
    const result = await fetchHaokaProducts();
    products = result.products;
  } catch (e) {
    error = e instanceof Error ? e.message : "获取浩卡联盟商品失败";
    console.error("[HaokaPage]", error);
  }

  return <HaokaContent products={products} error={error} />;
}
