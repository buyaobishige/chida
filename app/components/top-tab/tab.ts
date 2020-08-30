import { AppOption } from "../../app";
const { globalData } = getApp<AppOption>();
let currentSwipe = 0;

Component({
  properties: {
    navList: {
      type: Array,
      value: [],
    },
    barPosition: {
      type: String,
      value: "fixed",
    },
    barHeight: {
      type: String,
      value: "96vh",
    },
    /** 是否立即更改还是等动画完成之后再进行更改 */
    immediate: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    curNavItem: [],
    barleft: "32.5%",
    current: 0,
    fixed: "",
  },
  lifetimes: {
    attached() {
      this.setData({
        fixed: this.properties.barPosition,
        barHeight: this.properties.barHeight,
      });
    },
  },
  methods: {
    changeTab({
      currentTarget: {
        dataset: { index },
      },
    }: WXEvent.Touch) {
      this.setData({ current: Number(index) });
    },
    change({ detail: { current } }: any) {
      if (this.properties.immediate) this.setData({ current });
    },
    // 设置指示条动画
    transition({ detail }) {
      this.setData({
        barleft:
          String(
            0.325 * globalData.info.screenWidth +
              (detail.dx + globalData.info.screenWidth * currentSwipe) /
                (2 * this.properties.navList.length)
          ) + "px",
      });
    },
    aminationFinish({ detail: { current } }: any) {
      currentSwipe = current;
      if (!this.properties.immediate) this.setData({ current });
      this.triggerEvent("animationFinished", { current }, {});
    },
  },

  options: {
    multipleSlots: true,
  },
});
