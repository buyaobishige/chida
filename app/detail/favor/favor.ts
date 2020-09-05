import { AppOption, FoodDetail } from "../../app";
import { message } from "../../utils/message";
import { tip } from "../../utils/wx";
const { globalData } = getApp<AppOption>();
const { getFavor } = getApp<AppOption>();
Page({
  data: {
    editModel: false,
    /** 是否已经初始化 */
    inited: false,
    /** 收藏列表 */
    likesFoodList: [] as FoodDetail[],
    /** 地点索引值 */
    placeIndex: 0,
    /** 地点选择器列表 */
    placeValue: ["全部", "北苑", "南苑", "不喜欢"/* , '净月' */],
    /** 返回顶部状态 */
    backToTop: false,
    /** 是否到底 */
    reachBottom: false,
  },

  privateData: {
    dislikesFoodList: [] as FoodDetail[],
    copyID: null,
    arr: [],
    counter: 10,
    /** 南苑的收藏夹列表 */
    nanYuan: [] as FoodDetail[],
    /** 北苑的收藏夹列表 */
    beiYuan: [] as FoodDetail[],
    /** 符合当前条件的所有收藏夹列表 */
    likesFoodList: [] as FoodDetail[],
    /** 符合该分类的全部列表 */
    all: [] as FoodDetail[],
  },

  onLoad() {
    
    if (globalData.favorRequest) this.init();
    // 监听自定义推荐选择
    else message.on("favor", () => this.init(), true);
  },
  /** 初始化列表 */
  init() {
    globalData.favorRequest = false;
    getFavor(globalData.openid);
    let intId = setInterval(() => {
      if (globalData.favorRequest) {
        this.privateData.copyID = globalData.likesFoodIDList;
        this.privateData.disCopyID = globalData.dislikesFoodIDList;
        this.privateData.beiYuan=[];
        this.privateData.nanYuan=[];
        // 生成北苑和南苑的收藏夹列表
        globalData.likesFoodList.forEach(item => {
          if (item.locate === "北苑一楼" || item.locate === "北苑二楼") {
            this.privateData.beiYuan.push(item)
          }
          if (item.locate === "南苑一楼" || item.locate === "南苑三楼") {
            this.privateData.nanYuan.push(item)
          }
        })
        this.privateData.dislikesFoodList = globalData.dislikesFoodList
        // console.log(this.privateData.beiYuan)
        // 写入搜索范围
        this.privateData.all = globalData.likesFoodList;
        this.privateData.likesFoodList = globalData.likesFoodList;
        let a = this.privateData.all;
        let b;
        if (a.length > 10) { b = a.slice(0, 10) }
        else {
          b = a
        }
        console.log(b)
        this.setData({
          inited: true,
          likesFoodList: globalData.likesFoodList
        });

        clearInterval(intId)
      }
    }, 100)
  },

  // /** 生成最初的收藏列表 */
  // generatelikesFoodList() {
  //   const { likesFoodList } = globalData;
  //   return likesFoodList.length > 10 ? likesFoodList.slice(0, 10) : likesFoodList;
  // },

  /** 获取当前对应的全部菜品列表 */
  getlikesFoodList(pickerIndex: number) {

    return pickerIndex === 0
      ? this.privateData.all
      : pickerIndex === 1
        ? this.privateData.beiYuan
        : pickerIndex === 2 ?
          this.privateData.nanYuan :
          this.privateData.dislikesFoodList
  },

  /** 改变当前地点 */
  pickerChange({ detail: { value } }: WXEvent.PickerChange) {
    // 生成当前的收藏夹列表
    this.privateData.likesFoodList = this.getlikesFoodList(Number(value));
    this.setData({
      reachBottom: false,
      placeIndex: Number(value),
      likesFoodList: this.getlikesFoodList(Number(value))
    })
    this.scrollTop();
  },

  /** 输入框点击确认，开始搜索 */
  confirm({ detail: { value } }: WXEvent.Input) {
    this.privateData.likesFoodList =
      value === ""
        ? // 如果为空直接返回该分类全部菜品
        this.getlikesFoodList(this.data.placeIndex)
        : // 检测匹配
        this.getlikesFoodList(this.data.placeIndex).filter((item) =>
          item.name.includes(value)
        );

    this.setData({ reachBottom: false, likesFoodList: this.generatelikesFoodList() });
    this.scrollTop();
  },

  /** 添加菜品 */
  add() {
    wx.navigateTo({ url: "/detail/search/search?pick=true" });

    // 监听自定义推荐选择
    message.on(
      "pickFood",
      (food: FoodDetail) => {
        const { id } = food;

        // 添加到用户收藏夹
        globalData.likesFoodList.push(food);
        globalData.likesFoodIDList.push(id);

        wx.request({
          url: "https://lin.innenu.com/server/updateUser.php",
          method: "GET",
          data: { openid: globalData.openid, likes: globalData.likesFoodIDList, dislikes: globalData.likesFoodIDList },
          success: (res) => {
            // console.log(res)
            if (res.statusCode === 200 && res.data) console.log("添加成功");
            this.init()
          },
          fail: (err) => {
            console.error(err);
          },
        });
      },
      true
    );
  },

  /** 编辑 */
  edit() {
    // tip("制作中...");
    this.setData({
      editModel: true
    })
  },

  /** 触底操作 */
  onReachBottom() {
    if (this.privateData.all.length > 10) {
      // 已经到底
      if (globalData.likesFoodList.length === this.data.likesFoodList.length)
        this.setData({ reachBottom: true });
      else {
        // 继续添加十条
        const min = (x: number, y: number): number => (x > y ? y : x);
        this.privateData.arr = this.privateData.likesFoodList.slice(0, this.privateData.counter);
        this.privateData.arr.push(...this.privateData.likesFoodList.slice(this.privateData.counter, this.privateData.counter + 10));
        this.setData({
          likesFoodList: this.privateData.arr
        });
        this.privateData.counter += 10;
      }
    }
  },

  /** 返回顶部动作 */
  scrollTop() {
    wx.pageScrollTo({ selector: "#topAnchor" });
  },
  delItem(e) {
    let copyID;
    if (this.data.placeIndex == 3) {
      copyID = this.privateData.disCopyID;
    } else {
      copyID = this.privateData.copyID;
    }
    let index = e.currentTarget.dataset.index;
    if (e.detail.value) {
      copyID.forEach((item, ind) => {
        if (item === String(index)) {
          copyID[ind] = "del" + item
        }
      })
    } else {
      copyID.forEach((item, ind) => {
        if (item === "del" + String(index)) {
          copyID[ind] = item.slice(3, copyID[ind].length)
        }
      })
    }
console.log(copyID)
  },
  /**完成编辑 */
  finish() {
    if (this.data.placeIndex == 3) {
      let that = this;
      wx.showModal({
        title: "确认",
        content: "要保存修改吗？",
        success(res) {
          if (res.confirm) {
            let arr = that.privateData.disCopyID.filter(item => {
              if (Number(item[0])) { return item }
            })
            wx.request({
              url: "https://lin.innenu.com/server/updateUser.php",
              data: {
                openid: globalData.openid,
                likes: globalData.likesFoodIDList,
                dislikes: arr
              },
              success(res) {
                that.privateData.copyID = globalData.likesFoodIDList
                that.setData({
                  editModel: false
                })
                that.init()
              }
            })
          } else {
            that.setData({
              editModel: false
            })
          }
        }

      })
    }
    else {
      let that = this;
      wx.showModal({
        title: "确认",
        content: "要保存修改吗？",
        success(res) {
          if (res.confirm) {
            let arr = that.privateData.copyID.filter(item => {
              if (Number(item[0])) { return item }
            })
            wx.request({
              url: "https://lin.innenu.com/server/updateUser.php",
              data: {
                openid: globalData.openid,
                likes: arr,
                dislikes: globalData.dislikesFoodIDList
              },
              success(res) {
                that.privateData.copyID = globalData.likesFoodIDList
                that.setData({
                  editModel: false
                })
                that.init()
              }
            })
          } else {
            that.setData({
              editModel: false
            })
          }
        }

      })
    }

  },
  /** 处理返回顶部按钮逻辑 */
  onPageScroll(event) {
    if (event.scrollTop > 400 && !this.data.backToTop)
      this.setData({ backToTop: true });
    else if (event.scrollTop < 400 && this.data.backToTop)
      this.setData({ backToTop: false });
  },
});
