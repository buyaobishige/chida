import { tip } from "../../utils/wx";

Page({
  data: {
    pickerIndex: 0,
    picker: ["北苑", "南苑", "东师水果"],
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
});
