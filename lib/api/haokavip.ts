/**
 * 浩卡联盟 API 服务模块
 *
 * 接口文档: https://s.apifox.cn/bed9344f-d4dd-4e23-bf90-8e49e5d63005/doc-5073752
 * 加密方式: AES-256-ECB + PKCS5Padding
 * 密钥: APP_SECRET 的 UTF-8 编码前 32 字节
 * 请求参数: json_data (AES加密后的Base64字符串)
 * 响应: 纯 JSON, data 无需解密
 */
import crypto from "crypto";

/* ========== 类型定义 ========== */

/** 浩卡商品数据类型（来自实际 API 响应） */
export interface HaokaProduct {
  product_id: number;
  product_name: string;
  product_image: string;
  product_link: string;
  proxy_price: string;
  is_recommend: number;
  top_flag: number;
  [key: string]: unknown;
}

/** 运营商枚举 */
export type Operator = "mobile" | "telecom" | "unicom" | "broadcast" | "unknown";

/** API 商品列表响应结构 */
interface ProductListResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    items: HaokaProduct[];
    pageInfo: {
      total: number;
      currentPage: number;
      totalPage: number;
    };
  };
}

/* ========== 加密工具 ========== */

/**
 * 派生 AES-256 密钥
 * 使用 APP_SECRET 的 UTF-8 编码的前 32 字节作为密钥
 */
function deriveKey(secret: string): Buffer {
  return Buffer.from(secret, "utf8").subarray(0, 32);
}

/**
 * AES-256-ECB 加密
 * @param data - 要加密的 JSON 可序列化数据
 * @param secret - APP_SECRET
 * @returns Base64 编码的加密字符串
 */
function encrypt(data: unknown, secret: string): string {
  const key = deriveKey(secret);
  const jsonStr = JSON.stringify(data);
  const cipher = crypto.createCipheriv("aes-256-ecb", key, null);
  let encrypted = cipher.update(jsonStr, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
}

/**
 * AES-256-ECB 解密
 * @param encryptedBase64 - Base64 编码的加密数据
 * @param secret - APP_SECRET
 * @returns 解密后的 JSON 对象
 */
function decrypt<T = unknown>(encryptedBase64: string, secret: string): T {
  const key = deriveKey(secret);
  const decipher = crypto.createDecipheriv("aes-256-ecb", key, null);
  let decrypted = decipher.update(encryptedBase64, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return JSON.parse(decrypted) as T;
}

/* ========== 商品数据接口 ========== */

/** 分页大小（API 限制最大 20） */
const PAGE_SIZE = 20;

/**
 * 请求单页商品
 * @param appId APP_ID
 * @param appSecret APP_SECRET
 * @param page 页码（从 1 开始）
 */
async function fetchHaokaPage(
  appId: string,
  appSecret: string,
  page: number,
): Promise<ProductListResponse> {
  const encryptedData = encrypt({ page, page_size: PAGE_SIZE }, appSecret);

  const response = await fetch("https://api.haokavip.com/open/api/product", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ app_id: appId, json_data: encryptedData }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`浩卡API请求失败: HTTP ${response.status}`);
  }

  const result = (await response.json()) as ProductListResponse;

  if (!result.success) {
    throw new Error(`浩卡API错误: ${result.message || "未知错误"}`);
  }

  return result;
}

/**
 * 获取全部在线商品列表（自动分页获取所有页）
 * POST /open/api/product
 *
 * 请求体: { app_id, json_data: AES加密后的Base64字符串 }
 * 其中 json_data 加密前为: { page, page_size }
 */
export async function fetchHaokaProducts(): Promise<{
  products: HaokaProduct[];
  total: number;
}> {
  const appId = process.env.HAOKAVIP_APP_ID;
  const appSecret = process.env.HAOKAVIP_APP_SECRET;

  if (!appId || !appSecret) {
    throw new Error("浩卡联盟 API 未配置 (HAOKAVIP_APP_ID / HAOKAVIP_APP_SECRET)");
  }

  // 先请求第 1 页，获取总页数
  const firstPage = await fetchHaokaPage(appId, appSecret, 1);
  const totalPage = firstPage.data?.pageInfo?.totalPage || 1;
  const allItems = [...(firstPage.data?.items || [])];

  // 如果有多页，并发请求剩余页
  if (totalPage > 1) {
    const remainingPages: Promise<ProductListResponse>[] = [];
    for (let p = 2; p <= totalPage; p++) {
      remainingPages.push(fetchHaokaPage(appId, appSecret, p));
    }
    const restResults = await Promise.all(remainingPages);
    for (const res of restResults) {
      allItems.push(...(res.data?.items || []));
    }
  }

  return {
    products: allItems,
    total: firstPage.data?.pageInfo?.total || allItems.length,
  };
}

/* ========== 运营商工具函数 ========== */

/**
 * 根据商品名称推断运营商
 */
export function mapOperator(productName: string): Operator {
  const name = productName || "";
  if (/移动|mobile/i.test(name)) return "mobile";
  if (/电信|telecom/i.test(name)) return "telecom";
  if (/联通|unicom/i.test(name)) return "unicom";
  if (/广电|broadcast/i.test(name)) return "broadcast";
  return "unknown";
}

/** 运营商中文标签 */
export const OPERATOR_LABEL: Record<Operator, string> = {
  mobile: "中国移动",
  telecom: "中国电信",
  unicom: "中国联通",
  broadcast: "中国广电",
  unknown: "其他",
};

/** 运营商配置（颜色、图标） */
/* ========== 商品名称解析函数 ========== */

/** 归属地/可发地区类型 */
export type LocationType = "全国" | "随机归属地" | "收货地即归属地" | string;

/**
 * 从商品名称提取归属地信息
 * @returns { location, shipping }
 *   - location: 归属地标签（随机归属地 / 收货地即归属地 / 具体省份）
 *   - shipping: 可发地区（全国 / 具体省份 / 多省）
 */
export function parseLocation(name: string): { location: LocationType; shipping: string } {
  // 【发全国】→ 全国可发
  if (/发全国/.test(name)) {
    return { location: "随机归属地", shipping: "全国" };
  }
  // 【只发XX】→ 仅发特定省
  const onlyMatch = name.match(/只发([\u4e00-\u9fa5]{1,4})/);
  if (onlyMatch) {
    return { location: onlyMatch[1], shipping: onlyMatch[1] };
  }
  return { location: "收货地即归属地", shipping: "全国" };
}

/** 套餐时长类型 */
export type DurationType = "短期" | "1年" | "2年" | "长期" | "未知";

/**
 * 从商品名称提取套餐时长
 */
export function parseDuration(name: string): DurationType {
  if (/长期/.test(name)) return "长期";
  if (/2年|24个月|24月/.test(name)) return "2年";
  if (/1年|12个月|12月/.test(name)) return "1年";
  if (/短期|短期套餐/.test(name)) return "短期";
  return "未知";
}

/** 生成商品标签列表 */
export function parseTags(name: string): { text: string; className: string }[] {
  const tags: { text: string; className: string }[] = [];

  // 归属地标签
  const { location } = parseLocation(name);
  tags.push({
    text: location,
    className: "bg-green-50 text-green-600 border-green-100",
  });

  // 流量标签
  const flow = name.match(/\d+(?:\.\d+)?\s*(?:GB|G)/i);
  if (flow) {
    tags.push({
      text: flow[0],
      className: "bg-blue-50 text-blue-600 border-blue-100",
    });
  }

  // 语音标签
  if (/\d+\s*分钟/.test(name)) {
    tags.push({
      text: "含通话",
      className: "bg-purple-50 text-purple-600 border-purple-100",
    });
  }

  // 配送标签
  if (/京东/.test(name)) {
    tags.push({ text: "京东快递", className: "bg-orange-50 text-orange-600 border-orange-100" });
  } else {
    tags.push({ text: "免费包邮", className: "bg-orange-50 text-orange-600 border-orange-100" });
  }

  // 首月免租
  if (/免租|免月/.test(name)) {
    tags.push({ text: "首月免租", className: "bg-red-50 text-red-500 border-red-100" });
  }

  // 激活方式
  if (/自主激活/.test(name)) {
    tags.push({ text: "自主激活", className: "bg-cyan-50 text-cyan-600 border-cyan-100" });
  } else if (/快递激活/.test(name)) {
    tags.push({ text: "快递激活", className: "bg-cyan-50 text-cyan-600 border-cyan-100" });
  }

  // 先激活后发货
  if (/先激活/.test(name)) {
    tags.push({ text: "先激活后发货", className: "bg-yellow-50 text-yellow-600 border-yellow-100" });
  }

  // 套餐时长
  const dur = parseDuration(name);
  if (dur !== "未知") {
    tags.push({ text: dur, className: "bg-teal-50 text-teal-600 border-teal-100" });
  }

  // 年龄限制
  const ageMatch = name.match(/年龄(\d+)-(\d+)/);
  if (ageMatch) {
    tags.push({
      text: `${ageMatch[1]}-${ageMatch[2]}岁`,
      className: "bg-gray-50 text-gray-500 border-gray-100",
    });
  }

  return tags;
}

export const OPERATOR_CONFIG: Record<
  Operator,
  { label: string; color: string; border: string; bg: string; text: string }
> = {
  mobile: {
    label: "中国移动",
    color: "green",
    border: "hover:border-green-400",
    bg: "hover:bg-green-50 dark:hover:bg-green-500/5",
    text: "text-green-600 dark:text-green-400",
  },
  telecom: {
    label: "中国电信",
    color: "blue",
    border: "hover:border-blue-400",
    bg: "hover:bg-blue-50 dark:hover:bg-blue-500/5",
    text: "text-blue-600 dark:text-blue-400",
  },
  unicom: {
    label: "中国联通",
    color: "orange",
    border: "hover:border-orange-400",
    bg: "hover:bg-orange-50 dark:hover:bg-orange-500/5",
    text: "text-orange-600 dark:text-orange-400",
  },
  broadcast: {
    label: "中国广电",
    color: "purple",
    border: "hover:border-purple-400",
    bg: "hover:bg-purple-50 dark:hover:bg-purple-500/5",
    text: "text-purple-600 dark:text-purple-400",
  },
  unknown: {
    label: "其他",
    color: "gray",
    border: "hover:border-gray-400",
    bg: "hover:bg-gray-50 dark:hover:bg-gray-500/5",
    text: "text-gray-600 dark:text-gray-400",
  },
};
