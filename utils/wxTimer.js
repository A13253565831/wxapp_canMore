function GetRTime(endtime,that){
    //'2014/09/20 00:00:00'
    var EndTime= new Date(endtime);
    var NowTime = new Date();
    var t =EndTime.getTime() - NowTime.getTime();
    var d=0;
    var h=0;
    var m=0;
    var s=0;
    if(t>=0){
      d=Math.floor(t/1000/60/60/24);
      h=Math.floor(t/1000/60/60%24);
      m=Math.floor(t/1000/60%60);
      s=Math.floor(t/1000%60);
      that.setData({
          goods_tuan_status:true,
          shengTime:d+'天'+h+'时'+m+'分'+s+'秒后结束'
      })
      setTimeout(function(){
            GetRTime(endtime,that);
        }
    ,1000)
    }else{
        that.setData({
          goods_tuan_status:false,
          shengTime:'已结束'
      })
    }
}

function DaojishiTime(){
    
}
module.exports = {
    GetRTime: GetRTime
};
