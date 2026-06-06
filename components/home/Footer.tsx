import Link from "next/link";
import Image from "next/image";
import { SITE_WIDTH_STYLE, containerClass } from "@/lib/layout";

/** 页面底部组件 */
export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className={containerClass("py-14 md:py-16")} style={SITE_WIDTH_STYLE}>
        {/* ===== 品牌区域 ===== */}
        <div className="mb-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="流量派 Logo"
              width={32}
              height={32}
              className="size-8"
            />
            <span className="text-lg font-bold tracking-tight">
              流量派
            </span>
          </Link>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground">
            专注为用户提供正规、优惠、便捷的流量卡办理服务，让上网更自由。
          </p>
        </div>

        {/* ===== 4 列均匀导航 ===== */}
        <div className="grid grid-cols-2 gap-4 sm:gap-8 lg:grid-cols-4 border-t pt-10">
          {/* 号卡办理 */}
          <div>
            <h4 className="mb-4 text-base font-semibold">号卡办理</h4>
            <ul className="space-y-2.5 text-base text-muted-foreground">
              <li>
                <Link href="/lotml" className="transition-colors hover:text-foreground">
                  号卡联盟
                </Link>
              </li>
              <li>
                <Link href="/haoka" className="transition-colors hover:text-foreground">
                  号卡精选
                </Link>
              </li>
              <li>
                <Link href="/linxi" className="transition-colors hover:text-foreground">
                  林夕通信
                </Link>
              </li>
              <li>
                <Link href="/join" className="transition-colors hover:text-foreground">
                  代理加盟
                </Link>
              </li>
            </ul>
          </div>

          {/* 快速链接 */}
          <div>
            <h4 className="mb-4 text-base font-semibold">快速链接</h4>
            <ul className="space-y-2.5 text-base text-muted-foreground">
              <li>
                <Link href="/" className="transition-colors hover:text-foreground">
                  首页
                </Link>
              </li>
              <li>
                <Link href="#plans" className="transition-colors hover:text-foreground">
                  套餐介绍
                </Link>
              </li>
              <li>
                <Link href="#process" className="transition-colors hover:text-foreground">
                  办理流程
                </Link>
              </li>
              <li>
                <Link href="#faq" className="transition-colors hover:text-foreground">
                  常见问题
                </Link>
              </li>
            </ul>
          </div>

          {/* 服务支持 */}
          <div>
            <h4 className="mb-4 text-base font-semibold">服务支持</h4>
            <ul className="space-y-2.5 text-base text-muted-foreground">
              <li>
                <span className="cursor-pointer transition-colors hover:text-foreground">用户协议</span>
              </li>
              <li>
                <span className="cursor-pointer transition-colors hover:text-foreground">隐私政策</span>
              </li>
              <li>
                <span className="cursor-pointer transition-colors hover:text-foreground">售后服务</span>
              </li>
              <li>
                <span className="cursor-pointer transition-colors hover:text-foreground">投诉建议</span>
              </li>
            </ul>
          </div>

          {/* 联系我们 */}
          <div>
            <h4 className="mb-4 text-base font-semibold">联系我们</h4>
            {/* 二维码 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="mx-auto mb-2 aspect-square w-full max-w-[110px] overflow-hidden rounded-lg border bg-white p-3">
                  <img
                    src="/wx.png"
                    alt="微信客服二维码"
                    className="size-full object-contain"
                    loading="lazy"
                  />
                </div>
                <p className="text-xs text-muted-foreground">微信咨询</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-2 aspect-square w-full max-w-[110px] overflow-hidden rounded-lg border bg-white p-3">
                  <img
                    src="/weixin.png"
                    alt="客服二维码"
                    className="size-full object-contain"
                    loading="lazy"
                  />
                </div>
                <p className="text-xs text-muted-foreground">客服二维码</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>
            流量派平台仅为信息展示与办理入口，号卡及服务由各大运营商提供。
          </p>
          <p className="mt-1">
            &copy; {new Date().getFullYear()} 流量派 版权所有
          </p>
        </div>
      </div>
    </footer>
  );
}
