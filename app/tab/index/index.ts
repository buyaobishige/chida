import { AppOption, FoodDetail } from "../../app";
import { message } from "../../utils/message";
import { tip } from "../../utils/wx";
const { globalData } = getApp<AppOption>();

Page({
  onShareAppMessage() { },
  data: {
    /** 菜品推荐 */
    recommand: [] as FoodDetail[],
    /** 是否是自定义菜品 */
    customMode: false,
    /** 是否展示弹窗 */
    popupDisplay: false,
    /** 闪烁的菜品编号 */
    shinning: 0,
    /** 骰子的值 */
    value: 0,
    /** 最终值 */
    final: 0,
    /** 状态栏高度 */
    statusBarHeight: 20,
  },

  privateData: {
    /** 上一次的结果 */
    recentValue: 0,
    /** 每日推荐 */
    recommand: [] as FoodDetail[],
    /** 用户推荐 */
    isUserRecommand: false,
  },

  onLoad() {
    this.setData({ statusBarHeight: globalData.info.statusBarHeight });

    // 获取每日推荐
    wx.request({
      url: "https://lin.innenu.com/server/getRecommend.php",
      success: (res) => {
        this.privateData.recommand = res.data as FoodDetail[];
        this.setData({ recommand: res.data as FoodDetail[] });
      },
    });
  },

  /** 生成随机数 */
  randomValue() {
    /** 随机数 */
    let rand = Math.floor(1 + Math.random() * 6);

    /** 如果与上次相同则重新摇动 */
    while (rand === this.privateData.recentValue)
      rand = Math.floor(1 + Math.random() * 6);

    this.privateData.recentValue = rand;

    return rand;
  },

  /** 开始投骰子 */
  startDice() {
    // 自定义菜品时不许摇骰子
    if (!this.data.customMode) {
      const value = this.randomValue();

      this.setData({
        value,
        final: 0,
      });

      // 延时展现按钮
      setTimeout(() => {
        this.setData({ popupDisplay: true, final: value });
      }, 1800);

      const shinningAnimation = setInterval(() => {
        if (this.data.shinning === 6) {
          clearInterval(shinningAnimation);
          this.setData({ shinning: 0 });
        } else this.setData({ shinning: this.data.shinning + 1 });
      }, 200);

      // 存入历史
      if (globalData.history.length < 3)
        globalData.history.push(this.data.recommand[value]);
      else if (globalData.history.length >= 3) {
        globalData.history.shift();
        globalData.history.push(this.data.recommand[value]);
      }
    }
  },

  /** 关闭弹窗 */
  closePopup() {
    this.setData({ popupDisplay: false });
  },

  /** 切换自定义菜品状态 */
  toggleCustomMode() {
    if (this.data.customMode) this.setData({ customMode: false });
    else if (this.privateData.isUserRecommand)
      // 用户自定义推荐已读取
      this.setData({ customMode: true });
    else {
      // 读取用户自定义推荐并显示
      const userRecommand = wx.getStorageSync("recommand");
      console.log("用户自定义推荐为:", userRecommand);
      this.setData({
        recommand: userRecommand ? userRecommand : this.data.recommand,
        customMode: true,
      });
      this.privateData.isUserRecommand = true;
    }
  },

  /** 选择自定义菜品 */
  pickRecommand({
    currentTarget: {
      dataset: { index },
    },
  }: WXEvent.Touch) {
    wx.navigateTo({
      url: `/detail/search/search?from=dice`,
    });
    // todo: 收集用户数据
    // 监听自定义推荐选择
    message.on(
      "pickFood",
      (food: FoodDetail) => {
        const { recommand } = this.data;
        recommand[index - 1] = food;
        this.setData({ recommand });
        wx.setStorageSync("recommand", recommand);
      },
      true
    );
  },

  /** 重置为默认 */
  reset() {
    this.setData({ recommand: this.privateData.recommand }, () =>
      tip("重置成功", 1000, "success")
    );

    this.privateData.isUserRecommand = false;
  },
});
