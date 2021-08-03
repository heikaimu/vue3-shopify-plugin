/*
 * @Description: 图片文件工具函数
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-05-07 16:48:42
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-08-02 15:02:07
 */

/**
 * 获取文件本地预览地址
 * @param {*} file - 源文件
 * @returns {String} - 本地预览地址
 */
function getObjectUrl(file) {
  var url = null;
  if (window.createObjectURL !== undefined) {
    url = window.createObjectURL(file);
  } else if (window.URL !== undefined) {
    url = window.URL.createObjectURL(file);
  } else if (window.webkitURL !== undefined) {
    url = window.webkitURL.createObjectURL(file);
  }
  return url;
}

/**
 * base64转blob
 * @param {String} dataurl - base64
 * @returns
 */
function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(','); var mime = arr[0].match(/:(.*?);/)[1];
  var bstr = atob(arr[1]); var n = bstr.length; var u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * bolb转base64
 * @param {Blob} blob - 文件blob
 * @returns
 */
function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = function (e) {
      resolve(e.target.result);
    };
  });
}

/**
 * 获取文件大小
 * @param {*} url 
 */
function getFileSize(url) {
  return new Promise((resolve) => {
    fetch(url)
      .then(response => response.blob())
      .then(res => {
        resolve(res.size)
      })
  })
}

/**
 * 获取一个随机ID
 * @param {number} length - 长度
 * @returns
 */
function getRandomID(length = 8) {
  return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36);
}

/**
 * 通过URL下载
 * @param {string} url
 */
function download(url) {
  var a = document.createElement('a');
  a.download = 'AI';
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * 旋转图片
 * @param {Object} option
 * @param {Blob | String} option.file - 文件
 * @param {Number} option.quality - 质量
 * @param {Number} option.targetSize - 目标尺寸
 * @param {Number} option.angle - 旋转角度 90 x
 * @returns
 */
function imageReset(option) {
  const file = option.file; // 文件blob
  const targetSize = option.targetSize ? Number(option.targetSize) : undefined; // 目标尺寸
  let angle = option.angle ? Number(option.angle) : undefined; // 选择角度
  let quality = option.quality ? Number(option.quality) : undefined; // 质量

  // 如果图片小于300kb, 则使用最大质量
  if (file.size < 307200) {
    quality = 1;
  }

  // 角度处理成360度以内
  angle = angle % 360;
  if (angle < 0) {
    angle = angle + 360;
  }

  // 获取当前方位
  let position;
  if (Math.abs(angle % 360) === 0) {
    position = 'bottom';
  } else if (Math.abs(angle % 270) === 0) {
    position = 'right';
  } else if (Math.abs(angle % 180) === 0) {
    position = 'top';
  } else if (Math.abs(angle % 90) === 0) {
    position = 'left';
  }

  // 压缩并旋转
  const compressAndRotate = (url) => {
    const ext = url.split(';')[0].replace('data:image/', '');

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        let imgWidth = img.width;
        let imgHeight = img.height;

        // 如果有目标尺寸，先通过宽高比判断长边
        if (targetSize && Math.max(imgWidth, imgHeight) > targetSize) {
          const scale = imgWidth / imgHeight;
          if (scale > 1) {
            imgWidth = targetSize;
            imgHeight = imgWidth / scale;
          } else if (scale < 1) {
            imgHeight = targetSize;
            imgWidth = imgHeight * scale;
          }
        }

        // 绘制图片，或旋转
        let width = imgWidth;
        let height = imgHeight;
        let left = 0;
        let top = 0;

        switch (position) {
          case 'bottom':
            width = imgWidth;
            height = imgHeight;
            left = 0;
            top = 0;
            break;

          case 'left':
            width = imgHeight;
            height = imgWidth;
            left = width;
            top = 0;
            break;

          case 'top':
            width = imgWidth;
            height = imgHeight;
            left = width;
            top = height;
            break;

          case 'right':
            width = imgHeight;
            height = imgWidth;
            left = 0;
            top = height;
            break;

          default:
            break;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = width;
        canvas.height = height;
        ctx.translate(left, top);

        ctx.rotate(Math.PI / 180 * angle);
        ctx.drawImage(img, 0, 0, imgWidth, imgHeight);

        url = canvas.toDataURL('image/' + ext, quality);
        resolve(url);
      };
      img.src = url;
    });
  };

  return new Promise((resolve) => {
    // 如果是blob
    if (typeof file === 'object') {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const url = reader.result;
        compressAndRotate(url).then(res => {
          resolve(res);
        });
      };
    } else if (typeof file === 'string' && file.indexOf('data:image') > -1) {
      // 如果是base64
      compressAndRotate(file).then(res => {
        resolve(res);
      });
    }
  });
}

/**
 * 亮度对比度调整
 * @param {String} url - base64
 * @param {Object} option - 配置
 * @param {Number} option.brightness - 亮度
 * @param {Number} option.contrast - 对比度
 * @returns
 */
function colorMatrix(url, option) {
  const brightness = option.brightness || 0; // 亮度
  const contrast = option.contrast || 1; // 对比度
  const ext = url.split(';')[0].replace('data:image/', ''); // 后缀
  return new Promise((resolve) => {
    const image = new Image();
    image.src = url;
    image.crossOrigin = 'Anonymous'; // 支持跨域图片
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, image.width, image.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // 获取米格像素点信息
      for (let p = 0; p < imageData.data.length; p += 4) {
        const R = imageData.data[p];
        const G = imageData.data[p + 1];
        const B = imageData.data[p + 2];

        imageData.data[p] = R * contrast + brightness;
        imageData.data[p + 1] = G * contrast + brightness;
        imageData.data[p + 2] = B * contrast + brightness;
      }

      ctx.putImageData(imageData, 0, 0);

      url = canvas.toDataURL('image/' + ext, 0.7);

      resolve(url);
    };
  });
}

/**
 * 防抖
 * @param {Function} fn - 函数
 * @param {Number} delay - 时间间隔
 * @returns
 */
function debounce(fn, delay) {
  let timer = null;

  return function () {
    const _this = this;
    const args = arguments;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    timer = setTimeout(() => {
      fn.apply(_this, args);
    }, delay);
  };
}

/**
 * 节，创建并返回一个像节流阀一样的函数，当重复调用函数的时候，最多每隔delay毫秒调用一次该函数
 * @param {Function} fn - 函数
 * @param {Number} delay - 时间间隔
 */
function throttle(fn, delay, atleast) {
  let timer = null;
  let previous = null;

  return function () {
    let now = +new Date();

    if (!previous) previous = now;
    if (atleast && now - previous > atleast) {
      fn();
      // 重置上一次开始时间为本次结束时间
      previous = now;
      clearTimeout(timer);
    } else {
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn();
        previous = null;
      }, delay);
    }
  }
}

/**
 * 裁剪图片
 * @param {File} image - 图片文件
 * @param {Number} x - 开始坐标x
 * @param {Number} y - 开始坐标y
 * @param {Number} width - 宽度
 * @param {Number} height - 高度
 * @returns
 */
function cropImage(image, x, y, width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, x, y, width, height, 0, 0, width, height);
  const url = canvas.toDataURL('image/png', 0.9);
  return url;
}

/**
 * 加载图片
 * @param {Array[String]} images - 图片链接数组
 */
function loadImages(images) {
  const loadImage = url => {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = function () {
        resolve(image);
      };
      image.crossOrigin = 'Anonymous'; // 支持跨域图片
      image.src = url;
    });
  };
  const queue = images.map(url => {
    return loadImage(url);
  });
  return new Promise((resolve) => {
    Promise.all(queue).then(res => {
      resolve(res);
    });
  });
}

/**
 * 多张图片合成
 * @param {Object} options
 * @param {Number} options.width - 宽度
 * @param {Number} options.height - 高度
 * @param {String} options.backgroundImage - 背景图（地址，base64）
 * @param {String} options.mainImage - 内容图（地址，base64）
 * @param {String} options.overlapImage - 遮盖图（地址，base64）
 */
function combineImages(options) {
  const { width, height, backgroundImage, mainImage, overlapImage } = options;
  const urlList = [];
  backgroundImage && urlList.push(backgroundImage);
  mainImage && urlList.push(mainImage);
  overlapImage && urlList.push(overlapImage);

  return new Promise((resolve) => {
    loadImages(urlList).then(images => {
      // 生成画布
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      // 渲染图片
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const x = (width - image.width) / 2;
        const y = (height - image.height) / 2;
        if (i === 1) {
          ctx.drawImage(image, x, y - 30, image.width, image.height);
        } else {
          ctx.drawImage(image, x, y, image.width, image.height);
        }
      }

      // 生成效果图
      const url = canvas.toDataURL('image/png', 0.9);
      resolve(url);
    });
  });
}

export {
  getObjectUrl,
  dataURLtoBlob,
  blobToDataURL,
  getFileSize,
  getRandomID,
  download,
  imageReset,
  colorMatrix,
  debounce,
  throttle,
  cropImage,
  loadImages,
  combineImages
};
