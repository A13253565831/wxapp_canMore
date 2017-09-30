var con = require('../../../utils/api');
var app = getApp();
Page({
  data: {
    glo_is_load: true,
    isShow: true,
    userInfo: ''
  },

  bindShow: function(e){
    var that = this;
    that.setData({
      isShow: !that.data.isShow
    })
  },
  waimaiOrder:function(e){
    wx.navigateTo({
      url: '../user-waimai-list/index',
    })
  },
  diancanOrder: function(e){
    wx.navigateTo({
      url: '../user-diancan-list/list',
    })
  },
  onLoad: function(){
    var that = this;
    
    console.log(app.globalData.userInfo);
    that.setData({
      userInfo: app.globalData.userInfo,
      glo_is_load: false
    });
    
    // 获取技术支持平台
    wx.request({
      url: con.get_copyright,
      method: 'GET',
      data: { wxappid: con.wxappid },
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        that.setData({
          yname: res.data
        })
        // console.log(res.data)
      }

    })

  },
  onPullDownRefresh: function () {
    var that = this;
    wx.showNavigationBarLoading() //在标题栏中显示加载
    that.onShow();
    setTimeout(() => {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh();
    }, 1000);
  }
})