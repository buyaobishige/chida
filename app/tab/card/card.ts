import { AppOption, FoodDetail } from "../../app";
import { message } from "../../utils/message";
const { globalData } = getApp<AppOption>();

Page({
  data: {
    /** 导航栏标题 */
    navList: [1, 2, "推荐", "新菜"],
    /** 状态栏高度 */
    statusBarHeight: 20,

    /** 卡片列表 */
    cards: [] as FoodDetail[],
  },

  privateData: {
    /** 卡片列表 */
    cards: [] as FoodDetail[],
    /** 不喜欢的菜品 ID */
    dislikes: [] as number[],
  },

  onLoad() {
    // 收藏夹已完成请求
    if (globalData.favorRequest)
      this.setData({
        cards: this.generateCardList(),
        statusBarHeight: globalData.info.statusBarHeight,
      });
    else {
      // 建立监听
      message.on(
        "favor",
        () => {
          this.setData({ cards: this.generateCardList() });
        },
        true
      );

      this.setData({ statusBarHeight: globalData.info.statusBarHeight });
    }
  },

  /** 生成最初的卡片列表 */
  generateCardList() {
    const dislikes: number[] = wx.getStorageSync("dislikeList") || [];

    this.privateData.dislikes = dislikes;
    // 生成卡片
    this.privateData.cards = globalData.foodList.filter(
      // 既不在收藏夹也不在不喜欢列表
      (food) =>
        !dislikes.includes(food.id) && !globalData.favorIDList.includes(food.id)
    );

    return this.privateData.cards.length > 5
      ? this.privateData.cards.slice(0, 5)
      : this.privateData.cards;
  },

  /** 飞出卡片 */
  removeCard() {
    setTimeout(() => {
      this.data.cards.shift();
      const item = this.privateData.cards.pop();
      if (item) this.data.cards.push(item);

      this.setData({ cards: this.data.cards });
    }, 300);
  },

  /** 喜欢 */
  like() {
    console.log("like", this.data.cards[0]);

    const card = this.data.cards[0];
    const { id } = card;

    // 添加到用户收藏夹
    globalData.favorList.push(card);
    globalData.favorIDList.push(id);
    wx.request({
      url: "https://lin.innenu.com/test/favor.php",
      method: "POST",
      data: { type: "add", openid: globalData.openid, id },
      success: (res) => {
        if (res.statusCode === 200 && res.data) console.log("添加成功");
      },
      fail: (err) => {
        console.error(err);
      },
    });

    this.removeCard();
  },

  /** 稍后，用户无法做出决定 */
  later() {
    console.log("later", this.data.cards[0]);

    // 重新注入队列末尾
    this.privateData.cards.push(this.data.cards[0]);

    this.removeCard();
  },

  /** 不喜欢 */
  dislike() {
    console.log("dislike", this.data.cards[0]);
    const { id } = this.data.cards[0];

    // TODO: 保存到服务器
    this.privateData.dislikes.push(id);
    wx.setStorageSync("dislikeList", this.privateData.dislikes);

    this.removeCard();
  },
});
