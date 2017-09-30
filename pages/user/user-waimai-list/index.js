// pages/user/user-waimai-list/index.js
var con = require('../../../utils/api');
var app = getApp();
Page({
  data: {
    // that_load: true,
    this_group_val: -1,
    this_page: 1,//当前页码
    pagesize: 10,//每页数量
    paylist: []
  },
  select_status_show:function(e){
    var that = this;
    var val = e.currentTarget.dataset.val;
    that.setData({
      this_page: 1,
      this_group_val: val
    })
  },
  catchDetail:function(e){
    var ordersn = e.currentTarget.dataset.ordersn;
    wx.navigateTo({
      url: '../user-waimai-detail/index?ordersn='+ordersn,
    })
  },
  delete_user_order:function(e){
    var that = this;
    var order_sn = e.currentTarget.dataset.ordersn;
    var oid = e.currentTarget.id;
    wx.showModal({
      title: '提示',
      content: "确认要删除该订单吗?",
      success: function (res) {
        if (res.confirm == true) {

          wx.request({
            url: con.setDelOrder,
            method: "POST",
            data: {
              wxappid: con.wxappid,
              ordersn: order_sn
            },
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              console.log(res);
              if (res.data.code == 1) {
                that.onShow();
                wx.showToast({
                  title: '取消订单成功',
                  icon: 'success',
                  duration: 1000
                })
              }
            }
          })
        }
      }
    })     
  },
  order_go_pay_bind: function (e) {
    var that = this;
    var this_order_id = e.currentTarget.id;
    var ordersn = e.currentTarget.dataset.ordersn;
    console.log(ordersn);
    that.setData({
      ordersn: ordersn
    })
    wx.request({
      url: con.getWxPayParameters,
      method: "POST",
      data: {
        wxappid: con.wxappid,
        ordersn: ordersn
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data.WxRequestParameters);
        if (res.data.status == 1) {
          wx.requestPayment({
            appId: res.data.WxRequestParameters.appId,
            timeStamp: res.data.WxRequestParameters.timeStamp,
            nonceStr: res.data.WxRequestParameters.nonceStr,
            package: res.data.WxRequestParameters.package,
            signType: res.data.WxRequestParameters.signType,
            paySign: res.data.WxRequestParameters.paySign,
            success: function (res) {
              console.log(res);

              if (res.errMsg == 'requestPayment:ok') {
                that.orderFish();
                that.setOrderStatus();
                that.onShow();
                wx.showToast({
                  title: '支付成功',
                  icon: 'success',
                  duration: 1000
                })
              }
            },
            fail: function (res) {
              console.log(res);
  
              wx.showToast({
                title: '支付失败,请重新支付',
                icon: 'success',
                duration: 1000
              })
            }
          });

        }
      }
    })

  },
  setOrderStatus: function () {
    var that = this;
    wx.request({
      url: con.setOrderStatus,
      method: "POST",
      data: {
        wxappid: con.wxappid,
        ordersn: that.data.ordersn
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(that.data.ordersn);
        console.log(res, 22222233333);
      }
    })
  },
  orderFish: function () {
    var that = this;
    wx.request({
      url: con.setwmPayStatusComplete,
      method: "POST",
      data: {
        wxappid: con.wxappid,
        ordersn: that.data.ordersn
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(that.data.ordersn);
        console.log(res, 333333333);
        that.setData({
          status: res.status
        })
      }
    })
  },

  order_go_confirm: function (e) {
    var that = this;
    var ordersn = e.currentTarget.dataset.ordersn;
    console.log(ordersn);
    that.setData({
      ordersn: ordersn
    })
    wx.request({
      url: con.setOrderStatus,
      method: "POST",
      data: {
        wxappid: con.wxappid,
        ordersn: ordersn,
        status: 2
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res);
        // if (res.code == '1') {
        that.onShow();
        wx.showToast({
          title: '确认收货成功,请评价您的订单',
          icon: 'success',
          duration: 2000
        });

      }
      // }
    });


  },
  order_go_evaluate: function (e) {
    var that = this;
    var ordersn = e.currentTarget.dataset.ordersn;

    wx.navigateTo({
      url: "../../restaurant/restaurant-evaluate/evalu?ordersn=" + ordersn
    })
  },
  onLoad:function(){

  },
  onShow:function(){
    var that = this;
    wx.request({
      url: con.getfansorder,
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
         var info = res.data; 
        if (info == null) {
          that.setData({ showLoading: false });
        } else {
          if (info.length >= that.data.pagesize) {
            that.setData({ showLoading: true });
          } else {
            that.setData({ showLoading: false });
          }
        }
        that.setData({ paylist: info, glo_is_load: false });
        wx.hideToast();
      }
        
      
    })
  },
  onPullDownRefresh: function () {
    var that = this;
    wx.showNavigationBarLoading() //在标题栏中显示加载
    that.setData({
      this_page: 1,
      this_group_val: -1
    });
    that.onShow();
    setTimeout(() => {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh();
    }, 1000)
  }
})