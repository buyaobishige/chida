/** 文件管理器与API封装 */
import { remove, listFile } from "./file";
import { compareVersion, modal, requestJSON, tip } from "./wx";
import { error, warn } from "./log";
import { GlobalData } from "../app";
import { server } from "./config";

/** 通知格式 */
export interface Notice {
  /** 标题 */
  title: string;
  /** 内容 */
  content: string;
  /** 是否每次都通知 */
  force?: boolean;
}

/** 弹窗通知检查*/
export const noticeCheck = (): void => {
  requestJSON(
    "notice",
    (noticeList: Record<string, Notice>) => {
      for (const pageName in noticeList) {
        const notice = noticeList[pageName];
        const oldNotice = wx.getStorageSync(`${pageName}-notice`);

        // 如果通知内容不同或为强制通知，写入通知信息，并重置通知状态
        if (
          oldNotice.title !== notice.title ||
          oldNotice.content !== notice.content ||
          notice.force
        ) {
          wx.setStorageSync(`${pageName}-notice`, notice);
          wx.removeStorageSync(`${pageName}-notifyed`);
        }

        // 如果找到APP级通知，进行判断
        if (pageName === "app")
          if (!wx.getStorageSync("app-notifyed") || notice.force)
            modal(notice.title, notice.content, () =>
              wx.setStorageSync("app-notifyed", true)
            );
      }
    },
    () => {
      // 调试信息
      warn("noticeList error", "Net Error");
    },
    () => {
      // 调试信息
      error("noticeList error", "Address Error");
    }
  );
};

interface UpdateInfo {
  /** 是否进行强制更新 */
  forceUpdate: boolean;
  /** 是否进行强制初始化 */
  reset: boolean;
}

/**
 * 检查小程序更新
 *
 * 如果检测到小程序更新，获取升级状态（新版本号，是否立即更新、是否重置小程序）并做相应处理
 *
 * @param globalData 小程序的全局数据
 */
export const appUpdate = (): void => {
  const updateManager = wx.getUpdateManager();
  let version = "9.9.9";
  let forceUpdate = true;
  let reset = false;

  // 检查更新
  updateManager.onCheckForUpdate((status) => {
    // 找到更新，提示用户获取到更新
    if (status.hasUpdate) tip("发现小程序更新，下载中...");
  });

  updateManager.onUpdateReady(() => {
    // 请求配置文件
    requestJSON(`config`, (data) => {
      ({ forceUpdate, reset } = data as UpdateInfo);

      // 请求配置文件
      requestJSON<string>(`version`, (data2) => {
        version = data2;
        // 更新下载就绪，提示用户重新启动
        wx.showModal({
          title: "已找到新版本",
          content: `新版本${version}已下载，请重启应用更新。${
            reset ? "该版本会初始化小程序。" : ""
          }`,
          showCancel: !reset && !forceUpdate,
          confirmText: "应用",
          cancelText: "取消",
          success: (res) => {
            // 用户确认，应用更新
            if (res.confirm) {
              // 需要初始化
              if (reset) {
                // 显示提示
                void wx.showLoading({ title: "初始化中", mask: true });

                // 清除文件系统文件与数据存储
                listFile("").forEach((filePath) => {
                  remove(filePath);
                });
                wx.clearStorageSync();

                // 隐藏提示
                void wx.hideLoading();
              }

              // 应用更新
              updateManager.applyUpdate();
            }
          },
        });
      });
    });
  });

  // 更新下载失败
  updateManager.onUpdateFailed(() => {
    // 提示用户网络出现问题
    tip("小程序更新下载失败，请检查您的网络！");

    // 调试
    warn("Upate App error because of Net Error");
  });
};

/**
 * 登录
 *
 * @param globalData 小程序的全局数据
 */
const login = (globalData: GlobalData): void => {
  // 获取 openid
  const openid = wx.getStorageSync("openid") as string;

  if (openid) globalData.openid = openid;
  else
    wx.login({
      success: (loginRes) => {
        wx.request({
          url: `${server}test/get${globalData.env}OpenId.php`,
          method: "POST",
          data: { code: loginRes.code },
          success: (res) => {
            const { data } = res as WX.RequestResult<string>;
            if (res.statusCode === 200) {
              // 保存 openid
              globalData.openid = data;
              wx.setStorageSync("openid", data);
            }
          },
        });
      },
    });
};

/**
 * 小程序启动时的运行函数
 *
 * 负责检查通知与小程序更新，注册网络、内存、截屏的监听
 *
 * @param globalData 小程序的全局数据
 */
export const startup = (globalData: GlobalData): void => {
  // 获取设备与运行环境信息
  globalData.info = wx.getSystemInfoSync();
  if (globalData.info.AppPlatform === "qq") globalData.env = "qq";

  // 检测基础库版本
  if (
    ((globalData.env === "qq" &&
      compareVersion(globalData.info.SDKVersion, "1.9.0") < 0) ||
      (globalData.env === "wx" &&
        compareVersion(globalData.info.SDKVersion, "2.8.0") < 0)) &&
    wx.getStorageSync("SDKVersion") !== globalData.info.SDKVersion
  )
    modal(
      "基础库版本偏低",
      `您的${
        globalData.env === "qq" ? "QQ" : "微信"
      }版本偏低，虽然不会影响小程序的功能，但会导致部分内容显示异常。为获得最佳体验，建议您更新至最新版本。`,
      () => {
        // 避免重复提示
        wx.setStorageSync("SDKVersion", globalData.info.SDKVersion);
      }
    );

  // 检查通知更新与小程序更新
  noticeCheck();
  appUpdate();

  // 设置内存不足警告
  wx.onMemoryWarning((res) => {
    tip("内存不足");
    console.warn("onMemoryWarningReceive");
    wx.reportAnalytics("memory_warning", {
      // eslint-disable-next-line
      memory_warning: res && res.level ? res.level : 0,
    });
  });

  // 获取网络信息
  wx.getNetworkType({
    success: (res) => {
      const { networkType } = res;

      if (networkType === "none" || networkType === "unknown")
        tip("您的网络状态不佳");
    },
  });

  // 监听网络状态
  wx.onNetworkStatusChange((res) => {
    // 显示提示
    if (!res.isConnected) {
      tip("网络连接中断,部分小程序功能暂不可用");
      wx.setStorageSync("networkError", true);
    } else if (wx.getStorageSync("network")) {
      wx.setStorageSync("networkError", false);
      tip("网络链接恢复");
    }
  });

  // 监听用户截屏
  wx.onUserCaptureScreen(() => {
    tip("您可以点击右上角——转发或点击页面右下角——保存二维码分享小程序");
  });

  // 登录
  login(globalData);
};
