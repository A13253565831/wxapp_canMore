var con = require("../../../utils/api.js");
var app = getApp();
var cai_id;
Page({
  data: {

    dish_data: [],
    data_list: [],
    this_dish_id: 0,
    this_table_id: 0,
    this_table_name: '',
    this_table_list: null,
    is_show_table_select: false,
    is_show_table_layer: false,
    is_show_quan_layer: false,
    this_order_type: 1,
    all_g_number: 0,
    all_g_price: 0,
    all_g_yunfei: 0,
    all_g_dabao_price: 0,
    is_show_address: false,
    address_list: null,
    this_address_id: 0,
    this_address_info: '请选择',
    btn_submit_disabled: false,
    submitIsLoading: false,
    glo_is_load: true,
    
    pay_typelist:[
      {
      name: "微信支付"  
    }
    ],
    this_quan_id: 0,
    this_quan_info: '请选择',
    this_quan_jiner: 0,
    wx_address_info: '',
    quan_list: null,
    dish_id: 0,
    this_beizhu_info: '',
    address: '',
    orderInfo: {},
    glist: {}
  },
  //选择备注
  // select_beizhu_bind: function (e) {
  //   var beizhu_info = this.data.this_beizhu_info;
  //   beizhu_info = beizhu_info + e.currentTarget.dataset.info + '';
  //   console.log(beizhu_info,12333333);
  //   this.setData({ this_beizhu_info: beizhu_info });
  // },
  initdishCartInfo:function(){
    var that = this; 
    wx.getStorage({
      key: 'fansid',
      success: function(res) {
        

        wx.request({
          url: con.getfanscartlist,
          method: "POST",
          data: {
            wxappid: con.wxappid,
            fansid: res.data
          },
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            console.log(res.data.info.glist, 333666);
            that.setData({
              data_list: res.data.info,
              all_g_number: res.data.info.all_g_number,
              all_g_price: res.data.info.all_g_price,
              glist: res.data.info.glist,
              glo_is_load: false
            });
          }
        });
      },

    })
    
  },
  onLoad:function(options){
    var that = this;
    console.log(options);
    var post_id = options.dish_id;
    wx.setStorage({
      key: 'dish_id',
      data: post_id,
    });
    that.initdishCartInfo();
    that.setData({
      this_dish_id: post_id,
      glo_is_load:false
    });
    that.loadAddressInfo();
  },
  onShow: function(){
    var that = this;
    //请求门店详情
    wx.request({
      url: con.Index_getdishinfo,
      method: "GET",
      data: {
        wxappid: con.wxappid
      },
      header: {
        "Content-Type": "application/json"
      },
      success:function(res){
        console.log(res.data);
        that.setData({
          dish_data: res.data,
          glo_is_load: false
        })
      }
    });
    that.loadAddressInfo();
    that.orderFish();
  },
  loadAddressInfo: function(){
    var that = this;
    wx.request({
      url: con.getFansRecipients,
      method: "GET",
      data: {
        wxappid: con.wxappid,
        fansid: app.globalData.fansid
      },
      header: {
        "content-type": "application/json"
      },
      success:function(res){
        console.log(res.data);
        that.setData({
          wx_address_info: res.data.default_info,
          default_id: res.data.default_id,
          address: res.data,
          glo_is_load: false
        })
      }
    });
  },
  
  select_address_bind:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../restaurant-addaddress/address/index?id='+id,
    })
  },
  order_formSubmit:function(e){
    var that = this;
    console.log(that.data.wx_address_info);
    if (that.data.wx_address_info == null){
      
       wx.showToast({
         title: '请添加收货地址',
         icon: 'success',
         duration: 1000
       });
       return false;
     }
    else {
      var beizhu = e.detail.value.post_info;
      var that = this;
      var orderInfo = {};
      var goodsinfo = [];
      var glist = that.data.glist;
      var recipients = {};
      var goodsid= '', attr = '', num = '', price = '';
      //遍历数组相当于数组里面添加对象等  
      for (var i = 0; i < glist.length; i++) {
        // goodsinfo.push(glist[i].dish_num);
        var test = {};
        test.goodsid = glist[i].id;
        test.attr = glist[i].name;
        test.num = glist[i].dish_num;
        test.price = glist[i].price;
        goodsinfo.push(test);
      }
    
      orderInfo.fansid = app.globalData.fansid;
      orderInfo.goodsinfo = goodsinfo;
      console.log(goodsinfo);

      recipients.re_id = that.data.default_id;
      recipients.remark = beizhu;

      orderInfo.recipients = recipients;
      orderInfo.totalprice = that.data.all_g_price;

      console.log(orderInfo);

      wx.request({
        url: con.addorder,
        method: "POST",
        data: {
          wxappid: con.wxappid,
          orderInfo: JSON.stringify(orderInfo)
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res);
          that.setData({
            ordersn: res.data.ordersn
          })
          if (res.data.isSuccess == "1"){
            console.log(res.data.WxRequestParameters);
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
                    that.clearCart();
                    that.onShow();
                    wx.showModal({
                      title: '提示',
                      content: "订单支付成功",
                      confirmText: "查看订单",
                      showCancel: false,
                      success: function (res) {
                        console.log(res);
                        wx.redirectTo({
                          url: '../restaurant-order-info/info?ordersn=' +that.data.ordersn
                        });
                      }
                    });
                  }

                },
                fail: function(res){
                  console.log(res);
                  //if (res.errMsg == 'requestPayment:fail cancel') {         
            
                    wx.showModal({
                      title: '提示',
                      content: "支付失败,请稍后到我的订单中可继续支付",
                      showCancel: false,
                      success: function (res) {
                        console.log(res);
                        wx.redirectTo({
                          url: '../restaurant-order-list/index' 

                        });
                      }
                    });

                  }
                //}
              });
              
          }
        }
      })

    }
  },
  clearCart: function(){
    var that = this;
    wx.request({
      url: con.clearfanscart,
      method: "POST",
      data: {
        wxappid: con.wxappid,
        fansid: app.globalData.fansid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:function(res){
        console.log(res,333666999)
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
  orderFish: function(){
     var that = this;
     wx.request({
       url: con.setwmPayStatusComplete,
       method: "POST",
       data: {
         wxappid: con.wxappid,
         ordersn: that.data.ordersn
       },
       header:{
         "content-type": "application/x-www-form-urlencoded"
       },
       success:function(res){
          console.log(res,333333333);
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
  },
})