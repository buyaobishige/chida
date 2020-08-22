Page({
  data: {
    /** 选择器当前选中项 */
    currentIndex: 0,
    /** 选择器配置 */
    pickerValue: ["全部展示", "北苑", "南苑", "东师果园"],

    /** 轮播图配置 */
    swiperList: [
      {
        id: 0,
        type: "image",
        url: "http://pic1.win4000.com/wallpaper/d/543f7d96cea51.jpg",
      },
      {
        id: 1,
        type: "image",
        url:
          "http://img5.imgtn.bdimg.com/it/u=1381931952,4060895415&fm=26&gp=0.jpg",
      },
    ],

    /** 水果配置 */
    fruit: [
      {
        name: "苹果",
        price: "3",
        decimal: ".00",
        src:
          "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1584698251129&di=698804bfa6dbb4f9b4988111ecc50e6c&imgtype=0&src=http%3A%2F%2Fpic.haixia51.com%2Fpic%2F%3Fp%3D%2Fqianqianhua%2F20180502%2F15%2F1525247931-DLpoKUzmdG.jpg",
      },
      {
        name: "樱桃",
        price: "3",
        decimal: ".00",
        src:
          "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1584698341230&di=467863137440a01344e10397b510d428&imgtype=0&src=http%3A%2F%2Fi2.download.fd.pchome.net%2Ft_600x1024%2Fg1%2FM00%2F12%2F0F%2FooYBAFaCF6WINuSpAAF5WnB_o8UAAC0xwC9VfMAAXly039.jpg",
      },
      {
        name: "香蕉",
        price: "3",
        decimal: ".00",
        src:
          "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1584698378620&di=91455c2b471c6250a09005107811eec4&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20180703%2F3e4c37be73cc4430857c86a0b9e3eeb4.jpeg",
      },
      {
        name: "葡萄",
        price: "20",
        decimal: ".00",
        src:
          "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1584698599626&di=39b9e0c283cee817a24d5081ee82e889&imgtype=0&src=http%3A%2F%2Fw.xinjiangnet.com.cn%2Fxjwzt%2F2013Aug%2Fjkzf%2Fzfcs%2F201308%2FW020130826578596096901.jpg",
      },
      {
        name: "橘子",
        price: "5",
        decimal: ".00",
        src:
          "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=345615500,4128842742&fm=26&gp=0.jpg",
      },
      {
        name: "柚子",
        price: "10",
        decimal: ".00",
        src:
          "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1584698636900&di=21df1012b95493efb374d7ab0f6a859a&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fblog%2F201407%2F11%2F20140711115744_NdxNX.jpeg",
      },
      {
        name: "草莓",
        price: "19",
        decimal: ".90",
        src:
          "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1584698718450&di=b25b1a71cac20e0e581b5693df78831d&imgtype=0&src=http%3A%2F%2Fwww.windows10zj.com%2Fuploads%2Fallimg%2F170502%2F154Z35261-6.jpg",
      },
    ],
  },

  pickerChange(event: WXEvent.PickerChange) {
    this.setData({ currentIndex: Number(event.detail.value) });
  },
});