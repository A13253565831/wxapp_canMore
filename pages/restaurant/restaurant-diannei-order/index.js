var con = require("../../../utils/api");
var app = getApp();
var this_goods_id;

Page({
  data: {
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
    goods_a_info: {},
    totalprice: 0,
    diancan_id: 0,
    diancansn: 0,
    this_pages: 1,
    pagessize:10,
    hasMore: true,
    startX: 0, //开始坐标
    startY: 0

  },

  goods_info_bind: function(e){
    var that = this;
    var len = e.currentTarget.id;
    
    wx.navigateTo({
      url: '../restaurant-diannei-detail/detail?id='+len,
    })
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
      
    }
  },
  del_one:function(e){
    var that = this;
    var id = e.currentTarget.id;
    console.log(id);
    wx.showModal({
      title: '提示',
      content: '你确定要删除本菜品吗',
      success: function (res) {
        if (res.confirm) {

          wx.request({
            url: con.DianCanDelFromCart,
            method: "POST",
            data: {
              wxappid: con.wxappid,
              fansid: app.globalData.fansid,
              goodsid: id,
              tableid: that.data.this_table_id
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              // console.log(res);
              
              if (res.data.isSuccess == '1') {
                that.onShow();
                that.initCartData();
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
  //订单
  go_user_order_bind: function (e) {
    
    var that = this;
    wx.navigateTo({
      url: '/pages/restaurant/restaurant-diannei-list/list?diancansn=' + that.data.diancansn + '&totalprice='+that.data.totalprice
    });
  },
  tabSubBind: function (e) {
    var that = this;
    var this_target = e.target.id;
    that.setData({
      tabTit: this_target
    });
  },
  //桌台菜品选择
  DianCanSelectedList:function(){
     var that = this;
    wx.request({
      url: con.DianCanSelectedList,
      method: "POST",
      data: {
        wxappid: con.wxappid,
        tableid: that.data.this_table_id
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success:function(res){
        // console.log(res,333333333666666);
       
          that.setData({
            data_list: res.data,
            totalprice: res.data.totalprice,
            diancan_id: res.data.diancanid
          })
        
      }
    });  

  },  
  
  //跳转选址页面
  goods_order_bind: function (e) {
    var that = this;
    var len = e.currentTarget.dataset.id;
    var tableid = that.data.this_table_id;
    wx.navigateTo({
      url: '../restaurant-order-diannei/index?table_id=' + tableid,
    })
  },

  bind_cart_number_jian: function (e) {
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
      url: con.DianCanSubFromCart,
      method: "POST",
      data: {
        wxappid: con.wxappid,
        fansid: app.globalData.fansid,
        goodsid: this_goods_id,
        tableid: that.data.this_table_id
      },
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      success: function (res) {
        // console.log(res);
        if (res.data.isSuccess == "1") {
          //成功里面调用购物车数据,会实时更新
          that.initCartData();
        }

      }
    });
  },
  bind_cart_number_jia: function (e) {
    wx.showToast({
      title: '选餐中',
      icon: 'loading',
      duration: 1000
    });
    var that = this;
    var this_goods_id = e.currentTarget.id;
    var cart_id = e.currentTarget.dataset.cid;
    
    wx.request({
      url: con.DianCanAddtoCart,
      method: "POST",
      data: {
        wxappid: con.wxappid,
        fansid: app.globalData.fansid,
        goodsid: this_goods_id,
        tableid: that.data.this_table_id
      },
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      success: function (res) {
        //cartid返回来一个
        // console.log(res);
  
        if (res.data.isSuccess == "1") {
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
  initCartData: function () {
    var that = this;
    wx.getStorage({
      key: 'fansid',
      success: function (res) {
        
        wx.request({
          url: con.DianCanFansCart,
          data: {
            wxappid: con.wxappid,
            fansid: res.data,
            tableid: that.data.this_table_id
          },
          method: "POST",
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            // console.log(res,66666666666);
            
            that.setData({
              glist: res.data.cart_info.glist,
              cart_list: res.data.cart_info
.glist,
              all_g_number: res.data.cart_info
.all_g_number,
              all_g_price: res.data.cart_info
.all_g_price,
               glo_is_load: false
            });
            if (res.data.cart_info.all_g_number == 0) {
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
  clearCart: function () {
    var that = this;
    wx.request({
      url: con.DianCanClearfansCart,
      method: "POST",
      data: {
        wxappid: con.wxappid,
        fansid: app.globalData.fansid,
        tableid: that.data.this_table_id
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res);
        if (res.data.status == "1") {
          that.initCartData();
          that.setData({
            cart_list: '',
            all_g_number: '',
            all_g_price: ''
          });
        }

      }
    });
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
            url: con.DianCanClearfansCart,
            method: "POST",
            data: {
              wxappid: con.wxappid,
              fansid: app.globalData.fansid,
              tableid: that.data.this_table_id

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
  bindgoThere: function (e) {
    var that = this;
    var orderInfo = {};
    var goodsinfo = [];
    var goodsid = '', goodsname = '', num = '', price = '';
    for (var i = 0; i < that.data.glist.length; i++) {
      var test = {};
      console.log(that.data.glist[i]);
      test.goodsid = that.data.glist[i].id;
      test.goodsname = that.data.glist[i].name;
      test.num = that.data.glist[i].dish_num;
      test.price = that.data.glist[i].price;
      goodsinfo.push(test);
    }
    orderInfo.fansid = app.globalData.fansid;
    orderInfo.tableid = that.data.this_table_id;
    orderInfo.goodsinfo = goodsinfo;
    console.log(orderInfo);

    wx.request({
      url: con.DianCanAdd,
      method: "POST",
      data: {
        wxappid: con.wxappid,
        tableid: that.data.this_table_id,
        orderInfo: JSON.stringify(orderInfo)
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        // console.log(res, 12332111111);

        if (res.data.status == 1) {

          that.clearCart();
          
          
            that.setData({
              cart_list: res.data.isnull,
              all_g_number: res.data.isnull,
              all_g_price: res.data.isnull
            });
          
          wx.showModal({
            title: '提示',
            content: '确认您所选的菜品,可在桌台选菜中查看,桌台所选全部总菜品',
            showCancel: false,
            success: function (res) {
              console.log(res);

              if(res.confirm){
                that.initCartData();
                 that.onShow();
                 
              };
                
            }
          });
        }
      }
    })

  },
  bindsubmitMoney:function(){
    var that = this;
    wx.request({
      url: con.DianCanWxPay,
      method: "POST",
      data: {
        wxappid: con.wxappid,
        diancanid: that.data.diancan_id,
        fansid: app.globalData.fansid,
        price: that.data.totalprice
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:function(res){
        
        console.log(res);
        that.setData({
          diancansn: res.data.ordersn
        });
         wx.requestPayment({
          timeStamp: res.data.WxRequestParameters.timeStamp,
          nonceStr: res.data.WxRequestParameters.nonceStr,
          package: res.data.WxRequestParameters.package,
          signType: res.data.WxRequestParameters.signType,
          paySign: res.data.WxRequestParameters.paySign,
          appId: res.data.WxRequestParameters.appId,
          success:function(res){
            console.log(res);
            if (res.errMsg == 'requestPayment:ok'){
              that.initPayfinish();
              that.clearCart();
              that.onShow();
              wx.showModal({
                title: '点餐成功',
                content: '点餐成功后,将进入用餐状态,无法再进行点餐,如有需要请联系服务员',
                success: function(res){
                    if(res.confirm){
                      wx.navigateTo({
                        url: '../restaurant-diannei-list/list?diancansn='+that.data.diancansn,
                      })
                    }   
                }
              })
            }
          },
          fail: function(res){
            // console.log(res,1322);
            // that.initPayfinish();
            // that.clearCart();
            // that.onShow();
            wx.showModal({
              title: '支付失败',
              content: '请重新支付',
              success: function(res){
                 console.log(res,333222222); 
              }
            })  
          }
        })
        
      }
    })
  },
  initPayfinish: function(){
    var that = this;
    
    wx.request({
      url: con.DianCanPayComplete,
      method: "POST",
      data: {
        wxappid: con.wxappid,
        fansid: app.globalData.fansid,
        payprice: that.data.totalprice,
        diancansn: that.data.diancansn
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success:function(res){
        // console.log(res,33633666);
      }
    })
  },
  onLoad: function (options) {
    
    var that = this;
    var post_id = options.dish_id || 0;
    
    var table_id = options.table_id || 0;
      // console.log(options,3333333333);
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
    that.DianCanSelectedList();
    that.refreshTimeClear();  
  },
  onShow: function () {
    var that = this;
    that.setData({
      submitIsLoading: false
    });

    wx.request({
      url: con.Index_getdishinfo,
      method: "GET",
      data: {
        wxappid: con.wxappid
      },
      header: {
        "content-type": "application/json"
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          dish_data: res.data,
          classifySeleted: res.data.dish_cate[0].id,
          dish_yingye_status_val: res.data.is_yingye_status,
          glo_is_load: false
        });

        if (that.data.this_order_type == 2) {
          that.setData({
            this_type_text: res.data.dish_info[0].dish_show_text[2]
          });
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
        that.DianCanSelectedList(); 
        that.refreshTimeClear(); 
      }
    })
  },
  
  get_location_bind: function (e) {
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
  // loadMore: function(e){
  //   var that = this;
    // wx.showToast({
    //   title: '加载更多',
    //   icon: 'loading',
    //   duration: 1000
    // });

    // wx.request({
    //   url: con.getdishlist,
    //   method: "GET",
    //   data: {
    //     wxappid: con.wxappid,
    //     sid: that.data.classifySeleted,
    //     pageindex: that.data.this_pages++,
    //     pages: that.data.pagessize
    //   },
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function(res){        
    //     console.log(res);
    //     that.data.dish_data.dish_cate.goods_list.concat(res.data.page_list);
    //     that.setData({
    //       goods_list: that.data.dish_data.dish_cate.goods_list
    //     });
    //   } 
    // });

  // },
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

  delItem: function(e){
    var that = this;
    var id = e.currentTarget.id;
    wx.showModal({
      title: '提示',
      content: '您确定要删除所选菜品吗',

      success: function(res){
        res.confirm && wx.request({
          url: con.DianCanDelByid,
          method: "POST",
          data: {
            wxappid: con.wxappid,
            dcid: that.data.diancan_id,
            goodsid: id
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            that.DianCanSelectedList();
            if(res.data.code == 1){
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 1000
              });
            }
          }
        });
      }
    });
    
  },
  //刷新桌台超时清空
  refreshTimeClear: function(){
    var that = this;
    wx.request({
      url: con.tales_refresh,
      method: "POST",
      data: {
        wxappid: con.wxappid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res){
        console.log(res);
        if(res.data.code == 1){
          that.DianCanSelectedList();
        };
        
      }
    });
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