import { tip } from "../../utils/wx";
/** 折线图渲染数据 */
interface CoreDataSetItem {
  /** 水果名称 */
  name: string;
  /** 水果价格 */
  price: number;
}
// interface Data{
//   //...
// }
let coreDataSet: CoreDataSetItem[] = [];

Page({
  onLoad(opt) {
    wx.request({
      url: "https://lin.innenu.com/server/fruitToolkit/getCurrentFruitInfo.php",
      method: "GET",
      data: {
        /** 水果店名称 */
        market: opt.market,
      },
      success: (res: any) => {
        if (res.data.length > 0)
          coreDataSet = JSON.parse((res.data as any)[0].databaseSet);
        else coreDataSet = [];

        this.setData({ coreDataSet, market: opt.market });
      },
    });
  },

  data: {
    market: "",
    coreDataSet,
  },

  pickerChange(event: WXEvent.PickerChange) {
    this.setData({
      pickerIndex: Number(event.detail.value),
    });
  },

  loginForm(data: { detail: any }) {
    const { name, price } = data.detail.value;

    if (price.length === 0) tip("价格不能为空");
    else if (name.length < 2 || name.length > 20) tip("请输入2-20个字符");
    // console.log(data.detail.value);
    else tip("提交成功", 1500, "success");
  },

  delItem(myEvent: WXEvent.Touch) {
    wx.showModal({
      content: "确定删除这条？",
      success: (res) => {
        if (res.confirm) {
          coreDataSet.splice(Number(myEvent.currentTarget.dataset.index), 1);
          this.setData({ coreDataSet });
        }
      },
    });
  },
  bindInput(event: WXEvent.Input) {
    if (event.currentTarget.dataset.category === "name")
      coreDataSet[event.currentTarget.dataset.index].name = event.detail.value;
    else if (event.currentTarget.dataset.category === "price")
      coreDataSet[event.currentTarget.dataset.index].price = Number(
        event.detail.value
      );

    this.setData({
      coreDataSet,
    });
  },
  addLine() {
    coreDataSet.push({
      name: "某水果",
      price: 0.1,
    });
    this.setData({
      coreDataSet,
    });
  },
  submitChange() {
    let isDuplicated = false;
    coreDataSet.forEach((element, index) => {
      if (index < coreDataSet.length - 1)
        if (element.name === coreDataSet[index + 1].name) isDuplicated = true;
    });
    if (isDuplicated) wx.showToast({ title: "名称不得重复！", icon: "none" });
    else
      wx.showModal({
        content: "确定提交？",
        success: (res) => {
          if (res.confirm)
            wx.request({
              url:
                "https://lin.innenu.com/server/fruitToolkit/addCurrentFruitInfo.php",
              method: "GET",
              data: {
                market: this.data.market,
                timeStamp: new Date().getTime(),
                databaseSet: JSON.stringify(coreDataSet),
              },
              success: (res) => {
                wx.showToast({
                  title: res.data as string,
                });
              },
            });
        },
      });
  },
});
