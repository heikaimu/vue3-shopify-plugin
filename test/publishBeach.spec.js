/*
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-08-13 10:29:16
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-08-17 13:36:40
 */
import { getSKUList, publishSKU } from '../src/utils/productSKU';
import { product } from '../shopifyBeachConfig';
test('测试尺寸27.6\" x 59\"', () => {
  const list = getSKUList(product);
  const options = {
    Size: "27.6\" x 59\""
  }
  const res = publishSKU(list, 'Size', options);
  expect(res).toEqual({
    title: '31.5\" x 63\"',
    addPrice: 1000
  });
})

test('测试尺寸31.5\" x 63\"', () => {
  const list = getSKUList(product);
  const options = {
    Size: "31.5\" x 63\""
  }
  const res = publishSKU(list, 'Size', options);
  expect(res).toEqual({
    title: '47\" x 79\"',
    addPrice: 500
  });
})

test('测试尺寸47\" x 79\"', () => {
  const list = getSKUList(product);
  const options = {
    Size: "47\" x 79\""
  }
  const res = publishSKU(list, 'Size', options);
  expect(res).toBe(false);
})
