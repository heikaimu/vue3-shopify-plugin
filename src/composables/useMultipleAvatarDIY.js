/*
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-11-16 10:57:28
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-12-07 15:26:59
 */
import { ref, nextTick } from "vue";
import CanvasRenderer from "../utils/canvasRenderer";
import {
  getSVG,
  getAnnexList,
  getBody,
  getAvatar,
} from "../utils/layers";
import { getRandomID, loadImage } from "../utils/image";

export default function useMultipleAvatarDIY(props) {

  const { config, skin } = props;
  const currentSkin = ref(skin);

  /**
   * ************ 实列化插件 *************
   */
  let fabricInstance = null;
  const canvasBox = ref(null);
  function createCanvas(canvasContainerID) {
    if (!fabricInstance) {
      const { width, height } = canvasBox.value.getBoundingClientRect();
      const normalHeight = (width / 500) * 660;
      fabricInstance = new CanvasRenderer(canvasContainerID, {
        width,
        height: Math.min(normalHeight, height),
        scale: width / config.width,
      });
    }
    return fabricInstance;
  }

  /**
   * ************ 图层数据列表 *************
   */
  function createRenderLayerList() {
    const list = [];
    // 添加底板图
    const body = getBody(config, currentSkin.value);
    list.push(body);

    // 添加附件图
    const annexList = getAnnexList(config, currentSkin.value);
    list.push(...annexList);

    // 如果是hood模式，添加svg蒙版层
    if (config.type === "hood") {
      const svg = getSVG(config);
      list.push(svg);
    }

    // 根据当前头的数量添加虚拟头
    const avatarList = config.faceList.map((item, index) => {
      const { left, top, angle, width } = item;
      return {
        left,
        top,
        angle,
        width,
        originX: "center",
        originY: "bottom",
        sort: 3,
        customControls: true,
        globalCompositeOperation: config.type === "hood" ? "source-atop" : "",
        type: "vBox",
        id: getRandomID(),
        selectable: false,
        name: `vBox${index}`,
      };
    });
    list.push(...avatarList);
    return list;
  }

  /**
   * ************ 虚拟头像 *************
   */
  let actionLayer = null;

  // 选择头像文件之前
  function beforeSelectAvatar(data) {
    actionLayer = data;
  }

  // 使用新的头像替换actionLayer
  function replaceActionLayer(data, flag = true) {
    const { avatar } = data;
    const { left, top, width, angle, scaleX, id, offset } = actionLayer;
    const scale = fabricInstance.scale;

    // 删除原始图层
    fabricInstance.remove({ layer: actionLayer });

    // 获取当前头像的定位，如果之前有偏移，在计算位置的时候先减去偏移量
    const offsetX = offset ? offset.left : 0;
    const offsetY = offset ? offset.top : 0;
    const avatarConfig = {
      left: (left - offsetX) / scale,
      top: (top - offsetY) / scale,
      width: (width * scaleX) / scale,
      angle,
      configType: props.config.type,
    };

    // 添加新头像
    const avatarLayer = getAvatar(avatarConfig, avatar, id);
    fabricInstance.add(avatarLayer, true).then(() => {
      topAnnex();
      createLayerNav();
    });

    // 添加进已选文件
    if (flag) {
      addSelectFiles(data, id);
    }

  }

  // 添加selected files
  function addSelectFiles(data, id) {
    const currentItem = props.selectFiles.find(item => item.id === id);
    if (!currentItem) {
      // 新增
      props.selectFiles.push({
        id,
        data,
      });
    } else {
      // 编辑
      currentItem.data = data;
    }
  }

  /**
   * ************ 图层导航 *************
   */
  const layerNavList = ref([]);
  const activeID = ref("");

  // 创建图层导航
  function createLayerNav() {
    // 设置当前激活图层
    const activeObject = fabricInstance.getActiveObject();
    activeID.value = activeObject ? activeObject.id : "";

    // 获取头像以及可以操作的附件，排序
    const availableLayers = findLayerListByType('annex', 'avatar')
      .sort((a, b) => {
        const textureA = Number(a.cacheKey.replace("texture", ""));
        const textureB = Number(b.cacheKey.replace("texture", ""));
        return textureB - textureA;
      });

    layerNavList.value = availableLayers.map((item) => {
      return {
        raw: item,
        id: item.id,
        url: item.getSrc(),
      };
    });
  }

  // 激活对应图层，点亮导航
  function handleActiveLayerNav({ id, raw }) {
    // 设置当前点亮的ID
    activeID.value = id;
    // 在图层列表中获取对应图层
    const activeLayer = _findLayerByID(id);
    // 当前图层存在则激活
    if (activeLayer.visible) {
      fabricInstance.setActiveObject(activeLayer);

      if (activeLayer.type === "avatar") {
        activeLayer.bringForward();
        topAnnex();
      }
    } else {
      revertAnnex(raw);
    }
  }

  // 上移图层
  function bringForwardLayer(layer) {
    activeID.value = layer.id;
    layer.bringForward();
    topAnnex();
  }

  // 置顶所有附件
  function topAnnex() {
    const annexList = findAllAnnexLayer();
    annexList.forEach((annex) => {
      annex.bringToFront();
    });
    fabricInstance.refresh();
  }

  /**
   * ************ 附件 *************
   */
  // 删除附件
  function removeAnnex(layer) {
    // 取消当前附件的选中状态
    activeID.value = "";

    layer.set({
      visible: false
    })
    fabricInstance.discardActiveObject();
  }

  // 恢复附件
  function revertAnnex(layer) {
    layer.set({
      visible: true
    })
    fabricInstance.setActiveObject(layer);
  }

  // 肤色
  function setNewSkin(val) {
    currentSkin.value = val;
  }

  // 重新渲染背景和附件
  const skinLoading = ref(false);
  async function renderBgAndAnnex(val) {
    setNewSkin(val);

    skinLoading.value = true;
    const queue = [];

    // 背景
    const bgParams = getBody(config, val);
    queue.push(fabricInstance.add(bgParams, false, false));

    // 附件
    const annexLayers = findAllAnnexLayer();
    for (let i = 0; i < config.annex.length; i++) {
      const currentAnnex = config.annex[i].images.find(item => item.color === val);
      if (currentAnnex && currentAnnex.url) {
          queue.push(setAnnexUrl(annexLayers[i], currentAnnex.url));
      }
    }
    Promise.all(queue).then(() => {
      fabricInstance.refresh();
      skinLoading.value = false;
    })
  }

  function setAnnexUrl(layer, url) {
    return new Promise((resolve) => {
      loadImage(url).then(image => {
        layer.setSrc(url, () => {
          layer.set({
            width: image.width,
            height: image.height
          })
          setTimeout(() => {
            resolve();
          }, 60);
        });
      })
    })
  }

  /**
   * ************* 通用 *************
   */
  // 通过ID获取到图层
  function _findLayerByID(id) {
    return fabricInstance.getObjects().find((item) => item.id === id);
  }

  // 通过type查询所有图层列表
  function findLayerListByType(...args) {
    return fabricInstance.getObjects().filter((item) => args.includes(item.type) && item.selectable);
  }

  // 所有的附件
  function findAllAnnexLayer() {
    return fabricInstance.getObjects().filter((item) => item.type === 'annex');
  }

  return {
    canvasBox,
    createCanvas,
    createRenderLayerList,
    layerNavList,
    activeID,
    currentSkin,
    skinLoading,
    createLayerNav,
    handleActiveLayerNav,
    removeAnnex,
    beforeSelectAvatar,
    replaceActionLayer,
    bringForwardLayer,
    findLayerListByType,
    setNewSkin,
    renderBgAndAnnex
  }
}