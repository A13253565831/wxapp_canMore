var con = require('../../../utils/api');
var app = getApp();
Page({
  data: {
    this_order_id: 0,
    oinfo: [],
     glo_is_load: true
  },
  go_dish_info_bind: function (e) {
    var that = this;
    var dish_id = e.currentTarget.id;
    
    wx.navigateBack({
      delta: 3
    });

  },
  onLoad: function (options) {
    var that = this;
    var order_sn = options.ordersn;
    console.log(options);
    that.setData({
      this_order_id: order_sn,
    });
    that.initgetOrderInfoData();
  },
  initgetOrderInfoData:function(){
    var that = this;
    wx.request({
      url: con.getOrderBysn,
      method: "POST",
      data: {
        wxappid: con.wxappid,
        ordersn: that.data.this_order_id 
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success:function(res){
        console.log(res.data.info);
         that.setData({
           oinfo: res.data.info,
           glo_is_load: false 
         });
      }
    });

  },
  onPullDownRefresh: function () {
    var that = this;
    wx.showNavigationBarLoading() //在标题栏中显示加载
    that.onShow();
    setTimeout(() => {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh();
    }, 1000)
  }
});