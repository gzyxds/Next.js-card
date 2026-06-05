import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import ScrollToTopButton from "@/components/home/ScrollToTopButton";
import "./globals.css";

/* ========== 字体配置 ========== */

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

/** 站点名称 */
const SITE_NAME = "流量派";
/** 站点描述 */
const SITE_DESC =
  "流量派流量卡平台提供电信、联通、移动、广电正规手机号卡在线办理，19元起大流量套餐，全国通用包邮到家，官方授权正规渠道。";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} | 电信/联通/移动/广电大流量卡在线办理`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESC,
  keywords: [
    "流量卡",
    "大流量卡",
    "19元流量卡",
    "29元流量卡",
    "电信流量卡",
    "联通流量卡",
    "移动流量卡",
    "广电流量卡",
    "手机号卡",
    "号卡办理",
    "极速流量卡",
    "浩卡联盟",
  ],

  /* ===== 图标 ===== */
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },

  /* ===== Open Graph ===== */
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESC,
    type: "website",
    locale: "zh_CN",
    siteName: SITE_NAME,
  },

  /* ===== 其他 SEO ===== */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
  metadataBase: new URL("https://next-card.example.com"),
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: true,
    address: false,
    email: false,
  },

  /* ===== 其他 ===== */
  applicationName: SITE_NAME,
  referrer: "origin-when-cross-origin",
  creator: "浩卡联盟",
  publisher: "浩卡联盟",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        {/* 主题色 */}
        <meta name="theme-color" content="#ffffff" />
        <meta name="color-scheme" content="light dark" />
        {/* 禁止百度转码 */}
        <meta httpEquiv="Cache-Control" content="no-transform" />
        <meta httpEquiv="Cache-Control" content="no-siteapp" />
      </head>
      <body
        className={`${dmSans.variable} ${jetbrainsMono.variable} font-[family-name:var(--font-sans)] antialiased`}
      >
        {children}
        <ScrollToTopButton />
      </body>
    </html>
  );
}
