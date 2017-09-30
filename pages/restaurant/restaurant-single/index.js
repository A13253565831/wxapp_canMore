var con =require("../../../utils/api");
var app = getApp();
var this_goods_id ;

Page({
  data:{
    tabTit: 1,
    this_dish_id: 0,
    this_table_id: 0,
    this_type_text: '点餐',
    this_order_type: 1,
    glo_is_load: true,
    scrollDown: false,
    cart_list_isshow: false,
    dish_data: [],
    cart_list: [],
    dish_yingye_status_text: '请点菜品',
    dish_yingye_status_val: 2,
    dish_button_status: true,
    submitIsLoading: false,
    guigeIsShow: false,
    goods_attr_select: {},
    goods_specification: '',
    goods_a_info: {}
  },
  chage_order_type_bind: function () {
    var that = this;
    if (that.data.this_order_type == 2) {
      //_function.dishDeleteCartList(wx.getStorageSync("utoken"), that.data.this_dish_id, that.initdishDeleteCartListoData, that);
      that.setData({ this_order_type: 1 });
    } else {
      if (that.data.dish_data.dish_info.dish_is_waimai == 0) {
        wx.showModal({
          title: '提示',
          content: "该门店不支持外卖",
          showCancel: false
        });
        return false;
      }
      //_function.dishDeleteCartList(wx.getStorageSync("utoken"), that.data.this_dish_id, that.initdishDeleteCartListoData, that);
      that.setData({ this_order_type: 2 });
    }
  },
  // huodong_info_bind: function () {
  //   var that = this;
  //   wx.navigateTo({
  //     url: '../restaurant-active/index?&dish_id=' + that.data.this_dish_id
  //   });
  // },
  //订单
  go_user_order_bind: function (e) {
    wx.navigateTo({
      url: '/pages/restaurant/restaurant-order-list/index'
    });
  },
  tabSubBind: function (e) {
    var that = this;
    var this_target = e.target.id;
    that.setData({
      tabTit: this_target
    });
  },
  //电话
  call_phone_bind: function () {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.dish_data.dish_info[0].dish_con_mobile
    });
  },
  //跳转选址页面
  goods_order_bind:function(e){
    var that = this;
    var len = e.currentTarget.dataset.id;
  
      wx.navigateTo({
        url: '../restaurant-order/index?dish_id=' + len,
      }) 
  },
  del_one: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    wx.showModal({
      title: '提示',
      content: '你确定要删除本菜品吗',
      success: function (res) {
        if (res.confirm) {

          wx.request({
            url: con.delgoodsfromcart,
            method: "POST",
            data: {
              wxappid: con.wxappid,
              fansid: app.globalData.fansid,
              goodsid: id
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              // console.log(res);
              if (res.data.isSuccess == '1') {
                that.onShow();
                wx.showToast({
                  title: '删除菜品成功',
                  icon: 'success',
                  duration: 1000
                })
              }
            }
          });

        }
      }
    });


  },
  bind_cart_number_jian:function(e){
    wx.showToast({
      title: '选餐中',
      icon: 'loading',
      duration: 1000
    });
    var that = this;
     this_goods_id = e.currentTarget.id;
    
    var cart_id = e.currentTarget.dataset.cid;
    var requestData = {};
    requestData.dish_id = that.data.this_dish_id;
    requestData.gid = this_goods_id;
    requestData.cart_id = cart_id;
    requestData.gnumber = 1;
    wx.request({
      url: con.subgoodsfromcart,
      method: "POST",
      data: {
        wxappid: con.wxappid,
        fansid: app.globalData.fansid,
        goodsid: this_goods_id
      },
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res);
        if (res.data.isSuccess == "1"){
          //成功里面调用购物车数据,会实时更新
          that.initCartData();
        }
           
      }
    });
  },
  bind_cart_number_jia:function(e){
    wx.showToast({
      title: '选餐中',
      icon: 'loading',
      duration: 1000
    });
    var that = this;
    var this_goods_id = e.currentTarget.id;
    var cart_id = e.currentTarget.dataset.cid;
    var requestData = {};
    requestData.dish_id = that.data.this_dish_id;
    requestData.gid = this_goods_id;
    requestData.cart_id = cart_id;
    requestData.gnumber = 1;
    wx.request({
      url: con.addgoodstocart,
      method: "POST",
      data: {
        wxappid: con.wxappid,
        fansid: app.globalData.fansid,
        goodsid: this_goods_id
      },
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      success:function(res){
        console.log(res);
        if (res.data.isSuccess == "1"){
          that.initCartData();
          wx.showToast({
            title: '选餐成功',
            icon: 'success',
            duration: 1000
          })
        }
      }
    });
    
  },
  initCartData:function(){
    var that = this;
    wx.getStorage({
      key: 'fansid',
      success: function(res) {
        
        wx.request({
          url: con.getfanscartlist,
          data: {
            wxappid: con.wxappid,
            fansid: res.data
          },
          method: "POST",
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            console.log(res.data.info,12313);
            that.setData({
              cart_list: res.data.info.glist,
              all_g_number: res.data.info.all_g_number,
              all_g_price: res.data.info.all_g_price,
              glo_is_load: false
            });
            if (res.data.info.all_g_number == 0) {
              that.setData({
                cart_list_isshow: false
              });
            }
            wx.hideToast();
          }
        })
      },
    })
    
  },
  cart_delete_bind: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: "确认要清空购物车吗",
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm == true) {
          wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
          });

          wx.request({
            url: con.clearfanscart,
            method: "POST",
            data: {
              wxappid: con.wxappid,
              fansid: app.globalData.fansid

            },
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              console.log(res.data);
              
              if (res.data.isSuccess == "1") {
                that.initCartData();
                
                that.setData({
                  cart_list: res.data.isnull,
                  all_g_number: res.data.isnull,
                  all_g_price: res.data.isnull
                })
                wx.showToast({
                  title: '清空购物车成功',
                  icon: 'success',
                  duration: 1000
                });
              }
            }
          })
        }
      }
    });

  },
  
  onLoad:function(options){
    var that = this;
    var post_id = options.dish_id || 0;
    var table_id = options.table_id || 0;

    //order_type 1店内 2外卖
    var order_type = options.order_type || 1;
    if (table_id != undefined) {
      that.setData({
        this_table_id: table_id,
      });
    }
    that.setData({
      this_dish_id: post_id,
      this_order_type: order_type
    });
    that.initCartData();

  },
  onShow:function(){
    var that = this;
    that.setData({
      submitIsLoading: false
    });
    wx.request({
      url: con.Index_getdishinfo,
      method: "GET",
      data:{
        wxappid: con.wxappid
      },
      header: {
        "content-type": "application/json"
      },
      success:function(res){
        console.log(res.data.is_yingye_status);
        that.setData({
          dish_data: res.data,
          classifySeleted: res.data.dish_cate[0].id,
          dish_yingye_status_val: res.data.is_yingye_status 
        });
        
        if (that.data.this_order_type == 2) {
          that.setData({
            this_type_text: res.data.dish_info[0].dish_show_text[2]});
        } else {
          that.setData({ this_type_text: res.data.dish_info[0].dish_show_text[0] });
        }
        wx.setNavigationBarTitle({
          title: res.data.dish_info[0].dish_name
        });
          var status = 1;
        if (status) {
          that.setData({
            dish_yingye_status_text: '选好了',
            dish_button_status: false
          });
        } else {
          that.setData({
            dish_yingye_status_text: '请点菜品',
            dish_button_status: true
          });
        }
        that.initCartData();
        
      }
    })
  },
  get_location_bind:function(e){
    var that = this;
    var loc_lat = that.data.dish_data.dish_info[0].latitude;
    var loc_lng = that.data.dish_data.dish_info[0].longitude;
    console.log(loc_lat);
    console.log(loc_lng);
    wx.openLocation({
      latitude: parseFloat(loc_lat),
      longitude: parseFloat(loc_lng),
      scale: 18,
      name: that.data.dish_data.dish_info[0].dish_name,
      address: that.data.dish_data.dish_info[0].dish_quyu
    });

  },
  tapClassify: function (e) {
    var id = e.target.dataset.id;
    var seid = e.target.dataset.seid;
    this.setData({
      classifyViewed: id
    });
    var self = this;
    setTimeout(function () {
      self.setData({
        classifySeleted: seid
      });
    }, 100);
  },
  onGoodsScroll: function (e) {
    var that = this
    var scale = e.detail.scrollWidth / 570,
      scrollTop = e.detail.scrollTop / scale,
      h = 0,
      classifySeleted,
      len = that.data.dish_data.dish_cate.length;
    that.data.dish_data.dish_cate.forEach(function (classify, i) {
      var _h = 70 + classify.goods_list.length * (46 * 3 + 20 * 2);
      if (scrollTop >= h - 100 / scale) {
        classifySeleted = classify.id;
      }
      h += _h;
    });
    this.setData({
      classifySeleted: classifySeleted
    });
  },

  //显示隐藏购物车
  cart_list_show_bind: function () {
    var that = this;
    if (that.data.cart_list_isshow == true) {
      that.setData({
        cart_list_isshow: false
      });
    } else {
      that.setData({
        cart_list_isshow: true
      });
    }
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
})