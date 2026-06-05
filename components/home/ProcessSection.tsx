import { SITE_WIDTH_STYLE, containerClass } from "@/lib/layout";
import {
  Smartphone,
  ScrollText,
  Package,
  Zap,
  Clock,
  ChevronRight,
  ClipboardCheck,
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
    <section id="process" className="bg-white">
      {/* ===== 顶部标题区 ===== */}
      <div className={containerClass("pt-16 md:pt-24")} style={SITE_WIDTH_STYLE}>
        <div className="mb-12 text-center md:mb-14">
          <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
            <ClipboardCheck className="size-4" />
            办理流程
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            四步轻松领卡
          </h2>
          <p className="mt-3 text-muted-foreground">
            全程线上办理，无需线下排队，平均3天即可用上新卡
          </p>
        </div>

        {/* ===== 步骤卡片区 ===== */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, idx) => (
            <div key={step.num} className="relative">
              <div className="flex flex-col items-center text-center">
                {/* 图标 */}
                <div className="mb-4 flex size-14 items-center justify-center rounded-md bg-blue-50">
                  <step.icon className="size-6 text-blue-600" />
                </div>
                {/* 步骤编号 */}
                <span className="mb-2 rounded-sm bg-blue-100 px-3 py-0.5 text-xs font-bold text-blue-700">
                  步骤 {step.num}
                </span>
                <h3 className="mb-1 text-lg font-semibold">{step.title}</h3>
                <p className="max-w-[240px] text-sm leading-relaxed text-muted-foreground">
                  {step.desc}
                </p>
              </div>

              {/* 步骤间连接线（仅桌面端） */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block">
                  <div className="absolute top-7 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] border-t border-dashed border-slate-200" />
                  <ChevronRight className="absolute top-5 right-[-0.8rem] size-4 text-slate-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ===== 底部白色区域：完成提示 ===== */}
      <div className={containerClass("pb-16 md:pb-24 pt-12 md:pt-16")} style={SITE_WIDTH_STYLE}>
        <div className="flex flex-col items-center gap-6 rounded-md border border-slate-200 bg-slate-50 p-8 text-center sm:flex-row sm:text-left md:p-10">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-md bg-blue-100">
            <Clock className="size-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">平均 3 天即可用上新卡</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              从在线选卡到自主激活，全程线上完成。无需线下排队、无需复杂手续，
              京东/EMS 极速配送，让您足不出户畅享高速流量。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

