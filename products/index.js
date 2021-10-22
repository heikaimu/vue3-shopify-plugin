/*
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-10-20 11:24:44
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-10-20 13:13:36
 */
const files = import.meta.globEager("./*.js");

const products = [];

Object.keys(files).forEach(key => {
  products.push(files[key].default);
})

export default products;