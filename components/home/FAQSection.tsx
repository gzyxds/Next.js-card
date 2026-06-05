"use client";

import { useState } from "react";
import { HelpCircle, ChevronRight } from "lucide-react";

/** 常见问题区域组件 */
export default function FAQSection() {
  const faqs = [
    {
      q: "流量卡是正规手机卡吗？",
      a: "是的，我们提供的均为三大运营商（移动/联通/电信）官方发行的正规11位手机号码，支持打电话、发短信、开热点，可在运营商官方APP查询套餐和充值。",
    },
    {
      q: "流量是全国通用的吗？",
      a: "套餐内的通用流量可在全国范围内（不含港澳台）使用，不限地区、不限APP。定向流量则限定在指定的主流APP范围内使用。",
    },
    {
      q: "下单后多久能收到卡？",
      a: "通常下单后1-3个工作日内发货，由京东快递或EMS配送。收到卡后按照说明书指引在线激活即可使用。",
    },
    {
      q: "不想用了可以注销吗？",
      a: "可以。本页面推荐的套餐大多无合约期限制，支持通过运营商官方APP或客服热线办理线上注销，余额可按规定退还。",
    },
    {
      q: "为什么你们的套餐比营业厅便宜？",
      a: "这些套餐是运营商为互联网渠道推出的专属优惠套餐，通过线上办理可节省线下门店成本，因此资费更具竞争力，但号卡本身与营业厅办理无任何区别。",
    },
    {
      q: "一个人可以办理几张？",
      a: "根据工信部规定，同一身份证在同一运营商下最多可办理5张手机卡。如您名下已有该运营商号卡，请确认是否还有办卡额度。",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="border-t bg-muted/30">
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
        <div className="mb-12 text-center md:mb-14">
          <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
            <HelpCircle className="size-4" />
            常见问题
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            您可能想了解的
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl border bg-card shadow-sm transition-all"
            >
              <button
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left md:px-6"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span className="font-semibold text-foreground">{faq.q}</span>
                <span
                  className={`shrink-0 rounded-full border p-1 transition-transform ${
                    openIndex === idx ? "rotate-180 bg-blue-50" : ""
                  }`}
                >
                  <ChevronRight
                    className={`size-4 ${
                      openIndex === idx
                        ? "text-blue-600"
                        : "text-muted-foreground"
                    }`}
                  />
                </span>
              </button>
              {openIndex === idx && (
                <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground md:px-6">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
