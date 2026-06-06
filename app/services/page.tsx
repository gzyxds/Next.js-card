/**
 * 自助服务导航页面
 *
 * 聚合 172号卡、浩卡联盟、林夕通信等平台的常用自助服务入口，
 * 方便用户快速访问号卡办理、订单查询、代理注册等功能。
 * 纯客户端交互组件，由 ServicesContent 接管。
 */
import ServicesContent from "./ServicesContent";

export const metadata = {
    title: "自助服务",
    description:
        "流量派自助服务导航 — 聚合172号卡、浩卡联盟、林夕通信等多平台常用入口，包含号卡商城、订单查询、代理申请、运营商服务等一站式导航。",
};

export default function ServicesPage() {
    return <ServicesContent />;
}
