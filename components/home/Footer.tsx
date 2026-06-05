import Link from "next/link";
import { SITE_WIDTH_STYLE, containerClass } from "@/lib/layout";
import { Signal, Phone, Mail, Clock } from "lucide-react";

/** 页面底部组件 */
export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className={containerClass("py-12")} style={SITE_WIDTH_STYLE}>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* 品牌 */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Signal className="size-4" />
              </div>
              <span className="text-base font-bold tracking-tight">
                极速流量卡
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              专注为用户提供正规、优惠、便捷的流量卡办理服务，让上网更自由。
            </p>
          </div>

          {/* 快速链接 */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">快速链接</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-foreground">
                  首页
                </Link>
              </li>
              <li>
                <Link href="#plans" className="hover:text-foreground">
                  套餐介绍
                </Link>
              </li>
              <li>
                <Link href="#process" className="hover:text-foreground">
                  办理流程
                </Link>
              </li>
              <li>
                <Link href="#faq" className="hover:text-foreground">
                  常见问题
                </Link>
              </li>
            </ul>
          </div>

          {/* 服务支持 */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">服务支持</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="hover:text-foreground cursor-pointer">用户协议</span>
              </li>
              <li>
                <span className="hover:text-foreground cursor-pointer">隐私政策</span>
              </li>
              <li>
                <span className="hover:text-foreground cursor-pointer">售后服务</span>
              </li>
              <li>
                <span className="hover:text-foreground cursor-pointer">投诉建议</span>
              </li>
            </ul>
          </div>

          {/* 联系方式 */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">联系我们</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="size-3.5" />
                400-xxx-xxxx
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-3.5" />
                service@example.com
              </li>
              <li className="flex items-center gap-2">
                <Clock className="size-3.5" />
                周一至周日 9:00-21:00
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground">
          <p>
            极速流量卡平台仅为信息展示与办理入口，号卡及服务由各大运营商提供。
          </p>
          <p className="mt-1">
            &copy; {new Date().getFullYear()} 极速流量卡 版权所有
          </p>
        </div>
      </div>
    </footer>
  );
}
