/*
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-08-13 10:29:16
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-10-26 11:00:46
 */
import { getSKUList, publishSKU } from '../src/utils/productSKU';
import { product } from '../products/blanket';
test('30" x 40"', () => {
  const list = getSKUList(product);
  const options = {
    Size: '30" x 40"'
  }
  const res = publishSKU(list, 'Size', options);
  expect(res).toEqual({
    title: '40" x 50"',
    addPrice: 1800
  });
})

test('30" x 40"', () => {
  const list = getSKUList(product);
  const options = {
    Size: '30" x 40"'
  }
  const res = publishSKU(list, 'Size', options, '60" x 80"');
  expect(res).toEqual({
    title: '60" x 80"',
    addPrice: 4500
  });
})

test('40" x 50"', () => {
  const list = getSKUList(product);
  const options = {
    Size: '40" x 50"'
  }
  const res = publishSKU(list, 'Size', options);
  expect(res).toEqual({
    title: '50" x 60"',
    addPrice: 900
  });
})

test('50" x 60"', () => {
  const list = getSKUList(product);
  const options = {
    Size: '50" x 60"'
  }
  const res = publishSKU(list, 'Size', options);
  expect(res).toEqual({
    title: '50" x 80"',
    addPrice: 1100
  });
})

test('50" x 80"', () => {
  const list = getSKUList(product);
  const options = {
    Size: '50" x 80"'
  }
  const res = publishSKU(list, 'Size', options);
  expect(res).toEqual({
    title: '60" x 80"',
    addPrice: 700
  });
})

test('60" x 80"', () => {
  const list = getSKUList(product);
  const options = {
    Size: '60" x 80"'
  }
  const res = publishSKU(list, 'Size', options);
  expect(res).toBe(false);
})