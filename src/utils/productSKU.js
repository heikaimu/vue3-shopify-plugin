/**
 * 获取商品的所有变体
 * @param {Object} product 
 * @returns {Array} 
 */
export function getSKUList(product) {
  const typeKeys = product.options.map((key) => {
    const arr = key.split(/[\:\?]/);
    return arr[0] ? arr[0] : "";
  });
  const list = [];
  for (const variant of product.variants) {
    const { price, options, id, sku } = variant;

    const obj = {
      price,
      id,
      sku,
      options: {}
    };

    for (let i = 0; i < typeKeys.length; i++) {
      const key = typeKeys[i];
      obj.options[key] = options[i];
    }

    list.push(obj);
  }
  return list;
}

/**
 * 推荐SKU
 * @param {*} list - 变体列表
 * @param {*} options - 推荐的属性
 * @returns {Object} - 推荐的SKU
 */
export function publishSKU(list, optionKey, options, publishName) {
  const other = {};

  Object.keys(options).forEach(key => {
    if (key !== optionKey) {
      other[key] = options[key];
    }
  })

  let otherList = list.filter(item => {
    return _isInclude(item.options, other);
  })

  otherList = _unique(otherList, 'price');
  const sortList = otherList.sort((a, b) => {
    return a.price - b.price
  })

  // 获取推荐
  const currentIndex = sortList.findIndex(item => {
    const isInclude = _isInclude(item.options, options);
    return isInclude;
  })
  const currentItem = sortList[currentIndex];

  let publishItem;
  const publishByName = sortList.find(item => item.options[optionKey] === publishName);
  if (publishName && publishByName) {
    if (publishByName.price < currentItem.price) {
      return false;
    }
    publishItem = publishByName;
  } else {
    publishItem = sortList[currentIndex + 1];
  }

  if (!publishItem || !currentItem) {
    return false;
  }

  if (publishItem.price === currentItem.price) {
    return false;
  }

  return {
    title: publishItem.options[optionKey],
    addPrice: publishItem.price - currentItem.price
  }
}

/**
 * 前者包含后者
 * @param {Object} a 
 * @param {Object} b 
 * @returns {Boolean}
 */
function _isInclude(a, b) {
  for (let key in b) {
    if (a[key] !== b[key]) {
      return false;
    }
  }

  return true;
}

/**
 * 去重
 * @param {Array} arr - 需要去重的数据
 * @param {String} key - 对比key
 * @returns {Array} - 新数组
 */
function _unique(arr, key) {
  const obj = {};
  const newArr = [];
  for (let i = 0; i < arr.length; i++) {
    if (!obj[arr[i][key]]) {
      obj[arr[i][key]] = 1
      newArr.push(arr[i])
    }
  }
  return newArr
}