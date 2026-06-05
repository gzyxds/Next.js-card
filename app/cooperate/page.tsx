/**
 * 合作伙伴页面
 *
 * 展示流量派生态合作伙伴品牌 Logo，彰显平台实力与资源整合能力。
 * 纯客户端交互组件，由 CooperateContent 接管。
 */
import CooperateContent from "./CooperateContent";

export const metadata = {
  title: "合作伙伴",
  description:
    "流量派合作伙伴生态 — 与四大运营商、京东物流、顺丰速运等一线品牌深度合作，共建流量卡行业领先平台。",
};

export default function CooperatePage() {
  return <CooperateContent />;
}
