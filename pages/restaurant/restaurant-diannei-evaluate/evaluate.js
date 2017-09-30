var con = require("../../../utils/api");
var app = getApp();
Page({
  data: {
    // glo_is_load: true,
    this_page: 1,//当前页码
    pagesize: 10,//每页数量,
    this_val: -1,
    ordersn: 0,
    eval_fen: 0,
    time: 0,
    dishid: '',
    id: 0,
    image: '',
    dcid: '',
    pingjia_id: '',
    radios: [
      {
        name: "不满意",
        id: 1
      }, {
        name: "一般",
        id: 2
      },
      {
        name: "满意",
        id: 3
      }, {
        name: "很满意",
        id: 4
      }]

  },
  bind_eva_show: function (e) {
    var that = this;
    var len = e.currentTarget.dataset.val;
    console.log(len);
    that.setData({
      this_page: 1,
      this_val: len
    })
  },
  radioChange: function (e) {
    var that = this;
    var len = e.detail.value;
    that.setData({
      eval_fen: len
    })
  },
  bindEvaSubmit: function (e) {

    var eva = e.detail.value.text;

    var that = this;
    if (eva == "") {

      wx.showToast({
        title: '请输入评价内容',
        icon: 'success',
        duration: 1000
      });
      return false;
    } else {
      console.log(that.data.dcid,233333);
      wx.request({
        url: con.pingjia_add ,
        method: "POST",
        data: {
          wxappid: con.wxappid,
          fansid: app.globalData.fansid,
          dishid: that.data.dishid,
          level: that.data.eval_fen,
          info: eva,
          img: that.data.image,
          dcid: that.data.dcid
        },
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          if (res.data.code == 1) {
            
            wx.showModal({
              title: '评价成功',
              showCancel: false,
              success: function (res) {
                console.log(res);
                
                if (res.confirm) {
                  wx.navigateBack({
                    delta: 1
                  })

                }

              }
            });

          }
        }
      });
    }

  },
   
  onLoad: function (options) {

    var that = this;
    that.setData({
      dishid: options.id,
      dcid: options.id2 
    })
  },
  onShow: function () {
    var that = this;

    wx.request({
      url: con.pingjia_cai,
      method: "POST",
      data: {
        wxappid: con.wxappid,
        dishid: that.data.dishid
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res);
        that.setData({
          time: res.data.info.pingjia_time,
          image: res.data.info.image
        })
      }
    });
  },
  onPullDownRefresh: function () {
    var that = this;
    wx.showNavigationBarLoading() //在标题栏中显示加载
    that.setData({
      this_page: 1
    });
    that.onShow();
    setTimeout(() => {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh();
    }, 1000)
  },

})