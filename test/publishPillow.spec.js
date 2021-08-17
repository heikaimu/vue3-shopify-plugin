/*
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-08-13 10:29:16
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-08-16 13:38:21
 */
import { getSKUList, publishSKU } from '../src/utils/productSKU';
import { product } from '../shopifyPillowConfig';
test('异性抱枕尺寸1，单面', () => {
  const list = getSKUList(product);
  const options = {
    Size: "20cm-8\"",
    Type: "Single Side"
  }
  const res = publishSKU(list, 'Size', options);
  expect(res).toEqual({
    title: '30cm-12\"',
    addPrice: 500
  });
})

test('异性抱枕尺寸1，单面，推荐最大', () => {
  const list = getSKUList(product);
  const options = {
    Size: "20cm-8\"",
    Type: "Single Side"
  }
  const res = publishSKU(list, 'Size', options, '50cm-20"');
  expect(res).toEqual({
    title: '50cm-20\"',
    addPrice: 2000
  });
})

test('异性抱枕尺寸1，单面，推荐倒数第二大', () => {
  const list = getSKUList(product);
  const options = {
    Size: "20cm-8\"",
    Type: "Single Side"
  }
  const res = publishSKU(list, 'Size', options, '40cm-16"');
  expect(res).toEqual({
    title: '40cm-16\"',
    addPrice: 1000
  });
})

test('异性抱枕尺寸2，单面', () => {
  const list = getSKUList(product);
  const options = {
    Size: "30cm-12\"",
    Type: "Single Side"
  }
  const res = publishSKU(list, 'Size', options);
  expect(res).toEqual({
    title: '40cm-16\"',
    addPrice: 500
  });
})

test('异性抱枕尺寸3，单面', () => {
  const list = getSKUList(product);
  const options = {
    Size: "40cm-16\"",
    Type: "Single Side"
  }
  const res = publishSKU(list, 'Size', options);
  expect(res).toEqual({
    title: '50cm-20\"',
    addPrice: 1000
  });
})

test('异性抱枕尺寸4，单面', () => {
  const list = getSKUList(product);
  const options = {
    Size: "50cm-20\"",
    Type: "Single Side"
  }
  const res = publishSKU(list, 'Size', options);
  expect(res).toBe(false);
})

test('异性抱枕尺寸1，双面', () => {
  const list = getSKUList(product);
  const options = {
    Size: "20cm-8\"",
    Type: "Double Side"
  }
  const res = publishSKU(list, 'Size', options);
  expect(res).toEqual({
    title: '30cm-12\"',
    addPrice: 500
  });
})

test('异性抱枕尺寸2，双面', () => {
  const list = getSKUList(product);
  const options = {
    Size: "30cm-12\"",
    Type: "Double Side"
  }
  const res = publishSKU(list, 'Size', options);
  expect(res).toEqual({
    title: '40cm-16\"',
    addPrice: 500
  });
})

test('异性抱枕尺寸3，双面', () => {
  const list = getSKUList(product);
  const options = {
    Size: "40cm-16\"",
    Type: "Double Side"
  }
  const res = publishSKU(list, 'Size', options);
  expect(res).toEqual({
    title: '50cm-20\"',
    addPrice: 1000
  });
})

test('异性抱枕尺寸3，双面，更小的', () => {
  const list = getSKUList(product);
  const options = {
    Size: "40cm-16\"",
    Type: "Double Side"
  }
  const res = publishSKU(list, 'Size', options, '30cm-12"');
  expect(res).toBe(false);
})

test('异性抱枕尺寸4，双面', () => {
  const list = getSKUList(product);
  const options = {
    Size: "50cm-20\"",
    Type: "Double Side"
  }
  const res = publishSKU(list, 'Size', options);
  expect(res).toBe(false);
})

test('异性抱枕推荐单双面', () => {
  const list = getSKUList(product);
  const options = {
    Size: "50cm-20\"",
    Type: "Single Side"
  }
  const res = publishSKU(list, 'Type', options);
  expect(res).toEqual({
    title: 'Double Side',
    addPrice: 500
  });
})