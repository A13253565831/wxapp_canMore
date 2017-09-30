import listener from 'listener';
import _Promise from 'bluebird';

/**
 * @param {Function} fun 接口
 * @param {Object} options 接口参数
 * @returns {Promise} Promise对象
*/
function Promise(fun, options) {
    options = options || {};
    return new _Promise((resolve, reject) => {
        if (typeof fun !== 'function') {
            reject();
        }
        options.success = resolve;
        options.fail = reject;
        fun(options);
    });
}

function formatTime(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()


    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

/**
 * 格式化日期
 */
function format(time, fmt) {
    time = time instanceof Date ? time : new Date(time);
    var o = {
        "M+": time.getMonth() + 1,                 //月份 
        "d+": time.getDate(),                    //日 
        "h+": time.getHours(),                   //小时 
        "m+": time.getMinutes(),                 //分 
        "s+": time.getSeconds(),                 //秒 
        "q+": Math.floor((time.getMonth() + 3) / 3), //季度 
        "S": time.getMilliseconds()             //毫秒 
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

/**
 * 格式化日期 - （人性化）(附加时间)
 * @param {Number|Date} time
 * @return {string}
 */
function formatSmartTime(time) {
    time = time instanceof Date ? time.getTime() : time;
    var diffTime = new Date().getTime() - time + 20000;

    //今天凌晨时间戳
    const toDayTime = new Date().setHours(0, 0, 0);
    //昨天凌晨时间戳
    const yesterDayTime = toDayTime - 86400000;
    //明天凌晨时间戳
    const tomorrowTime = toDayTime + 86400000;
    //前天凌晨时间戳
    const beforeYesterdayTime = yesterDayTime - 86400000;
    //后天凌晨时间戳
    const afterTomorrowTime = tomorrowTime + 86400000;

    if (diffTime < 0) {
        diffTime = Math.abs(diffTime);
        //大于一分钟
        if (diffTime < 60000) return "一会儿";
        //大于一分钟小于一小时
        if (diffTime >= 60000 && diffTime < 3600000) return parseInt(diffTime / 60000) + "分钟后";
        //今天
        if (time < tomorrowTime) return "今天" + format(time, "hh:mm");
        //明天
        if (time < afterTomorrowTime) return "明天" + format(time, "hh:mm");
        //后天
        if (time < afterTomorrowTime + 86400000) return "后天" + format(time, "hh:mm");
    } else {
        //小于一分钟
        if (diffTime < 60000) return "刚刚";
        //大于一分钟小于一小时
        if (diffTime >= 60000 && diffTime < 3600000) return parseInt(diffTime / 60000) + "分钟前";
        //今天
        if (time > toDayTime) return "今天" + format(time, "hh:mm");
        //昨天
        if (time > yesterDayTime) return "昨天" + format(time, "hh:mm");
        //前天
        if (time > beforeYesterdayTime) return "前天" + format(time, "hh:mm");
    }
    //月份/日 大于今年开始时间
    const toYearTime = new Date();
    toYearTime.setMonth(0, 0);
    toYearTime.setHours(0, 0, 0, 0);
    const toYearTime2 = new Date(time);
    toYearTime2.setMonth(0, 0);
    toYearTime2.setHours(0, 0, 0, 0);
    if (toYearTime.getTime() == toYearTime2.getTime())
        return format(time, "M月d日 hh:mm");
    return format(time, "yyyy年M月d日 hh:mm");
}

/**
 * 调用支付界面
 * @param {string} payInfo
 * @param {callback} callback
 */
function payment(payInfo, callback) {
    console.log("must pay param:", { notify_url: "业务处理回调地址错误！", total_amount: "总金额" });
    const payKey = 'pay_' + new Date().getTime();
    const getPayInfoHandler = function () {
        listener.removeEventListener('pay.get_payinfo_' + payKey, getPayInfoHandler);

        //触发设置信息接口
        listener.fireEventListener('pay.payinfo_' + payKey, [payInfo]);
        console.log('pay.payinfo_' + payKey, "fireEvented");
        const getPaymentResultHandler = function (res) {
            listener.removeEventListener('pay.result_' + payKey, getPaymentResultHandler);
            if (callback) {
                setTimeout(function () {
                    callback.call(null, res);
                }, 500);
            }
        };
        listener.addEventListener('pay.result_' + payKey, getPaymentResultHandler);

    };
    listener.addEventListener('pay.get_payinfo_' + payKey, getPayInfoHandler);
    console.log("waiting set get_payinfo");

    wx.navigateTo({
        url: '/pages/user/mcard/pay?key=' + payKey,
        fail: function () {
            listener.removeEventListener('pay.get_payinfo_' + payKey, getPayInfoHandler);
            wx.showModal({
                content: '无法调用余额界面，请尝试关闭一些界面！',
                showCancel: false,
            });
        },
    });
}

/**
 * 获取用户信息
 * @param {Function} callback
 */
function getUserInfo(callback) {
    wx.getUserInfo({
        success: (res) => {
            callback.call(null, res.userInfo);
        },
        fail: (res) => {
            console.error(res);
            const getUserInfo = function (info) {
                listener.removeEventListener('user.get_info', getUserInfo);
                if (info) callback.call(null, info);
            };
            listener.addEventListener('user.get_info', getUserInfo);
            wx.navigateTo({
                url: '../tips-info/index',
            });
        }
    });
}

module.exports = {
    format, formatTime, formatSmartTime,
    payment, getUserInfo, Promise
}
