import * as echarts from "./echarts";
import WxCanvas from "./wx-canvas";
import { compareVersion } from "../../utils/wx";

/** 处理触摸事件 */
const wrapTouch = (event: any): any => {
  event.touches.forEach((touch: any) => {
    touch.offsetX = touch.x;
    touch.offsetY = touch.y;
  });

  return event;
};

let ctx: any;
let chart = {} as any;

Component({
  properties: {
    /** canvas ID */
    canvasId: { type: String, value: "ec-canvas" },
    /** echarts 配置 */
    ec: { type: Object },
    /** 是否强制使用旧版本 canvas */
    forceUseOldCanvas: { type: Boolean, value: false },
  },

  data: {
    /** 是否使用新版 canvas */
    isUseNewCanvas: false,
  },

  ready() {
    if (!this.data.ec)
      console.warn(
        '组件需绑定 ec 变量，例：<ec-canvas id="mychart-dom-bar" canvas-id="mychart-bar" ec="{{ ec }}" />'
      );
    else if (!this.data.ec.lazyLoad) this.init();
  },

  methods: {
    init(callback?: any): any {
      const { SDKVersion } = wx.getSystemInfoSync();
      const canisUseNewCanvas = compareVersion(SDKVersion, "2.9.0") >= 0;
      const isUseNewCanvas = canisUseNewCanvas && !this.data.forceUseOldCanvas;

      this.setData({ isUseNewCanvas });

      if (isUseNewCanvas) this.initByNewWay(callback);
      else {
        const isValid = compareVersion(SDKVersion, "1.9.91") >= 0;
        if (isValid) this.initByOldWay(callback);
        else
          console.error(
            "微信基础库版本过低，需大于等于 1.9.91。" +
              "参见：https://github.com/ecomfe/echarts-for-weixin" +
              "#%E5%BE%AE%E4%BF%A1%E7%89%88%E6%9C%AC%E8%A6%81%E6%B1%82"
          );
      }
    },

    initByOldWay(callback) {
      ctx = wx.createCanvasContext(this.data.canvasId, this);

      const canvas = new WxCanvas(ctx, this.data.canvasId, false);

      echarts.setCanvasCreator(() => canvas);
      const canvasDpr = 1;

      const query = wx.createSelectorQuery().in(this);

      query
        .select(".ec-canvas")
        .boundingClientRect((res) => {
          if (typeof callback === "function")
            // eslint-disable-next-line callback-return
            chart = callback(canvas, res.width, res.height);
          else if (this.data.ec && typeof this.data.ec.onInit === "function")
            chart = this.data.ec.onInit(
              canvas,
              res.width,
              res.height,
              canvasDpr
            );
          else
            this.triggerEvent("init", {
              canvas,
              width: res.width,
              height: res.height,
              canvasDpr,
            });
        })
        .exec();
    },

    /** version >= 2.9.0：使用新的方式初始化 */
    initByNewWay(callback) {
      const query = wx.createSelectorQuery().in(this);
      query
        .select(".ec-canvas")
        .fields({ node: true, size: true })
        .exec((res) => {
          const canvasNode = res[0].node;
          (this as any).canvasNode = canvasNode;

          const canvasDpr = wx.getSystemInfoSync().pixelRatio;
          const canvasWidth = res[0].width;
          const canvasHeight = res[0].height;

          const ctx2D = canvasNode.getContext("2d");

          const canvas = new WxCanvas(
            ctx2D,
            this.data.canvasId,
            true,
            canvasNode
          );
          echarts.setCanvasCreator(() => canvas);

          if (typeof callback === "function")
            // eslint-disable-next-line callback-return
            chart = callback(canvas, canvasWidth, canvasHeight, canvasDpr);
          else if (this.data.ec && typeof this.data.ec.onInit === "function")
            chart = this.data.ec.onInit(
              canvas,
              canvasWidth,
              canvasHeight,
              canvasDpr
            );
          else
            this.triggerEvent("init", {
              canvas,
              width: canvasWidth,
              height: canvasHeight,
              dpr: canvasDpr,
            });
        });
    },

    canvasToTempFilePath(opt): void {
      if (this.data.isUseNewCanvas) {
        const query = wx.createSelectorQuery().in(this);
        query
          .select(".ec-canvas")
          .fields({ node: true, size: true })
          .exec((res) => {
            opt.canvas = res[0].node;
            wx.canvasToTempFilePath(opt);
          });
      } else {
        if (!opt.canvasId) opt.canvasId = this.data.canvasId;

        ctx.draw(true, () => {
          wx.canvasToTempFilePath(opt, this);
        });
      }
    },

    touchStart(event: any): void {
      if (chart && event.touches.length > 0) {
        const touch = event.touches[0];
        const { handler } = chart.getZr();

        handler.dispatch("mousedown", {
          zrX: touch.x,
          zrY: touch.y,
        });
        handler.dispatch("mousemove", {
          zrX: touch.x,
          zrY: touch.y,
        });
        handler.processGesture(wrapTouch(event), "start");
      }
    },

    touchMove(event): void {
      if (chart && event.touches.length > 0) {
        const touch = event.touches[0];
        const { handler } = chart.getZr();

        handler.dispatch("mousemove", {
          zrX: touch.x,
          zrY: touch.y,
        });
        handler.processGesture(wrapTouch(event), "change");
      }
    },

    touchEnd(event: any): void {
      if (chart) {
        const touch = event.changedTouches ? event.changedTouches[0] : {};
        const { handler } = chart.getZr();

        handler.dispatch("mouseup", {
          zrX: touch.x,
          zrY: touch.y,
        });

        handler.dispatch("click", {
          zrX: touch.x,
          zrY: touch.y,
        });

        handler.processGesture(wrapTouch(event), "end");
      }
    },
  },
});
