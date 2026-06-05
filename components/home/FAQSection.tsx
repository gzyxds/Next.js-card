"use client";

/**
 * 常见问题区域组件（FAQSection）
 *
 * 左右双栏布局，配色风格与 GuaranteeSection 保持一致：
 * - 背景渐变：via-blue-50/20
 * - 卡片：bg-card border shadow-sm rounded-2xl
 * - 图标容器：bg-blue-500/10 + text-blue-600
 */

import { useState } from "react";
import {
  HelpCircle,
  ChevronDown,
  Smartphone,
  CreditCard,
  ShieldCheck,
  MessageCircle,
  Phone,
} from "lucide-react";
import { SITE_WIDTH_STYLE, containerClass } from "@/lib/layout";

/* ========== FAQ 数据 ========== */

interface FaqItem {
  q: string;
  a: string;
  category: string;
}

const FAQS: FaqItem[] = [
  {
    category: "号卡产品",
    q: "流量卡是正规手机卡吗？",
    a: "是的，我们提供的均为三大运营商（移动/联通/电信/广电）官方发行的正规 11 位手机号码卡。支持打电话、发短信、开热点，可在运营商官方 APP 查询套餐余量和在线充值，与营业厅办理的卡没有任何区别。",
  },
  {
    category: "号卡产品",
    q: "流量是全国通用的吗？限不限制 APP？",
    a: "套餐内的通用流量可在全国范围内（不含港澳台）使用，不限地区、不限 APP、不限速。定向流量则在指定主流 APP（如抖音、腾讯视频等）范围内使用。具体请以套餐详情页说明为准。",
  },
  {
    category: "号卡产品",
    q: "为什么你们的套餐比营业厅便宜这么多？",
    a: "这些套餐是运营商为互联网渠道推出的专属优惠号卡，通过线上办理可节省线下门店租金和人力成本，因此资费更具竞争力。但号卡本身与营业厅办理的完全一致，享受同样的网络质量和服务保障。",
  },
  {
    category: "订购激活",
    q: "下单后多久能收到卡？如何激活？",
    a: "通常下单后 1-3 个工作日内发货，由京东快递或 EMS 配送上门。收到卡后按照随卡附带的激活指南操作即可，支持线上自助激活（上传身份证 + 人脸识别），全程约 3-5 分钟即可完成。",
  },
  {
    category: "订购激活",
    q: "一个人可以办理几张？有年龄限制吗？",
    a: "根据工信部规定，同一身份证在同一运营商下最多可办理 5 张手机卡。年龄要求通常在 16-60 周岁之间（具体以套餐要求为准）。下单前请确认您名下该运营商的办卡额度是否充足。",
  },
  {
    category: "订购激活",
    q: "下单需要哪些资料？信息安全吗？",
    a: "办理号卡需要提供收件人姓名、身份证号、收货地址和联系电话。这些信息仅用于运营商实名制开户，全程加密传输，我们不会将您的个人信息用于任何其他用途。",
  },
  {
    category: "售后保障",
    q: "不想用了可以注销吗？有没有违约金？",
    a: "可以。本平台推荐的套餐大多无合约期限制或不低于 6 个月，支持通过运营商官方 APP 或客服热线（10086/10000/10010）随时办理线上注销，无需前往营业厅，不收取任何违约金。",
  },
  {
    category: "售后保障",
    q: "套餐到期后会自动续约吗？资费会变吗？",
    a: "优惠套餐到期后，通常会自动恢复为运营商标准资费。建议在优惠期结束前关注短信提醒，如有需要可联系我们或登录运营商 APP 选择新的优惠套餐继续使用。",
  },
  {
    category: "售后保障",
    q: "收到卡后不满意可以退吗？",
    a: "号卡属于特殊商品，激活后将无法退货。但下单后至签收激活前，您随时可以取消订单或不激活使用。如果您有任何疑问，建议先联系客服确认套餐详情后再激活。",
  },
];

/* ========== 分类配置 ========== */

const CATEGORY_CONFIG: Record<string, { icon: typeof HelpCircle; desc: string }> = {
  "号卡产品": { icon: Smartphone, desc: "了解号卡来源、流量范围及资费优势" },
  "订购激活": { icon: CreditCard, desc: "下单流程、发货时效及激活方式" },
  "售后保障": { icon: ShieldCheck, desc: "注销、续约及退换政策" },
};

/* ========================================================================================== */

/** 常见问题区域组件 */
export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section className="relative overflow-hidden">
      {/* 背景渐变（与 GuaranteeSection 一致）：via-blue-50/20 */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background via-blue-50/20 to-background" />

      <div className={containerClass("py-16 md:py-24")} style={SITE_WIDTH_STYLE}>
        <div className="grid gap-10 md:grid-cols-[1fr_1.5fr] md:gap-12 lg:gap-16">
          {/* ===== 左栏：标题 + 分类索引 + 联系引导 ===== */}
          <div className="flex flex-col">
            <div className="mb-8">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-600">
                <HelpCircle className="size-3.5" />
                常见问题
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                您可能想了解的
              </h2>
              <p className="mt-3 text-muted-foreground">
                关于号卡产品、订购激活、售后服务的常见疑问，这里都有答案
              </p>
            </div>

            {/* 分类索引卡片 */}
            <div className="mb-8 space-y-3">
              {Object.entries(CATEGORY_CONFIG).map(([cat, cfg]) => {
                const count = FAQS.filter((f) => f.category === cat).length;
                const Icon = cfg.icon;
                return (
                  <div
                    key={cat}
                    className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                      <Icon className="size-5 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold">{cat}</p>
                      <p className="text-xs text-muted-foreground">{cfg.desc}</p>
                    </div>
                    <span className="ml-auto shrink-0 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      {count} 题
                    </span>
                  </div>
                );
              })}
            </div>

            {/* 联系引导卡片 */}
            <div className="mt-auto rounded-2xl border bg-card p-5 shadow-sm">
              <p className="font-semibold">没有找到答案？</p>
              <p className="mt-1 text-sm text-muted-foreground">
                联系客服获取一对一帮助
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href="#"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-700"
                >
                  <MessageCircle className="size-3.5" />
                  在线咨询
                </a>
                <a
                  href="tel:400-xxx-xxxx"
                  className="inline-flex items-center gap-1.5 rounded-lg border bg-card px-3.5 py-2 text-xs font-medium transition-colors hover:bg-muted"
                >
                  <Phone className="size-3.5 text-blue-600" />
                  客服热线
                </a>
              </div>
            </div>
          </div>

          {/* ===== 右栏：FAQ 折叠面板 ===== */}
          <div className="space-y-2">
            {FAQS.map((faq, idx) => {
              const isOpen = openIndex === idx;
              const CatIcon = CATEGORY_CONFIG[faq.category]?.icon;

              return (
                <div
                  key={idx}
                  className={`overflow-hidden rounded-2xl border bg-card shadow-sm transition-all ${
                    isOpen
                      ? "border-blue-200 shadow-md"
                      : "hover:shadow-md"
                  }`}
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left md:px-6"
                    onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                    aria-expanded={isOpen}
                  >
                    <span className="flex items-center gap-3 text-sm font-medium md:text-base">
                      <span
                        className={`flex size-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                          isOpen
                            ? "bg-blue-600 text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {idx + 1}
                      </span>
                      {faq.q}
                    </span>

                    <ChevronDown
                      className={`size-4 shrink-0 transition-all duration-200 ${
                        isOpen
                          ? "rotate-180 text-blue-600"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>

                  {/* 答案区域 */}
                  <div
                    className="grid transition-all duration-200"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t px-5 pb-5 pt-3 md:px-6">
                        <div className="flex items-start gap-3">
                          {CatIcon && (
                            <CatIcon className="mt-0.5 size-4 shrink-0 text-blue-600" />
                          )}
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {faq.a}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
