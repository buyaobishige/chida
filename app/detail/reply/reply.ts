import { modal, tip } from "../../utils/wx";
import { AppOption } from "../../app";

const { globalData } = getApp<AppOption>();
let placeholder = ""; // at

Page({
  data: {
    placeholder: "回复:",
    inputValue: "",
    popupConf3: { cancel: false, title: "更多", confirm: false },
    id: 0,
    targetRemark: {} as any,
    isLogin: false,
    orientation: "",
    curCommentId: 0,
    openid: globalData.openid,
  },

  privateData: {
    user: "",
    avatarUrl: "",
    /** @ 的用户 */
    at: "",
    /** 用于解析评论 */
    dataBackUp: [] as any[],
    /** 用于解析评论 */
    count: 0,
  },

  // eslint-disable-next-line max-lines-per-function
  refreshInfo() {
    wx.request({
      url: "https://lin.innenu.com/server/remarksToolkit/getRemark.php",
      method: "GET",
      data: {
        orientation: this.data.orientation || "general",
      },
      success: (res) => {
        const data = res.data as any[];

        // deep copy
        this.privateData.dataBackUp = JSON.parse(JSON.stringify(data));
        data.forEach((item, index) => {
          // 解析赞
          if (!item.replyList) item.replyList = [];

          if (item.zan_list) {
            const arr = JSON.parse(item.zan_list);
            // if (item.zan_list && arr.includes(globalData.openid))
            // item.zanOk = true;
            // else item.zanOk = false;

            item.zanList = arr;
            // item.zanNum = item.zanList.length;
          }

          // 解析时间戳
          const timeStamp = new Date(Number(item.date) * 1000);
          const year = timeStamp.getFullYear();
          const month = timeStamp.getMonth() + 1;
          const day = timeStamp.getDate();
          item.formattedDate = `${year}年${month}月${day}日`;

          // 解析评论
          if (index < data.length - 1) {
            if (item.id === data[index + 1].id) {
              if (data[index - this.privateData.count].replyList.length > 0)
                data[index - this.privateData.count].replyList.pop();

              data[index - this.privateData.count].replyList.push(
                this.privateData.dataBackUp[index].replys
              );
              data[index - this.privateData.count].replyList.push(
                this.privateData.dataBackUp[index + 1].replys
              );
              this.privateData.count += 1;
            } else this.privateData.count = 0;
          };
          // 评论去重
          const newData: any[] = [];
          const idArray: string[] = [];
          data.forEach((item) => {
            if (!idArray.includes(item.id)) {
              idArray.push(item.id);
              newData.push(item);
            }
          });
          let targetRemark: any;
          newData.forEach((item) => {
            if (item.id == this.data.id) targetRemark = item;
          });
          (targetRemark.replyList || []).forEach((item: any) => {
            if (item.rzan_list) item.rzanList = JSON.parse(item.rzan_list);
            if (item.rzanList && item.rzanList.includes(globalData.openid)){
              item.rzanOk = true;
            }
            // 解析时间戳
            const timeStamp = new Date(Number(item.rdate) * 1000);
            const year = timeStamp.getFullYear();
            const month = timeStamp.getMonth() + 1;
            const day = timeStamp.getDate();
            item.formattedDate = `${year}年${month}月${day}日`;
          });
          //解析评论点赞
          this.setData({
            targetRemark,
            openid: globalData.openid,
          });
          console.log(targetRemark);
        })
        this.privateData.count = 0;
      }
    })
  },

  openMorePop(e) {
    this.setData({
      popupDisplay3: true,
      curCommentId: e.currentTarget.dataset.commentid,
    });
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

  valueChange(event: WXEvent.Input) {
    this.setData({
      inputValue: event.detail.value,
    });
  },
  submit() {
    const that = this;
    if (that.data.inputValue.length > 3) {
      wx.request({
        url:
          "https://lin.innenu.com/server/remarksToolkit/addRemarkToReplys.php",
        data: {
          rat: that.privateData.at || null,
          rid: that.data.id,
          ruser: that.privateData.user,
          rsystemModel: globalData.info.brand,
          ropenid: globalData.openid,
          ravatarUrl: that.privateData.avatarUrl,
          rcontent: placeholder + that.data.inputValue,
          rorientation: that.data.orientation || "general",
        },
        success: (res) => {
          console.log(res);
          that.refreshInfo();
        },
      });
      that.setData({
        inputValue: "",
      });
    } else tip("请输入3个以上字符");
  },
  onLoad(option) {
    this.setData({
      orientation: option.orientation,
      id: Number(option.id || 0),
    });
    this.refreshInfo();
  },

  login(event: any) {
    this.privateData.user = event.detail.userInfo.nickName;
    this.privateData.avatarUrl = event.detail.userInfo.avatarUrl;
    const commentId = event.currentTarget.dataset.replyid;

    this.setData({ isLogin: true });
    if (event.currentTarget.dataset.func === "zan") {
      wx.showLoading({
        title: "请稍候...",
        mask: true,
      });
      wx.request({
        url: "https://lin.innenu.com/server/remarksToolkit/addZanToReplys.php",
        data: {
          replyid: commentId,
          ropenid: globalData.openid,
        },
        success: (res) => {
          console.log(res);
          this.refreshInfo();
          wx.hideLoading();
        },
      });
    }
  },

  deleteComment(event: WXEvent.Touch) {
    const commentId = this.data.curCommentId;

    modal(
      "删除评论",
      "请确认是否删除该评论？",
      () => {
        wx.request({
          url: "https://lin.innenu.com/server/remarksToolkit/deleteReply.php",
          data: {
            replyid: commentId,
          },
          success: (res) => {
            console.log(res);

            const { targetRemark } = this.data;
            (targetRemark.replyList as any[]).forEach((item, index) => {
              if (item.replyid === commentId)
                targetRemark.replyList.splice(index, 1);
            });

            this.setData({ targetRemark, popupDisplay3: false });
            tip("删除成功");
          },
        });
      },
      () => { }
    );
  },
  reply(event: WXEvent.Touch) {
    const { ropenid } = event.currentTarget.dataset;
    const { ruser } = event.currentTarget.dataset;
    this.privateData.at = ropenid;
    placeholder = `@ ${ruser}：`;
    this.setData({ placeholder });
  },
});
