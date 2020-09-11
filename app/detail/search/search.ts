import { AppOption, FoodDetail } from "../../app";
import { message } from "../../utils/message";
import { tip } from "../../utils/wx";
const { globalData } = getApp<AppOption>();

Page({
  data: {
    /** 是否已经初始化 */
    inited: false,
    /** 是否是搜索模式 (用于判断搜索框是否聚焦) */
    search: false,
    // /** 是否是选择模式 */
    // pick: false,
    /** 地点索引值 */
    placeIndex: 0,
    /** 地点选择器列表 */
    placeValue: ["全部", "北苑", "南苑" /* , '净月' */],
    /** 食物列表 */
    foodList: [] as FoodDetail[],
    /** 返回顶部状态 */
    backToTop: false,
    /** 是否到底 */
    reachBottom: false,
    from: ""
  },

  privateData: {
    /** 南苑的菜品列表 */
    nanYuan: [] as FoodDetail[],
    /** 北苑的菜品列表 */
    beiYuan: [] as FoodDetail[],
    /** 符合当前条件的所有菜品列表 */
    foodList: [] as FoodDetail[],
    /** 符合该分类的全部列表 */
    all: [] as FoodDetail[],
  },

  onLoad(options) {
    this.setData({
      from: options.from
    })
    if (globalData.foodList.length > 0) this.init(options);
    // 进行监听
    else message.on("foodList", () => this.init(options), true);
  },

  /** 初始化列表 */
  init(options: Record<string, string | undefined>) {
    // 是否限制了标签
    const foodList = options.tag
      ? // 根据标签过滤菜品列表
      globalData.foodList.filter(
        // tags 可能为 null
        (item) => item.tags && item.tags.some((tag) => tag === options.tag)
      )
      : // 全部菜品列表
      globalData.foodList;

    // 生成北苑和南苑的食物列表
    this.privateData.nanYuan = foodList.filter(
      (item) => item.locate === "南苑一楼" || item.locate === "南苑三楼"
    );
    this.privateData.beiYuan = foodList.filter(
      (item) => item.locate === "北苑一楼" || item.locate === "北苑二楼"
    );

    // 写入搜索范围
    this.privateData.all = foodList;
    this.privateData.foodList = foodList;

    this.setData({
      inited: true,
      search: Boolean(options.search),
      foodList: this.generateFoodList(),
      // pick: Boolean(options.pick),
    });
  },

  /** 获取当前对应的全部菜品列表 */
  getFoodList(pickerIndex: number) {
    return pickerIndex === 0
      ? this.privateData.all
      : pickerIndex === 1
        ? this.privateData.beiYuan
        : this.privateData.nanYuan;
  },

  /** 生成最初的菜品列表 */
  generateFoodList() {
    const { foodList } = this.privateData;

    return foodList.length > 10 ? foodList.slice(0, 10) : foodList;
  },

  /** 改变当前地点 */
  pickerChange({ detail: { value } }: WXEvent.PickerChange) {
    // 生成当前的菜品列表
    this.privateData.foodList = this.getFoodList(Number(value));

    this.setData({
      reachBottom: false,
      placeIndex: Number(value),
      foodList: this.generateFoodList(),
    });
    this.scrollTop();
  },

  /** 输入框点击确认，开始搜索 */
  confirm({ detail: { value } }: WXEvent.Input) {
    this.privateData.foodList =
      value === ""
        ? // 如果为空直接返回该分类全部菜品
        this.getFoodList(this.data.placeIndex)
        : // 检测匹配
        this.getFoodList(this.data.placeIndex).filter((item) =>
          item.name.includes(value)
        );

    this.setData({ reachBottom: false, foodList: this.generateFoodList() });
    this.scrollTop();
  },

  /** 触底操作 */
  onReachBottom() {
    // 已经到底
    if (this.privateData.foodList.length === this.data.foodList.length)
      this.setData({ reachBottom: true });
    else {
      // 继续添加十条
      const min = (a: number, b: number) => (a > b ? b : a);
      this.setData({
        foodList: this.privateData.foodList.slice(
          0,
          // 选择现有菜品长度加10，和总长度较小的那个
          min(this.data.foodList.length + 10, this.privateData.foodList.length)
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

  /** 选择项目 */
  pick({ currentTarget }: WXEvent.Touch) {
    // 寻找相同的食物，并赋值
    for (const food of globalData.foodList)
      if (food.id === currentTarget.dataset.id) {
        message.emit("pickFood", food);
        break;
      }

    wx.navigateBack();
  },
});
