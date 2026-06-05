/**
 * 关于我们页面
 *
 * 展示公司背景、发展历程、核心团队及联系方式。
 * 纯客户端交互组件，由 AboutContent 接管。
 */
import AboutContent from "./AboutContent";

export const metadata = {
  title: "关于我们",
  description:
    "流量派 — 领先的流量卡分销平台，四大运营商官方授权，致力于为用户提供优质号卡与代理加盟服务。了解我们的故事、团队与使命。",
};

export default function AboutPage() {
  return <AboutContent />;
}
