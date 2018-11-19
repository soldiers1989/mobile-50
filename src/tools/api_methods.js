/**
 * Copyright (c) 技术部门出品 zgxt2016@163.com
 */
import {host} from '../tools/api'
import {Toast, Dialog} from 'vant'
export const SAVE_LASTING = true
export const TOKEN_OBJ_ID = 'token_json_key'
export const TOKEN_EXPIRES_HOURS = 4 // token过期时间
export const UPLOAD_AVATAR_URL = host + "/uploadAvatar"

export const getItem = (key) => {
  let val = ""
  if (SAVE_LASTING) {
    val = localStorage.getItem(key)
  } else {
    val = sessionStorage.getItem(key)
  }
  return JSON.parse(val)
}

export const setItem = (key, val) => {
  val = JSON.stringify(val)
  if (SAVE_LASTING) {
    val = localStorage.setItem(key, val)
  } else {
    val = sessionStorage.setItem(key, val)
  }
}

// 提示
export const toast = (msg) => {
    let duration
    if (msg.length > 15) {
        duration = 3000
    } else if (msg.length < 15 && msg.length > 4) {
        duration = parseInt(msg.length) * 200
    } else {
        duration = 1500
    }
    Toast({
    duration: duration, // 持续展示 toast
    forbidClick: true,
    message: msg
    })
}

// loading
export const loading = (msg) => {
    if (msg == '') {
        msg = '加载中'
    }
    Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: msg
    })
}

export const loadingClose = () => {
    Toast.clear()
}

// confirm
export const confirmDialog = (options) => {
    if (options.title == '' || options.title == undefined) {
        options.title = '提示'
    } else if (options.confirmButtonText == '') {
        options.confirmButtonText = '确定'
    } else if (options.cancelButtonText == '') {
        options.cancelButtonText = '取消'
    }
    Dialog.confirm({
        title: options.title,
        message: options.message,
        confirmButtonText: options.confirmButtonText,
        cancelButtonText: options.cancelButtonText,
        closeOnClickOverlay: false,
        lockScroll: true
    }).then(() => {
        options.callBackConfirm()
    }).catch(() => {
        if (options.callBackCancel != undefined) {
            options.callBackCancel()
        }
    })
}

// 设置登录的信息
export const setLoginInfo = (data) => {
  data.expires_time = new Date().getTime() + TOKEN_EXPIRES_HOURS * 3600 * 1000
  setItem(TOKEN_OBJ_ID, data)
}

export const checkRealName = () => {
    let flag = true
    let real_name = getItem('userInfo').real_name
    let id_card = getItem('userInfo').id_card
    if (!real_name || !id_card || id_card == '' || real_name == '') {
        flag = false
    } else {
        flag = true
    }
    return flag
}

// 获取token
export default function fetchToken () {
  let tokenInfo = getItem(TOKEN_OBJ_ID)
  return tokenInfo ? tokenInfo.access_token : null
}

export const validLogin = () => {
  let userInfo = getItem('userInfo')
  let token = getItem(TOKEN_OBJ_ID)
  return userInfo && token
}

// 判断是否为微信环境
export const isWechat = () => {
  let ua = navigator.userAgent.toLowerCase()
  let isWeixin = ua.indexOf('micromessenger') != -1
  if (isWeixin) {
    return true
  } else {
    return false
  }
}

/**
 * 压缩图片
 * @param file
 * @param quality
 * @param callback
 */
export const compress = function (file, quality, callback) {
  if (!window.FileReader || !window.Blob) {
    return errorHandler('您的浏览器不支持图片上传')()
  }

  let reader = new FileReader()
  let mimeType = file.type || 'image/jpeg'

  reader.onload = createImage
  reader.onerror = errorHandler('图片读取失败！')
  reader.readAsDataURL(file)

  function createImage () {
    let dataURL = this.result
    let image = new Image()
    image.onload = compressImage
    image.onerror = errorHandler('图片加载失败')
    image.src = dataURL
  }

  function compressImage () {
    var canvas = document.createElement('canvas')
    var ctx
    var dataURI

    canvas.width = this.naturalWidth
    canvas.height = this.naturalHeight
    ctx = canvas.getContext('2d')
    ctx.drawImage(this, 0, 0)
    dataURI = canvas.toDataURL(mimeType, quality)

    callback(null, dataURI)
  }

  function errorHandler (message) {
    return function () {
      let error = new Error('Compression Error:', message)
      callback(error, null)
    }
  }
}
// 时间格式化
export function formatDate (date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    }
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + ''
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
        }
    }
    return fmt
}

function padLeftZero (str) {
    return ('00' + str).substr(str.length)
}

// 格式化金额
export function formatMoney (num) {
    let money
    if (num != '--') {
        if (typeof num === "string") {
            money = num.replace(/([0-9]+\.[0-9]{2})[0-9]*/, '$1')
        } else {
            money = Number(num).toFixed(2)
        }
        if (money == 'NaN') return '0.00'
        if (money.indexOf('.') == -1) {
            money = money + '.00'
        } else if (money.substr(-2, 1) == '.') {
            money = money + '0'
        }
        let now = money.replace(/(\d{1,3})(?=(\d{3})+(?:$|\D))/g, '$1,')
        return now
    } else {
        return num
    }
}

/* Number.prototype.toFixed = function (s) {
    let str = this.toString()
    let model = `([0-9]+\\.[0-9]{${s}})[0-9]*`
    return str.replace(new RegExp(model), '$1')
} */

/*
 params: num 期望长度
str: 目标字符串 */
export function fillZero (num, str) {
    if (!str || str.toString().indexOf(".") < 0) {
        return str
    }
    str = str.toString()
    let dec
    let inte
    dec = str.split('.')[1]
    inte = str.split('.')[0]

    if (dec.length < num) {
        return inte + '.' + dec.padEnd(num, "0")
    } else {
        return str
    }
}
