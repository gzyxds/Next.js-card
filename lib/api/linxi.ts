/**
 * 林夕通信 API 封装模块（号卡极团系统）
 * 
 * 林夕通信使用号卡极团系统开放接口，包括：
 * - 查询套餐列表（/order/api/haoteam/getlist）
 * - 获取号码（/order/api/haoteam/gethao）
 * - 提交订单（/order/api/haoteam/pushorder）
 * - 订单查询（/order/api/haoteam/haoteamquery）
 * - 照片上传（/order/api/haoteam/getimg）
 * 
 * API文档：https://console-docs.apipost.cn/preview/0c0d9f77125b886c/c2401b80a91b5a4d
 * 店铺地址：https://h5.vip12300.cn/index?k=SGpiazRLQVZSREk9
 * 
 * 认证方式：apiuser（接入账号）+ apipwd（MD5加密后的密钥）
 */

import { createHash } from 'node:crypto';

/** 林夕通信平台配置（号卡极团系统） */
const LINXI_CONFIG = {
  /** API基础地址 - 林夕通信站点地址 */
  baseUrl: process.env.LINXI_API_BASE_URL || 'https://h5.vip12300.cn',
  /** 林夕通信H5店铺首页 */
  shopUrl: 'https://h5.vip12300.cn/index?k=SGpiazRLQVZSREk9',
  /** 林夕通信H5下单页面基础URL */
  orderBaseUrl: 'https://h5.vip12300.cn/order/index',
  /** 接入账号 - 在林夕通信平台注册的账号 */
  apiUser: process.env.LINXI_API_USER || '',
  /** 接入密钥 - 原始密钥，需MD5加密后发送 */
  apiPwdRaw: process.env.LINXI_API_PWD || '',
  /** 代理ID参数（林夕通信店铺uid参数） */
  agentId: 'SGpiazRLQVZSREk9',
};

/**
 * 对字符串进行 MD5 加密
 * @param str - 待加密字符串
 * @returns 32位小写MD5哈希值
 */
function md5(str: string): string {
  return createHash('md5').update(str).digest('hex');
}

/**
 * 获取MD5加密后的API密钥
 * 号卡极团系统要求：先获取原始密钥，再进行MD5加密后传输
 * @returns MD5加密后的密钥
 */
function getApiPwd(): string {
  return md5(LINXI_CONFIG.apiPwdRaw);
}

/** 号卡极团系统商品接口类型定义 */
export interface LinxiProduct {
  /** 产品ID */
  id: string;
  /** 主图URL */
  shop_img: string;
  /** 商品名称 */
  shop_name: string;
  /** 商品描述，如"19元包50G通用+30G定向+通话0.1元/分钟" */
  shop_des: string;
  /** 商品标签，如"收货地即归属地, 考核激活充值不销户" */
  shop_tag: string;
  /** 运营商，如"中国电信" */
  shop_yys: string;
  /** 选号ID，为空则不支持选号 */
  shop_number: string;
  /** 资费详情链接 */
  shop_link: string;
  /** 商品资料介绍（HTML格式） */
  shop_rule: string;
  /** 可发货省份 */
  shop_provinces: string;
  /** 是否需要照片 0-不需要 其他-需要 */
  shop_photos: string | null;
  /** 结算周期 0-次月返 1-秒返 2-月月返 */
  shop_money: string;
  /** 创建时间 */
  s_time: string;
  /** 最小限制年龄 */
  min_age: number | null;
  /** 最大限制年龄 */
  max_age: number | null;
  /** 佣金 */
  shop_bkge: number;
  /** 序号 */
  shop_sort: string;
  /** 月月返/秒返金额 */
  first_bkge: number;
  /** 月月返共计返利月数 */
  rebate_num: string;
  /** 选号默认归属省 */
  gsd_province: string | null;
  /** 选号默认归属市 */
  gsd_city: string | null;
  /** 禁发关键词，命中其中任意一个则禁止提交 */
  Prohibited: string;
}

/**
 * 构建时内存缓存
 * 避免静态生成时对相同API的重复请求
 */
let productsCache: { data: LinxiProduct[]; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5分钟缓存有效期

/**
 * 获取商品列表
 * 构建时使用内存缓存，避免对同一API重复请求导致部署超时
 * @returns 商品列表数组
 */
export async function fetchLinxiProducts(): Promise<LinxiProduct[]> {
  // 缓存命中且未过期，直接返回
  if (productsCache && Date.now() - productsCache.timestamp < CACHE_TTL) {
    return productsCache.data;
  }

  if (!LINXI_CONFIG.apiUser || !LINXI_CONFIG.apiPwdRaw) {
    console.warn('Linxi API: apiuser或apipwd未配置，请在环境变量中设置 LINXI_API_USER 和 LINXI_API_PWD');
    return [];
  }

  const body = new URLSearchParams({
    apiuser: LINXI_CONFIG.apiUser,
    apipwd: getApiPwd(),
  });

  try {
    const response = await fetch(`${LINXI_CONFIG.baseUrl}/order/api/haoteam/getlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    const data: LinxiProduct[] = await response.json();

    if (!Array.isArray(data)) {
      console.error('Linxi API Error: 返回数据格式异常', JSON.stringify(data).substring(0, 200));
      return [];
    }

    // 写入缓存
    productsCache = { data, timestamp: Date.now() };
    console.log(`Linxi API: 成功获取 ${data.length} 个商品`);
    return data;
  } catch (error) {
    console.error('Linxi FetchProducts Error:', error);
    return [];
  }
}

/**
 * 获取店铺首页URL
 * @returns 林夕通信H5店铺地址
 */
export function getLinxiShopUrl(): string {
  return LINXI_CONFIG.shopUrl;
}

/**
 * 根据商品ID获取下单URL
 * 跳转到林夕通信H5店铺对应商品下单页面
 * URL格式：/order/index?uid=代理ID&pid=商品ID
 * @param productId - 商品ID
 * @returns 带商品ID的林夕通信下单页面URL
 */
export function getLinxiOrderUrl(productId: string | number): string {
  return `${LINXI_CONFIG.orderBaseUrl}?uid=${LINXI_CONFIG.agentId}&pid=${productId}`;
}

/**
 * 获取商品详情URL
 * 跳转到林夕通信店铺对应商品下单页面（详情页即下单页）
 * URL格式：/order/index?uid=代理ID&pid=商品ID
 * @param _netAddr - 商品资料介绍地址（号卡极团系统无此字段，保留参数兼容）
 * @param productId - 商品ID
 * @returns 商品详情/下单页面URL
 */
export function getLinxiProductDetailUrl(_netAddr: string, productId: string | number): string {
  return `${LINXI_CONFIG.orderBaseUrl}?uid=${LINXI_CONFIG.agentId}&pid=${productId}`;
}

/**
 * 获取可选号码列表
 * @param pid - 产品ID
 * @param province - 省份，如"湖南省"
 * @param city - 城市，如"长沙市"
 * @returns 可选号码数组
 */
export async function fetchLinxiNumbers(
  pid: string,
  province: string,
  city: string
): Promise<string[]> {
  if (!LINXI_CONFIG.apiUser || !LINXI_CONFIG.apiPwdRaw) {
    return [];
  }

  const body = new URLSearchParams({
    pid,
    province,
    city,
    apiuser: LINXI_CONFIG.apiUser,
    apipwd: getApiPwd(),
  });

  try {
    const response = await fetch(`${LINXI_CONFIG.baseUrl}/order/api/haoteam/gethao`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    const data = await response.json();

    if (Array.isArray(data)) {
      return data.map(String);
    }

    return [];
  } catch (error) {
    console.error('Linxi FetchNumbers Error:', error);
    return [];
  }
}

/**
 * 提交订单参数类型
 */
export interface LinxiOrderParams {
  /** 姓名 */
  order_Name: string;
  /** 手机号 */
  order_Phone: string;
  /** 身份证号 */
  order_IDCard: string;
  /** 省市区，空格隔开 */
  order_Province: string;
  /** 详细地址，不小于4个字符 */
  order_Address: string;
  /** 下游订单号，保证唯一 */
  api_xid: string;
  /** 产品ID */
  pid: string;
  /** 选中号码，不选号传空 */
  haoma?: string;
  /** 订单变动回调地址 */
  callbackurl?: string;
  /** 选号密文（选号返回时需携带） */
  checkCode?: string;
}

/**
 * 提交订单结果类型
 */
export interface LinxiOrderResult {
  /** 状态码，200表示成功 */
  code: string;
  /** 产品ID */
  pid?: string;
  /** 上游订单号 */
  apiorder?: string;
  /** 接收状态 */
  apistatus?: string;
  /** 拒绝原因 */
  reason?: string;
}

/**
 * 提交订单
 * @param params - 订单参数
 * @returns 下单结果
 */
export async function submitLinxiOrder(params: LinxiOrderParams): Promise<LinxiOrderResult> {
  if (!LINXI_CONFIG.apiUser || !LINXI_CONFIG.apiPwdRaw) {
    return { code: '-1', reason: 'API凭据未配置' };
  }

  const body = new URLSearchParams({
    ...params,
    apiuser: LINXI_CONFIG.apiUser,
    apipwd: getApiPwd(),
  } as Record<string, string>);

  try {
    const response = await fetch(`${LINXI_CONFIG.baseUrl}/order/api/haoteam/pushorder`, {
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data' },
      body: body.toString(),
    });

    const data: LinxiOrderResult = await response.json();
    return data;
  } catch (error) {
    console.error('Linxi SubmitOrder Error:', error);
    return { code: '-1', reason: '网络错误' };
  }
}

/**
 * 订单查询结果类型
 */
export interface LinxiOrderInfo {
  code: string;
  order_id: string;
  api_xid: string;
  order_status: string;
  order_Express: string;
  plan_mobile: string;
  api_reason: string;
  is_active: string;
  is_recharge: string;
  recharge_amount: string;
}

/**
 * 查询订单状态
 * @param apiSn - 上游订单号
 * @returns 订单信息
 */
export async function queryLinxiOrder(apiSn: string): Promise<LinxiOrderInfo | null> {
  if (!LINXI_CONFIG.apiUser || !LINXI_CONFIG.apiPwdRaw) {
    return null;
  }

  const body = new URLSearchParams({
    apiuser: LINXI_CONFIG.apiUser,
    apipwd: getApiPwd(),
    api_sn: apiSn,
  });

  try {
    const response = await fetch(`${LINXI_CONFIG.baseUrl}/order/api/haoteam/haoteamquery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    const data: LinxiOrderInfo = await response.json();
    return data;
  } catch (error) {
    console.error('Linxi QueryOrder Error:', error);
    return null;
  }
}

/**
 * 解析商品价格
 * 从商品描述中提取月租价格，如"19元包50G..." -> 19
 * @param des - 商品描述
 * @returns 月租价格
 */
export function parseLinxiPrice(des: string): number {
  const match = des.match(/(\d+)元/);
  return match ? parseInt(match[1], 10) : 29;
}

/**
 * 解析套餐流量
 * 从商品描述中提取通用和定向流量
 * @param des - 商品描述，如"19元包50G通用+30G定向+通话0.1元/分钟"
 * @returns 通用流量和定向流量
 */
export function parseLinxiTraffic(des: string): { general: string; directional: string } {
  const generalMatch = des.match(/(\d+)G通用/);
  const directionalMatch = des.match(/(\d+)G定向/);
  return {
    general: generalMatch ? `${generalMatch[1]}G` : '0G',
    directional: directionalMatch ? `${directionalMatch[1]}G` : '0G',
  };
}

/**
 * 解析通话分钟数
 * @param des - 商品描述
 * @returns 通话分钟数字符串
 */
export function parseLinxiMinutes(des: string): string {
  const mMatch = des.match(/通话(\d+)分钟/);
  if (mMatch) return `${mMatch[1]}分钟`;
  // 某些商品描述为"通话0.1元/分钟"
  if (des.includes('通话') && des.includes('元/分钟')) return '0分钟';
  return '0分钟';
}

/** 运营商映射配置 - 根据号卡极团系统 API shop_yys 字段返回值 */
const OPERATOR_MAP: Record<string, { key: string; label: string }> = {
  '中国移动': { key: 'mobile', label: '中国移动' },
  '移动': { key: 'mobile', label: '中国移动' },
  '中国电信': { key: 'telecom', label: '中国电信' },
  '电信': { key: 'telecom', label: '中国电信' },
  '中国联通': { key: 'unicom', label: '中国联通' },
  '联通': { key: 'unicom', label: '中国联通' },
  '中国广电': { key: 'broadcast', label: '中国广电' },
  '广电': { key: 'broadcast', label: '中国广电' },
};

/**
 * 映射运营商名称到内部标识
 * 根据号卡极团系统 API 返回的 shop_yys 字段进行匹配
 * @param op - 运营商原始名称，如"中国电信"、"中国移动"等
 * @returns 运营商标识，未匹配到返回 'unknown'
 */
export function mapLinxiOperator(op: string): 'unicom' | 'mobile' | 'telecom' | 'broadcast' | 'unknown' {
  if (!op) return 'unknown';
  const trimmed = op.trim();
  // 精确匹配
  if (OPERATOR_MAP[trimmed]) return OPERATOR_MAP[trimmed].key as 'unicom' | 'mobile' | 'telecom' | 'broadcast';
  // 模糊匹配：包含关键词
  if (trimmed.includes('联通')) return 'unicom';
  if (trimmed.includes('移动')) return 'mobile';
  if (trimmed.includes('电信')) return 'telecom';
  if (trimmed.includes('广电')) return 'broadcast';
  console.warn(`Linxi API: 未知运营商名称 "${op}"`);
  return 'unknown';
}

/**
 * 获取运营商中文名称
 * @param op - 运营商原始名称
 * @returns 运营商中文名称
 */
export function getLinxiOperatorLabel(op: string): string {
  if (!op) return '未知';
  const trimmed = op.trim();
  if (OPERATOR_MAP[trimmed]) return OPERATOR_MAP[trimmed].label;
  if (trimmed.includes('联通')) return '中国联通';
  if (trimmed.includes('移动')) return '中国移动';
  if (trimmed.includes('电信')) return '中国电信';
  if (trimmed.includes('广电')) return '中国广电';
  return '未知';
}
