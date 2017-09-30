var con = require('../../../utils/api');
var app = getApp();
Page({
  data: {
    is_load: true,
    diancanList: [],
    diable: true
  },
  deletelist:function(e){
    var that = this;
    var len = e.currentTarget.id;
    wx.request({
      url: con.del_diancan_log,
      method: "POST",
      data: {
        wxappid: con.wxappid,
        diancanid: len
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:function(res){
        // console.log(res);
        
        if(res.data.code == 1){
          that.onShow();
          wx.showToast({
            title: '删除订单成功',
            icon: 'success',
            duration: 1000
          })
        }
      }
    })
  },
  onShow:function(){
    var that = this;
    wx.request({
      url: con.getFansDiancanLogs,
      method: 'POST',
      data: {
        wxappid: con.wxappid,
        fansid: app.globalData.fansid

      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:function(res){
        console.log(res);
        if(res.data.code == 1){
          that.setData({
            diancanList: res.data.info,
            is_load: false  
          })
        }
      }
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this;
    wx.showNavigationBarLoading() //在标题栏中显示加载
    that.onShow();
    setTimeout(() => {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh();
    }, 1000)
  },
});