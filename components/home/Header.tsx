"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SITE_WIDTH_STYLE, containerClass } from "@/lib/layout";
import {
  Signal,
  Menu,
  X,
  ChevronDown,
  Store,
  Sparkles,
  Wifi,
  LayoutGrid,
  ClipboardList,
  MessageCircleQuestion,
  ArrowRight,
  BadgeCheck,
  UserPlus,
  LogIn,
} from "lucide-react";

/* ========== 导航数据结构 ========== */

/** 导航子菜单项 */
interface SubNavItem {
  label: string;
  href: string;
  /** 简短描述 */
  desc?: string;
  /** lucide 图标组件 */
  icon: React.ElementType;
  /** 标签颜色类 */
  iconColor?: string;
}

/** 导航项（可有子菜单） */
interface NavItem {
  label: string;
  href?: string;
  /** 下拉面板标题（可选） */
  dropdownTitle?: string;
  children?: SubNavItem[];
}

/** 主导航配置 */
const NAV_ITEMS: NavItem[] = [
  { label: "首页", href: "/" },
  {
    label: "号卡办理",
    dropdownTitle: "选择号卡平台",
    children: [
      {
        label: "号卡联盟",
        href: "/lotml",
        desc: "172号卡全量套餐，全国可办",
        icon: Store,
        iconColor: "text-blue-600 bg-blue-50",
      },
      {
        label: "号卡精选",
        href: "/haoka",
        desc: "浩卡联盟精选，品质保障",
        icon: Sparkles,
        iconColor: "text-amber-600 bg-amber-50",
      },
      {
        label: "林夕通信",
        href: "/linxi",
        desc: "万千号卡，尽在林夕",
        icon: Wifi,
        iconColor: "text-green-600 bg-green-50",
      },
    ],
  },
  {
    label: "套餐指南",
    dropdownTitle: "办理与服务指南",
    children: [
      {
        label: "套餐浏览",
        href: "#plans",
        desc: "热销套餐一览",
        icon: LayoutGrid,
        iconColor: "text-indigo-600 bg-indigo-50",
      },
      {
        label: "办理流程",
        href: "#process",
        desc: "下单到激活全过程",
        icon: ClipboardList,
        iconColor: "text-emerald-600 bg-emerald-50",
      },
      {
        label: "常见问题",
        href: "#faq",
        desc: "号卡使用与激活疑问",
        icon: MessageCircleQuestion,
        iconColor: "text-rose-600 bg-rose-50",
      },
    ],
  },
  { label: "代理加盟", href: "/join" },
  { label: "合作伙伴", href: "/cooperate" },
  { label: "关于我们", href: "/about" },
];

/* ========== 下拉菜单组件 ========== */

/**
 * 桌面端下拉菜单 — 企业级网格宫格设计
 */
function DropdownMenu({
  label,
  dropdownTitle,
  children,
}: {
  label: string;
  dropdownTitle?: string;
  children: SubNavItem[];
}) {
  /** 根据子项数量决定列数 */
  const cols = children.length <= 2 ? 2 : 3;

  return (
    <div className="group relative">
      {/* 触发按钮 */}
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-base font-medium tracking-wide text-slate-600 transition-all duration-200 group-hover:bg-slate-100 group-hover:text-blue-700"
      >
        {label}
        <ChevronDown className="size-3.5 text-slate-400 transition-transform duration-300 group-hover:rotate-180 group-hover:text-blue-500" />
      </button>

      {/* 下拉面板 */}
      <div className="invisible absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
        {/* 角标箭头指示器 */}
        <div className="absolute left-1/2 top-0.5 -translate-x-1/2">
          <div className="size-3 rotate-45 border-l border-t border-slate-200/60 bg-white" />
        </div>

        <div className="overflow-hidden rounded-md border border-slate-200/60 bg-white">
          {/* 标题行 */}
          {dropdownTitle && (
            <div className="border-b border-slate-100 px-5 py-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                {dropdownTitle}
              </span>
            </div>
          )}

          {/* 宫格子项 */}
          <div
            className={`grid gap-1.5 p-3`}
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(220px, 1fr))` }}
          >
            {children.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group/item flex items-start gap-4 rounded-md px-4 py-3 transition-all duration-200 hover:bg-slate-50"
              >
                {/* 图标 */}
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${item.iconColor || "text-slate-600 bg-slate-100"}`}
                >
                  <item.icon className="size-5" />
                </div>

                {/* 文字 */}
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-slate-700 transition-colors group-hover/item:text-blue-700">
                      {item.label}
                    </span>
                    <ArrowRight className="size-3 shrink-0 -translate-x-1 text-blue-400 opacity-0 transition-all duration-200 group-hover/item:translate-x-0 group-hover/item:opacity-100" />
                  </div>
                  {item.desc && (
                    <span className="text-xs leading-relaxed text-slate-400">
                      {item.desc}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 移动端下拉菜单（点击展开/折叠，含图标）
 */
function MobileDropdownMenu({
  label,
  children,
  onClose,
}: {
  label: string;
  children: SubNavItem[];
  onClose: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
      >
        <span className="flex items-center gap-2">
          <BadgeCheck className="size-4 text-blue-500" />
          {label}
        </span>
        <ChevronDown
          className={`size-4 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="mb-1 ml-3 border-l-2 border-blue-100 py-1 pl-3">
          {children.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50"
            >
              <item.icon className="size-4 shrink-0 text-slate-400" />
              <div>
                <div className="font-medium">{item.label}</div>
                {item.desc && (
                  <div className="text-xs text-slate-400">{item.desc}</div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* ========== 顶部导航栏 ========== */

/** 页面顶部导航栏组件（含二级网格宫格菜单） */
export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  /** 点击外部关闭移动端菜单 */
  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(e.target as Node)
      ) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [mobileOpen]);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl"
    >
      <div
        className={containerClass("flex h-16 items-center justify-between")}
        style={SITE_WIDTH_STYLE}
      >
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md shadow-blue-600/25">
            <Signal className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold leading-none tracking-tight text-slate-800">
              流量派
            </span>
            <span className="mt-0.5 text-[10px] font-medium leading-none uppercase tracking-widest text-slate-400">
              全国正规号卡
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            if (item.children) {
              return (
                <DropdownMenu
                  key={item.label}
                  label={item.label}
                  dropdownTitle={item.dropdownTitle}
                >
                  {item.children}
                </DropdownMenu>
              );
            }
            return (
              <Link
                key={item.label}
                href={item.href!}
                className="rounded-lg px-3 py-2 text-base font-medium tracking-wide text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-blue-700"
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA + Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 登入按钮 */}
          <a
            href="https://haoka.lot-ml.com/login.html"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 sm:inline-flex lg:px-3.5 lg:py-2 lg:text-base"
          >
            <LogIn className="size-4" />
            登入
          </a>
          {/* 注册按钮 */}
          <a
            href="https://haoka.lot-ml.com/plugreg.html?agentid=90925"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-md bg-blue-600 px-2.5 py-1.5 text-sm font-medium text-white transition-all hover:bg-blue-700 hover:-translate-y-0.5 sm:inline-flex lg:px-3.5 lg:py-2 lg:text-base"
          >
            <UserPlus className="size-4" />
            注册
          </a>
          <button
            className="inline-flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="切换菜单"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t border-slate-200/60 bg-white px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => {
              if (item.children) {
                return (
                  <MobileDropdownMenu
                    key={item.label}
                    label={item.label}
                    children={item.children}
                    onClose={() => setMobileOpen(false)}
                  />
                );
              }
              return (
                <Link
                  key={item.label}
                  href={item.href!}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-base font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  {item.label}
                </Link>
              );
            })}
            <Button
              size="sm"
              className="mt-2 w-full rounded-full bg-gradient-to-r from-blue-600 to-blue-700 font-semibold text-white shadow-md hover:from-blue-700 hover:to-blue-800"
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
