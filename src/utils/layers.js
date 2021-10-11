/*
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-09-24 11:03:45
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-10-11 10:27:16
 */
import { getRandomID } from './image';

function getLayers({ config, files, skin }) {
  let layers = [];

  const body = getBody(config, skin);
  layers.push(body);

  const avatarList = getAvatarList(config, files);
  layers.push(...avatarList);

  const annexList = getAnnexList(config, skin);
  layers.push(...annexList);

  if (config.type === 'hood') {
    const svg = getSVG(config);
    layers.push(svg);
  }

  return layers
}

/**
 * 获取身体
 * @param {Object} config 
 * @param {String} skin 
 * @returns 
 */
function getBody(config, skin, id) {
  const currentBody = config.images.find((item) => item.color === skin);
  return {
    url: currentBody.url,
    left: 0,
    top: 0,
    width: config.width,
    sort: 1,
    globalCompositeOperation: config.type === "hood" ? "destination-over" : "",
    type: config.type === "normal" ? "background" : "overlay",
    id: id || getRandomID()
  }
}

/**
 * 获取附件
 * @param {Object} config 
 * @param {String} skin 
 * @returns 
 */
function getAnnexList(config, skin, id) {
  let list = [];
  if (config.annex && config.annex.length) {
    for (const item of config.annex) {
      const currentAnnex = item.images.find(
        (item) => item.color === skin
      );
      list.push({
        url: currentAnnex.url,
        left: item.left,
        top: item.top,
        angle: item.angle,
        width: item.width,
        sort: 4,
        customControls: true,
        type: "annex",
        id: id || getRandomID()
      });
    }
  }
  return list;
}

/**
 * 获取头像列表
 * @param {Object} config 
 * @param {String} skin 
 * @returns 
 */
function getAvatarList(config, files) {
  if (files.length === 0) {
    return [];
  }

  const list = config.faceList;
  return list.map((item, index) => {
    const avatar = files[index % files.length].avatar;
    return getAvatar(item, avatar);
  })
}

/**
 * 获取头像
 * @param {Object} config 
 * @param {String} skin 
 * @returns 
 */
function getAvatar(config, avatar, id) {
  const { left, top, angle, width } = config;
  return {
    left,
    top,
    angle,
    width,
    url: avatar.url,
    offset: avatar.chin,
    originX: "center",
    originY: "bottom",
    sort: 3,
    customControls: true,
    globalCompositeOperation: config.type === "hood" ? "source-atop" : "",
    type: "avatar",
    id: id || getRandomID()
  }
}

/**
 * 获取SVG遮盖
 * @param {Object} config 
 * @param {String} skin 
 * @returns 
 */
function getSVG(config, id) {
  return {
    url: config.avatar.path,
    left: config.avatar.left,
    top: config.avatar.top,
    width: config.avatar.width,
    sort: 2,
    selectable: false,
    type: "svg",
    id: id || getRandomID()
  }
}

export {
  getLayers,
  getBody,
  getAnnexList,
  getAvatar,
  getAvatarList,
  getSVG
}