import { modal, tip } from "../../utils/wx";
import { AppOption } from "../../app";
const { globalData } = getApp<AppOption>();

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

Page({
  data: {
    navList: ["档口", "评论"],

    /** 档口信息 */
    info: {} as StallInfo,
    /** 菜品列表 */
    foodList: [] as FoodListDetail[],

    currentRate: 0,
    averageScore: 0,
    openid: "",
    load: true,
    inputValue: "",
    remarks: [] as any[],
    isLogin: false,
  },

  privateData: {
    /** 档口名称 */
    stall: "",
    user: "",
    avatar: "",
    count: 0,
    /** 评论的复制 */
    comment: [] as any[],
    /** 当前用户的评分 */
    currentRate: 4,
    /** 评分详情 */
    rateDetail: [] as any[],
  },

  onLoad(options) {
    if (options.stall) {
      this.privateData.stall = options.stall;
      this.setData({ openid: globalData.openid, orientation: options.stall || "general" });
      wx.request({
        url: "https://lin.innenu.com/test/stall.php",
        method: "POST",
        data: { type: "get", stall: options.stall },
        success: (res) => {
          const { info, foodList } = res.data as GetStallCallback;
          this.setData({ foodList, info });
          this.refreshInfo();
          console.log(this.data.info)
        },
      });
    }
  },
  onPullDownRefresh() {
    this.refreshInfo();
    wx.stopPullDownRefresh();
  },

  /** 刷新评论列表 */
  // eslint-disable-next-line max-lines-per-function
  refreshInfo() {
    wx.request({
      url: "https://lin.innenu.com/server/remarksToolkit/getRemark.php",
      method: "GET",
      data: { orientation: this.privateData.stall || "general" },
      // eslint-disable-next-line max-lines-per-function
      success: (res) => {
        console.log(res)
        const { data } = res as WX.RequestResult<any[]>;
        const rateDetail = (JSON.parse(data[0].rate) || []) as any[];
        console.log(data);
        let averageScore;
        this.privateData.comment = JSON.parse(JSON.stringify(data));

        this.privateData.rateDetail = rateDetail;
        // 没有评分
        if (rateDetail.length === 0) averageScore = 0;
        else {
          let totalScore = 0;

          rateDetail.forEach((item) => {
            if (item.rating != 0) {
              totalScore += Number(item.rating);
            }
          });
          // FIXME: 限制位数
          averageScore = (totalScore / rateDetail.length).toFixed(1);
        }

        data.forEach((item, index) => {
          // 生成回复列表 TODO: Remove
          if (!item.replyList) item.replyList = [];

          // 解析赞
          if (item.zan_list) {
            const likes = JSON.parse(item.zan_list);

            item.zanOk = Boolean(
              item.zan_list && likes.includes(globalData.openid)
            );

            item.zanList = likes;
            item.zanNum = item.zanList.length;
          }

          // 解析时间戳
          const timeStamp = new Date(Number(item.date) * 1000);
          const year = timeStamp.getFullYear();
          const month = timeStamp.getMonth() + 1;
          const day = timeStamp.getDate();
          item.formattedDate = `${year}年${month}月${day}日`;

          // 解析评分
          if (rateDetail.length !== 0)
            rateDetail.forEach((rate) => {
              // 当前评论者的评分
              if (rate.openid === item.openid) item.rate = rate.rating;

              // 当前用户的评分
              if (rate.openid === globalData.openid)
                this.privateData.currentRate = rate.rating;
            });

          // 解析评论数 FIXME: Is it equal to `index !== data.length -1` ?
          if (index < data.length - 1)
            if (item.id === data[index + 1].id) {
              if (data[index - this.privateData.count].replyList.length > 0)
                data[index - this.privateData.count].replyList.pop();

              data[index - this.privateData.count].replyList.push(
                this.privateData.comment[index].replys
              );
              data[index - this.privateData.count].replyList.push(
                this.privateData.comment[index + 1].replys
              );
              this.privateData.count += 1;
            } else this.privateData.count = 0;
        });

        // 评论去重
        const comments: any[] = [];
        const idArray: number[] = [];
        console.log(data);
        data.forEach((item) => {
          if (!idArray.includes(item.id)) {
            idArray.push(item.id);
            comments.push(item);
          }
        });
        this.setData({
          remarks: comments,
          // currentRate: this.privateData.currentRate,
          rateArr: rateDetail,
          averageScore,
        });
        // }
      },
    });
  },

  phoneCall() {
    wx.makePhoneCall({ phoneNumber: this.data.info.contact });
  },

  copyContact() {
    wx.setClipboardData({
      data: this.data.info.contact,
      success: () => {
        tip("已复制店家手机 / 微信号");
      },
    });
  },

  tabSelect(event: WXEvent.Touch) {
    const { index } = event.currentTarget.dataset;

    this.setData({
      TabCur: index,
      MainCur: index,
      VerticalNavTop: (index - 1) * 50,
    });
  },

  deleteComment(event: WXEvent.Touch) {
    const commentId = event.currentTarget.dataset.commentid;
    modal("删除评论", "请确认是否删除该评论？", () => {
      const { rateDetail } = this.privateData;
      const index = rateDetail.findIndex(
        (rate) => rate.openid === globalData.openid
      );

      // 数组中是否有你的评价
      if (index !== -1) rateDetail.splice(index, 1);

      wx.request({
        url: "https://lin.innenu.com/server/remarksToolkit/deleteRemark.php",

        // FIXME: 这是一个严重漏洞，这将使得用户可以任意删除其他人的评分
        data: {
          id: commentId,
          rate: rateDetail,
        },
        success: (resp) => {
          this.refreshInfo();
          console.log(resp);
          tip("删除成功");
        },
      });
    });
  },

  sort(event: WXEvent.Touch) {
    const { remarks } = this.data;

    if (event.currentTarget.dataset.sortby === "new") {
      console.log("new");
      remarks.sort((a, b) => Number(b.date) - Number(a.date));
    } else if (event.currentTarget.dataset.sortby === "pop") {
      console.log("zan");
      remarks.sort(
        (a, b) => (b.zanList ? b.zanNum : 0) - (a.zanList ? a.zanNum : 0)
      );
    }
    this.setData({ remarks });
  },

  valueChange(event: WXEvent.Input) {
    this.setData({ inputValue: event.detail.value });
  },

  login(event: any) {
    this.privateData.user = event.detail.userInfo.nickName;
    this.privateData.avatar = event.detail.userInfo.avatarUrl;
    this.setData({ isLogin: true });

    if (event.currentTarget.dataset.func === "zan") {
      wx.showLoading({ title: "请稍候...", mask: true });
      wx.request({
        url: "https://lin.innenu.com/server/remarksToolkit/addZan.php",
        data: {
          id: event.currentTarget.dataset.id,
          openid: globalData.openid,
        },
        success: () => {
          this.refreshInfo();
          wx.hideLoading();
        },
      });
    }
  },

  submit() {
    if (this.data.inputValue.length > 3) {
      const { rateDetail } = this.privateData;
      // 数组中是否有你的评价
      let hasRated = false;
      if (rateDetail)
        rateDetail.forEach((item) => {
          if (item.openid === globalData.openid) {
            item.rating = this.data.currentRate;
            hasRated = true;
          }
        });

      if (hasRated === false)
        rateDetail.push({
          openid: globalData.openid,
          rating: this.data.currentRate,
        });

      wx.request({
        url: "https://lin.innenu.com/server/remarksToolkit/addRemark.php",
        data: {
          user: this.privateData.user,
          systemModel: globalData.info.brand,
          openid: globalData.openid,
          avatarUrl: this.privateData.avatar,
          content: this.data.inputValue,
          orientation: this.privateData.stall || "general",
          rate: JSON.stringify(rateDetail),
        },
        success: (res) => {
          console.log(res);
          this.refreshInfo();
        },
      });
      this.setData({ inputValue: "" });
    } else tip("请输入3个以上字符");
  },

  onRate(event: WXEvent.Touch) {
    this.setData({
      currentRate: event.currentTarget.dataset.rating,
    });
  },

  /*
   * verticalMain(event: WXEvent.Touch) {
   *   const { list } = this.data;
   *   let tabHeight = 0;
   */

  /*
   *   if (this.data.load) {
   *     for (let i = 0; i < list.length; i++) {
   *       const view = wx.createSelectorQuery().select(`#main-${list[i].id}`);
   */

  /*
   *       view
   *         // eslint-disable-next-line no-loop-func
   *         .fields({ size: true }, (data) => {
   *           list[i].top = tabHeight;
   *           tabHeight += data.height;
   *           list[i].bottom = tabHeight;
   *         })
   *         .exec();
   *     }
   */

  /*
   *     this.setData({ load: false, list });
   *   }
   */

  //   const scrollTop = event.detail.scrollTop + 20;

  /*
   *   for (let i = 0; i < list.length; i++)
   *     if (scrollTop > list[i].top && scrollTop < list[i].bottom)
   *       this.setData({
   *         VerticalNavTop: (list[i].id - 1) * 50,
   *         TabCur: list[i].id
   *       });
   * }
   */
});
