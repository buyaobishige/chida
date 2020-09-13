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
  /**是否已被添加到收藏夹 */
  liked?: boolean
}

/** 全局数据 */
export interface GlobalData {
  /** 用户的标识符 */
  openid: string;
  /** 用户收藏夹是否请求完成 */
  favorRequest: boolean;
  /** 收藏夹 ID 列表 */
  likesFoodIDList: Number[];
  /** 用户收藏夹 */
  likesFoodList: FoodDetail[];
  /**食物总列表 */
  foodList: FoodDetail[]
  /**不喜欢的食物ID */
  dislikesFoodIDList: Number[];

  /** 不喜欢的食物ID列表 */
  dislikesFoodList: FoodDetail[];

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
    likesFoodIDList: [],
    likesFoodList: [],
    dislikesFoodIDList: [],
    dislikesFoodList: [],
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
      url: "https://lin.innenu.com/server/getFoodList.php",
      method: "GET",
      success: (res) => {
        // console.log(res)
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
    const that = this;
    wx.request({
      url: "https://lin.innenu.com/server/getUser.php",
      method: "GET",
      data: { openid },
      success: (res) => {
        console.log(res)
        that.globalData.likesFoodList = []
        that.globalData.dislikesFoodList = []
        if (res.statusCode === 200) {
          that.globalData.favorRequest = true;
          console.log((res.data[0].likes))
          that.globalData.likesFoodIDList = JSON.parse(res.data[0].likes);
          that.globalData.dislikesFoodIDList = JSON.parse(res.data[0].dislikes);
          that.globalData.dislikesFoodIDList.forEach((id) => {
            that.globalData.foodList.forEach((food) => {
              if (food.id === id) {
                food.disliked = true;
                that.globalData.dislikesFoodList.push(food)
              } else {
                food.disliked = false;
              }
            })
          })
          console.log(that.globalData.likesFoodIDList)
          that.globalData.likesFoodIDList.forEach((id) => {
            that.globalData.foodList.forEach((food) => {
              if (food.id === id) {
                food.liked = true;
                that.globalData.likesFoodList.push(food)
              } 
            })
          })
          message.emit("favor");
        }
        console.log(that.globalData.likesFoodList)
      },
    });
  }
});
