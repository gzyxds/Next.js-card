/** 172号卡平台配置 - 敏感信息从环境变量读取 */
const HAOKA_CONFIG = {
  baseUrl: 'https://haokaopenapi.lot-ml.com',
  userId: process.env.HAOKA_USER_ID || '',
  secret: process.env.HAOKA_SECRET || '',
  agentId: process.env.HAOKA_AGENT_ID || '',
  h5BaseUrl: 'https://h5.lot-ml.com',
  detailBaseUrl: 'https://172.lot-ml.com',
  /** 172号卡订单办理页基础域名 */
  orderBaseUrl: 'https://haokawx.lot-ml.com',
  /** 172号卡统一办理入口（首页，兜底用） */
  orderPageUrl: 'https://haokawx.lot-ml.com/ProductEn/Index/1a654e0b341cadd2',
};

/** productID → pudID 静态映射表（由 scripts/scrape-pudid.cjs 构建时生成） */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

let pudidMap: Record<string, string> = {};
try {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  pudidMap = JSON.parse(readFileSync(join(__dirname, '..', 'data', 'pudid-map.json'), 'utf-8'));
} catch {
  console.warn('[WARN] pudid-map.json 未找到，请先运行: npm run scrape:pudid');
}

import { createHash } from 'node:crypto';

function md5(str: string): string {
  return createHash('md5').update(str).digest('hex');
}

function generateSign(params: Record<string, string>): string {
  const sortedKeys = Object.keys(params).sort();
  const signStr = sortedKeys.map((k) => `${k}=${params[k]}`).join('&') + HAOKA_CONFIG.secret;
  return md5(signStr);
}

export interface HaokaProduct {
  productID: number;
  productName: string;
  mainPic: string;
  area: string;
  disableArea: string;
  littlepicture: string;
  netAddr: string;
  flag: boolean;
  numberSel: number;
  operator: string;
  rule: string;
  taocan: string;
  backMoneyType: string;
  age1: number;
  age2: number;
  priceTime: string;
  skus: SkuItem[] | null;
}

export interface SkuItem {
  SkuID: number;
  SkuName: string;
  Desc: string;
}

export interface HaokaResponse {
  data: HaokaProduct[];
  code: number;
  message: string;
}

/** 模块级缓存，避免构建时多次调用API触发频率限制 */
let _productsCache: HaokaProduct[] | null = null;

/** 获取好卡平台商品列表（带缓存） */
export async function fetchProducts(productID: string = ''): Promise<HaokaProduct[]> {
  /** 如果请求全部商品且缓存存在，直接返回缓存 */
  if (!productID && _productsCache) {
    return _productsCache;
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const params = { ProductID: productID, Timestamp: timestamp, user_id: HAOKA_CONFIG.userId };
  const user_sign = generateSign(params);
  const body = new URLSearchParams({
    user_id: HAOKA_CONFIG.userId,
    Timestamp: timestamp,
    ProductID: productID,
    user_sign,
  });

  const response = await fetch(`${HAOKA_CONFIG.baseUrl}/api/order/GetProductsV2`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  const json: HaokaResponse = await response.json();

  if (json.code !== 0) {
    console.error('Haoka API Error:', json.message);
    return [];
  }

  const data = json.data || [];

  /** 缓存全部商品数据 */
  if (!productID && data.length > 0) {
    _productsCache = data;
  }

  return data;
}

/** 获取办理URL（统一办理入口） */
export function getProductOrderUrl(): string {
  return HAOKA_CONFIG.orderPageUrl;
}

/** 获取代理主页URL（统一办理入口） */
export function getAgentHomePage(): string {
  return HAOKA_CONFIG.orderPageUrl;
}

/**
 * 获取172号卡商品专属办理页URL
 * 通过静态映射表（由构建脚本从店铺页抓取）将 productID 映射为 pudID
 * 
 * @param _pudID - 保留参数（兼容旧接口），实际不使用
 * @param _netAddr - 保留参数（兼容旧接口），实际不使用  
 * @param productId - 商品ID，用于查找映射表
 * @returns 办理页URL，格式: https://haokawx.lot-ml.com/h5orderEn/index?pudID=xxx&userid=xxx
 */
export function getOrderPageUrl(_pudID: string | undefined, _netAddr: string, productId: string | number): string {
  const buildUrl = (id: string) =>
    `${HAOKA_CONFIG.orderBaseUrl}/h5orderEn/index?pudID=${id}&userid=${HAOKA_CONFIG.agentId}`;

  /** 从映射表查找 pudID */
  const mappedPudID = (pudidMap as Record<string, string>)[String(productId)];
  if (mappedPudID) {
    return buildUrl(mappedPudID);
  }

  /** 兜底：映射表中无此商品时，返回172号卡首页 */
  return HAOKA_CONFIG.orderPageUrl;
}

export function getProductDetailUrl(netAddr: string, productId: string | number): string {
  if (netAddr && netAddr.startsWith('http')) {
    const url = new URL(netAddr);
    url.searchParams.set('userid', HAOKA_CONFIG.agentId);
    return url.toString();
  }
  return `${HAOKA_CONFIG.detailBaseUrl}/PackInfo/Detail/${productId}?userid=${HAOKA_CONFIG.agentId}`;
}

export interface PickNumberResult {
  type: string;
  number: string;
  numberId: string;
  numberPoolId: string;
}

export interface PickNumberResponse {
  data: PickNumberResult[];
  code: number;
  message: string;
  errs: null | string[];
}

export async function pickNumbers(
  prodID: string,
  options?: { province?: string; city?: string; searchValue?: string }
): Promise<PickNumberResult[]> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const province = options?.province || '';
  const city = options?.city || '';
  const searchValue = options?.searchValue || '';

  const signStr =
    `city=${city}&prodID=${prodID}&province=${province}&searchCategory=3&searchValue=${searchValue}&Timestamp=${timestamp}&user_id=${HAOKA_CONFIG.userId}${HAOKA_CONFIG.secret}`;
  const user_sign = md5(signStr);

  const body = new URLSearchParams({
    user_id: HAOKA_CONFIG.userId,
    Timestamp: timestamp,
    prodID,
    ...(province && { province }),
    ...(city && { city }),
    ...(searchValue && { searchValue }),
    user_sign,
  });

  console.log('PickNumber Request:', {
    url: `${HAOKA_CONFIG.baseUrl}/api/order/PickNumber`,
    params: Object.fromEntries(body),
    signStr,
  });

  try {
    const response = await fetch(`${HAOKA_CONFIG.baseUrl}/api/order/PickNumber`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    const json: PickNumberResponse = await response.json();

    if (json.code !== 0) {
      console.error('PickNumber API Error:', json.message);
      return [];
    }

    return json.data || [];
  } catch (error) {
    console.error('PickNetwork Error:', error);
    return [];
  }
}

export interface OrderParams {
  Name: string;
  Phone: string;
  IDCard: string;
  Province: string;
  City: string;
  Area: string;
  Address: string;
  ProductID: number | string;
  DownOrderID: string;
  ThirdPhone?: string;
  NumberId?: string;
  NumberPoolId?: string;
  SkuID?: number | string;
}

export interface OrderResponse {
  code: number;
  message: string;
  errs: null | string[];
}

export async function submitOrder(orderParams: OrderParams): Promise<OrderResponse> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const thirdPhone = orderParams.ThirdPhone || '';

  const signStr =
    `Address=${orderParams.Address}&Area=${orderParams.Area}&City=${orderParams.City}&DownOrderID=${orderParams.DownOrderID}&IDCard=${orderParams.IDCard}&Name=${orderParams.Name}&Phone=${orderParams.Phone}&ProductID=${orderParams.ProductID}&Province=${orderParams.Province}&ThirdPhone=${thirdPhone}&Timestamp=${timestamp}&user_id=${HAOKA_CONFIG.userId}${HAOKA_CONFIG.secret}`;
  const user_sign = md5(signStr);

  const body = new URLSearchParams({
    user_id: HAOKA_CONFIG.userId,
    Timestamp: timestamp,
    Name: orderParams.Name,
    Phone: orderParams.Phone,
    IDCard: orderParams.IDCard,
    Province: orderParams.Province,
    City: orderParams.City,
    Area: orderParams.Area,
    Address: orderParams.Address,
    ProductID: String(orderParams.ProductID),
    DownOrderID: orderParams.DownOrderID,
    ThirdPhone: thirdPhone,
    ...(orderParams.NumberId && { NumberId: orderParams.NumberId }),
    ...(orderParams.NumberPoolId && { NumberPoolId: orderParams.NumberPoolId }),
    ...(orderParams.SkuID && { SkuID: String(orderParams.SkuID) }),
    user_sign,
  });

  console.log('ApiToOrder Request:', {
    url: `${HAOKA_CONFIG.baseUrl}/api/order/ApiToOrder`,
    params: Object.fromEntries(body),
    signStr,
  });

  try {
    const response = await fetch(`${HAOKA_CONFIG.baseUrl}/api/order/ApiToOrder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    const json: OrderResponse = await response.json();

    console.log('ApiToOrder Response:', json);

    if (json.code !== 0) {
      console.error('ApiToOrder Error:', json.message);
    }

    return json;
  } catch (error) {
    console.error('ApiToOrder Network Error:', error);
    return { code: -1, message: '网络错误', errs: null };
  }
}
