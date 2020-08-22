import { AppOption } from "../../app";
import { tip } from "../../utils/wx";
const { globalData } = getApp<AppOption>();

Page({
  data: {
    /** 当前是否登录 */
    isLogin: false,
    /** 随机展示的提示 */
    tip: "",
    avatarUrl: "https://mp.innenu.com/img/nenuyouth.png",
    nickName: "",
    list: {
      content: [
        {
          text: "通知消息",
          icon: "/tab/user/icon/notice.svg",
          url: "/test/notice",
        },
        {
          text: "收藏夹",
          icon: "/tab/user/icon/favor.svg",
          url: "/detail/favor/favor",
        },
      ],
    },
  },

  privateData: {
    /** 提示语库 */
    tips: [
      "新的一天祝你有好♥情",
      "可爱的人要记得照顾好自己",
      "唯爱与美食不可辜负",
    ],
  },

  onLoad() {
    const randomTip = this.privateData.tips[Math.floor(Math.random() * 3)];

    if (wx.getStorageSync("getinfo"))
      this.setData({
        isLogin: true,
        nickName: wx.getStorageSync("nickname"),
        avatarUrl: wx.getStorageSync("avatarUrl"),
        env: globalData.env,
        tip: randomTip,
      });
    else this.setData({ env: globalData.env, tip: randomTip });
  },

  contact() {
    wx.setClipboardData({ data: "2284490400" });
    tip("QQ号已复制至剪切板");
  },

  login(event: WXEvent.Touch) {
    const { nickName, avatarUrl } = event.detail.userInfo;

    this.setData({ nickName, avatarUrl, isLogin: true });
    wx.setStorageSync("getinfo", true);
    wx.setStorageSync("nickname", nickName);
    wx.setStorageSync("avatarUrl", avatarUrl);
  },
});
