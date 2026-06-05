import { SITE_WIDTH_STYLE, containerClass } from "@/lib/layout";
import {
  ShieldCheck,
  Users,
  MapPin,
  Phone,
} from "lucide-react";

/** 服务保障区域组件 */
export default function GuaranteeSection() {
  const items = [
    {
      icon: ShieldCheck,
      title: "官方授权",
      desc: "所有号卡均来自三大运营商官方渠道，可在官方APP查询套餐详情。",
    },
    {
      icon: Users,
      title: "真实用户",
      desc: "严格实名认证，一证五号政策合规办理，保障通信安全。",
    },
    {
      icon: MapPin,
      title: "全国覆盖",
      desc: "支持全国大部分地区发货，偏远地区请以实际下单页提示为准。",
    },
    {
      icon: Phone,
      title: "售后无忧",
      desc: "提供专属客服服务，用卡过程中遇到问题可随时咨询解决。",
    },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background via-indigo-50/20 to-background" />
      <div className={containerClass("py-16 md:py-24")} style={SITE_WIDTH_STYLE}>
        <div className="mb-12 text-center md:mb-14">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            用户权益保障
          </h2>
          <p className="mt-3 text-muted-foreground">
            您的每一分钱都花得明明白白，每一张卡都用得安安心心
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.title}
              className="flex gap-4 rounded-2xl border bg-card p-5 shadow-sm transition-all hover:shadow-md md:p-6"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                <item.icon className="size-5 text-blue-600" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
