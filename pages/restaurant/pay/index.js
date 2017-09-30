const app = getApp();
const con = require("../../../utils/api");
Page({
  data: {
    this_user_info: {},
    submitIsLoading: false,
    buttonIsDisabled: false,
    this_dish_id: 0,
    this_dish_info: [],
    is_beizhu_show: false,
    ZhuanZhang_sn: '',
  },
  change_beizhu_show: function () {
    this.setData({ is_beizhu_show: this.data.is_beizhu_show ? false : true });
  },
  onLoad:function(options){
    var that = this;
    var dish_id = options.dish_id;
    that.setData({ this_dish_id: dish_id });
  },
  onShow:function(){
    var that = this;
    wx.request({
      url: con.getcompanylist,
      data: {
        wxappid: con.wxappid
      },
      method: "GET",
      header:{
        "Content-Type": "application/json"
      },
      success:function(res){
        for(var i in res.data.info){
          that.setData({ this_dish_info: res.data.info[i], glo_is_load: false });
        }
        
      }
    })  
  },
  formSubmit: function (e) {
    
    var that = this;
    that.setData({ submitIsLoading: true, buttonIsDisabled: true });
    var rdata = e.detail.value;
    console.log(rdata);    
      rdata.dish_id = that.data.this_dish_id;
      var re = /^[0-9]+.?[0-9]*$/;

      if(rdata.money == ''){
        wx.showToast({
          title: '请输入转账内容',
          icon: "success",
          duration: 1000
        });
        return false;
      } else if (!re.test(rdata.money)){
        wx.showToast({
          title: '输入金额应为数字',
          icon: 'success',
          duration: 1000
        });
        return false;
      }else {
        
        wx.request({
          url: con.wxpaytoCompany,
          method: "POST",
          data: {
            wxappid: con.wxappid,
            fansid: app.globalData.fansid,
            money: rdata.money,
            msg: rdata.beizhu,
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            that.setData({ submitIsLoading: false, buttonIsDisabled: false });
            // console.log(res.data.WxRequestParameters);
            wx.requestPayment({
              timeStamp: res.data.WxRequestParameters.timeStamp,
              nonceStr: res.data.WxRequestParameters.nonceStr,
              package: res.data.WxRequestParameters.package,
              signType: res.data.WxRequestParameters.signType,
              paySign: res.data.WxRequestParameters.paySign,
              appId: res.data.WxRequestParameters.appId,
              success: function (res) {
                console.log(res, 32123212);
                that.setData({
                  ZhuanZhang_sn: res.data.ZhuanZhang_sn
                });
                if (res.errMsg == 'requestPayment:ok') {
                  // wx.redirectTo({
                  //   url: '../pay-success/index',
                  // })
                  that.zhuanzhangfinish();
                  wx.showToast({
                    title: '支付成功',
                    icon:　'success',
                    duration: 2000
                  });
                }
              },
              fail: function (res) {
                console.log(res, 123321)
                // if (res.errMsg == 'requestPayment:fail cancel') {

                  wx.showToast({
                    title: '支付失败',
                    icon: 'success',
                    duration: 1000
                  })
                // }
              }
            })
          }

        });
      }
      
  },
  zhuanzhangfinish:function(){
    var that = this;
    wx.request({
      url: con.setzzpaystatus,
      method: "POST",
      data: {
        wxappid: con.wxappid,
        fansid: app.globalData.fansid,
        zhuanzhangsn: that.data.ZhuanZhang_sn
      },
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:function(res){
        console.log(res);
      }
    })
  },
  //刷新
  onPullDownRefresh: function () {
    var that = this;
    wx.showNavigationBarLoading() //在标题栏中显示加载
    that.onShow();
    setTimeout(() => {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh();
    }, 1000);
  },

})

