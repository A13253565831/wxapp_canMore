/*
    * @description    根据某个字段实现对json数组的排序
    * @param   array  要排序的json数组对象
    * @param   field  排序字段（此参数必须为字符串）
    * @param   reverse 是否倒序（默认为false）
    * @return  array  返回排序后的json数组
*/
function duoguanJsonSort(array, field, reverse){
    //数组长度小于2 或 没有指定排序字段 或 不是json格式数据
    if(array.length < 2 || !field || typeof array[0] !== "object") return array;
    //数字类型排序
    if(typeof array[0][field] === "number") {
        array.sort(function(x, y) { return x[field] - y[field]});
    }
    //字符串类型排序
    if(typeof array[0][field] === "string") {
        array.sort(function(x, y) { return x[field].localeCompare(y[field])});
    }
    //倒序
    if(reverse) {
        array.reverse();
    }
    return array;
}
module.exports = {
    duoguanJsonSort: duoguanJsonSort
};

