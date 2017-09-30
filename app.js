//app.js
var con =require("utils/api.js");

App({
  onLaunch: function(){
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
    this.getUserInfo();
    // this.getAddress();
 
  },
  getUserInfo: function(){
    var that =this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {

      wx.login({
        success: function (o) {
          // console.log(o);
          wx.getUserInfo({
            success: function (res) {
              // console.log(res);
              wx.request({
                url: con.index_slogin,
                method: "POST",
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                  code: o.code,
                  wxappid: con.wxappid,
                  nickname: res.userInfo.nickName,
                  pic: res.userInfo.avatarUrl
                },
                success: function (res) {
                  
                  that.globalData.fansid = res.data.fansid;
                  console.log(res.data.fansid);
                  wx.setStorage({
                    key: 'fansid',
                    data: res.data.fansid,
                  })
                  console.log(222222,res.data.openid, res);
                  wx.setStorage({
                    key: 'openid',
                    data: res.data.openid,
                  })
                }
              })

              that.globalData.userInfo = res.userInfo
              // console.log(33333333,res.userInfo);
            }
          })
        }
      });
    }
  },
  // getAddress: function () {
  //   var that = this;
  //   wx.chooseAddress({
  //     success: function (r) {
  //       console.log(r);
  //     }
  //   })

  // },
  globalData:{
    fansId: ""
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  }

    
});









