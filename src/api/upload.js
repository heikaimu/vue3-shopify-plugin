/*
 * @Description: 
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-23 15:40:12
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-09-29 16:00:48
 */
import axios from 'axios';
/**
 * 上传文件到S3服务器
 * @param {Object} params 
 * @param {Blob} params.file - 文件本体
 * @param {String} params.name - 文件名
 * @param {Function} params.onSuccess - 成功后回调
 * @param {Function} params.onError - 失败后回调
 * @param {Function} params.onProgress - 进度
 * @returns 
 */
export const uploadFile = async (params) => {

  const file = params.file;
  const name = params.name;
  const onSuccess = params.onSuccess || null;
  const onError = params.onError || null;
  const onProgress = params.onProgress || null;

  const url = await accessUploadURL({
    fileName: name
  });

  const { status } = await axios.put(url, file, {
    headers: {
      'Content-Type': 'image'
    }
  });

  if (status === 200) {
    let sourceURL = url.split('?')[0];
    sourceURL = sourceURL.replace('faceonboxer.s3.us-west-1.amazonaws.com', 'face.globaladput.com');
    onSuccess(sourceURL);
  } else {
    onError();
  }
}

/**
 * 获取S3临时上传地址
 * @param {Object} params 
 * @param {String} params.fileName
 * @returns 
 */
function accessUploadURL(params) {
  return new Promise(async (resolve, reject) => {
    const url = 'https://sback.globalhot.shop/plugins/api/v1/getAwsSign';
    const { status, data } = await axios.post(url, params);
    if (status === 200 && data.status === '0') {
      resolve(data.data);
    }
  })
}