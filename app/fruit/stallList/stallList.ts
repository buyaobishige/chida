// fruit/stallList/stallList.js
interface stallDetail {
  name: string,
  locate: string,
  /**picture */
  src: string,
  /**descrition */
  des: string,
  /**评分数组 */
  rate: string,
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stallListData:[] as stallDetail[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: "https://lin.innenu.com/server/getRestaurantList.php",
      success: (res) => {
        this.setData({ stallListData: res.data });
      },
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})