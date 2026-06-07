/**
 * 站点布局常量
 *
 * 统一管理全站内容区宽度，所有页面共用同一标准。
 * 如需修改站点宽度，仅需修改 SITE_WIDTH 即可全局生效。
 */

/** 站点标准内容宽度（像素值） */
export const SITE_WIDTH = 1550;

/** 站点标准内容宽度 style 对象（用于组件内联样式） */
export const SITE_WIDTH_STYLE = { maxWidth: SITE_WIDTH } as const;

/**
 * 获取标准宽度样式 + 通用容器类
 * @param className - 额外的 Tailwind 类
 * @returns 标准容器 className
 *
 * 使用示例:
 *   <div className={containerClass()}>  ← 标准宽度容器
 *   <section className={containerClass("py-16")}>  ← 带额外类
 */
export function containerClass(extra = ""): string {
  return `mx-auto w-full px-4 md:px-6 ${extra}`.trim();
}
