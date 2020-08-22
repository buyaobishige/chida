/* eslint-disable max-params */
import { debug, warn } from "./log";
import { server } from "./config";

/**
 * 显示提示文字
 *
 * @param text 提示文字
 * @param duration 提示持续时间，单位ms，默认为`1500`
 * @param icon 提示图标，默认为`'none'`
 */
export const tip = (
  text: string,
  duration = 1500,
  icon: "success" | "loading" | "none" = "none"
): void => {
  void wx.showToast({
    icon,
    title: text,
    duration: duration ? duration : 1500,
  });
};

/**
 * 显示提示窗口
 *
 * @param title 提示文字
 * @param content 提示文字
 * @param confirmFunc 点击确定的回调函数
 * @param cancelFunc 点击取消的回调函数，不填则不显示取消按钮
 */
export const modal = (
  title: string,
  content: string,
  confirmFunc?: () => void,
  cancelFunc?: () => void
): void => {
  /** 显示取消按钮 */
  const showCancel = Boolean(cancelFunc);

  wx.showModal({
    title,
    content,
    showCancel,
    success: (res) => {
      if (res.confirm && confirmFunc) confirmFunc();
      else if (res.cancel && cancelFunc) cancelFunc();
    },
  });
};

/**
 * 确认操作
 *
 * @param actionText 行为文字
 * @param confirmFunc 确定回调函数
 * @param cancelFunc 取消回调函数
 */
export const confirm = (
  actionText: string,
  confirmFunc: () => void,
  cancelFunc: () => void = (): void => undefined
): void => {
  modal("确认操作", `您确定要${actionText}么?`, confirmFunc, cancelFunc);
};

/** 网络状态汇报 */
export const netReport = (): void => {
  // 获取网络信息
  wx.getNetworkType({
    success: (res) => {
      const { networkType } = res;

      switch (networkType) {
        case "2g":
        case "3g":
          tip("您的网络状态不佳");
          break;
        case "none":
        case "unknown":
          tip("您没有连接到网络");
          break;
        case "wifi":
          wx.getConnectedWifi({
            success: (info) => {
              if (info.wifi.signalStrength < 0.5)
                tip("Wifi信号不佳，网络链接失败");
            },
            fail: () => {
              tip("无法连接网络");
            },
          });
          break;
        default:
          tip("网络连接出现问题，请稍后重试");
      }

      warn("Request fail with", networkType);
    },
    fail: () => {
      tip("网络连接出现问题，请稍后重试");

      warn("Request fail and cannot get networkType");
    },
  });
};

/**
 * 请求 JSON 文件
 *
 * @param path 请求路径
 * @param successFunc 回调函数
 * @param failFunc 失败回调函数
 * @param errorFunc 状态码错误回调函数
 */
export const requestJSON = <T = IAnyObject>(
  path: string,
  successFunc: (data: T) => void,
  failFunc?: (errMsg: WechatMiniprogram.GeneralCallbackResult) => void,
  errorFunc?: (statusCode: number) => void
): void => {
  wx.request({
    url: `${server}${path}.json`,
    success: (res) => {
      debug(`请求 ${path} 成功: `, res); // 调试
      if (res.statusCode === 200) successFunc(res.data as T);
      else {
        tip("服务器出现问题，请稍后重试");
        // 调试
        warn(`请求 ${path} 失败：${res.statusCode}`);

        if (errorFunc) errorFunc(res.statusCode);
      }
    },
    fail: (failMsg) => {
      if (failFunc) failFunc(failMsg);
      netReport();

      // 调试
      warn(`请求 ${path} 失败: `, failMsg);
    },
  });
};

/**
 * 下载文件
 *
 * @param path 下载路径
 * @param successFunc 成功回调函数
 * @param failFunc 失败回调函数
 * @param errorFunc 状态码错误回调函数
 */
export const downLoad = (
  path: string,
  successFunc: (/** 缓存文件路径 */ tempFilePath: string) => void,
  failFunc?: (
    /** 失败信息 */ errMsg: WechatMiniprogram.GeneralCallbackResult
  ) => void,
  errorFunc?: (/** 服务器状态码 */ statusCode: number) => void
): void => {
  const progress = wx.downloadFile({
    url: `${server}${path}`,
    success: (res) => {
      void wx.hideLoading();
      if (res.statusCode === 200) successFunc(res.tempFilePath);
      else {
        tip("服务器出现问题，请稍后重试");
        if (errorFunc) errorFunc(res.statusCode);

        // 调试
        warn(`下载 ${path} 失败: ${res.statusCode}`);
      }
    },
    fail: (failMsg) => {
      void wx.hideLoading();
      if (failFunc) failFunc(failMsg);
      netReport();
      warn(`下载 ${path} 失败:`, failMsg);
    },
  });

  progress.onProgressUpdate((res) => {
    void wx.showLoading({ title: `下载中${Math.round(res.progress)}%` });
  });
};

/**
 * 保存图片到相册
 *
 * @param imgPath 图片地址
 */
export const savePhoto = (imgPath: string): void => {
  downLoad(
    imgPath,
    (path) => {
      // 获取用户设置
      wx.getSetting({
        success: (res) => {
          // 如果已经授权相册直接写入图片
          if (res.authSetting["scope.writePhotosAlbum"])
            wx.saveImageToPhotosAlbum({
              filePath: path,
              success: () => {
                tip("保存成功");
              },
            });
          // 没有授权——>提示用户授权
          else
            wx.authorize({
              scope: "scope.writePhotosAlbum",
              success: () => {
                wx.saveImageToPhotosAlbum({
                  filePath: path,
                  success: () => {
                    tip("保存成功");
                  },
                });
              },

              // 用户拒绝权限，提示用户开启权限
              fail: () => {
                modal(
                  "权限被拒",
                  "如果想要保存图片，请在“我的东师”-“权限设置”允许保存图片权限",
                  () => tip("二维码保存失败")
                );
              },
            });
        },
      });
    },
    () => {
      tip("图片下载失败");
    }
  );
};

/**
 * 比较版本号
 * @param versionA 版本号A
 * @param versionB 版本号B
 */
export const compareVersion = (versionA: string, versionB: string): number => {
  const version1 = versionA.split(".");
  const version2 = versionB.split(".");

  const maxLen = Math.max(version1.length, version2.length);

  while (version1.length < maxLen) version1.push("0");

  while (version2.length < maxLen) version2.push("0");

  for (let i = 0; i < maxLen; i++) {
    const num1 = parseInt(version1[i]);
    const num2 = parseInt(version2[i]);

    if (num1 > num2) return 1;
    else if (num1 < num2) return -1;
  }

  return 0;
};
