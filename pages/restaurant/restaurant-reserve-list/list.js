var con = require('../../../utils/api');
var app = getApp();
Page({
  data: {
    glo_is_load: true,
    this_group_val: '-1',
    current_info: '',
    infoList: '',
  },

  select_status_show:function(e){
    var that = this;
    var le = e.currentTarget.dataset.val;
    console.log(le);
    that.setData({
      this_group_val: le
    });
  },
  backhome: function(e){
    var that = this;
    wx.navigateBack({
      delta: 3
    });
  },
  dleList: function(e){
    var that = this;
    var id = e.currentTarget.id;
    wx.request({
      url: con.yuding_delbyid,
      method: "POST",
      data: {
        wxappid: con.wxappid,
        id: id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:function(res){
        console.log(res);
        if(res.data.code == 1){
          that.onShow();
          wx.showToast({
            title: '删除成功',
            icon : 'success',
            duration: 1000
          });
        }
      }
    });

  },
  onShow: function(){
    var that = this;
    wx.request({
      url: con.yuding_getinfo,
      method: "POST",
      data: {
        wxappid: con.wxappid,
        fansid: app.globalData.fansid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:function(res){
        console.log(res);
        that.setData({
          current_info: res.data.current_info,
          infoList: res.data.infoList,
          glo_is_load: false
        })
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