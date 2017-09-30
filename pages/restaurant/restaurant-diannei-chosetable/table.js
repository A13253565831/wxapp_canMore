var con = require('../../../utils/api');
var app = getApp();
Page({
  data: {
    glo_isload: true,
    cid: '',
    dish_data: '',
    zhuotaistatus: '',
    zhuostatus: false
  },
  catchtapView:function(e){
    var that = this;
    var status = e.currentTarget.id;
    var id = e.currentTarget.dataset.id;
    if(status< 3){
      wx.navigateTo({
        url: '../restaurant-diannei-order/index?table_id='+id,
      })
    }else{
      wx.showToast({
        title: '已支付处于用餐中',
        icon: 'success',
        duration: 1000
      });
    }
  },
  onLoad: function(options){
    
    var that = this;
    that.setData({
      cid: options.cid
    });
  },
  onShow: function(){
   var that = this;
   wx.request({
     url: con.gettablebycid,
     method: 'GET',
     data: {
       wxappid: con.wxappid,
       cid: that.data.cid
     },
     header: {
       'content-type': 'application/json'
     },
     success: function(res){
      console.log(res);
      that.setData({
        dish_data: res.data,
        glo_isload: false
      });

      for(var i in res.data.info){
        // console.log(res.data.info[i]);
        var status = res.data.info[i].status;
        if (status < 3) {
          that.setData({
            zhuotaistatus: '去点餐',
            zhuostatus: true
          });
        } else{
          that.setData({
            zhuotaistatus: '桌台已支付',
            zhuostatus: false
          });
        } 
      }      
     }
   });
  },
  onPullDownRefresh: function(){
    var that = this;
    that.onShow();
    wx.showNavigationBarLoading() //在标题栏中显示加载
    setTimeout(() => {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh();
    }, 1000);
  }
});