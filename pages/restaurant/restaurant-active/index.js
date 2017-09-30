var con = require("../../../utils/api");
var app = getApp();
Page({
  data:{
    this_dish_info:{}
  },
  onLoad:function(options){
    var that = this;
    var dish_id = options.dish_id;
    that.setData({ this_dish_id: dish_id });
    wx.request({
      url: con.getcompanylist,
      method: "GET",
      data: {
        wxappid: con.wxappid
      },
      header: {
        "content-type": "application/json"
      },
      success:function(res){
        for(var i in res.data.info){
          console.log(res.data.info[i]);
          that.setData({
            this_dish_info: res.data.info[i]
          })
        }
      }
    })
  },
  go_back_bind: function () {
    wx.navigateBack(1);
  }
})