//城市选择
var app = getApp();
var con = require('../../../utils/api.js');

Page({
  data: {
    shengArr: [],//省级数组
    shengId: [],//省级id数组
    shiArr: [],//城市数组
    shiId: [],//城市id数组
    quArr: [],//区数组
    shengIndex: 0,
    shiIndex: 0,
    quIndex: 0,
    mid: 0,
    sheng: 0,
    city: 0,
    area: 0,
    code: 0,
    id:0,
    arr_recipients: {

    },
  },
  formSubmit: function (e) {
    var that = this;
    var adds = e.detail.value;
     var id = this.data.id;
    var arr_recipients = {};
    var re_name = adds.name;
    var address = adds.address;
    var phone = adds.phone;
    var email = '';
    var province = that.data.province;
    var city = that.data.citys;
    var area = that.data.areaq;
    var country = '';
    var postalcode = '';
    var tel = ''
    arr_recipients.re_name = re_name;
    arr_recipients.address = address;
    arr_recipients.phone = phone;
    arr_recipients.email = email;
    arr_recipients.province = province;
    arr_recipients.city = city;
    arr_recipients.area = area;
    arr_recipients.country = country;
    arr_recipients.postalcode = postalcode;
    arr_recipients.tel = tel;


    console.log(333, arr_recipients);

    var name = e.detail.value.name;

    if (name.length == 0) {
      wx.showToast({
        title: '姓名不能为空',
        icon: "success",
        duration: 1500
      });
    }
    var phoneNum = e.detail.value.phone;
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (phoneNum.length == 0) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'success',
        duration: 1500,

      });
      return false;
    } else if (phoneNum.length != 11) {
      wx.showToast({
        title: '您输入的手机号长度有错',
        icon: "success",
        duration: 1500
      });
      return false;
    } else if (!myreg.test(phoneNum)) {
      wx.showToast({
        title: '输入的手机号有误',
        icon: "success",
        duration: 1500
      });
      return false;
    } else {
      wx.showToast({
        title: '输入正确',
        icon: "success",
        duration: 1500
      });
    };
    var address = e.detail.value.address;
    if (address.length == 0) {
      wx.showToast({
        title: '详细地址不能为空',
        icon: "success",
        duration: 1500
      })
    };
    wx.request({
      url: con.addRecipients,
      data: {
        wxappid: con.wxappid,
        fansid: app.globalData.fansid,
        recipients: JSON.stringify(arr_recipients),
        // sheng: this.data.sheng,
        // city: this.data.city,
        // quyu: this.data.area,
        // adds: adds.address,
        // code: this.data.code,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(123646456);
        // success
        var status = res.data.status;
        console.log(12121, res);
        if (status == 1) {
          wx.showToast({
            title: '保存成功！',
            duration: 2000
          });
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
        wx.redirectTo({
          url: 'address/index?id=' + id
        });
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })


  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    console.log(options);
    var that = this;
    that.setData({
      id: options.id
    })
    
    //获取省级城市
    wx.request({
      url: con.getprovince,
      data: {
        wxappid: con.wxappid
      },
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },

      success: function (res) {
        console.log(1231546);
        console.log(res);
        var status = res.data.status;
        var province = res.data.info;
        var sArr = [];
        var sId = [];
        sArr.push('请选择');
        sId.push('0');
        for (var i = 0; i < province.length; i++) {
          sArr.push(province[i].name);
          sId.push(province[i].code);
        }
        that.setData({
          shengArr: sArr,
          shengId: sId
        });
        console.log(that.data.shengArr);
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })

  },
  bindPickerChangeshengArr: function (e) {
    var code = this.data.shengId;

    this.setData({
      provinceCode: code[e.detail.value],
      province: this.data.shengArr[e.detail.value]
    })
    console.log(this.data.province);
    this.setData({
      shengIndex: e.detail.value,
      shiArr: [],
      shiId: [],
      quArr: [],
      quiId: []
    });
    var that = this;
    wx.request({
      url: con.getCitybyProvinceCode,
      data: { wxappid: con.wxappid, ProvinceCode: that.data.provinceCode },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(134564121, res);
        // success
        var status = res.data.status;
        var city = res.data.info;

        var hArr = [];
        var hId = [];
        hArr.push('请选择');
        hId.push('0');
        for (var i = 0; i < city.length; i++) {
          hArr.push(city[i].name);
          hId.push(city[i].code);
        }

        that.setData({
          sheng: res.data.sheng,
          shiArr: hArr,
          shiId: hId
        })
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },

    })
  },




  bindPickerChangeshiArr: function (e) {
    console.log(this.data.shiId);
    this.setData({
      shiIndex: e.detail.value,
      quArr: [],
      quiId: [],
      shiId: this.data.shiId[e.detail.value],
      citys: this.data.shiArr[e.detail.value]
    })
    console.log(this.data.city);
    var that = this;
    wx.request({
      url: con.getAreabyCityCode,
      data: {
        wxappid: con.wxappid,
        CityCode: that.data.shiId
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res);
        var status = res.data.status;
        var area = res.data.info;

        var qArr = [];
        var qId = [];
        qArr.push('请选择');
        qId.push('0');
        for (var i = 0; i < area.length; i++) {
          qArr.push(area[i].name)
          qId.push(area[i].id)
        }
        that.setData({
          city: res.data.city,
          quArr: qArr,
          quiId: qId
        })
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },
  bindPickerChangequArr: function (e) {
    console.log(this.data.city)
    this.setData({
      quIndex: e.detail.value,
      areaq: this.data.quArr[e.detail.value]
    });
    console.log(this.data.areaq);
    var that = this;
    // wx.request({
    //   url: app.d.ceshiUrl + '/Api/Address/get_code',
    //   data: {
    //     quyu:e.detail.value,
    //     city:this.data.city
    //   },
    //   method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    //   header: {// 设置请求的 header
    //     'Content-Type':  'application/x-www-form-urlencoded'
    //   },
    //   success: function (res) {
    //     that.setData({
    //       area:res.data.area,
    //       code:res.data.code
    //     })
    //   },
    //   fail: function () {
    //     // fail
    //     wx.showToast({
    //       title: '网络异常！',
    //       duration: 2000
    //     });
    //   }
    // })
  }

})