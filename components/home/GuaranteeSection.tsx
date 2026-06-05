import { SITE_WIDTH_STYLE, containerClass } from "@/lib/layout";
import {
  ShieldCheck,
  Users,
  MapPin,
  Phone,
  BadgeCheck,
} from "lucide-react";

/** 服务保障区域组件 */
export default function GuaranteeSection() {
  const items = [
    {
      icon: ShieldCheck,
      title: "官方授权",
      desc: "所有号卡均来自四大运营商官方渠道，可在官方APP查询套餐详情。",
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
    <section className="bg-white">
      <div className={containerClass("py-16 md:py-24")} style={SITE_WIDTH_STYLE}>
        {/* ===== 标题区 ===== */}
        <div className="mb-12 text-center md:mb-14">
          <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
            <BadgeCheck className="size-4" />
            服务承诺
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            用户权益保障
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            您的每一分钱都花得明明白白，每一张卡都用得安安心心
          </p>
        </div>

        {/* ===== 四列卡片 ===== */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center rounded-md border bg-white p-6 text-center transition-colors hover:border-blue-200 hover:bg-blue-50/30 md:p-7"
            >
              <div className="mb-4 flex size-12 items-center justify-center rounded-md bg-blue-50">
                <item.icon className="size-6 text-blue-600" />
              </div>
              <h3 className="mb-2 text-base font-semibold">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
