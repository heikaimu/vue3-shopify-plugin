/*
 * @Description: 插件文本
 * @Version: 2.0
 * @Author: Yaowen Liu
 * @Date: 2021-11-22 10:11:47
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2021-12-13 14:17:54
 */
const text = {
  // 文件选择标题
  photo_select_title: {
    us: 'Choose Photos Source',
    de: 'Fotoquelle wählen'
  },
  // 文件选择
  photo_select: {
    us: 'Choose from your album',
    de: 'Wählen Sie aus Ihrem Album'
  },
  // 拍照
  take_photo: {
    us: 'Take A Photo',
    de: 'Ein Foto machen'
  },
  // 第三方图片选择
  third_photo_select: {
    us: 'Choose from Online Services',
    de: 'Wählen Sie aus Online-Diensten'
  },
  // 图片缓存
  photo_cache_title: {
    us: 'Images Records（Click To Use）',
    de: 'Bilder Datensätze（Klick zum Verwenden)'
  },
  // 清除缓存
  clear_cache: {
    us: 'Clear All',
    de: 'Alle löschen'
  },
  // 没有缓冲
  no_cache: {
    us: 'Three is no cache files',
    de: 'Drei ist keine Cache-Dateien'
  },
  // 取消
  cancel: {
    us: 'Cancel',
    de: 'Abbrechen'
  },
  // 替换
  replace: {
    us: 'Replace',
    de: 'Ersetzen Sie'
  },
  // 确定
  confirm: {
    us: 'CONFIRM',
    de: 'BESTÄTIGEN'
  },
  // 注意
  note: {
    us: 'Note',
    de: 'Hinweis'
  },
  // 裁剪提示信息
  crop_note_content: {
    us: 'AI image cropping is mainly for preview.NOT FINAL DESIGN! Our designer will finalize the perfect fit!',
    de: 'AI Bildausschnitt ist hauptsächlich für die Vorschau, NICHT FINAL DESIGN! Unser Designer wird die perfekte Passform finalisieren!'
  },
  crop_action_content: {
    us: 'Drag the frame to choose one face',
    de: 'Ziehen Sie den Rahmen, um eine Seite auszuwählen'
  },
  // 背景提示
  bg_note_content: {
    us: 'Just for preview, our designer will finalize the perfect image!',
    de: 'Nur für die Vorschau, unser Designer wird das perfekte Bild zu beenden!'
  },
  // 肤色
  skin_color: {
    us: 'Skin Color',
    de: 'Hautfarbe'
  },
  // 点击并编辑
  tap_edit: {
    us: 'Tap & Edit',
    de: 'Tippen & Bearbeiten'
  },
  // 添加进购物车
  add_cart: {
    us: 'Add to Cart',
    de: 'Zum Warenkorb hinzufügen'
  },
  // 确定下一步
  yes_next: {
    us: 'Sure & Next',
    de: 'Sicher & Weiter'
  },
  // 不要下一步
  no_next: {
    us: 'No Thanks & Next',
    de: 'Nein danke & Weiter'
  },
  // 或者
  or: {
    us: 'or',
    de: 'oder'
  },
  // 或许喜欢
  maybe_like: {
    us: 'MAYBE YOU LIKE',
    de: 'VIELLEICHT MÖGEN SIE'
  },
  // 以选择的产品
  selected_product: {
    us: 'selected products',
    de: 'ausgewählte Produkte'
  },
  // 要，加入购物车
  yes_add_cart: {
    us: 'Sure & Add To Cart',
    de: 'Sicher & Zum Warenkorb hinzufügen'
  },
  // 不要，加入购物车
  no_add_cart: {
    us: 'No Thanks & Add To Cart',
    de: 'Nein danke & In den Warenkorb'
  },
  // VIP
  vip_service: {
    us: 'VIP SERVICE',
    de: 'VIP-SERVICE'
  },
  // 单双面文字
  slide_text1: {
    us: 'Print back side？',
    de: 'Rückseite drucken？'
  },
  slide_text2: {
    us: 'add your design mirrored on back side for only',
    de: 'fügen Sie Ihr Design auf der Rückseite gespiegelt für nur'
  },
  // 文字定制询问
  yes_please: {
    us: 'Yes, please',
    de: 'Ja, bitte'
  },
  no_thanks: {
    us: 'No, thanks',
    de: 'Nein, danke'
  },
  font_family: {
    us: 'Font Family',
    de: 'Schriftart Familie'
  },
  font_color: {
    us: 'Font Color',
    de: 'Schriftart Farbe'
  },
  text_title: {
    us: 'Text Title',
    de: 'Text Titel'
  },
  background: {
    us: 'Background',
    de: 'Hintergrund'
  },
  background_group: {
    us: 'Background Group',
    de: 'Hintergrund Gruppe'
  },
  size: {
    us: 'Size',
    de: 'Größe'
  },
  composing: {
    us: 'Composing',
    de: 'Komposition'
  }
}

/**
 * 通过语言获取对应的插件文本
 * @param {*} lg - 语言
 */
export function pluginText(lg) {
  const currentText = {};
  Object.keys(text).forEach(key => {
    currentText[key] = text[key][lg];
  })
  return currentText;
}