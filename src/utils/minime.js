/**
 * Minime 类
 * @param {String} canvasID - canvas的ID
 * @param {Object} size - 尺寸信息
 * @param {Number} size.width - 宽
 * @param {Number} size.height - 高
 * @param {Function} cb - 回调函数
 */

import { fabric } from 'fabric';
import 'fabric-customise-controls';

function Minime(canvasID, size) {
  this.canvasID = canvasID;
  this.size = size;
  this.eventObj = {};

  // 生成画布
  this.createCanvas();

  // 控制器
  this.customControlsPlugin();

  // 策略
  this.strategies = {
    normal: option => {
      return this.renderNormal(option);
    },
    hood: option => {
      return this.renderHood(option);
    }
  };
}

// 发布订阅模式
// 订阅
Minime.prototype.on = function(eventType, fn) {
  if (!this.eventObj[eventType]) {
    this.eventObj[eventType] = [];
  }
  this.eventObj[eventType].push(fn);
};

// 发布
Minime.prototype.emit = function() {
  const eventType = Array.prototype.shift.call(arguments);
  const arr = this.eventObj[eventType];
  if (!arr) {
    return;
  }

  for (let i = 0; i < arr.length; i++) {
    arr[i].apply(arr[i], arguments);
  }
};

// 创建画布
Minime.prototype.createCanvas = function() {
  this.canvas = new fabric.Canvas(this.canvasID, {
    width: this.size.width || 600,
    height: this.size.height || 600,
    selection: false
  });
  this.canvas.preserveObjectStacking = true;
};

// 通过插件设置控制器样式
Minime.prototype.customControlsPlugin = function(params) {
  const _this = this;
  // 事件
  fabric.Canvas.prototype.customiseControls({
    tl: {
      action: function(e, target) {
        if (typeof _this.replacePhoto === 'function') {
          _this.replacePhoto();
        }
      },
      cursor: 'pointer'
    },
    tr: {
      action: 'scale',
      cursor: 'pointer'
    },
    br: {
      action: 'rotate',
      cursor: 'pointer'
    },
    bl: {
      action: function(e, target) {
        const scaleX = target.scaleX;
        target.set({
          scaleX: -Math.abs(scaleX)
        });
        _this.canvas.renderAll();
      },
      cursor: 'pointer'
    }
  });
};

/**
* 设置配置项目，根据type选择对应策略
* @param {String} avatarResource - 头像资源
* @param {Object} option - 配置
* @returns
*/
Minime.prototype.setOption = function({ avatar, chin, option, skin, success, replacePhoto }) {
  this.skin = skin || 'white';

  if (!option) {
    return;
  }

  if (typeof success === 'function') {
    this.cb = success;
  }

  if (typeof replacePhoto === 'function') {
    this.replacePhoto = replacePhoto;
  }

  // 如果当前已经有绘制内容则先清空画板
  if (this.canvas) {
    this.canvas.clear();
  }

  this.globalScale = this.size.width / option.width; // 全局缩放比例
  this.avatarResource = avatar || ''; // 头像资源
  this.chin = chin; // 下巴坐标点
  this.option = JSON.parse(JSON.stringify(option)); // 配置
  const type = option.type; // 类型

  // 策略模式，根据type使用对应策略
  const strategy = this.strategies[type];
  if (strategy) strategy(this.option);
};

// normal类型
Minime.prototype.renderNormal = function() {
  this.renderBody().then(() => {
    this.renderAvatar().then((avatar) => {
      // this.canvas.setActiveObject(avatar);
      if (this.option.annex) {
        this.renderAnnexList().then(() => {
          this.renderSuccess();
        });
      } else {
        this.renderSuccess();
      }
    });
  });
};

// hood类型
Minime.prototype.renderHood = function() {
  this.renderMask().then(() => {
    this.renderAvatar('source-atop').then((avatar) => {
      // this.canvas.setActiveObject(avatar);
      this.renderBody('overlay', 'destination-over').then(() => {
        this.renderSuccess();
      });
    });
  });
};

// 渲染成功
Minime.prototype.renderSuccess = function() {
  if (this.cb) {
    this.cb(this.canvas);
  }
};

/**
* 渲染身体
* @param {String} level - 层级（背景还是覆盖层）
* @param {String} globalCompositeOperation - 叠加模式
* @returns {Promise}
*/
Minime.prototype.renderBody = function(level, globalCompositeOperation) {
  level = level || 'background';
  globalCompositeOperation = globalCompositeOperation || 'source-over';
  const item = this.option.images.find(item => item.color === this.skin);
  const url = item ? item.url : '';

  return new Promise((resolve, reject) => {
    fabric.Image.fromURL(url, img => {
      const scale = this.size.width / img.width;
      img.scale(scale).set({
        selectable: false,
        globalCompositeOperation
      });
      if (level === 'background') {
        this.canvas.setBackgroundImage(img, this.canvas.renderAll.bind(this.canvas));
      } else if (level === 'overlay') {
        this.canvas.setOverlayImage(img, this.canvas.renderAll.bind(this.canvas));
      }

      resolve();
    }, {
      crossOrigin: 'Anonymous'
    });
  });
};

/**
* 渲染遮盖svg
* @returns {Promise}
*/
Minime.prototype.renderMask = function() {
  const url = this.option.avatar.path;

  return new Promise((resolve, reject) => {
    fabric.loadSVGFromURL(url, (objects, options) => {
      const mask = fabric.util.groupSVGElements(objects, options);
      mask.scale(this.globalScale).set({
        left: this.getSize(mask.left),
        top: this.getSize(mask.top),
        fill: 'black',
        selectable: false
      });
      this.canvas.add(mask);

      resolve();
    });
  });
};

/**
* 渲染头部
* @param {String} globalCompositeOperation - 叠加模式
* @returns {Promise}
*/
Minime.prototype.renderAvatar = function(globalCompositeOperation) {
  globalCompositeOperation = globalCompositeOperation || 'source-over';
  const avatarOption = this.option.face;

  return new Promise((resolve, reject) => {
    this.avatarObject(avatarOption).then(avatar => {
      avatar.set({
        angle: avatarOption.angle || 0,
        active: true,
        globalCompositeOperation,
        originX: 'center',
        originY: 'bottom',
        centeredScaling: true,
        name: 'avatar'
      });

      avatar.on('moving', e => {
        this.updateSize(avatarOption, e, true);
      });

      avatar.on('scaling', e => {
        this.updateSize(avatarOption, e, true);
      });

      avatar.on('rotating', e => {
        this.updateSize(avatarOption, e, true);
      });

      // 显示
      avatar.setControlsVisibility({
        mtr: false,
        ml: false,
        mr: false,
        mt: false,
        mb: false
      });

      // 重构控制器样式
      avatar.customiseCornerIcons({
        settings: {
          borderColor: '#e02433',
          cornerSize: 25,
          cornerBackgroundColor: '#e02433',
          cornerShape: 'circle',
          cornerPadding: 10
        },
        tl: {
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACWklEQVRYR+2WS6hOYRSGn3coA5EBM6EwcAklROdQh4nBGVBCkWLgmCi3EaVcSilChGMgA7ekTBg45TbBwP1WTJQiMxlIr5b21n+2/9/f3sdf/+Ss2d7fWu/37vW9+/2W6HCow/szTKBSB2zvAHYCYyoe2Rdgn6RjqfwkAduTgXdAgJ5IAQLjgU1Z3lxJj8tqqhDYC+wBuiUNVCCA7a3AUeC0pM2VCdjuAdYC6wpFSaDiJrYfAXMK748AVyXdz9//7YDtNcCFFmyTrWxCYCVwqQVer6TrsdZI4B6wENgmKZi2PWyHNk4BDyUtKBIw8FTSzNTOtlcDS4ClwE/gZgZ6uULte2CSpD8f39iBIDAgqbsViO1RQHRnQ5bzEfgVgNnzXWCVpM8lGHeArtoEbIegQlgRB4GLkp7Fg+2pmU+sz9YnSvrQjITt+gRsjwZeAuOAHkm3W4D3AteAN/EHSPreRJxDInAICDc8J2lj2Tnbzn3jsKTt7SJwA1gBTJP0OkFgeogZuCVpWbsIfAJ+SApbTobtOP8RkuLIBsVQNdBxAh0/glyExyX1JTSwCzgAtFWEE4DnwMjcQEqMJgztGzBF0te2aCAzmzCZ/gxwd9hvwYiiM1uy9cWSwhX/iSGJMEexvQiIWyyfjIpWHMbTJ+l8SYfqG1EjmO2xme3OAOLiirsgpp5XwElJQapl/FcHkgZQIaGMQMwDs4FZkt5WwKqdYjvwHwBPms0D4fFngBfAldro1QqWA/Ma58tBQ6ntLmA/ML8aXu2smAX7JZ3NK5NTce0tahYME+h4B34DdsNYMI+a3t0AAAAASUVORK5CYII='
          // icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACjUlEQVRYR8VXv4+NURA9p0ehUCkJIaGwFRI2kUiERGMLREiEhFqhQuUvIKEhYiOxhcIWJBIrsSpbkBAbdCoRhd3+yLzMfRnfu/f77vsR71bvffd+M2fuzDkzHzHlxSn7x1gAJG2zAEh+GzWQkQFI2gXgkzveTfLzKCDGAXAYwGt3Okty6X8D2APggzvdS/LjRAFIugngEIA3JO33wPIzVgNt+zcA3CqdKaZAkl2vXbOtooFS1JJOAniW9klmfbUBsKgMva0lkrNNZ5J2OAtWM3tVAbQWYS4Nki4BOAfAamCjO14DYDXwiOR9eybJbs8CKKawB36YwpH0HsC+jndWSM7U2q0GIOkpgFPB8DyAV/7/CIAzYW+B5FwNiCoAko4DeB4MzpFciA4kGTgDmdYJkotdIGoBLAPY78ZmSK7kDEuy9FiabL0jeWAoAK7tWwH8jsIiyYpsA4DOqw2pWieZitSK0op2M4AfsXf0b6Ch7Qa8x/3G86sk77ZFJekKgDt+ptcjnE2J0rbV7x0RgHW2r8F4AmBc/+LPL5B82AHgPIAHfmYnydUMgO3pFv6pAY92C4C1mGdJf5zz8yTPdgB47IwwG5vSWa8PS8nP2Dlri/AtgFRQAwwITiITlkkeHKoIS4dd/e6F/QEmNBhgRy8nVWwDUXUDZiCjgqYDaQYw2Y0iVa2G1QAcRFMNc8F1UjW+1NWMjgG4BuAiye8OwlTxujcj0wZb696Mbkf1k2Ty/Ivky1IaatvxE5Knm0acNTaQDMyDjXlgKgPJUQAvEuhxBpIi+sqRrHWsG6oIYwoatCs2qInoQM6ITzxTHctj7+hre1fEzf2RU+CUtK+jLAtqgYwFoNbJRKR4Es5yNv4C17IiMHYEETkAAAAASUVORK5CYII='
        },
        tr: {
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABLElEQVRYR+2WMU7EMBBF3z8Doqei4RJLQ0EPNR0V/XbsHoICKmpqeujokbgESFzhI6+8KERObIeEFVLcejz/+c+ME7HjpR3rMwP8Xwds3wKHNT0k6bgdP8gB2w/AWY048DwmwAkQHDiogBgPoEIU247xM8C0DtheAVfAa7PZ/qQEUfw61vpT0t62TwYDxDl/kXTf13Qt8RC6lhTc2KxBAI05/3GbNkhO/DcAT8AiJJCUfKxKxCcDKBWfBCAhvpK07uoT2+/APnAn6bLoW2A7WYJa8ejABXAq6TwF2VXfLoDtbUKu3puXPte1AAHsCLjps71UfNPkqeCuEtQkLo2dAbIOFFr5BiwlPRbGf4eNBRASJuc8B9QHkDvb3P/omvNckkE/pbmkNfszwOzAF0fStCFcRTQ2AAAAAElFTkSuQmCC'
        },
        bl: {
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAgCAYAAACPb1E+AAAC8ElEQVRYR82YT4hNYRjGf092bGzIhlIWapRkoYT8yUoUNigZRUZZGaEUMynKNLNRakRG+RNFip0yo1HKYhYSjYWQzSzEQknUq/d2zu27555z7jlnzpVvc+vc7z3P77zn/Z7zfp+oMMzsPrBA0qYw3MwMGJN0ML5uZruAB8CApMEKcqhskJntA257nKSW+AhyIoQ3swHgHPALWClpuqxmFcgnwLYKkB5yXtLZrkKa2TpgMhYpmUkP+wCskPSzDGipTJrZFeDoLCA9tE/SaFcgzWwJ8A6YmwPp9ee12vj1EdRkfOmFpPXdgjwNXASeAlvTajJNOAXSp22X5LVdaBR+3Wb2BugB9gJ3MxZOkUx66D1JewoR+pspMjGwnY+Ae+B4xdUdyrkdvS6iXxQyth23D1/ddUCOSOqvBTJhO4uBZTVBzgBLi9hRx0wGtnNL0n4z21gTpCexX9JIp2zmQka28ym6yWZJ4zVDTklaPVvI2HZeSVoT+V6dmfRb7pb0MA+0UyY/A16HRyRdLQBZ1IJCpseSdlSCDGznO7BQ0u9OkCXMPDk1144yM2lmz4ENwLCkE/FdO9Skl4J/FieC+XGrlpesUUl9WRNSIRO20yPpbUFIb3qz+sk8yB/R20rtjrIgx4ADQFu91Ly6Q/BTki6lPUkbZMJ2dkp6FAZ2EXJa0vKikHENpQZ1ETLTjtIy+Q2YD5yUNJR8si5DPpO0JamZ3Eh5HXo9+gLw3eDXfwzpcm12lIScAlYB1yUdyvC9vC9OFTNPylyTdDi82IQ0M/dE90YfayW9LAs5CzNvWZvAvLA7CiF9A+8b+UlJDpw6OtRkHZl03RY7akAmbKdX0s2KkFXNPCn3RZL3DI0RQw4Dx4EZSYuyAKMHqrsLypJrdkcx5B9gDnBB0pn/BLL5eZWZHQMuR2AtB1A5sHXscfJyEf/XsCOHdMFG91J2VDhmKSsx6AcNDnkD6C0b7XtvSX7C1hxmdgd4nzjBiI/+KkjQgPwLZlwVP+daef0AAAAASUVORK5CYII='
        },
        br: {
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC5ElEQVRYR8WWSahOYRjHf/9YoFCsWMhcMi1koRApN+MOkWJhWphKsSHExrBBFvdSigyxNIQNoSwMyQJZGCLDgmRDUX89er/Pueeeb7rfp/vUW9/5zjnP/3fe95lED5t6WJ9uAdgeCkxM6zvwFngHvJcU13Vb3QC2pwDrgDnAqCoK54Bzkq7WQ1ETICMc4mE/gFdpvQB6AYOAwUBAxu6E3QOOS7pQDaQqgO0lwMXk4ANwAmiX9LHIqe0hwHpgbQZkg6T2ShAVAXLie6sJ550nkIPAynRvu6RDRRCFADnxlZLO1nOeBSDHgI3p/82S4rqTVQKIbY/tny3pdnfES+/Y3gPsBuIIZ0iK+ClbtSOYJul+M+Lxru3ewB1gWsSQpFIw/3VdMwuaBUgQC4AryVebpJslv50AbC8Hfku61ArhrA/bEUcrgF2S9ncBsN0feAj8kjThPwCsBk4BlyUtLgI4DGxLN/ZKiuBpmdkeDkTh+gZMlvS5HAO2ZwG3cmp9Jf1sliBlQcnNVGA+EHXlXxDavgbMy4mdlrSqBQDxceG/b4GvLbK9CThaQWi8pGctgDgAbM/5eSNpRABEkShlQ/wO2gflLWpBLKQAj+Y0KQOxSNKVchqmHv8EGACMk/S62S/PpWGkeLTqsGuSojZ0LkS2bwBzo5tJOtlKgPBlOwACpHy0+UK0D9gJnJcURaOlZnsssEZSOR7yAG3A9aS6sN6pphFK232y6d2lF9juSANFNKKZkn43IlD0rO1Jkp4W3SsCGAncTRNN0xUxM1tckrQ0D1FpHsjWhiOStnZnF3KDzdKiJldtHoi+EP0h7Aywo9IsWGHbo++XZsFC8S5pmHdkO4bLiImwmkNpSrUQjhUTclhF8ZoAyeGyNNdNz4BEwYqu9hX4AoxOa0wa0ePRAO+Q9Kja8dU9EdmOyhW1oVp9eAnEDFlTuARVN0DpBdsDgWGZ1Q94DDyX9KnRYG0YoFGBWs/3OMAfr8wMGJFpMYMAAAAASUVORK5CYII='
        }
      }, () => {
        this.canvas.renderAll();
      });

      this.canvas.add(avatar);

      resolve(avatar);
    });
  });
};

Minime.prototype.avatarObject = function(avatarOption) {
  // avatarResource
  return new Promise((resolve, reject) => {
    if (!this.avatarResource) {
      const avatar = new fabric.Rect({
        top: this.getSize(avatarOption.top),
        left: this.getSize(avatarOption.left),
        width: this.getSize(avatarOption.width),
        height: this.getSize(avatarOption.height),
        fill: 'blue'
      });

      resolve(avatar);
    } else {
      fabric.Image.fromURL(this.avatarResource, avatar => {
        const scale = this.getSize(avatarOption.width) / avatar.width;
        const offsetX = 0;
        let offsetY = 0;

        if (this.chin) {
          // const chinLeft = this.chin[0] * scale;
          const chinTop = this.chin[1] * scale;
          // const centerX = avatar.width * scale / 2;
          const bottomY = avatar.height * scale;
          // offsetX = centerX - chinLeft; 注释调X轴偏移
          offsetY = bottomY - chinTop;
        }

        avatar.scale(scale).set({
          left: this.getSize(avatarOption.left) + offsetX,
          top: this.getSize(avatarOption.top) + offsetY
        });

        // 根据下巴点偏移重新设置top和left
        avatarOption.top = avatarOption.top + this.setSize(offsetY);
        avatarOption.left = avatarOption.left + this.setSize(offsetX);

        resolve(avatar, this.avatarResource);
      }, {
        crossOrigin: 'Anonymous'
      });
    }
  });
};

/**
* 渲染附件集合
* @returns {Promise}
*/
Minime.prototype.renderAnnexList = function() {
  return new Promise((resolve, reject) => {
    const annexList = this.option.annex || [];
    const promiseAnnexList = annexList.map((annex, index) => {
      return this.renderAnnexItem(annex, index);
    });

    Promise.all(promiseAnnexList).then(() => {
      resolve();
    });
  });
};

/**
* 渲染附件
* @param {Object} data
* @returns {Promise}
*/
Minime.prototype.renderAnnexItem = function(data, index) {
  return new Promise((resolve, reject) => {
    const url = data.images.find(item => item.color === this.skin).url;
    fabric.Image.fromURL(url, img => {
      const scale = this.getSize(data.width) / img.width;
      img.scale(scale).set({
        left: this.getSize(data.left),
        top: this.getSize(data.top),
        centeredScaling: true,
        name: `annex${index}`
      });
      this.canvas.add(img);

      resolve();

      img.on('moving', e => {
        this.updateSize(data, e);
      });

      img.on('scaling', e => {
        this.updateSize(data, e);
      });

      img.on('rotating', e => {
        this.updateSize(data, e);
      });

      img.setControlsVisibility({ // 这个方法是重点
        tl: false,
        bl: false,
        mtr: false,
        ml: false,
        mr: false,
        mt: false,
        mb: false
      });

      // 重构控制器样式
      img.customiseCornerIcons({
        settings: {
          borderColor: '#e02433',
          cornerSize: 25,
          cornerBackgroundColor: '#e02433',
          cornerShape: 'circle',
          cornerPadding: 10
        },
        tr: {
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABLElEQVRYR+2WMU7EMBBF3z8Doqei4RJLQ0EPNR0V/XbsHoICKmpqeujokbgESFzhI6+8KERObIeEFVLcejz/+c+ME7HjpR3rMwP8Xwds3wKHNT0k6bgdP8gB2w/AWY048DwmwAkQHDiogBgPoEIU247xM8C0DtheAVfAa7PZ/qQEUfw61vpT0t62TwYDxDl/kXTf13Qt8RC6lhTc2KxBAI05/3GbNkhO/DcAT8AiJJCUfKxKxCcDKBWfBCAhvpK07uoT2+/APnAn6bLoW2A7WYJa8ejABXAq6TwF2VXfLoDtbUKu3puXPte1AAHsCLjps71UfNPkqeCuEtQkLo2dAbIOFFr5BiwlPRbGf4eNBRASJuc8B9QHkDvb3P/omvNckkE/pbmkNfszwOzAF0fStCFcRTQ2AAAAAElFTkSuQmCC'
        },
        br: {
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC5ElEQVRYR8WWSahOYRjHf/9YoFCsWMhcMi1koRApN+MOkWJhWphKsSHExrBBFvdSigyxNIQNoSwMyQJZGCLDgmRDUX89er/Pueeeb7rfp/vUW9/5zjnP/3fe95lED5t6WJ9uAdgeCkxM6zvwFngHvJcU13Vb3QC2pwDrgDnAqCoK54Bzkq7WQ1ETICMc4mE/gFdpvQB6AYOAwUBAxu6E3QOOS7pQDaQqgO0lwMXk4ANwAmiX9LHIqe0hwHpgbQZkg6T2ShAVAXLie6sJ550nkIPAynRvu6RDRRCFADnxlZLO1nOeBSDHgI3p/82S4rqTVQKIbY/tny3pdnfES+/Y3gPsBuIIZ0iK+ClbtSOYJul+M+Lxru3ewB1gWsSQpFIw/3VdMwuaBUgQC4AryVebpJslv50AbC8Hfku61ArhrA/bEUcrgF2S9ncBsN0feAj8kjThPwCsBk4BlyUtLgI4DGxLN/ZKiuBpmdkeDkTh+gZMlvS5HAO2ZwG3cmp9Jf1sliBlQcnNVGA+EHXlXxDavgbMy4mdlrSqBQDxceG/b4GvLbK9CThaQWi8pGctgDgAbM/5eSNpRABEkShlQ/wO2gflLWpBLKQAj+Y0KQOxSNKVchqmHv8EGACMk/S62S/PpWGkeLTqsGuSojZ0LkS2bwBzo5tJOtlKgPBlOwACpHy0+UK0D9gJnJcURaOlZnsssEZSOR7yAG3A9aS6sN6pphFK232y6d2lF9juSANFNKKZkn43IlD0rO1Jkp4W3SsCGAncTRNN0xUxM1tckrQ0D1FpHsjWhiOStnZnF3KDzdKiJldtHoi+EP0h7Aywo9IsWGHbo++XZsFC8S5pmHdkO4bLiImwmkNpSrUQjhUTclhF8ZoAyeGyNNdNz4BEwYqu9hX4AoxOa0wa0ePRAO+Q9Kja8dU9EdmOyhW1oVp9eAnEDFlTuARVN0DpBdsDgWGZ1Q94DDyX9KnRYG0YoFGBWs/3OMAfr8wMGJFpMYMAAAAASUVORK5CYII='
        }
      }, () => {
        this.canvas.renderAll();
      });
    }, {
      crossOrigin: 'Anonymous'
    });
  });
};

/**
* 获取尺寸信息
* @param {Number} val - 尺寸
*/
Minime.prototype.getSize = function(val) {
  if (isNaN(Number(val))) {
    return 0;
  }

  return parseInt(val * this.globalScale);
};

/**
* 设置尺寸信息
* @param {Number} val - 尺寸
*/
Minime.prototype.setSize = function(val) {
  if (isNaN(Number(val))) {
    return 0;
  }

  return parseInt(val / this.globalScale);
};

/**
* 更新尺寸
* @param {*} obj - 对象
* @param {*} e
*/
Minime.prototype.updateSize = function(obj, e, avatar) {
  const target = e.transform.target;
  const { left, top, width, height, scaleX, scaleY, angle } = target;
  obj.left = this.setSize(left);
  obj.top = this.setSize(top);
  obj.width = this.setSize(width * scaleX);
  obj.height = this.setSize(height * scaleY);
  obj.angle = angle;

  // 发布状态
  if (avatar) {
    if (this.eventObj['update']) {
      this.emit('update', obj);
    }
  }
};

// 获取当前配置项
Minime.prototype.getOption = function() {
  return JSON.parse(JSON.stringify(this.option));
};

// 生产最终数据
Minime.prototype.toDataURL = function() {
  return this.canvas.toDataURL({
    format: 'png',
    quality: 1
  });
};

Minime.prototype.destroy = function() {
  this.canvas.width = 0;
  this.canvas.height = 0;
  this.canvas.clear();
  this.canvas = null;
};

// 判断是否是base64
// function isBase64(str) {
//   var reg = /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i;
//   return reg.test(str);
// }

export default Minime;
