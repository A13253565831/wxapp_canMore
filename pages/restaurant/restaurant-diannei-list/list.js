var con = require("../../../utils/api");
var app= getApp();
Page({
  data: {
    glo_is_load: true,
    tabTap: 1,
    this_group_val: -1,
    this_page: 1,//当前页码
    pagesize: 10,//每页数量
    totalprice: 0,
    showLoading: false,
    diancansn: ''
  },
  
  select_status_show:function(e){
    var that = this;
    var status = e.currentTarget.dataset.val;
    console.log(status);
    that.setData({
      this_group_val: status,
      this_page: 1,
      glo_is_load: false
    })
   that.onShow(); 
  },
  tabSubBind:function(e){
    var len = e.currentTarget.id;
    var that = this;
    that.setData({
      tabTap: len
    })
  },
  go_dish_info_bind:function(e){
    var that = this;
    wx.navigateBack({
      delta: 3
    })
  },
  bindgohome: function (e) {
    wx.navigateBack({
      delta: 4
    })
  },
  goToevaluate:function(e){
    
    var that = this;
    var id = e.currentTarget.dataset.id;
    var id2 = e.currentTarget.dataset.oid;
    // console.log(id);
    wx.showModal({
      title: '提示',
      content: '评价菜品只能评价本次支付订单状态,如果不评系统将自动清除评价,不能再次评价',
      showCancel:false,
      success:function(res){
        if(res.confirm){
          wx.navigateTo({
            url: '../restaurant-diannei-evaluate/evaluate?id=' + id + '&id2=' + id2,
          });
        }
      }
    })

    

  },
  onLoad:function(options){
    var that = this;
    var diancansn = options.diancansn;
    var total = options.totalprice;
    console.log(diancansn, 33333333);
    that.setData({
      diancansn: diancansn,
      totalprice: total
    });
    that.onShow();
  },
  onShow:function(){
    
    var that = this;
    
    
    wx.request({
      url: con.DianCanZhangdan,
      method: "POST",
      data: {
        wxappid: con.wxappid,
        diancansn: that.data.diancansn
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success:function(res){
        console.log(res);
        
        var oinfo = res.data.info;

        if (oinfo == 'diancansn is missing'){
          wx.showModal({
            title: '提示',
            content: '还没有您的订单,请您点餐,生成相应的订单',
            success:function(res){
              if(res.confirm){
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          });
        } else if (oinfo == '该订单未支付,或已关闭'){
          wx.showToast({
            title: '您的订单还没有支付,请支付您的订单',
            icon: 'loading',
            duration: 1500
          });
          that.setData({
            glo_is_load: true
          });

        }else{
          if (oinfo == null) {
            that.setData({ showLoading: false });
          } else {
            if (oinfo.length >= that.data.pagesize) {
              that.setData({ showLoading: true });
            } else {
              that.setData({ showLoading: false });
            }
          }
          that.setData({ oinfo: oinfo, glo_is_load: false });
          wx.hideToast();
        }
          
        
      }
    })
  },
  del_list: function () {
    var that = this;
    wx.request({
      url: con.pingjia_del,
      method: "POST",
      data: {
        wxappid: con.wxappid,
      }
    })
  },
  onPullDownRefresh: function () {
    var that = this;
    wx.showNavigationBarLoading() //在标题栏中显示加载
    that.onShow();
    setTimeout(() => {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1000)
  }
})