import { SITE_WIDTH_STYLE, containerClass } from "@/lib/layout";
import {
  Wifi,
  Globe,
  CreditCard,
  ShieldCheck,
  Package,
  Headphones,
  Zap,
} from "lucide-react";

/** 核心优势区域组件 */
export default function FeaturesSection() {
  const features = [
    {
      icon: Wifi,
      title: "5G高速网络",
      desc: "支持5G/4G双模，峰值速率可达500Mbps，刷视频、玩游戏、看直播都不卡顿。",
      color: "text-blue-600",
      bg: "from-blue-500/10 to-blue-500/5",
    },
    {
      icon: Globe,
      title: "全国通用流量",
      desc: "流量全国通用，不限地区、不限APP，出差旅行、回家过年都能畅快使用。",
      color: "text-indigo-600",
      bg: "from-indigo-500/10 to-indigo-500/5",
    },
    {
      icon: CreditCard,
      title: "低月租无套路",
      desc: "月租透明，无隐形消费，无强制捆绑业务。套餐内容官方APP随时可查。",
      color: "text-emerald-600",
      bg: "from-emerald-500/10 to-emerald-500/5",
    },
    {
      icon: ShieldCheck,
      title: "官方正规号卡",
      desc: "三大运营商（移动/联通/电信）官方授权，11位正规手机号，可接打电话收发短信。",
      color: "text-violet-600",
      bg: "from-violet-500/10 to-violet-500/5",
    },
    {
      icon: Package,
      title: "全国包邮到家",
      desc: "在线下单后京东/EMS快递配送，1-3天送达。自主激活，无需排队等待。",
      color: "text-amber-600",
      bg: "from-amber-500/10 to-amber-500/5",
    },
    {
      icon: Headphones,
      title: "专属客服支持",
      desc: "7×12小时在线客服，从选卡、下单到激活使用，全程一对一指导服务。",
      color: "text-rose-600",
      bg: "from-rose-500/10 to-rose-500/5",
    },
  ];

  return (
    <section className="border-t bg-white">
      <div className={containerClass("py-16 md:py-24")} style={SITE_WIDTH_STYLE}>
        <div className="mb-12 text-center md:mb-14">
          <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
            <Zap className="size-4" />
            核心优势
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            为什么选择极速流量卡
          </h2>
          <p className="mt-3 text-muted-foreground">
            聚焦用户真实需求，打造省心、省钱、省力的流量解决方案
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5 md:p-7"
            >
              <div
                className={`mb-4 flex size-11 items-center justify-center rounded-xl bg-gradient-to-br ${f.bg}`}
              >
                <f.icon className={`size-5 ${f.color}`} />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
