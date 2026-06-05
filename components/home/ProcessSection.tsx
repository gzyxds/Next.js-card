import { SITE_WIDTH_STYLE, containerClass } from "@/lib/layout";
import {
  Smartphone,
  ScrollText,
  Package,
  Zap,
  Clock,
  ChevronRight,
} from "lucide-react";

/** 办理流程区域组件 */
export default function ProcessSection() {
  const steps = [
    {
      num: "01",
      title: "在线选卡",
      desc: "浏览对比不同套餐，选择最符合您需求的流量卡。",
      icon: Smartphone,
    },
    {
      num: "02",
      title: "提交申请",
      desc: "填写实名信息并下单，全程加密保护您的隐私安全。",
      icon: ScrollText,
    },
    {
      num: "03",
      title: "快递送达",
      desc: "京东/EMS包邮到家，1-3个工作日内即可收到号卡。",
      icon: Package,
    },
    {
      num: "04",
      title: "自主激活",
      desc: "按说明书指引在线激活，充值后即可畅享高速流量。",
      icon: Zap,
    },
  ];

  return (
    <section id="process" className="border-t bg-muted/30">
      <div className={containerClass("py-16 md:py-24")} style={SITE_WIDTH_STYLE}>
        <div className="mb-12 text-center md:mb-14">
          <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
            <Clock className="size-4" />
            办理流程
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            四步轻松领卡
          </h2>
          <p className="mt-3 text-muted-foreground">
            全程线上办理，无需线下排队，平均3天即可用上新卡
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, idx) => (
            <div key={step.num} className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 shadow-sm">
                  <step.icon className="size-6 text-blue-600" />
                </div>
                <span className="mb-2 text-xs font-bold text-blue-600">
                  步骤 {step.num}
                </span>
                <h3 className="mb-1 text-lg font-semibold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.desc}
                </p>
              </div>

              {/* 步骤间连接线（桌面端） */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block">
                  <div className="absolute top-7 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] border-t border-dashed border-border" />
                  <ChevronRight className="absolute top-5 right-[-0.8rem] size-4 text-muted-foreground/40" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
