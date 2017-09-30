var con = require('../../../utils/api');
var app = getApp();
Page({
  data: {
    glo_is_load: true,
    dishid: '',
    dish_data: '',
    data_list: '',
    this_dish_id: 0,
    this_dish_info: {},
    date_time: '',
    time_time: '',
    all_g_price:0,
    yudingjin: 0,
    submitIsLoading: false,
    buttonIsDisabled: false,
    ordersn: ''
  },

  bindDateChange: function (e) {

    this.setData({ date_time: e.detail.value });
  },
  bindTimeChange: function (e) {
    this.setData({ time_time: e.detail.value });
  },


  onLoad:function(options){
    var that = this;
    wx.request({
      url: con.Index_getdishinfo,
      method: 'GET',
      data: {
        wxappid: con.wxappid
      },
      header: {
        'content-type': 'application/json'
      },
      success:function(res){
        console.log(res);
        that.setData({
          dish_data: res.data,
          glo_is_load: false 
        });
      }

    });


    that.setData({
      dishid: options.dish_id,
      glo_is_load: false
    });

  },
  onShow:function(){
    var that = this;
    var myDate = new Date();
    var year = myDate.getFullYear();
    var month = myDate.getMonth() + 1;
    var day = myDate.getDate();
    var hour = myDate.getHours() + 2;
    var minute = 30;
    that.setData({
      date_time: year + "-" + month + "-" + day, time_time: hour + ":" + minute,

    });

    wx.request({
      url: con.yuding_getfanscartlist,
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
        var len = res.data.info.glist;
        that.setData({
          data_list: res.data.info,
          all_g_price: res.data.info.all_g_price,
          yudingjin: res.data.info.payprice,
          glist: res.data.info.glist,
          glo_is_load: false
        });
     
      }
    });   

  },
  order_formSubmit:function(e){
    var that = this;
    // console.log(e);
    var username = e.detail.value.yuding_name;
    var phone = e.detail.value.yuding_phone;
    var remark = e.detail.value.post_info;
    var companyid = that.data.this_dish_id;
    var yuyuedate = e.detail.value.yuding_date;
    var yuyuetime = e.detail.value.yuding_time;
    var usercount = e.detail.value.yuding_renshu;

    var reg = "^1[3|4|5|7|8][0-9]\\d{8}$";
    var re = new RegExp(reg);
    var num = "^\\d+$";
    var nu = new RegExp(num);

    if (e.detail.value.yuding_renshu == '') {
      wx.showToast({
        title: '人数不能为空',
        icon: 'success',
        duration: 1000
      });
      return false;

    } else if (e.detail.value.yuding_name == '') {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'success',
        duration: 1000
      });
      return false;
    } else if (e.detail.value.yuding_phone == '') {
      wx.showToast({
        title: '电话不能为空',
        icon: 'success',
        duration: 1000
      });
      return false;
    } else if (e.detail.value.yuding_info == '') {
      wx.showToast({
        title: '输入内容不能为空',
        icon: 'success',
        duration: 1000
      });
      return false;
    } else if (!re.test(phone)) {
      wx.showToast({
        title: '输入的手机号不正确',
        icon: 'success',
        duration: 1000
      });
      return false;
    } else if (!nu.test(usercount)) {
      wx.showToast({
        title: '人数输入格式不确',
        icon: 'success',
        duration: 1000
      });
      return false;
    } else {

      var yuding = {};
      var goodsinfo = [];
      yuding.fansid = app.globalData.fansid;
      yuding.totalprice = that.data.all_g_price;
      var yuyue = {};
      yuyue.username = username;
      yuyue.phone = phone;
      yuyue.remark = remark;
      yuyue.companyid = companyid;
      yuyue.yuyuedate = yuyuedate;
      yuyue.yuyuetime = yuyuetime;
      yuyue.usercount = usercount;
      yuyue.payprice = that.data.yudingjin;
      yuding.yuyue = yuyue;
      var goodsid= '',attr = '',num = '', price = '';
      
      for (var i = 0; i < that.data.glist.length; i++){
        // console.log(that.data.glist[i]);
        var test = {};
        test.goodsid = that.data.glist[i].id;
        test.attr = that.data.glist[i].name;
        test.num = that.data.glist[i].dish_num;
        test.price = that.data.glist[i].price;
        goodsinfo.push(test);
      }
      yuding.goodsinfo = goodsinfo;
      // console.log(yuyue);
      // console.log(yuding);
      wx.request({
        url: con.addyuding_diancan,
        method: 'POST',
        data: {
          wxappid: con.wxappid,
          yuding: JSON.stringify(yuding)
        },
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          //  console.log(res.data);
          
          if (res.data.status == '1') {
            wx.requestPayment({
              appid: res.data.WxRequestParameters.appId,
              timeStamp: res.data.WxRequestParameters.timeStamp,
              nonceStr: res.data.WxRequestParameters.nonceStr,
              package: res.data.WxRequestParameters.package,
              signType: res.data.WxRequestParameters.signType,
              paySign: res.data.WxRequestParameters.paySign,
              success:function(res){
                if (res.errMsg == 'requestPayment:ok') {
                  that.inityudingPayComplete();
                  wx.showModal({
                    title: '提示',
                    content: '预付订金支付成功,请查看您的预订订单',
                    showCancel: false,
                    success: function (res) {
                      if (res.confirm) {
                        wx.navigateTo({
                          url: '../restaurant-reserve-list/list',
                        });
                      }
                    }
                  });
                }
              },
              fail: function (res) {
                
                // that.inityudingPayComplete();
                wx.showModal({
                  title: '支付失败',
                  content: '请重新支付',
                  showCancel: false,
                  success: function (res) {
                    // console.log(res, 333222222);

                    // if (res.confirm) {
                    //   wx.navigateTo({
                    //     url: '../restaurant-reserve-list/list'
                    //   });
                    // };

                  }
                });
              }
            });
          };
          
          that.setData({
            ordersn: res.data.ordersn
          });

        }
      });

    }    

  },

  inityudingPayComplete: function(){
    var that = this;
   
    setTimeout(function(){
      console.log(that.data.ordersn);
      wx.request({
        url: con.yuding_setPayStatusComplete,
        method: "POST",
        data: {
          wxappid: con.wxappid,
          ordersn: that.data.ordersn
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          
          // console.log(res, 260000000);
          if (res.data.code == '1') {
            that.clearYudingCart();
          }
        }
      });

    },1000);
  },
  clearYudingCart: function(){
    var that = this;
    wx.request({
      url: con.yuding_clearfanscart,
      method: "POST",
      data: {
        wxappid: con.wxappid,
        fansid: app.globalData.fansid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:function(res){
        // console.log(res);
        that.setData({
          all_g_number: res.data.isnull,
          all_g_price: res.data.isnull,
          glist: res.data.isnull
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