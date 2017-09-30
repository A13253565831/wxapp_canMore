var con = require('../../../utils/api');
var app = getApp();
Page({
  data: {
    glo_is_load: true,
    dish_data: '',
    cart_list_isshow: false,
    scrollDown: false,
    dish_button_status: true,
    submitIsLoading: false,
    dish_yingye_status_text: '请您点餐',
    all_g_number: 0,
    all_g_price: 0,
    glist: '',
    dishid: ''

  },
  
  goods_order_bind:function(){
    var that = this;
    wx.navigateTo({
       url: '../restaurant-reserve-detail/detail?dish_id='+that.data.dishid,
    });
    
  },
//清空购物车
  cart_delete_bind:function(e){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '你确定要清空购物车吗',
      success:function(res){
        if(res.confirm){
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
            success: function (res) {
              console.log(res);
              that.setData({
                all_g_number: res.data.isnull,
                all_g_price: res.data.isnull,
                glist: res.data.isnull
              });
              if (res.data.isSuccess == '1'){
                that.initCart();
                wx.showToast({
                  title: '清空购物车成功',
                  icon: 'success',
                  duration: 1000
                });                
              }
            }
          });
        }
      }
    });
    
  },
  //删除菜品
  del_one:function(e){
    var that = this;
    var id = e.currentTarget.id;
    wx.showModal({
      title: '提示',
      content: '你确定要删除本菜品吗',
      success:function(res){
        if(res.confirm){

          wx.request({
            url: con.yuding_delgoodsfromcart,
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
                that.initCart();
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
    var that = this;
    wx.showToast({
      title: '点餐中',
      icon: 'loading',
      duration: 1000
    })
    var cid = e.currentTarget.dataset.cid;
    var id = e.currentTarget.id;
    wx.request({
      url: con.yuding_subgoodsfromcart,
      method: "POST",
      data: {
        wxappid: con.wxappid,
        fansid: app.globalData.fansid,
        goodsid: id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:function(res){
        console.log(res);
        if (res.data.isSuccess == '1'){
          that.initCart();
          wx.showToast({
            title: '选餐成功',
            duration: 1000
          });

        }else{

          wx.showToast({
            title: '选餐失败',
            durations: 1000
          });
        }
      }
    });
  },

  bind_cart_number_jia:function(e){
    var that = this;
    wx.showToast({
      title: '点餐中',
      icon: 'loading',
      duration: 1000
    });
    var id = e.currentTarget.id;
    wx.request({
      url: con.yuding_addgoodstocart,
      method: "POST",
      data: {
        wxappid: con.wxappid,
        fansid: app.globalData.fansid,
        goodsid: id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:function(res){
        console.log(res);
        if (res.data.isSuccess == 1){
          that.initCart();
          wx.showToast({
            title: '选餐成功',
            duration: 1000
          });
        }else{
          wx.showToast({
            title: '选餐失败',
            durations: 1000
          });
        }
      }
    });
  },     
  onLoad:function(options){
     var that = this;
     that.setData({
       dishid: options.dish_id
     });
     that.initCart();
  },
  onShow:function(){
    var that = this;
    that.setData({
      submitIsLoading: false
    });
    wx.request({
      
      url: con.Index_getdishinfo,
      method: "POST",
      data: {
        wxappid: con.wxappid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:function(res){
        console.log(res);
        that.initCart();
        that.setData({
          dish_data: res.data,
          glo_is_load: false
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
        wx.hideToast();
      }
    });
  },
  initCart: function () {
    var that = this;
    wx.request({
      url: con.yuding_getfanscartlist,
      method: 　"POST",
      data: {
        wxappid: con.wxappid,
        fansid: app.globalData.fansid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        
        
        that.setData({
          all_g_number: res.data.info.all_g_number,
          all_g_price: res.data.info.all_g_price,
          glist: res.data.info.glist,
          glo_is_load: false
        });
        
        wx.hideToast();
        
      }
    });
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
  cart_list_show_bind:function(){
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