var app = getApp();
var con = require("../../../utils/api");
Page({

  data: {

    this_dish_id: 0,
    this_dish_info: {},
    date_time: '',
    time_time: '',
    global_is_load: true,
    submitIsLoading: false,
    buttonIsDisabled: false,
  },
  bindDateChange: function (e) {

    this.setData({ date_time: e.detail.value });
  },
  bindTimeChange: function (e) {
    this.setData({ time_time: e.detail.value });
  },
  onLoad: function (options) {

    var that = this;
    var dish_id = options.dish_id;
    that.setData({ this_dish_id: dish_id });
  },
  onShow: function () {

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
      url: con.getcompanylist,
      method: "GET",
      data: {
        wxappid: con.wxappid
      },
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        for (var i in res.data.info) {
          that.setData({
            this_dish_info: res.data.info[i],
            global_is_load: false
          })
        }

      }
    })
  },
  formSubmit: function (e) {
    console.log(e);
    var that = this;
    var username = e.detail.value.yuding_name;
    var phone = e.detail.value.yuding_phone;
    var remark = e.detail.value.yuding_info;
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
        icon: 　'success',
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
      yuding.fansid = app.globalData.fansid;
      var yuyue = {};
      yuyue.username = username;
      yuyue.phone = phone;
      yuyue.remark = remark;
      yuyue.companyid = companyid;
      yuyue.yuyuedate = yuyuedate;
      yuyue.yuyuetime = yuyuetime;
      yuyue.usercount = usercount;
      yuding.yuyue = yuyue;
      console.log(yuyue);
      console.log(yuding);
      wx.request({
        url: con.addyuding,
        method: 'POST',
        data: {
          wxappid: con.wxappid,
          yuding: JSON.stringify(yuding)
        },
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          console.log(res.data);
          if (res.data.status == 1) {
            wx.showToast({
              title: '预订成功',
              icon: 'success',
              duration: 1000
            });
            that.setData({
              buttonIsDisabled: true
            });
          }
        }
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
})






