const app = getApp();
const QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');// 引入SDK核心类
const qqmapsdk = new QQMapWX({ key: '7DWBZ-XEW6R-HGGWQ-WZYXJ-FZUAV-MBBDY' });// 实例化API核心类
const con = require('../../../utils/api.js');

Page({
  data: {
    this_options: {},
    this_dish_id: 0,
    this_dish_info: '',
    this_dish_type: '',
    this_cate_id: 0,
    this_dish_cate_data: '',
    this_dish_cate_num: 0,
    this_ruzhu_show_status: true,
    this_latitude_data: 0,
    this_longitude_data: 0,
    glo_is_load: false,
    this_page_size: 1,
    this_page_num: 10,
    dish_sort_type: 1,
    is_loadmore: true,
    previewImage:[],
    shareDesc: ''
    
  },
  dish_diancan_bind: function (e) {
    var that = this;
    var cid = e.currentTarget.id;
    if (that.data.this_dish_info.dish_is_diannei == 1) {  
    wx.showModal({
      title: '提示',
      content: '如果需要扫餐桌二维码点餐,请点击确定,否则将进入选桌界面',
      success: function(res){
         if(res.confirm){
           if (that.data.this_dish_info.dish_is_rcode_open == 1) {
             wx.showToast({
               title: '加载中',
               icon: 'loading',
               duration: 1000 
             });
                wx.scanCode({
                  success: (res) => {
                    // console.log(res,123321);
                    if (res.path) {
                      wx.navigateTo({
                        url: '/' + res.path
                      });
                    }
                  }
                });        
           }
         }else{
           wx.navigateTo({
             url: '../restaurant-diannei-chosetable/table?cid='+cid,
           })
         } 
      }
    });
    }else {

      wx.showModal({
        title: '提示',
        content: "对不起，暂不支持店内点餐",
        showCancel: false
      });
      return;
    }
    
      
  },
  //预订
  dish_yuding_bind: function (e) {
    var that = this;

    wx.request({
      url: con.getyudingtype,
      method: "GET",
      data: {
        wxappid: con.wxappid,
        cid: e.currentTarget.id
      },
      header: {
        'content-type': 'application/json'
      },
      success:function(res){
        
        if(res.data.code == '1'){
          
          wx.showModal({
            title: '提示',
            content: '选择您想要的预约状态,点击确定就将进入预约点餐,否则将是预约状态',
            success:function(res){
              console.log(res);
              if(res.confirm){
              wx.navigateTo({
              url: '../restaurant-reserve/index?dish_id=' + e.currentTarget.id,
                });
              }else{
                wx.navigateTo({
                  url: '../restaurant-planned/planned?dish_id=' + e.currentTarget.id,
                });
              }
            }
          });
        }else if(res.data.code == '0'){
          wx.navigateTo({
            url: '../restaurant-planned/planned?dish_id=' + e.currentTarget.id,
          });
        }else{
          wx.showModal({
          title: '提示',
          content: "对不起，暂不支持预订",
          showCancel: false
          });
          return;
        }
      }
    });
    
  },
  //外卖
  dish_waimai_bind: function (e) {
    var that = this;
    if (that.data.this_dish_info.dish_is_waimai == 1) {
      wx.navigateTo({
        url: '../restaurant-single/index?dish_id=' + e.currentTarget.id + '&order_type=2'
      });
    } else {
      wx.showModal({
        title: '提示',
        content: "对不起，暂不支持外卖",
        showCancel: false
      });
      return;
    }
  },
  //转账
  zhuanzhang_bind: function (e) {
    wx.navigateTo({
      url: '../pay/index?dish_id=' + e.currentTarget.id
    });
  },
  get_location_bind: function () {
    wx.showToast({
      title: '地图加载中',
      icon: 'loading',
      duration: 10000,
      mask: true
    });
    var that = this;
    var loc_lat = that.data.this_dish_info.latitude;
    var loc_lng = that.data.this_dish_info.longitude;

    wx.openLocation({
      latitude: parseFloat(loc_lat),
      longitude: parseFloat(loc_lng),
      scale: 18,
      name: that.data.this_dish_info.dish_name,
      address: that.data.this_dish_info.dish_quyu
    });
  },
  //电话
  call_phone_bind: function () {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.this_dish_info.dish_con_mobile
    });
  },
  onLoad: function(options){
    var that = this;
    that.setData({
      this_options: options
    });
    that.loadSingleDishData(); 

    wx.request({
      url: con.getshareconfig,
      method: 'GET',
      data: {
        wxappid: con.wxappid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        // console.log(res);
        that.setData({
          shareDesc: res.data.info.desc
        });
      }
    });
  },
  loadSingleDishData:function(){
    var that = this;
    wx.request({
      url: con.getcompanylist,
      method: "GET",
      data: {
        wxappid: con.wxappid
      },
      header: {
        "Content-Type": "application/json"
      },
      success:function(res){
        for(var i in res.data.info){
          // console.log(res.data.info[i]);
          that.setData({
            this_dish_info: res.data.info[i],
            glo_is_load:false
          })
        }
      }
    })
  },
 

  onShareAppMessage: function () {
    var that = this;
    var shareDesc = that.data.shareDesc;
    var sharePath = 'pages/restaurant/restaurant-home/index';
    return {
      title: shareDesc,
      path: sharePath,
      success:function(res){
        // console.log(res);
      },  
    }; 
  },
  //图片放大
  // img_max_bind: function (e) {
  //   var that = this;
  //   wx.previewImage({ current: e.target.dataset.url, urls: that.data.this_dish_info.dish_shijing_arr });
  // },
  img_max_bind_zz: function (e) {
    var that = this;
    that.data.previewImage.push(that.data.this_dish_info.dish_zizhi);
    that.setData({
      previewImage: that.data.previewImage
    })
    wx.previewImage({ current: e.target.dataset.url, urls: that.data.previewImage });
  },
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this;
    that.setData({ this_cate_id: 0 });
    that.onLoad(that.data.this_options);
    that.loadSingleDishData();
    wx.showNavigationBarLoading() //在标题栏中显示加载
     setTimeout(() => {
       wx.hideNavigationBarLoading() //完成停止加载 
       wx.stopPullDownRefresh();
    }, 1000);
     
  },
  
})