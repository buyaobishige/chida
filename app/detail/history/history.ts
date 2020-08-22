import { AppOption, FoodDetail } from "../../app";
const { globalData } = getApp<AppOption>();

Page({
  data: {
    foodList: [] as FoodDetail[],
  },

  onLoad() {
    this.setData({ foodList: globalData.history });
  },
});
