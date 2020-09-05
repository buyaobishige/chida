import { modal, tip } from "../../utils/wx";
import { AppOption } from "../../app";
const { globalData } = getApp<AppOption>();
interface FruitItem {
  /** 果品名  */
  name: string,
  /** 果品价格  */
  wholePrice: number,
  /** 果品价格的整数位  */
  price: string,
  /** 果品价格的整数位  */
  decimal: string,
  /** 图片  */
  src: string,
  isWeighted: boolean
}
//从数据库拉取并处理后的数据
interface DatasetObj {
  name: string,
  price: number
}
interface SrcSetItem {
  /** 图片  */
  src: string,
  /**是否称重计费  */
  isWeighted?: boolean
}
/** 图片地址与是否称重的有关信息  */
interface SrcSet {
  [propName: string]: SrcSetItem
}
let srcSet: SrcSet;


const privateData = {
  user: "",
  avatar: "",
  count: 0,
  /** 评论的复制 */
  comment: [] as any[],
  /** 当前用户的评分 */
  currentRate: 4,
  /** 评分详情 */
  rateDetail: [] as any[],
  //设置多次点击后跳转的链接
  urlSet: {
    0: "../input/input?market=东师果园",
    1: "../input/input?market=南苑",
    2: "../input/input?market=北苑",
  },
  // 中间变量，用于多次点击判定，可忽略
  clickcount: {},
};
Page({
  data: {
    navList: ["档口", "评论"],
    /** 是否显示编辑按钮 */
    floatIconBoxDisplay: false,
    popupConf: { cancel: false, final: "" },
    popupConf2: { cancel: false, title: "发表评论", confirm: false },
    popupConf3: { cancel: false, title: "更多", confirm: false },
    popupDisplay: false,
    popupDisplay2: false,
    popupDisplay3: false,
    /** 选中的评论的id */
    curCommentId: 0,
    TabCur: 0,
    MainCur: 0,
    currentRate: 0,
    averageScore: 0,
    openid: "",
    load: true,
    inputValue: "",
    remarks: [] as any[],
    isLogin: false,
    VerticalNavTop: 0,
    navlist:["果品", "评价"],
    /** 选择器当前选中项 */
    currentIndex: 0,
    /** 选择器配置 */
    pickerValue: ["全部展示", "北苑", "南苑", "东师果园"],
    /** 水果店 */
    market: "东师果园",
    /** 轮播图配置 */
    swiperList: [
      {
        id: 0,
        type: "image",
        url: "http://pic1.win4000.com/wallpaper/d/543f7d96cea51.jpg",
      },
      {
        id: 1,
        type: "image",
        url:
          "http://img5.imgtn.bdimg.com/it/u=1381931952,4060895415&fm=26&gp=0.jpg",
      },
      {
        id: 2,
        type: "image",
        url:
          "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3006593522,635038461&fm=26&gp=0.jpg",
      },
    ],

    /** 水果配置 */
    fruit: []

  },
  animationFinished(e) {
    console.log(e);
    if (e.detail.current == 0) this.setData({ floatIconBoxDisplay: false });

    if (e.detail.current == 1) this.setData({ floatIconBoxDisplay: true });
  },
  openEditPop() {
    this.setData({ popupDisplay2: true });
  },
  openMorePop(e) {
    this.setData({
      popupDisplay3: true,
      curCommentId: e.currentTarget.dataset.commentid,
    });
  },
  closePopup2() {
    this.setData({ popupDisplay2: false });
  },
  closePopup3() {
    this.setData({ popupDisplay3: false });
  },
  showFullName(e) {
    wx.showToast({
      title: e.currentTarget.dataset.item.user,
      icon: "none",
    });
  },

  // 滑动一段距离后显示编辑评论按钮
  onScroll(e) {
    if (e.detail.deltaY > 5) this.setData({ floatIconBoxDisplay: true });

    if (e.detail.deltaY < -5) this.setData({ floatIconBoxDisplay: false });
  },
  refreshInfo() {
    wx.request({
      url: "https://lin.innenu.com/server/remarksToolkit/getRemark.php",
      method: "GET",
      data: { orientation: this.data.market || "general" },
      // eslint-disable-next-line max-lines-per-function
      success: (res) => {
        const { data } = res as WX.RequestResult<any[]>;
        const rateDetail = (JSON.parse(data[0].rate) || []) as any[];
        let averageScore;
        privateData.comment = JSON.parse(JSON.stringify(data));

        privateData.rateDetail = rateDetail;
        // 没有评分
        if (rateDetail.length === 0) averageScore = 0;
        else {
          let totalScore = 0;

          rateDetail.forEach((item) => {
            if (item.rating != 0) totalScore += Number(item.rating);
          });
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
                privateData.currentRate = rate.rating;
            });

          // 解析评论数 FIXME: Is it equal to `index !== data.length -1` ?
          if (index < data.length - 1)
            if (item.id === data[index + 1].id) {
              if (data[index - privateData.count].replyList.length > 0)
                data[index - privateData.count].replyList.pop();

              data[index - privateData.count].replyList.push(
                privateData.comment[index].replys
              );
              data[index - privateData.count].replyList.push(
                privateData.comment[index + 1].replys
              );
              privateData.count += 1;
            } else privateData.count = 0;
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
        comments.forEach((item) => {
          if (item.user.length > 6)
            item.userShortName = item.user.slice(0, 5) + "...";
        });
        this.setData({
          remarks: comments,
          // currentRate: privateData.currentRate,
          rateArr: rateDetail,
          averageScore,
        });
        // }
      },
    });
  },

  deleteComment(event: WXEvent.Touch) {
    const commentId = this.data.curCommentId;
    console.log(commentId);
    modal(
      "删除评论",
      "请确认是否删除该评论？",
      () => {
        const { rateDetail } = privateData;
        const index = rateDetail.findIndex(
          (rate) => rate.openid === globalData.openid
        );

        // 数组中是否有你的评价
        if (index !== -1) rateDetail.splice(index, 1);

        wx.request({
          url: "https://lin.innenu.com/server/remarksToolkit/deleteRemark.php",

          data: {
            id: commentId,
            rate: rateDetail,
          },
          success: (resp) => {
            this.refreshInfo();
            console.log(resp);
            tip("删除成功");
            this.setData({
              popupDisplay3: false,
            });
          },
        });
      },
      () => { }
    );
  },

  submit() {
    if (this.data.inputValue.length > 3) {
      const { rateDetail } = privateData;
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
          user: privateData.user,
          systemModel: globalData.info.brand,
          openid: globalData.openid,
          avatarUrl: privateData.avatar,
          content: this.data.inputValue,
          orientation: this.data.market || "general",
          rate: JSON.stringify(rateDetail),
        },
        success: (res) => {
          this.setData({ popupDisplay2: false });
          wx.showToast({
            title: "评论已发布！",
            icon: "success",
          });
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
  onLoad() {
    this.refreshInfo();
    wx.request({
      url: "https://lin.innenu.com/server/srcSet.json",
      success: res => {
        srcSet = (res.data as SrcSet)
        wx.request({
          url: "https://lin.innenu.com/server/fruitToolkit/getCurrentFruitInfo.php",
          method: "GET",
          data: {
            market: this.data.market,
          },
          success: res => {
            let resultArr = [];
            let temp = [];
            let data = JSON.parse(res.data[0].databaseSet as string);

            data.forEach((item: DatasetObj) => {
              for (let key in srcSet) {
                let resultItem: FruitItem = {
                  name: "",
                  wholePrice: 0,
                  price: "",
                  decimal: "",
                  src: "",
                  isWeighted: true
                };
                resultItem.name = item.name;
                resultItem.wholePrice = item.price;
                resultItem.price = String(parseInt(String(item.price)));
                let dec = String(item.price - Number(resultItem.price));
                resultItem.decimal = String(Math.round(Number(dec) * 10))
                if (item.name === key) {
                  resultItem.src = srcSet[key].src;
                  if (srcSet[key].isWeighted === false) {
                    resultItem.isWeighted = false
                  }
                  temp.push(key);
                  resultArr.push(resultItem)
                } else if (key === "general" && !temp.includes(item.name)) {
                  resultItem.src = srcSet.general.src;
                  resultArr.push(resultItem)
                }
              }
            });
            console.log(resultArr)
            this.setData({
              fruit: resultArr
            })
          }
        })
      }
    })

  },
  pickerChange(event: any) {
    this.setData({ currentIndex: Number(event.detail.value) });
  },

  tappingSwiperItem(e) {
    const { sequence } = e.currentTarget.dataset;
    if (!privateData.clickcount[sequence]) {
      privateData.clickcount[sequence] = 1;
      setTimeout(() => {
        privateData.clickcount[sequence] = 0;
      }, 2000);
    } else {
      privateData.clickcount[sequence] += 1;
      if (privateData.clickcount[sequence] >= 4)
        wx.navigateTo({ url: privateData.urlSet[sequence] });
    }
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
    console.log(this)
    privateData.user = event.detail.userInfo.nickName;
    privateData.avatar = event.detail.userInfo.avatarUrl;
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
});
