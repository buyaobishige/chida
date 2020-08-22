import { message } from "./utils/message";
import { startup } from "./utils/app";
/** 菜品详情 */
export interface FoodDetail {
  /** 唯一 ID */
  id: number;
  /** 菜品名称 */
  name: string;
  /** 菜品描述 */
  desc: string;
  /** 菜品价格 */
  price: number;
  /** 所在地点 */
  locate: string;
  /** 对应档口 */
  stall: string;
  /** 图片地址 */
  src: string;
  /** 评分，范围 0~5 */
  score: number;
  /** 标签 */
  tags: string[];
}

/** 全局数据 */
export interface GlobalData {
  /** 用户的标识符 */
  openid: string;
  /** 用户收藏夹是否请求完成 */
  favorRequest: boolean;
  /** 用户收藏夹 */
  favorList: FoodDetail[];
  /** 收藏夹 ID 列表 */
  favorIDList: number[];

  /** 食物列表 */
  foodList: FoodDetail[];

  /** 设备信息 */
  info: WechatMiniprogram.GetSystemInfoSyncResult;

  /** 系统环境 */
  env: "wx" | "qq";

  /** 摇骰子的历史记录 */
  history: FoodDetail[];

  /** FIXME: What's it and what's it's type */
  currentRemarkArr: any[];
}

/** App 配置 */
export interface AppOption {
  /** 小程序的全局数据 */
  globalData: GlobalData;
  /** 初始化收藏夹 */
  getFavor(openid: string): void;
}

App<AppOption>({
  globalData: {
    openid: "",
    favorRequest: false,
    favorList: [],
    favorIDList: [],
    foodList: [],
    env: "wx",
    history: [],
    info: {} as WechatMiniprogram.GetSystemInfoSyncResult,
    currentRemarkArr: [],
  },

  onLaunch() {
    startup(this.globalData);

    // TODO: Add version code
    wx.request({
      url: "https://lin.innenu.com/test/getFoodList.php",
      method: "POST",
      success: (res) => {
        if (res.statusCode === 200)
          this.globalData.foodList = res.data as FoodDetail[];

        message.emit("foodList");
        this.getFavor(this.globalData.openid);
      },
    });
  },

  onError(errorMsg) {
    console.error("出错信息为：", errorMsg);
  },

  onPageNotFound(msg) {
    // 重定向到主界面
    wx.switchTab({ url: "page/main/main" });

    console.warn("未找到界面:", msg);
  },

  /** 获取收藏夹 */
  getFavor(openid: string) {
    wx.request({
      url: "https://lin.innenu.com/test/favor.php",
      method: "POST",
      data: { type: "get", openid },
      success: (res) => {
        if (res.statusCode === 200) {
          this.globalData.favorRequest = true;
          this.globalData.favorIDList = res.data as number[];
          this.globalData.favorList = this.globalData.favorIDList.map((id) =>
            this.globalData.foodList.find((food) => food.id === id)
          ) as FoodDetail[];

          message.emit("favor");
        }
      },
    });
  },
});
