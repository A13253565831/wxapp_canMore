var con = require("../../../utils/api");
var app = getApp();
Page({
  data: {
    postlist: [],
    this_weiba_id: 0,
    hasMore: false,
    showLoading: false,
    isScrollY: true,
    this_page: 1,//当前页码
    pagesize: 10,//每页数量
    this_nav_name: 'index',
    this_is_jinghua: 0,
    this_finish_page: 0,
    glo_is_load: true,
    this_group_val: -1,
    address: {}
  },

  //订单详情
  user_orderinfo_bind: function (e) {
    var oid = e.currentTarget.id;
    var ordersn = e.currentTarget.dataset.ordersn;
    wx.navigateTo({
      url: '../restaurant-order-info/info?ordersn=' + ordersn
    });
  },
  //订单状态切换
  select_status_show: function (e) {

    var len = e.currentTarget.dataset.val;
    this.setData({ this_page: 1, this_group_val: e.currentTarget.dataset.val });
   
    this.onShow();
  },
  //删除订单
  delete_user_order: function(e){
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
                if(res.data.code == 1){
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
  
  order_go_pay_bind:function(e){
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
      success:function(res){
        console.log(res.data.WxRequestParameters);
        if(res.data.status == 1){
          wx.requestPayment({
            appId: res.data.WxRequestParameters.appId,
            timeStamp: res.data.WxRequestParameters.timeStamp,
            nonceStr: res.data.WxRequestParameters.nonceStr,
            package: res.data.WxRequestParameters.package,
            signType: res.data.WxRequestParameters.signType,
            paySign: res.data.WxRequestParameters.paySign,
            success:function(res){
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
            fail:function(res){
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
  setOrderStatus: function(){
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
      success:function(res){
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
  order_go_evaluate:function(e){
      var that = this;
      var ordersn = e.currentTarget.dataset.ordersn;

      wx.navigateTo({
        url: "../restaurant-evaluate/evalu?ordersn="+ordersn
      })
  },
  // orderConfirm: function(){
  //   var that = this;
  //   wx.request({
  //     url: con.setOrderStatus,
  //     method: "POST",
  //     data: {
  //       wxappid: con.wxappid,
  //       ordersn: that.data.ordersn,
  //       status: 2
  //     },
  //     header: {
  //       "content-type": "application/x-www-form-urlencoded"
  //     },
  //     success: function (res) {
  //       console.log(res);
  //       if (res.code == '1') {

  //         wx.showToast({
  //           title: '确认收货成功,请评价您的订单',
  //           icon: 'success',
  //           duration: 1000
  //         });
          
  //       }
  //     }
  //   })
  // },
  
  onShow: function(){
    var that = this;
    //动态获取商品规格
    var requestData = {};
    requestData.pagesize = that.data.this_page;
    requestData.pagenum = that.data.pagesize;
    requestData.order_status = that.data.this_group_val;
   
    wx.request({
      url: con.getfansorder,
      method: "POST",
      data: {
        wxappid: con.wxappid,
        fansid: app.globalData.fansid,
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data);
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
        that.setData({ postlist: info.orderList, glo_is_load: false });
        wx.hideToast();
      }
    }); 

    // that.orderConfirm(); 
    
    
  },
  //下拉刷新
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
  },


})