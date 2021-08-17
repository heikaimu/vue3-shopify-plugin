/*
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-08-16 11:03:11
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-08-16 11:03:57
 */
export function number(val, inscriber = 2) {
  val += ''; // 数字转换为字符
  const x = val.split('.'); // 按照小数点分隔
  let x1 = x[0]; // 整数部分
  const x2 = x.length > 1 ? '.' + x[1] : ''; // 小数部分
  var rgx = /(\d+)(\d{3})/; // 正则式定义
  while (rgx.test(x1)) { // 正则式匹配
    x1 = x1.replace(rgx, '$1' + ',' + '$2'); // 正则式替换
  }
  return x1 + x2.substr(0, inscriber + 1);
}