export default class WxCanvas {
  /** 表格 */
  private chart: any;

  /** 画布节点 */
  private canvasNode: any;

  /** 事件 */
  private event: Record<string, any>;

  // eslint-disable-next-line max-params
  constructor(
    /** 当前环境指针 */
    private ctx: any,
    public canvasId: string,
    /** 是否是新版画布 */
    public isNew: boolean,
    canvasNode?: any
  ) {
    this.chart = null;
    this.event = {};
    if (isNew) this.canvasNode = canvasNode;
    else this.initStyle(ctx);

    this.initEvent();
  }

  getContext(contextType: string): any {
    if (contextType === "2d") return this.ctx;

    return null;
  }

  setChart(chart: any): void {
    this.chart = chart;
  }

  attachEvent(): void {
    // noop
  }

  detachEvent(): void {
    // noop
  }

  initCanvas(zrender: any, ctx: any): void {
    zrender.util.getContext = (): any => ctx;

    zrender.util.$override("measureText", (text: string, font: string) => {
      ctx.font = font || "12px sans-serif";
      return ctx.measureText(text);
    });
  }

  initStyle(ctx: any, ...rest: any[]): void {
    const styles = [
      "fillStyle",
      "strokeStyle",
      "globalAlpha",
      "textAlign",
      "textBaseAlign",
      "shadow",
      "lineWidth",
      "lineCap",
      "lineJoin",
      "lineDash",
      "miterLimit",
      "fontSize",
    ];

    styles.forEach((style) => {
      Object.defineProperty(ctx, style, {
        get: () => ctx.style,
        set: (value) => {
          if (
            (style !== "fillStyle" && style !== "strokeStyle") ||
            (value !== "none" && value !== null)
          )
            ctx[`set${style.charAt(0).toUpperCase()}${style.slice(1)}`](value);
        },
      });
    });

    ctx.createRadialGradient = (): void =>
      ctx.createCircularGradient([ctx, ...rest]);
  }

  initEvent(): void {
    const eventNames = [
      {
        wxName: "touchStart",
        ecName: "mousedown",
      },
      {
        wxName: "touchMove",
        ecName: "mousemove",
      },
      {
        wxName: "touchEnd",
        ecName: "mouseup",
      },
      {
        wxName: "touchEnd",
        ecName: "click",
      },
    ];

    eventNames.forEach((name) => {
      this.event[name.wxName] = (event: any): void => {
        const touch = event.touches[0];
        this.chart.getZr().handler.dispatch(name.ecName, {
          zrX: name.wxName === "tap" ? touch.clientX : touch.x,
          zrY: name.wxName === "tap" ? touch.clientY : touch.y,
        });
      };
    });
  }

  get width(): number {
    if (this.canvasNode) return this.canvasNode.width;
    return 0;
  }

  set width(width: number) {
    if (this.canvasNode) this.canvasNode.width = width;
  }

  get height(): number {
    if (this.canvasNode) return this.canvasNode.height;
    return 0;
  }

  set height(height: number) {
    if (this.canvasNode) this.canvasNode.height = height;
  }
}
