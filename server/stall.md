# Stall 接口

## 获取

```ts
interface GetStallOptions {
  type: 'get';
  /** 档口名称 */
  stall: string;
}

/** 菜品信息 */
interface FoodInfo {
  /** 菜品名称 */
  name: string;
  /** 菜品详情 */
  desc: string;
  /** 菜品图片 */
  src: string;
  /** 菜品价格 */
  price: number;
}

interface FoodListDetail {
  /** 类别名称 */
  name: string;
  /** 具体菜品列表 */
  content: FoodInfo[];
}

/** 档口信息 */
interface StallInfo {
  /** 档口名称 */
  name: string;
  /** 档口描述 */
  desc: string;
  /** 档口图片 */
  src: string;
  /** 档口位置 */
  locale: string;
  /** 档口联系方式 */
  contact: string;
  /** 档口标签 */
  tags: string[];
  /** 档口浏览量 */
  views: number;
  /** 档口评分 */
  rate: null;
}

interface GetStallCallback {
  info: StallInfo;
  /** 菜品列表 */
  foodList: FoodListDetail[];
}
```
