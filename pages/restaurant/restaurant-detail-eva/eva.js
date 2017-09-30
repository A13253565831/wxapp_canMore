var con = require('../../../utils/api');
var app = getApp();
Page({
  data: {
    glo_is_load: true,
    dishid:'',
    id: ''
  },
  
  onLoad:function(options){
    var that = this;
    console.log(options);
    that.setData({
      id: options.id,
      dishid: options.dishid
    })
  },
  onShow:function(){
    var that = this;
    wx.request({
      url: con.pingjia_fenji,
      method: "POST",
      data: {
        wxappid: con.wxappid,
        dishid: that.data.dishid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res);
        that.setData({
          pingjia: res.data.info,
          glo_is_load: false
        })
      }
    });
  },
  select_status_show: function (e) {
    var that = this;
    // var len = e.currentTarget.dataset.val;
    that.setData({
      this_group_val: that.data.id
    })
  },
  onPullDownRefresh: function () {
    var that = this;
    that.onShow();
    wx.showNavigationBarLoading() //在标题栏中显示加载
    setTimeout(() => {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh();
    }, 1000);
  }
})