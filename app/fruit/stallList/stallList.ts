import * as echarts from "../ec-canvas/echarts";

let dataX: any[] = [];
let dataY: any[] = [];

interface CoreDataSetItem {
  timeStamp: number;
  price: number;
}

const config = {
  // 是否补全没有价格数据的时间点
  fillBlank: { fillBlank: false, minDays: 30 },
};

const privateData = {
  maxVal: 0,
  minVal: 0,
  firstLoading: true,
  option: null,
};
let databaseSet: CoreDataSetItem[] = [];

const initChart = (
  canvas: any,
  width: number,
  height: number,
  dpr: number
  // eslint-disable-next-line max-params
): any => {
  const chart = echarts.init(canvas, null, {
    width,
    height,
    devicePixelRatio: dpr,
  });

  canvas.setChart(chart);

  const data = [];
  /** 一天的秒数 */
  const secondOfOneDay = 24 * 3600 * 1000;

  let now = new Date(1997, 9, 3);
  let value = Math.random() * 1000;

  const randomData = (): any => {
    now = new Date(now.valueOf() + secondOfOneDay);
    value = value + Math.random() * 21 - 10;

    return {
      name: now.toString(),
      value: [
        [now.getFullYear(), now.getMonth() + 1, now.getDate()].join("/"),
        Math.round(value),
      ],
    };
  };

  for (let i = 0; i < 1000; i++) data.push(randomData());

  if (privateData.firstLoading)
    setTimeout(() => {
      privateData.option = {
        xAxis: { type: "category", data: dataX },
        yAxis: {
          type: "value",
        },
        tooltip: {
          trigger: "axis",
          formatter: "{b}\n价格:{c}元",
          // axisPointer:{
          //   axis:"x"
          // },
        },
        series: {
          data: dataY,
          type: "line",
          animation: false,
          symbolSize: 0,
          markLine: {
            symbol: "none",
            data: [
              {
                yAxis: privateData.minVal,
              },
              {
                yAxis: privateData.maxVal,
              },
            ],
          },
        },
      };
      chart.setOption(privateData.option);
      privateData.firstLoading = false;
    }, 1200);
  else chart.setOption(privateData.option);

  return chart;
};

// stallList/stallList.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    config,
    privateData,
    // TODO: 自动生成fruitName
    fruitName: "apple",
    latest: "",
    currentPrice: 0,
    // TODO: 自动生成market
    market: "东师果园",
    ec: {
      onInit: initChart,
    },
    stallListData: [],
    navList: ["菜馆", "水果"],
    //TODO
    frontActive: "",
    backActive: "",
    hide: "",
  },

  isAtSameDay(a: number, b: number) {
    return new Date(a).toDateString() === new Date(b).toDateString();
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad(options) {
    wx.request({
      url: "https://lin.innenu.com/server/getRestaurantList.php",
      success: (res) => {
        this.setData({ stallListData: res.data });
      },
    });

    databaseSet = [];
    dataX = [];
    dataY = [];
    wx.request({
      url: "https://lin.innenu.com/server/fruitToolkit/getCurrentFruitInfo.php",
      method: "GET",
      data: {
        market: this.data.market,
      },
      success: (res) => {
        //处理原始数据
        const raw = res.data as any[];
        //处理时间戳在同一天的数据，只保留最近的
        raw.forEach((item: any, index: number) => {
          if (index < raw.length - 1)
            if (
              this.isAtSameDay(
                Number(item.timeStamp),
                Number(raw[index + 1].timeStamp)
              )
            ) {
              // console.log(this.isAtSameDay(Number(item.timeStamp), Number(raw[index + 1].timeStamp)))
              if (item.timeStamp > raw[index + 1].timeStamp)
                raw[index + 1].duplicated = true;

              if (item.timeStamp < raw[index + 1].timeStamp)
                item.duplicated = true;
            }
        });
        raw.forEach((item: any, index: number) => {
          JSON.parse(item.databaseSet).forEach((element) => {
            if (element.name === this.data.fruitName && !item.duplicated)
              databaseSet.push({
                timeStamp: Number(item.timeStamp),
                price: element.price,
              });
          });
        });

        //end

        // 找出最大最小值，用于划markline
        privateData.maxVal = databaseSet[0].price;
        privateData.minVal = databaseSet[0].price;
        databaseSet.forEach((item) => {
          if (item.price >= privateData.maxVal) privateData.maxVal = item.price;

          if (item.price < privateData.minVal) privateData.minVal = item.price;
        });

        // 如果 x 轴不足天数，则补
        if (
          databaseSet.length < config.fillBlank.minDays &&
          config.fillBlank.fillBlank
        )
          for (
            let i = config.fillBlank.minDays - databaseSet.length + 1;
            i > 0;
            i--
          ) {
            dataX.push(
              `${
                new Date(
                  databaseSet[0].timeStamp - 3600 * 24 * i * 1000
                ).getMonth() + 1
              }月${new Date(
                databaseSet[0].timeStamp - 3600 * 24 * i * 1000
              ).getDate()}号`
            );
            dataY.push(null);
          }

        //填入dataX和dataY
        databaseSet.reverse();
        dataX.push(
          ...databaseSet.map(
            (val) =>
              `${new Date(val.timeStamp).getMonth() + 1}月${new Date(
                val.timeStamp
              ).getDate()}号`
          )
        );
        dataY.push(
          ...databaseSet.map((val) => {
            return val.price;
          })
        );
        this.setData({
          latest: dataX[dataX.length - 1],
          currentPrice: dataY[dataY.length - 1],
          privateData,
          config,
        });
      },
    });
  },
  onTap() {
    if (this.data.backActive == "")
      this.setData({
        backActive: "backActive",
        frontActive: "frontActive",
        hide: "hide",
      });
    else {
      this.setData({ backActive: "", frontActive: "" });
      setTimeout(() => {
        this.setData({ hide: "" });
      }, 400);
    }
  },
  aminationFinished({ detail }) {
    console.log(detail.current);
    if (detail.current === 1) {
      this.setData({ backActive: "backActive", frontActive: "frontActive" });
      setTimeout(() => {
        this.setData({ hide: "hide" });
      }, 400);
    }
    if (detail.current === 0) {
      console.log(0);
      this.setData({ backActive: "", frontActive: "" });
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: void function () {},
});
