var WYY_HOST_URL = "https://wxapi.weiyunyi.com";
var c = "Dish";
module.exports = {
    wyy_host_api_url:WYY_HOST_URL,
    wxappid: "6",
    //获取指定菜品详情 菜品id
    id: "12132",
    //获取指定门店的菜品
    cid: "864",
    //获取指定分类下的菜品 关联菜品分类id
    sid: "2632",
    //获取指定门店信息  根据门店id获取门店详情
    id: "866",
    //获取菜品分类详情 id
    id: "2624",
    //根据餐桌id获取预定单 tableid
    tableid: "844",
    //根据订单号获取预订单详情
    ordernum: "123",
    
    wyy_share_info:'',
    wyy_config_version:2567,
    //获取所有菜品
    getdish:  WYY_HOST_URL + "/Wap.php/"+c+"/getdish",
    //获取所有已上架菜品
    getondish: WYY_HOST_URL + "/Wap.php/"+ c+ "/getondish",
    //获取所有已下架菜品
    getoffdish: WYY_HOST_URL + "/Wap.php/" + c + "/getoffdish",
    //获取指定门店的菜品 cid
    getdishbycid: WYY_HOST_URL + "/Wap.php/" + c + "/getdishbycid",
    //获取指定菜品详情 id=12132
    getdishbyid_detail: WYY_HOST_URL+ "/Wap.php/" + c+ "/getdishbyid",
    //获取指定分类下的菜品  sid=2627
    getdishbysid_classyfy_dish: WYY_HOST_URL + "/Wap.php/" + c + "/getdishbysid",
    //获取所有门店数据列表
    getcompanylist: WYY_HOST_URL + "/Wap.php/" + c + "/getcompanylist",
    //获取指定门店信息  根据门店id获取门店详情 id=866
    getcompanybyid_detail: WYY_HOST_URL + "/Wap.php/" + c + "/getcompanybyid",
    //获取指定门店的菜品分类  根据门店id获取门店的菜品分类 cid
    getcompanysort: WYY_HOST_URL + "/Wap.php/"　+ c + "/getcompanysort",
    //获取菜品分类详情 id=2624

    getsortinfo: WYY_HOST_URL + "/Wap.php/" + c + "/getsortinfo",

    //获取分享设置列表
    getshareconfig: WYY_HOST_URL + "/Wap.php/" + c + "/getshareconfig",

    //获取所有餐桌列表
    gettablelist: WYY_HOST_URL + "/Wap.php/" + c +　"/gettablelist",

    //获取指定门店的餐桌列表   根据门店id获取餐桌列表+cid
    gettablebycid: WYY_HOST_URL + "/Wap.php/" + c +　"/gettablebycid",

    //根据门店id和餐桌状态获取餐桌列表  根据门店id和餐桌状态获取餐桌列表,cid,status=0
    gettbalebystatus: WYY_HOST_URL + "/Wap.php/" + c + "/gettbalebystatus",

    //获取指定餐桌的预订记录 根据餐桌id获取预定单 tableid
    getyudingbytableid: WYY_HOST_URL + "/Wap.php/" + c + "/getyudingbytableid",

    //根据id获取预订单详情 id=2
    getyudingbyid: WYY_HOST_URL + "/Wap.php/" + c + "/getyudingbyid",

    //根据订单号获取预订单详情 ordernum=123
    getyudingbyordernum: WYY_HOST_URL + "/Wap.php/" + c + "/getyudingbyordernum",

    //根据门店id获取该门店所有预定单 根据门店id获取该门店所有预定单 cid
    getyudingbycid: WYY_HOST_URL + "/Wap.php/" + c + "/getyudingbycid",

    //获取指定粉丝的所有预订单
    getyudingbyfansid: WYY_HOST_URL + "/Wap.php/" + c + "/getyudingbyfansid",

    //获取单门店首页展示信息
    getDishOneInfo: WYY_HOST_URL + "/Wap.php/" + c + "/getDishOneInfo",

    //菜品的综合排序 cid=864
    getdishascbycid: WYY_HOST_URL + "/Wap.php/" + c + "/getdishascbycid",
    
    //销量排序
    getdishAscbySales: WYY_HOST_URL + "/Wap.php/" + c + "/getdishAscbySales",

    // 获取粉丝的购物车菜品总数及菜品详单
    getfanscartlist: WYY_HOST_URL + "/Wap.php/" + c + "/getfanscartlist",

    //添加（＋1）菜品进入粉丝的购物车
    addgoodstocart: WYY_HOST_URL + "/Wap.php/" + c + "/addgoodstocart",

    //从购物车减去（-1）商品菜品
    subgoodsfromcart: WYY_HOST_URL + "/Wap.php/" + c + "/subgoodsfromcart",
    
    //从粉丝购物车删除指定菜品
    delgoodsfromcart: WYY_HOST_URL + "/Wap.php/" + c + "/delgoodsfromcart",



    //用户登录slogin
    index_slogin:WYY_HOST_URL + "/Wap.php/Index/slogin",
    //错误日志errorLog
    index_errorLog :WYY_HOST_URL + "/Wap.php/Index/errorLog",
    //获取分享信息 getShareInfo
    index_getShareInfo:WYY_HOST_URL + "/Wap.php/Index/getShareInfo",
    //获取用户菜单列表 getUserMenuList
    Index_getUserMenuList:WYY_HOST_URL + "/Wap.php/Index/getUserMenuList",
    //获取用户信息 getUserInfo
    Index_getUserInfo:WYY_HOST_URL + "/Wap.php/Index/getUserInfo",
    //编辑用户信息 editUserInfo
    Index_editUserInfo:WYY_HOST_URL + "/Wap.php/Index/editUserInfo",
    //获取用户支付日志 getUserPaylog
    Index_getUserPaylog:WYY_HOST_URL + "/Wap.php/Index/getUserPaylog",
    //创建支付数据 makePayData
    Index_makePayData:WYY_HOST_URL + "/Wap.php/Index/makePayData",
    ////以下医疗行业方法
    //获取商家基本信息 getinfo
    hospital_getinfo:WYY_HOST_URL + "/Wap.php/"+ c +"/getinfo",
    //获取商家首页幻灯片 getslide
    hospital_getslide:WYY_HOST_URL + "/Wap.php/"+ c +"/getslide",
    //获取商家分类 gettype
    hospital_gettype: WYY_HOST_URL + "/Wap.php/" + c +"/gettype",
    //获取图库分组 getphotogroup
    hospital_getphotogroup: WYY_HOST_URL + "/Wap.php/" + c +"/getphotogroup",
    //获取图库图片 getphoto
    hospital_getphoto: WYY_HOST_URL + "/Wap.php/" + c +"/getphoto",
    //获取文章 getartical
    hospital_getartical: WYY_HOST_URL + "/Wap.php/" + c +"/getartical",
    //获取预约列表 getprelist
    hospital_getprelist: WYY_HOST_URL + "/Wap.php/" + c +"/getprelist",
    //获取预约详情 getpre
    hospital_getpre: WYY_HOST_URL + "/Wap.php/" + c +"/getpre",
    //提交预约信息 prerecord
    hospital_postprerecord: WYY_HOST_URL + "/Wap.php/" + c +"/postprerecord",
    //获取评价信息 getevaluation
    hospital_getevaluation: WYY_HOST_URL + "/Wap.php/" + c +"/getevaluation",
    // 获取首页文章列表
    homegetartical: WYY_HOST_URL + "/Wap.php/" + c +"/homegetartical",
    //文章列表
    gettarticallist: WYY_HOST_URL + "/Wap.php/" + c + "/gettarticallist",
    // 首页图库分组
    homegetphotogroup: WYY_HOST_URL + "/Wap.php/" + c + "/homegetphotogroup",
    // 首页预约列表
    homegetprelist: WYY_HOST_URL + "/Wap.php/" + c + "/homegetprelist",
   
    getmap: WYY_HOST_URL + "/Wap.php/" + c + "/getmap",

    //转帐接口
    wxpaytoCompany: WYY_HOST_URL + "/Wap.php/" + c + "/wxpaytoCompany",
    
    //点餐数据
    Index_getdishinfo: WYY_HOST_URL + "/Wap.php/" + c + "/getdishinfo",

    //设置外卖订单支付完成

    setwmPayStatusComplete: WYY_HOST_URL + "/Wap.php/" + c + "/setwmPayStatusComplete",

    //清空购物车
    clearfanscart: WYY_HOST_URL + "/Wap.php/" + c + "/clearfanscart",

    //获取购物车已选择商品信息列表
    getcartgoodsbySelected: WYY_HOST_URL + "/Wap.php/" + c + "/getcartgoodsbySelected",

    //查询粉丝收货地址
    getFansRecipients: WYY_HOST_URL + "/Wap.php/" + c + "/getFansRecipients",

    //添加添加粉丝收货地址
    addRecipients: WYY_HOST_URL + "/Wap.php/" + c + "/addRecipients",

    //获取省份列表
    getprovince: WYY_HOST_URL + "/Wap.php/" + c + "/getprovince",

    //获取指定省份下的城市列表
    getCitybyProvinceCode: WYY_HOST_URL + "/Wap.php/" + c + "/getCitybyProvinceCode",


    //获取指定城市的区域列表
    getAreabyCityCode: WYY_HOST_URL + "/Wap.php/" + c + "/getAreabyCityCode",

    //更新粉丝收获地址
    updateRecipients: WYY_HOST_URL + "/Wap.php/" + c  + "/updateRecipients",

    //设置粉丝默认收货地址
    SetDefaultRecipients: WYY_HOST_URL + "/Wap.php/" + c + "/SetDefaultRecipients",

    //删除粉丝收货地址
    delRecipients: WYY_HOST_URL + "/Wap.php/" + c + "/delRecipients",

    //添加外卖订单并调用微信统一下单接口
    addorder: WYY_HOST_URL + "/Wap.php/" + c + "/addorder",

    //获取粉丝的外卖订单集合,分类输出
    getfansorder: WYY_HOST_URL + "/Wap.php/" + c + "/getfansorder",

    //取消订单
    setDelOrder: WYY_HOST_URL + "/Wap.php/" + c + "/setDelOrder",

    //获取订单详情页数据
    getOrderBysn: WYY_HOST_URL + "/Wap.php/" + c + "/getOrderBysn",

    //菜品支付订单
    getWxPayParameters: WYY_HOST_URL + "/Wap.php/" + c + "/getWxPayParameters",

    //设置订单支付状态
    setOrderStatus: WYY_HOST_URL + "/Wap.php/" + c +  "/setOrderStatus",

    //待评价
    setevaluation: WYY_HOST_URL + "/Wap.php/" + c + "/setevaluation",

    //获取评价日期
    gettime: WYY_HOST_URL + "/Wap.php/" + c + "/gettime",

    //预定
    addyuding: WYY_HOST_URL + "/Wap.php/" + c + "/addyuding",

    //点餐的购物车数据
    DianCanFansCart: WYY_HOST_URL + "/Wap.php/" + c + "/DianCanFansCart",

    //点餐点击添加进购物车
    DianCanAddtoCart: WYY_HOST_URL + "/Wap.php/" + c + "/DianCanAddtoCart",

    //点餐点击减去商品
    DianCanSubFromCart: WYY_HOST_URL + "/Wap.php/" + c + "/DianCanSubFromCart",

    //点餐从购物车内删除商品
    DianCanDelFromCart: WYY_HOST_URL + "/Wap.php/" + c + "/DianCanDelFromCart",

    //清空购物车
    DianCanClearfansCart: WYY_HOST_URL + "/Wap.php/" + c + "/DianCanClearfansCart",

    //提交个人选菜
    DianCanAdd: WYY_HOST_URL + "/Wap.php/" + c + "/DianCanAdd",

    //查看桌台的菜品
    DianCanSelectedList: WYY_HOST_URL + "/Wap.php/" + c + "/DianCanSelectedList",

    //点餐支付统一下单
    DianCanWxPay: WYY_HOST_URL + "/Wap.php/" + c + "/DianCanWxPay",
    
    //点餐支付完成设置的状态
    DianCanPayComplete: WYY_HOST_URL + "/Wap.php/" + c + "/DianCanPayComplete",

    //点餐结账信息
    DianCanZhangdan: WYY_HOST_URL + "/Wap.php/" + c + "/DianCanZhangdan",

    //转账结束
    setzzpaystatus: WYY_HOST_URL + "/Wap.php/" + c + "/setzzpaystatus",

    //获取粉丝历史点餐记录
    getFansDiancanLogs: WYY_HOST_URL + "/Wap.php/" + c + "/getFansDiancanLogs",

    //删除粉丝点餐记录

    del_diancan_log: WYY_HOST_URL + "/Wap.php/" + c + "/del_diancan_log",

    //点餐账单
    DianCanZhangdan: WYY_HOST_URL + "/Wap.php/" + c + "/DianCanZhangdan",

    //版权声明
    get_copyright: WYY_HOST_URL + "/Wap.php/" + c + "/get_copyright",

    //点餐评价
    pingjia_add: WYY_HOST_URL + "/Wap.php/" + c + "/pingjia_add",

    //删除菜品评价
    pingjia_del: WYY_HOST_URL + "/Wap.php/" + c + "/pingjia_del",

    //查询菜品评价
    pingjia_find: WYY_HOST_URL + "/Wap.php/" + c + "/pingjia_find",

    //菜品评价页面
    pingjia_cai: WYY_HOST_URL + "/Wap.php/" + c +  "/pingjia_cai",

    //评价列表
    pingjia_list: WYY_HOST_URL + "/Wap.php/" + c + "/pingjia_list",

    //分类输出
    pingjia_fenji: WYY_HOST_URL + "/Wap.php/" + c +"/pingjia_fenji",

    //预订购物车获取菜品总数和菜品详单
    yuding_getfanscartlist: WYY_HOST_URL + "/Wap.php/" + c + "/yuding_getfanscartlist",

    //添加+1进购物车
    yuding_addgoodstocart: WYY_HOST_URL + "/Wap.php/" + c + "/yuding_addgoodstocart",

    //减1购物车
    yuding_subgoodsfromcart: WYY_HOST_URL + "/Wap.php/" + c + "/yuding_subgoodsfromcart",
    
    //从购物车删除商品
    yuding_delgoodsfromcart: WYY_HOST_URL + "/Wap.php/" + c + "/yuding_delgoodsfromcart",

    //清空购物车
    yuding_clearfanscart: WYY_HOST_URL + "/Wap.php/" + c + "/yuding_clearfanscart",

    //获取预订类型
    getyudingtype: WYY_HOST_URL + "/Wap.php/" + c +　"/getyudingtype",

    //根据菜品id数组获取购物车已选择菜品信息列表
    yuding_getcartgoodsbySelected: WYY_HOST_URL + "/Wap.php/" + c + "/yuding_getcartgoodsbySelected",

    //添加预订点餐订单
    addyuding_diancan: WYY_HOST_URL + "/Wap.php/" + c + "/addyuding_diancan",


    //预订订金支付完成
    yuding_setPayStatusComplete: WYY_HOST_URL + "/Wap.php/" + c + "/yuding_setPayStatusComplete",

    //获取预约订单
    yuding_getinfo: WYY_HOST_URL + "/Wap.php/" + c + "/yuding_getinfo",

    //根据id删除预约订单
    yuding_delbyid: WYY_HOST_URL + "/Wap.php/" + c + "/yuding_delbyid",

    //首页的分享
    getshareconfig: WYY_HOST_URL + "/Wap.php/" + c + "/getshareconfig",

    //根据门店列表获取餐桌列表
    gettablebycid: WYY_HOST_URL + "/Wap.php/" + c + "/gettablebycid",

    //删除桌台菜品
    DianCanDelByid: WYY_HOST_URL + "/Wap.php/" + c + "/DianCanDelByid",

    //刷新清空桌台信息
    tales_refresh: WYY_HOST_URL + "/Wap.php/" + c + "/tales_refresh",

    //获取固定数量分类菜品
    getdishlist: WYY_HOST_URL + "/Wap.php/" + c + "/getdishlist"
}




