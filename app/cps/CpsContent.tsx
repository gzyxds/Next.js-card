/**
 * 聚推客联盟 CPS 生活优惠页面 — 客户端交互组件
 *
 * 提供分类筛选、活动卡片展示、转链跳转等交互功能。
 * 用户点击活动卡片后，通过 API 获取推广链接并新窗口打开。
 */

"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import type { JutuikeActivity } from "@/lib/api/jutuike";
import { SITE_WIDTH_STYLE, containerClass } from "@/lib/layout";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import {
    Gift,
    ArrowRight,
    ExternalLink,
    AlertCircle,
    RefreshCw,
    Store,
    UtensilsCrossed,
    Car,
    Film,
    ShoppingBag,
    Coffee,
    X,
    Copy,
    Check,
    Smartphone,
} from "lucide-react";

/* ========== 类型定义 ========== */

interface CpsContentProps {
    /** 全量活动列表 */
    activities: JutuikeActivity[];
    /** 需要展示的分类 key 列表 */
    targetCategories: string[];
    /** 错误信息 */
    error: string | null;
}

/** 分类显示配置 */
interface CategoryConfig {
    label: string;
    icon: React.ElementType;
    color: string;
}

/* ========== 分类配置 ========== */

/** 分类对应的图标和颜色映射 */
const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
    all: { label: "全部", icon: Gift, color: "text-slate-600 bg-slate-100" },
    "美团": { label: "美团", icon: Store, color: "text-yellow-600 bg-yellow-50" },
    "饿了么": { label: "饿了么", icon: UtensilsCrossed, color: "text-blue-600 bg-blue-50" },
    "打车出行": { label: "出行", icon: Car, color: "text-green-600 bg-green-50" },
    "连锁餐饮": { label: "连锁餐饮", icon: Coffee, color: "text-orange-600 bg-orange-50" },
    "电影票": { label: "电影", icon: Film, color: "text-purple-600 bg-purple-50" },
    "本地生活": { label: "生活服务", icon: Gift, color: "text-teal-600 bg-teal-50" },
    "电商": { label: "电商", icon: ShoppingBag, color: "text-rose-600 bg-rose-50" },
};

/* ========== 工具函数 ========== */

/** 获取分类显示配置，未知分类返回默认样式 */
function getCategoryConfig(key: string): CategoryConfig {
    return CATEGORY_CONFIG[key] || { label: key, icon: Gift, color: "text-slate-600 bg-slate-100" };
}

/* ========== 子组件 ========== */

/**
 * 错误页面
 */
function ErrorPage({ message }: { message: string }) {
    return (
        <div className="flex min-h-screen flex-col bg-[#f5f7fa]">
            <Header />
            <main className="flex flex-1 items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="mx-auto mb-4 size-12 text-red-300" />
                    <h2 className="mb-1 text-lg font-semibold text-gray-700">优惠加载失败</h2>
                    <p className="text-sm text-gray-400">{message}</p>
                </div>
            </main>
            <Footer />
        </div>
    );
}

/**
 * 分类筛选标签栏
 * 水平滚动的药丸标签，选中后高亮
 */
function CategoryTabs({
    categories,
    active,
    onChange,
    counts,
}: {
    categories: { key: string; label: string }[];
    active: string;
    onChange: (k: string) => void;
    counts: Record<string, number>;
}) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
                const isActive = active === cat.key;
                const config = getCategoryConfig(cat.key);
                const count = counts[cat.key];

                return (
                    <button
                        key={cat.key}
                        type="button"
                        onClick={() => onChange(cat.key)}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${isActive
                            ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/20"
                            : "border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                            }`}
                    >
                        <config.icon className="size-4" />
                        {config.label}
                        {count !== undefined && (
                            <span
                                className={`ml-0.5 text-xs ${isActive ? "text-white/70" : "text-gray-400"}`}
                            >
                                {count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}

/**
 * 活动卡片
 * 展示活动图标、名称、描述，点击获取推广链接
 */
function ActivityCard({
    activity,
    onOpen,
    loadingId,
}: {
    activity: JutuikeActivity;
    onOpen: (actId: number) => void;
    loadingId: number | null;
}) {
    const isLoading = loadingId === activity.act_id;
    const catConfig = getCategoryConfig(activity.cate_name || "");

    return (
        <div className="group flex flex-col rounded-lg border border-gray-200/60 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-md sm:p-5">
            {/* ===== 图标 + 分类标签 ===== */}
            <div className="mb-3 flex items-start justify-between">
                {/* 活动图标 */}
                <div className="flex size-12 items-center justify-center overflow-hidden rounded-lg bg-gray-50 sm:size-14">
                    {activity.icon ? (
                        <img
                            src={activity.icon}
                            alt={activity.act_name}
                            className="size-10 object-contain sm:size-12"
                            loading="lazy"
                        />
                    ) : (
                        <Gift className="size-6 text-gray-300" />
                    )}
                </div>

                {/* 分类徽章 */}
                {activity.cate_name && (
                    <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${catConfig.color}`}
                    >
                        <catConfig.icon className="size-3" />
                        {catConfig.label}
                    </span>
                )}
            </div>

            {/* ===== 活动名称 ===== */}
            <h3 className="mb-1.5 line-clamp-2 text-sm font-semibold leading-snug text-gray-900">
                {activity.act_name}
            </h3>

            {/* ===== 活动描述 ===== */}
            <p className="mb-3 flex-1 line-clamp-2 text-xs leading-relaxed text-gray-500">
                {activity.desc || "暂无描述"}
            </p>

            {/* ===== 操作按钮 ===== */}
            <button
                type="button"
                onClick={() => onOpen(activity.act_id)}
                disabled={isLoading}
                className={`flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all duration-300 ${isLoading
                    ? "cursor-not-allowed bg-gray-100 text-gray-400"
                    : "border border-gray-300 bg-white text-gray-700 shadow-sm hover:border-gray-400 hover:bg-gray-50 hover:shadow"
                    }`}
            >
                {isLoading ? (
                    <>
                        <RefreshCw className="size-4 animate-spin" />
                        获取中...
                    </>
                ) : (
                    <>
                        立即参与
                        <ExternalLink className="size-3.5" />
                    </>
                )}
            </button>
        </div>
    );
}

/* ========== 链接弹窗（桌面端展示二维码） ========== */

/** 弹窗中的链接数据 */
interface LinkModalData {
    /** 活动名称 */
    actName: string;
    /** 推广链接 */
    url: string;
}

/**
 * 桌面端链接弹窗
 *
 * 聚推客联盟的推广链接主要为移动端（微信小程序/H5）设计，
 * PC 端直接打开体验较差。因此桌面端显示二维码 + 复制链接，
 * 引导用户用手机扫码或复制链接到手机浏览器打开。
 */
function LinkModal({
    data,
    onClose,
}: {
    data: LinkModalData;
    onClose: () => void;
}) {
    const [copied, setCopied] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    /** 点击遮罩关闭 */
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    /** ESC 关闭 */
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [onClose]);

    /** 复制链接到剪贴板 */
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(data.url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback: 选中文本
            const input = document.createElement("input");
            input.value = data.url;
            document.body.appendChild(input);
            input.select();
            document.execCommand("copy");
            document.body.removeChild(input);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    /** 生成二维码图片 URL（使用免费 qrserver API） */
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data.url)}`;

    return (
        /* ===== 遮罩层 ===== */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={handleBackdropClick}
        >
            {/* ===== 弹窗卡片 ===== */}
            <div
                ref={modalRef}
                className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
                {/* 关闭按钮 */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-3 top-3 z-10 rounded-full p-1.5 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600"
                >
                    <X className="size-5" />
                </button>

                {/* ===== 头部 ===== */}
                <div className="bg-gradient-to-r from-blue-400 to-indigo-400 px-6 py-8 text-center">
                    <Smartphone className="mx-auto mb-3 size-10 text-white/80" />
                    <h3 className="mb-1 text-lg font-bold text-white">请使用手机参与</h3>
                    <p className="text-sm text-blue-100">
                        该活动仅支持手机端，请扫码或复制链接
                    </p>
                </div>

                {/* ===== 内容区 ===== */}
                <div className="px-6 py-6">
                    {/* 活动名称 */}
                    <p className="mb-4 text-center text-sm font-medium text-gray-700">
                        {data.actName}
                    </p>

                    {/* 二维码 */}
                    <div className="mb-4 flex justify-center">
                        <div className="rounded-xl border-2 border-gray-100 p-3">
                            <img
                                src={qrUrl}
                                alt="扫码参与活动"
                                className="size-44"
                            />
                        </div>
                    </div>

                    {/* 提示 */}
                    <p className="mb-4 text-center text-xs text-gray-400">
                        使用手机摄像头扫码，或复制下方链接在手机浏览器打开
                    </p>

                    {/* 链接 + 复制按钮 */}
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            readOnly
                            value={data.url}
                            className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs text-gray-600 outline-none"
                            onFocus={(e) => e.target.select()}
                        />
                        <button
                            type="button"
                            onClick={handleCopy}
                            className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${copied
                                ? "bg-green-500 text-white"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                        >
                            {copied ? (
                                <>
                                    <Check className="size-4" />
                                    已复制
                                </>
                            ) : (
                                <>
                                    <Copy className="size-4" />
                                    复制
                                </>
                            )}
                        </button>
                    </div>

                    {/* 如果用户在手机上，仍然可以点击打开 */}
                    <a
                        href={data.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-500 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                    >
                        在浏览器中打开
                        <ExternalLink className="size-3.5" />
                    </a>
                </div>
            </div>
        </div>
    );
}

/* ========== 主入口 ========== */

export default function CpsContent({
    activities,
    targetCategories,
    error,
}: CpsContentProps) {
    const [activeCategory, setActiveCategory] = useState("all");
    const [loadingId, setLoadingId] = useState<number | null>(null);
    /** 桌面端二维码弹窗数据 */
    const [modalData, setModalData] = useState<LinkModalData | null>(null);
    /** 是否为桌面端（宽度 >= 768px） */
    const [isDesktop, setIsDesktop] = useState(false);

    /* ===== 检测设备类型 ===== */
    useEffect(() => {
        const check = () => setIsDesktop(window.innerWidth >= 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    /* ===== 计算分类数据 ===== */
    const { filteredActivities, categoryCounts, displayCategories } = useMemo(() => {
        // 各分类活动数量
        const counts: Record<string, number> = { all: activities.length };
        for (const cat of targetCategories) {
            counts[cat] = activities.filter((a) => a.cate_name === cat).length;
        }

        // 筛选项（只显示有活动的分类）
        const cats = [
            { key: "all", label: "全部" },
            ...targetCategories
                .filter((k) => counts[k] > 0)
                .map((k) => ({ key: k, label: getCategoryConfig(k).label })),
        ];

        // 当前筛选结果
        const filtered =
            activeCategory === "all"
                ? activities
                : activities.filter((a) => a.cate_name === activeCategory);

        return { filteredActivities: filtered, categoryCounts: counts, displayCategories: cats };
    }, [activities, targetCategories, activeCategory]);

    /**
     * 点击参与：获取推广链接
     * - 桌面端（>=768px）：弹出二维码弹窗
     * - 移动端：直接新窗口打开
     */
    const handleOpen = useCallback(
        async (actId: number) => {
            /* ===== 根据 act_id 找到对应活动，获取名称 ===== */
            const act = activities.find((a) => a.act_id === actId);
            const actName = act?.act_name || "优惠活动";

            setLoadingId(actId);
            try {
                const response = await fetch(`/api/cps-link?act_id=${actId}`);
                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || "获取链接失败");
                }

                const data = await response.json();

                // 优先使用 H5 链接，其次长链接
                const link = data.h5 || data.long_h5;
                if (!link) {
                    throw new Error("该活动暂无可用的推广链接");
                }

                /* ===== 桌面端：弹二维码 / 移动端：直接打开 ===== */
                if (isDesktop) {
                    // 桌面端 → 弹出二维码弹窗
                    setModalData({ actName, url: link });
                } else {
                    // 移动端 → 直接打开
                    window.open(link, "_blank", "noopener,noreferrer");
                }
            } catch (e) {
                const msg = e instanceof Error ? e.message : "未知错误";
                alert(`跳转失败: ${msg}`);
            } finally {
                setLoadingId(null);
            }
        },
        [activities, isDesktop],
    );

    /* ===== 错误状态 ===== */
    if (error) return <ErrorPage message={error} />;

    return (
        <div className="min-h-screen bg-[#f5f7fa]">
            <Header />

            {/* ===== Hero Banner ===== */}
            <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 py-14 md:py-18">
                <div className={containerClass()} style={SITE_WIDTH_STYLE}>
                    <div className="mx-auto max-w-2xl text-center">
                        {/* 标签 */}
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-blue-100 backdrop-blur-sm">
                            <Gift className="size-4" />
                            聚推客联盟 · CPS 优惠聚合
                        </div>

                        {/* 标题 */}
                        <h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl">
                            生活优惠
                        </h1>

                        {/* 描述 */}
                        <p className="mx-auto max-w-lg text-sm text-blue-100 sm:text-base">
                            外卖红包、打车券、电影票折扣、电商返利一站式聚合，省钱更省心
                        </p>
                    </div>
                </div>
            </section>

            <main>
                {/* ===== 分类筛选栏 ===== */}
                <section className={containerClass("py-6")} style={SITE_WIDTH_STYLE}>
                    <div className="rounded-lg bg-white p-4 shadow-sm">
                        <CategoryTabs
                            categories={displayCategories}
                            active={activeCategory}
                            onChange={setActiveCategory}
                            counts={categoryCounts}
                        />
                    </div>
                </section>

                {/* ===== 活动卡片网格 ===== */}
                <section className={containerClass("pb-16")} style={SITE_WIDTH_STYLE}>
                    {filteredActivities.length === 0 ? (
                        /* 空状态 */
                        <div className="flex flex-col items-center py-20 text-center">
                            <Gift className="mb-4 size-12 text-gray-300" />
                            <p className="text-base font-medium text-gray-500">暂无该分类的优惠活动</p>
                            <p className="mt-1 text-sm text-gray-400">请尝试切换其他分类</p>
                        </div>
                    ) : (
                        <>
                            {/* 结果计数 */}
                            <p className="mb-4 text-xs text-gray-400">
                                共 {filteredActivities.length} 项活动
                            </p>

                            {/* 卡片网格 */}
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {filteredActivities.map((act) => (
                                    <ActivityCard
                                        key={act.act_id}
                                        activity={act}
                                        onOpen={handleOpen}
                                        loadingId={loadingId}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </section>

                {/* ===== 底部 CTA ===== */}
                <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-12">
                    <div className="mx-auto max-w-2xl px-4 text-center">
                        <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl">
                            更多优惠，尽在流量派
                        </h2>
                        <p className="mb-6 text-sm text-blue-100 sm:text-base">
                            海量号卡套餐 + 生活优惠，一站式推广赚钱
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <a
                                href="/haoka"
                                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-blue-600 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
                            >
                                查看号卡套餐
                                <ArrowRight className="size-4" />
                            </a>
                            <a
                                href="/join"
                                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white transition-all hover:border-white hover:bg-white/10"
                            >
                                加入代理
                                <ArrowRight className="size-4" />
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            {/* ===== 桌面端二维码弹窗 ===== */}
            {modalData && (
                <LinkModal data={modalData} onClose={() => setModalData(null)} />
            )}
        </div>
    );
}
