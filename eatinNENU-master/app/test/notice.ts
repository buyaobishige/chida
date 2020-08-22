Page({
  data: {
    date: "",
    content: "",
  },

  onLoad() {
    wx.request({
      url: "https://lin.innenu.com/notice.json",
      success: (res) => {
        const { date, content } = res.data as Record<string, any>;

        this.setData({ date, content });
      },
    });
  },
});
