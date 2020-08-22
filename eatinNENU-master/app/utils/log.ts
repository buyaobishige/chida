/** 实时日志管理器 */
const log = wx.getRealtimeLogManager
  ? wx.getRealtimeLogManager()
  : wx.getLogManager({ level: 1 });
const realtime = Boolean(wx.getRealtimeLogManager);

/** 写入普通日志 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debug = (...args: any[]): void => {
  console.log(...args);
  if (realtime) log.info("debug", ...args);
  else (log as WechatMiniprogram.LogManager).debug(...args);
};

/** 写入信息日志 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const info = (...args: any[]): void => {
  console.info(...args);
  log.info(...args);
};

/** 写入警告日志 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const warn = (...args: any[]): void => {
  console.warn(...args);
  log.warn(...args);
};

/** 写入错误日志 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const error = (...args: any[]): void => {
  console.error(...args);
  if (realtime) (log as WechatMiniprogram.RealtimeLogManager).error(...args);
  else log.warn("error", ...args);
};

/**
 * 写入过滤信息
 *
 * @param filterMsg 过滤信息
 */
export const fliter = (filterMsg: string): void => {
  if (realtime)
    (log as WechatMiniprogram.RealtimeLogManager).setFilterMsg(filterMsg);
};
