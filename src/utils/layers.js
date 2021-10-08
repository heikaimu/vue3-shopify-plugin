/*
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-09-24 11:03:45
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-09-24 17:54:57
 */
import { getRandomID } from './image';

export function getLayers({ config, files, skin }) {
  let layers = [];

  const body = getBody(config, skin, config.type);
  layers.push(body);

  const avatarList = getAvatarList(config, files, config.type);
  layers.push(...avatarList);

  const annexList = getAnnexList(config, skin);
  layers.push(...annexList);

  if (config.type === 'hood') {
    const svg = getSVG(config);
    layers.push(svg);
  }

  return layers
}

function getBody(config, skin, type) {
  const currentBody = config.images.find((item) => item.color === skin);
  return {
    url: currentBody.url,
    left: 0,
    top: 0,
    width: config.width,
    sort: 1,
    globalCompositeOperation: type === "hood" ? "destination-over" : "",
    type: type === "normal" ? "background" : "overlay",
    id: getRandomID()
  }
}

function getAnnexList(config, skin) {
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
        id: getRandomID()
      });
    }
  }
  return list;
}

function getAvatarList(config, files, type) {
  if (files.length === 0) {
    return [];
  }

  const list = config.faceList;
  return list.map((item, index) => {
    const { left, top, angle, width } = item;
    const avatar = files[index % files.length].avatar;
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
      globalCompositeOperation: type === "hood" ? "source-atop" : "",
      type: "avatar",
      id: getRandomID()
    }
  })
}

function getSVG(config) {
  return {
    url: config.avatar.path,
    left: config.avatar.left,
    top: config.avatar.top,
    width: config.avatar.width,
    sort: 2,
    selectable: false,
    type: "svg",
    id: getRandomID()
  }
}