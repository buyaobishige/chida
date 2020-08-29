import { AppOption, FoodDetail } from "../../app";
import { message } from "../../utils/message";
import { tip } from "../../utils/wx";
const { globalData } = getApp<AppOption>();

Page({
  data: {
    /** 是否已经初始化 */
    inited: false,
    /** 收藏列表 */
    favorList: [] as FoodDetail[],
    /** 地点索引值 */
    placeIndex: 0,
    /** 地点选择器列表 */
    placeValue: ["全部", "北苑", "南苑" /* , '净月' */],
    /** 返回顶部状态 */
    backToTop: false,
    /** 是否到底 */
    reachBottom: false,
  },

  privateData: {
    /** 南苑的收藏夹列表 */
    nanYuan: [] as FoodDetail[],
    /** 北苑的收藏夹列表 */
    beiYuan: [] as FoodDetail[],
    /** 符合当前条件的所有收藏夹列表 */
    favorList: [] as FoodDetail[],
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
    // 生成北苑和南苑的收藏夹列表
    this.privateData.nanYuan = globalData.favorList.filter(
      (item) => item.locate === "南苑一楼" || item.locate === "南苑三楼"
    );
    this.privateData.beiYuan = globalData.favorList.filter(
      (item) => item.locate === "北苑一楼" || item.locate === "北苑二楼"
    );

    // 写入搜索范围
    this.privateData.all = globalData.favorList;
    this.privateData.favorList = globalData.favorList;

    this.setData({
      inited: true,
      favorList: this.generateFavorList(),
    });
  },

  /** 生成最初的收藏列表 */
  generateFavorList() {
    const { favorList } = globalData;

    return favorList.length > 10 ? favorList.slice(0, 10) : favorList;
  },

  /** 获取当前对应的全部菜品列表 */
  getFavorList(pickerIndex: number) {
    return pickerIndex === 0
      ? this.privateData.all
      : pickerIndex === 1
      ? this.privateData.beiYuan
      : this.privateData.nanYuan;
  },

  /** 改变当前地点 */
  pickerChange({ detail: { value } }: WXEvent.PickerChange) {
    // 生成当前的收藏夹列表
    this.privateData.favorList = this.getFavorList(Number(value));

    this.setData({
      reachBottom: false,
      placeIndex: Number(value),
      favorList: this.generateFavorList(),
    });
    this.scrollTop();
  },

  /** 输入框点击确认，开始搜索 */
  confirm({ detail: { value } }: WXEvent.Input) {
    this.privateData.favorList =
      value === ""
        ? // 如果为空直接返回该分类全部菜品
          this.getFavorList(this.data.placeIndex)
        : // 检测匹配
          this.getFavorList(this.data.placeIndex).filter((item) =>
            item.name.includes(value)
          );

    this.setData({ reachBottom: false, favorList: this.generateFavorList() });
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
        globalData.favorList.push(food);
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
      },
      true
    );
  },

  /** 编辑 */
  edit() {
    tip("制作中...");
  },

  /** 触底操作 */
  onReachBottom() {
    // 已经到底
    if (globalData.favorList.length === this.data.favorList.length)
      this.setData({ reachBottom: true });
    else {
      // 继续添加十条
      const min = (x: number, y: number): number => (x > y ? y : x);
      this.setData({
        foodList: globalData.favorList.slice(
          0,
          // 选择现有个数加 10，和总个数较小的那个
          min(this.data.favorList.length + 10, globalData.favorList.length)
        ),
      });
    }
  },

  /** 返回顶部动作 */
  scrollTop() {
    wx.pageScrollTo({ selector: "#topAnchor" });
  },

  /** 处理返回顶部按钮逻辑 */
  onPageScroll(event) {
    if (event.scrollTop > 400 && !this.data.backToTop)
      this.setData({ backToTop: true });
    else if (event.scrollTop < 400 && this.data.backToTop)
      this.setData({ backToTop: false });
  },
});
