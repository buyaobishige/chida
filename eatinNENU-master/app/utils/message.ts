/** 发布 / 订阅模块 */

/** 事件处理器 */
interface EventHandler {
  /** 事件处理函数 */
  handler: (...args: any[]) => void;
  /** 是否只执行一次 */
  once: boolean;
  /** 是否已经被调用过 */
  called?: boolean;
}

/** 监听器对象 */
interface EventBus {
  [props: string]: EventHandler[];
}

/** 监听器方法 */
type EventBusMethods = "on" | "off" | "emit" | "assign";

/** 发布 / 订阅模块 */
class Message {
  public constructor() {
    this.eventObject = {};
  }

  /** 监听器对象 */
  protected eventObject: EventBus;

  /**
   * 订阅事件
   *
   * @param eventId 订阅事件名称
   * @param handler 处理函数
   * @param once 是否只处理一次
   *
   * @returns 取消监听函数
   */
  public on(
    eventId: string,
    handler: (...args: any[]) => void,
    once = false
  ): () => void {
    // 如果时间对象中不存在 eventId，则初始化一个空数组
    if (!this.eventObject[eventId]) this.eventObject[eventId] = [];

    // 向 eventId 队列中注入信息
    this.eventObject[eventId].push({ handler, once });

    // 返回取消监听函数，如果日后需要取消这个监听处理函数则需要调用这个函数。
    return () => this.off(eventId, handler);
  }

  /**
   * 取消订阅事件
   *
   * @param eventId 需要取消的订阅事件名称
   * - 设置为`all`即取消所有
   * @param handler 需要取消的监听处理函数，不填则取消所有监听处理函数
   */
  public off(eventId: string | string[] | "all", handler?: () => void): void {
    /** 需要移除的监听id列表 */
    const idList = Array.isArray(eventId)
      ? eventId
      : eventId === "all"
      ? Object.keys(this.eventObject)
      : [eventId];

    idList.forEach((key) => {
      if (handler)
        // 移除特定监听
        this.eventObject[key] = (this.eventObject[key] || []).filter(
          (evtObj) => evtObj.handler !== handler
        );
      else this.eventObject[key] = []; // 移除所有监听
    });
  }

  /**
   * 触发订阅事件
   *
   * @param eventId 订阅事件名称
   * @param args 参数
   */
  public emit(eventId: string, ...args: any[]): void {
    /** 事件处理器 */
    this.eventObject[eventId] = (this.eventObject[eventId] || []).filter(
      (evtObj) => {
        try {
          // 尝试调用函数
          if (evtObj.handler) evtObj.handler.apply(undefined, args);

          evtObj.called = true; // 写入调用状态

          // 如果只能调用一次则移除
          if (evtObj.once) return false;
        } catch (err) {
          // 给出错误信息
          console.error(
            `${eventId}事件监听触发失败：`,
            err.stack || err.message || err
          );
        }

        return true;
      }
    );
  }

  /**
   * 合并不同的 pub / sub
   *
   * @param target 需要合并的 pub / sub
   */
  public assign(target: Message): void {
    (["on", "off", "emit", "assign"] as EventBusMethods[]).forEach((name) => {
      target[name] = (...args: any[]) => (this[name] as any).apply(this, args);
    });
  }
}

export const message = new Message();

export default Message;
