/**
 * 获取对象的值
 * @param {Object} form
 * @param  {...any} selectors
 * @returns
 */
export function getValue(form, ...selectors) {
  const res = selectors.map(s => {
    return s
      .replace(/\[(\w+)\]/g, '.$1')
      .split('.')
      .reduce((prev, cur) => {
        return prev && prev[cur];
      }, form);
  });
  return res;
}
