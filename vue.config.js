/*
 * @Description:
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-07-19 09:42:00
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-07-29 10:44:22
 */
const path = require('path');
const resolve = (dir) => path.join(__dirname, dir);

module.exports = {
  // chainWebpack: config => {
  //   config.resolve.alias
  //   .set('@', resolve('src'))
  //   .set('comp', resolve('src/components'))
  //   .set('utils', resolve('src/utils'))
  // },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      // patterns: [
      //   path.resolve(__dirname, 'src/styles/_variables.scss'),
      //   path.resolve(__dirname, 'src/styles/_mixins.scss'),
      // ]
    }
  }
}