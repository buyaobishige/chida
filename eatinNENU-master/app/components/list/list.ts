Component({
  properties: {
    /** 普通列表配置 */
    config: Object as any,
  },

  methods: {
    /** 导航到指定页面 */
    navigate(event: WXEvent.Touch) {
      wx.navigateTo({ url: event.currentTarget.dataset.url });
    },
  },

  // QQ 及低版本微信兼容
  options: {
    styleIsolation: "shared",
  },
});
