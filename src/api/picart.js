import axios from 'axios';
import { dataURLtoBlob, cropImage } from '../utils/image';

const getToken = async (type) => {
  const { status, data } = await axios.post(`https://tsback.witemedia.com/api/v1/getSign?type=${type}`);
  if (status === 200 && data.status === '0') {
    return data.data;
  }
}

/**
 * 获取卡通图像
 * @param {String} base64 - 原始图像Base64
 * @returns {String} -卡通Base64
 */
export const getCartoonURL = async (base64) => {
  const token = await getToken(17);
  const { uid, signExpireTime, sign } = token;
  const url = `https://www.cutout.pro/api/v1/matting2?mattingType=17&crop=true&uid=${uid}&signExpireTime=${signExpireTime}&sign=${sign}&faceAnalysis=true`;
  const formData = new FormData();
  formData.append('file', dataURLtoBlob(base64));
  const { status, data } = await axios({
    method: 'post',
    url,
    data: formData,
    headers: {
      ContentType: 'multipart/form-data'
    }
  })

  if (status === 200 && data.code === 0) {
    return `data:image/png;base64,${data.data.imageBase64}`;
  }
}

/**
 * 获取卡通图像
 * @param {String} base64 - 原始图像Base64
 * @returns {Array} -头像Base64集合
 */
export const getAIAvatar = async (base64) => {
  const token = await getToken(3);
  const { uid, signExpireTime, sign } = token;
  const url = `https://www.cutout.pro/api/v1/matting2?mattingType=3&crop=true&uid=${uid}&signExpireTime=${signExpireTime}&sign=${sign}&faceAnalysis=true`;
  const formData = new FormData();
  formData.append('file', dataURLtoBlob(base64));
  const { status, data } = await axios({
    method: 'post',
    url,
    data: formData,
    headers: {
      ContentType: 'multipart/form-data'
    }
  })

  if (status === 200 && data.code === 0) {
    return new Promise((resolve) => {
      // 如果没有脸部信息或者只有一张脸,直接使用该脸部
      const { faceAnalysis, imageBase64 } = data.data;
      const { face_num, faces, points } = faceAnalysis;

      if (!face_num) {
        resolve(null);
      } else if (face_num === 1) {
        const avatar = {
          url: `data:image/png;base64,${imageBase64}`,
          chin: points[0][8]
        }
        resolve([avatar]);
      } else if (face_num > 1) {
        const image = new Image();
        image.onload = function () {
          const avatarList = faces.map((face, index) => {
            const chin = points[index][8];
            const scale = 1.4;
            let x = face[0];
            let y = face[1];
            const oWidth = face[2] - x;
            const oHeight = face[3] - y;
            const cWidth = oWidth * scale;
            const cHeight = oHeight * scale;
            x = x - (cWidth - oWidth) / 2;
            y = y - (cHeight - oHeight) / 2;
            const chinX = chin[0] - x;
            const chinY = chin[1] - y;
            const url = cropImage(image, x, y, cWidth, cHeight);
            return {
              url,
              chin: new Array(chinX, chinY)
            }
          })
          resolve(avatarList);
        }
        image.src = `data:image/png;base64,${imageBase64}`;
      }
    })
  }
}