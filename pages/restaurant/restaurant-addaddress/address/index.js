// pages/address/user-address/user-address.js
var con = require('../../../../utils/api');
var app = getApp();
Page({
  data: {
    address: [],
    radioindex: '',
    pro_id: 0,
    num: 0,
    id: 0,
    recipients: {},
    default_id: 0,
    default_add: []
  },
  onLoad: function (options) {
    
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    that.setData({
      id: options.id
    })
    wx.request({
      url: con.getFansRecipients,
      data: {
        wxappid: con.wxappid,
        fansid: app.globalData.fansid,
              
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },

      success: function (res) {
        // success
        console.log(res.data);
        var address = res.data.info;
        console.log(address);
        if (address == '') {
          var address = []
        }

        that.setData({
          address: address,
          default_id: res.data.default_id,
          default_add: res.data.default_info
        })
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })

  },

  onReady: function () {
    // 页面渲染完成
  },
  setDefault: function (e) {
    var that = this;
    var addrId = e.currentTarget.dataset.id;
    
    wx.request({
      url: con.SetDefaultRecipients,
      data: {
       wxappid: con.wxappid,
       fansid: app.globalData.fansid,
       re_id: addrId
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },

      success: function (res) {
        // success
        console.log(res,123666);
        var status = res.data.status;
           var id = that.data.id;
           var dish_id;
           wx.getStorage({
             key: 'dish_id',
             success: function(res) {
               dish_id = res.data
                
               if (status == 1) {
                 if (dish_id) {
                     wx.redirectTo({

                       url: '../../restaurant-order/index?dish_id=' + dish_id,
                     });
                   
                   return false;
                 }

                 wx.showToast({
                   title: '操作成功！',
                   duration: 2000
                 });

                 that.DataonLoad();
               } else {
                 wx.showToast({
                   title: res.data.errMsg,
                   duration: 2000
                 });
               }
             },
           });
          
        
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },
  delAddress: function (e) {
    var that = this;
    var addrId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '你确认移除吗',
      success: function (res) {
        res.confirm && wx.request({
          url: con.delRecipients,
          data: {
            wxappid: con.wxappid,
            fansid: app.globalData.fansid,
            re_id: addrId
          },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {// 设置请求的 header
            'Content-Type': 'application/x-www-form-urlencoded'
          },

          success: function (res) {
            // success
            console.log(res);
            var status = res.data.status;
            if (status == 1) {
              that.DataonLoad();
            } else {
              wx.showToast({
                title: res.data.err,
                duration: 2000
              });
            }
          },
          fail: function () {
            // fail
            wx.showToast({
              title: '网络异常！',
              duration: 2000
            });
          }
        });
      }
    });
  },
  DataonLoad: function () {
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    //加载更新
    wx.request({
      url: con.getFansRecipients,
      data: {
        wxappid: con.wxappid,
        fansid: app.globalData.fansid,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },

      success: function (res) {
        // success
        var address = res.data.info;
        if (address == '') {
          var address = []
        }
        that.setData({
          address: address,
          default_id: res.data.default_id,
          default_add: res.data.default_info,
        })
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })

  },
  //刷新
  onPullDownRefresh: function () {
    var that = this;
    that.onShow();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000)
  },
})


