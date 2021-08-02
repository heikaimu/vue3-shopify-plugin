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
export const uploadFile = (params) => {

  const file = params.file;
  const name = params.name;
  const onSuccess = params.onSuccess || null;
  const onError = params.onError || null;
  const onProgress = params.onProgress || null;

  // S3桶名字
  const temporaryBucket = `faceonboxer/temporary`;
  const endpoint = new AWS.Endpoint('s3-accelerate.amazonaws.com');
  const accessKeyId = 'AKIAW6ATM4SRHZTQDIGM';
  const secretAccessKey = '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';
  const region = 'us-west-1'
  const ACL = 'public-read';

  // 创建S3实例
  const s3 = new AWS.S3({
    endpoint,
    accessKeyId,
    secretAccessKey,
    region
  });

  // 构造上传参数
  const uploadParams = {
    Bucket: temporaryBucket,
    Key: `${name}.jpg`,
    Body: file,
    ContentType: 'image',
    ACL
  };

  // 发起请求
  const request = s3.putObject(uploadParams, (err) => {
    if (err) {
      reject(err);
    }
  });

  // 监听进度
  request.on('httpUploadProgress', (progress) => {
    const val = parseInt((progress.loaded / progress.total) * 100);
    if (onProgress) {
      onProgress(val);
    }
  });

  // 监听成功
  request.on('success', () => {
    const temporary = temporaryBucket.split('/')[1];
    const url = `https://face.globaladput.com/${temporary}/${name}.jpg`;
    if (onSuccess) {
      onSuccess(url);
    }
  });

  // 监听失败
  request.on('error', () => {
    console.log('Ajax request failed...');
    if (onError) {
      onError();
    }
    request.send();
  });
}