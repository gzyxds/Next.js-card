"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SITE_WIDTH_STYLE, containerClass } from "@/lib/layout";
import { Signal, Menu, X } from "lucide-react";

/** 页面顶部导航栏组件 */
export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "首页", href: "#" },
    { label: "号卡", href: "/haoka" },
    { label: "套餐", href: "#plans" },
    { label: "办理流程", href: "#process" },
    { label: "常见问题", href: "#faq" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className={containerClass("flex h-16 items-center justify-between")} style={SITE_WIDTH_STYLE}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md shadow-blue-600/20">
            <Signal className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-none tracking-tight text-foreground">
              极速流量卡
            </span>
            <span className="text-[10px] leading-none text-muted-foreground">
              官方正规 · 全国通用
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            className="hidden bg-blue-600 text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 md:inline-flex"
            asChild
          >
            <Link href="#plans">立即办理</Link>
          </Button>
          <button
            className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="切换菜单"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t border-border/40 bg-background px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <Button
              size="sm"
              className="mt-2 w-full bg-blue-600 text-white hover:bg-blue-700"
              asChild
            >
              <Link href="#plans" onClick={() => setMobileOpen(false)}>
                立即办理
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
