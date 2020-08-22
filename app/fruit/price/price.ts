import * as echarts from "../ec-canvas/echarts";

const dataX: any[] = [];
const dataY: any[] = [];
const minDays = 30;

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

  const option = {
    xAxis: { data: dataX },
    yAxis: { type: "value" },
    series: [
      {
        data: dataY,
        type: "line",
      },
    ],
  };

  chart.setOption(option);

  return chart;
};

Page({
  data: {
    currentPrice: 0,
    highestPrice: 0,
    lowestPrice: 0,
    latest: "",
    ec: {
      onInit: initChart,
    },
  },
  onLoad() {
    const databaseSetX = [1579340101916, 1580538771338, 1581640771338];
    const databaseSetY = [5, 5.6, 3];
    // 如果 x 轴不足天数，则补
    if (databaseSetX.length < minDays)
      for (let i = minDays - databaseSetX.length + 1; i > 0; i--) {
        dataX.push(
          `${
            new Date(databaseSetX[0] - 3600 * 24 * i * 1000).getMonth() + 1
          }月${new Date(databaseSetX[0] - 3600 * 24 * i * 1000).getDate()}号`
        );
        dataY.push(0);
      }

    dataX.push(
      ...databaseSetX.map(
        (val) => `${new Date(val).getMonth() + 1}月${new Date(val).getDate()}号`
      )
    );
    dataY.push(...databaseSetY);
    const tmpY = [];
    tmpY.push(...dataY);
    const sortedY = tmpY.sort((element1, element2) => {
      return element2 - element1;
    });
    this.setData({
      currentPrice: dataY[dataY.length - 1],
      highestPrice: sortedY[0],
      // 非 0 历史最低价格
      lowestPrice: sortedY[sortedY.indexOf(0) - 1],
      latest: dataX[dataX.length - 1],
    });
  },
});
