/*
 * @Description:
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-09-10 11:22:07
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-02-16 15:18:25
 */
import { number } from '../src/utils/number';

test('整数测试', () => {
  const res = number(5, 2);
  expect(res).toBe('5.00');
});

test('小数测试', () => {
  const res = number(5.3, 2);
  expect(res).toBe('5.30');
});

test('小数测试', () => {
  const res = number(5.35, 2);
  expect(res).toBe('5.35');
});
