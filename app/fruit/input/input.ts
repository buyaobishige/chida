import { tip } from "../../utils/wx";

interface CoreDataSetItem {
  name: string,
  price: number,
}
let coreDataSet: CoreDataSetItem[];
// = [
//   { name: "apple", price: 20 },
//   { name: "peach", price: 15 },
//   { name: "peach", price: 15 }
// ]
Page({
  onLoad(opt) {
    wx.request({
      url: "https://lin.innenu.com/server/fruitToolkit/getCurrentFruitInfo.php",
      method: "GET",
      data: {
        market: opt.market
      },
      success: res => {
        coreDataSet = JSON.parse(res.data[0].databaseSet);
        this.setData({ coreDataSet, market: opt.market })
      }
    })
  },

  data: {
    market: "",
    // pickerIndex: 0,
    // picker: ["北苑", "南苑", "东师水果"],
    coreDataSet
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
    else {
      console.log(data.detail.value);
      tip("提交成功", 1500, "success");
    }
  },

  delItem(e) {
    wx.showModal({
      content: "确定删除这条？",
      success: (res) => {
        if (res.confirm) {
          coreDataSet.splice(e.currentTarget.dataset.index, 1)
          this.setData({ coreDataSet })
        }
      }
    })
  },
  bindInput(e) {
    if (e.currentTarget.dataset.category == "name") {
      coreDataSet[e.currentTarget.dataset.index].name = e.detail.value;
    } else if (e.currentTarget.dataset.category == "price") {
      coreDataSet[e.currentTarget.dataset.index].price = e.detail.value;
    }
    this.setData({
      coreDataSet
    })
  },
  addLine() {
    coreDataSet.push({
      name: "某水果",
      price: 0.1
    })
    this.setData({
      coreDataSet
    })
  },
  submitChange() {
    //TODO : 水果不能重名
    wx.showModal({
      content: "确定提交？",
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: "https://lin.innenu.com/server/fruitToolkit/addCurrentFruitInfo.php",
            method: "GET",
            data: {
              market: this.data.market,
              timeStamp: (new Date()).getTime(),
              databaseSet: JSON.stringify(coreDataSet)
            },
            success: res => {
              wx.showToast({
                title: res.data as string
              })
            }
          })
        }
      }
    })

  }
});

console.log(JSON.stringify(coreDataSet))