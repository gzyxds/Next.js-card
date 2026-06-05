/**
 * 代理加盟页面
 *
 * 展示代理加盟政策、优势、流程及在线申请表单。
 * 纯客户端交互组件，由 JoinContent 接管。
 */
import JoinContent from "@/app/join/JoinContent";

export const metadata = {
  title: "代理加盟",
  description:
    "流量派代理加盟计划 — 零门槛、高佣金、全支持。加入流量卡代理，轻松开启副业增收之路。",
};

export default function JoinPage() {
  return <JoinContent />;
}
