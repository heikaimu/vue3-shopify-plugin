/*
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-09-24 11:03:45
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-01-18 17:18:35
 */
import { getRandomID } from './image';
const VBOX_URL = 'https://cdn.shopifycdn.net/s/files/1/0343/0275/4948/files/vFace.png?v=1634089968';

function getLayers({ config, files, skin }) {
  const layers = [];

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

  return layers;
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
    globalCompositeOperation: config.type === 'hood' ? 'destination-over' : '',
    type: config.type === 'normal' ? 'background' : 'overlay',
    id: id || getRandomID()
  };
}

/**
 * 获取附件
 * @param {Object} config
 * @param {String} skin
 * @returns
 */
function getAnnexList(config, skin, id) {
  const list = [];
  if (config.annex && config.annex.length) {
    for (const item of config.annex) {
      const currentAnnex = item.images.find(
        (item) => item.color === skin
      );

      const selectable = item.selectable === undefined || item.selectable === null ? true : item.selectable;

      list.push({
        url: currentAnnex.url,
        left: item.left,
        top: item.top,
        angle: item.angle,
        width: item.width,
        sort: 10,
        customControls: true,
        type: 'annex',
        selectable,
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
  files = files || [];
  const list = config.faceList;
  return list.map((item, index) => {
    const curFile = files[index % files.length];
    const avatar = curFile ? curFile.data.avatar : {url: VBOX_URL};
    item.configType = config.type;
    return getAvatar(item, avatar);
  });
}

/**
 * 获取头像
 * @param {Object} config
 * @param {String} skin
 * @returns
 */
function getAvatar(config, avatar, id) {
  const { left, top, angle, width, configType } = config;
  return {
    left,
    top,
    angle,
    width,
    url: avatar.url,
    offset: avatar.chin,
    originX: 'center',
    originY: 'bottom',
    sort: 3,
    customControls: true,
    globalCompositeOperation: configType === 'hood' ? 'source-atop' : '',
    type: 'avatar',
    id: id || getRandomID()
  };
}

function createVirtualBox(config) {
  const { left, top, angle, width, type } = config;
  return {
    left,
    top,
    angle,
    width,
    originX: "center",
    originY: "bottom",
    sort: 3,
    customControls: true,
    globalCompositeOperation: type === "hood" ? "source-atop" : "",
    type: "vBox",
    id: getRandomID(),
    selectable: false,
    name: `vBox`,
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
    type: 'svg',
    id: id || getRandomID()
  };
}

export {
  getLayers,
  getBody,
  getAnnexList,
  getAvatar,
  getAvatarList,
  getSVG,
  createVirtualBox
};
