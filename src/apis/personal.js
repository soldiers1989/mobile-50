/**
 * Copyright (c) 技术部门出品 zgxt2016@163.com
 */
import axios from 'axios'
import {bus} from '../tools/bus.js'
import {router} from '../main.js'
import {host, java_host} from '../tools/api'
import fetchToken, {getItem, setItem, TOKEN_OBJ_ID, TOKEN_EXPIRES_HOURS, setLoginInfo} from '../tools/api_methods'
import initAxios from '../tools/ajax'
let is_token_locked = false

// 根据token 获取用户信息
export const getUserInfo = params => {
  return initAxios().post(`/getUserInfo`, params).then(res => res.data).then((res) => {
    if (res.status == 1) {
      setItem("userInfo", res.data)
      if (res.data.is_login_forbidden) {
        bus.$emit("logout")
      }
      if (res.data.notice_pwd_chg != null) {
        alert(res.data.notice_pwd_chg)
      }
      bus.$emit("updateUserInfo")
      bus.$emit("leaveLoginPage")
    } else {
      console.log(res.msg)
    }
  })
}

// 获得accesstoken或者openid
export const getOAuth = params => {
  return initAxios().post(`/oAuth`, params).then(res => res.data)
}

// 刷新用户token信息
export const refreshToken = params => {
  return axios.create({baseURL: host, timeout: 10000}).post(`/refreshToken`, params).then(res => res.data)
}

// 获取验证码 不需要任何参数
export const createCaptcha = params => {
  return initAxios().post(`/createCaptcha`, params).then(res => res.data).catch(errorHandle)
}

// 手机号码 密码登陆/
export const requestLogin = params => {
  return initAxios().post(`/login`, params).then(res => res.data).catch(errorHandle)
}

export const logout = () => {
  return initAxios().post('/logout').then(res => res.data).catch(errorHandle)
}

// 登陆api
export const requestRegister = params => {
  return initAxios().post('/register', params).then(res => res.data).catch(errorHandle)
}

export const getBackPassword = params => {
  return initAxios().post('/getBackPassword', params).then(res => res.data).catch(errorHandle)
}

export const updateNickname = params => {
  return initAxios().post('/updateNickname', params).then(res => res.data).catch(errorHandle)
}

export const createCertification = params => {
  return initAxios().post('/createCertification', params).then(res => res.data).catch(errorHandle)
}

export const withdraw = params => {
  return initAxios().post('/withdraw', params).then(res => res.data).catch(errorHandle)
}
// 设置提现密码
export const createWithdrawPassword = params => {
  return initAxios().post('/createWithdrawPassword', params).then(res => res.data).catch(errorHandle)
}
// 修改提现密码
export const updateWithdrawPassword = params => {
  return initAxios().post('/updateWithdrawPassword', params).then(res => res.data).catch(errorHandle)
}
// 修改手机号
export const updatePhone = params => {
  return initAxios().post('/updatePhone', params).then(res => res.data).catch(errorHandle)
}
// 修改登录密码
export const updatePassword = params => {
  return initAxios().post('/updatePassword', params).then(res => res.data).catch(errorHandle)
}
// 添加银行卡
export const createBankCard = params => {
  return initAxios().post('/createBankCard', params).then(res => res.data).catch(errorHandle)
}
// 修改银行卡信息
export const updateBankCard = params => {
  return initAxios().post('/updateBankCard', params).then(res => res.data).catch(errorHandle)
}
// 解绑银行卡
export const deleteBankCard = params => {
  return initAxios().post('/deleteBankCard', params).then(res => res.data).catch(errorHandle)
}
// 获取实时资讯
export const getIndexInformations = (params, page) => {
  return initAxios().post('/getIndexInformations?page=' + page, params).then(res => res.data).catch(errorHandle)
}
// 获取大盘点评数据
export const getIndexComments = (params, page) => {
  return initAxios().post('/getIndexComments?page=' + page, params).then(res => res.data).catch(errorHandle)
}

// 自选池相关
export const getStockPool = (params, page) => {
  return initAxios().post('/getStockPool', params).then(res => res.data).catch(errorHandle)
}

// 添加自选
export const addStockToPool = (params, page) => {
    return initAxios().post('/addStockToPool', params).then(res => res.data).catch(errorHandle)
}

//  删除自选
export const delStockFromPool = params => {
    return initAxios().post('/delStockFromPool', params).then(res => res.data).catch(errorHandle)
}

// 模糊查询期权产品
export const getProductByParam = params => {
    return initAxios().post('/getProductByParam', params).then(res => res.data).catch(errorHandle)
}

// 查询所有期权产品
export const getAllProduct = params => {
    return initAxios().post('/getAllProduct', params).then(res => res.data).catch(errorHandle)
}

// 查询所有期权产品
export const getAllProductLogin = params => {
  return initAxios().post('/getAllProductLogin', params).then(res => res.data).catch(errorHandle)
}

// 是否加入自选
export const isInPool = params => {
    return initAxios().post('/isInPool', params).then(res => res.data).catch(errorHandle)
}

// 搜索
export const queryChooseOptionProd = (params) => {
    return initAxios().post(java_host + '/addStockToPool', params).then(res => res.data).catch(errorHandle)
}

// 获取分享统计
export const getShareCount = () => {
  return initAxios().post('/getShareCount').then(res => res.data).catch(errorHandle)
}

// 获取推广的用户列表
export const getPromotionUsers = (params, page) => {
  return initAxios().post('/getPromotionUsers?page=' + page, params).then(res => res.data).catch(errorHandle)
}

// 获取推广的收益列表
export const getPromotionPercentages = (params, page) => {
  return initAxios().post('/getPromotionPercentages?page=' + page, params).then(res => res.data).catch(errorHandle)
}

export const getFundsDetails = (params, page) => {
  return initAxios().post('/getFundsDetails?page=' + page, params).then(res => res.data).catch(errorHandle)
}

export const withdrawRecord = (page) => {
  return initAxios().post('/withdrawRecord?page=' + page).then(res => res.data).catch(errorHandle)
}

export const checkBackWithdraw = (params) => {
  return initAxios().post('/checkBackWithdraw', params).then(res => res.data).catch(errorHandle)
}

export const getBackWithdrawPassword = (params) => {
  return initAxios().post('/getBackWithdrawPassword', params).then(res => res.data).catch(errorHandle)
}

export const offlineTransfer = (params) => {
  return initAxios().post('/offlineTransfer', params).then(res => res.data).catch(errorHandle)
}

// 微信凭证支付
export const weixinCertificatePay = (params) => {
  return initAxios().post('/weixinCertificatePay', params).then(res => res.data).catch(errorHandle)
}

// 认证支付
export const bankCardPayment = (params) => {
  return initAxios().post('/bankCardPayment', params).then(res => res.data).catch(errorHandle)
}

// 确认认证支付
export const bankCardPaymentConfirm = (params) => {
  return initAxios().post('/bankCardPaymentConfirm', params).then(res => res.data).catch(errorHandle)
}

// 认证支付2(万物支付)
export const bankCardPayment2 = (params) => {
  return initAxios().post('/bankCardPayment2', params).then(res => res.data).catch(errorHandle)
}

// 确认认证支付2(万物支付)
export const bankCardPaymentConfirm2 = (params) => {
  return initAxios().post('/bankCardPaymentConfirm2', params).then(res => res.data).catch(errorHandle)
}
// 通联支付
export const orangePay = params => {
  return initAxios().post(host + "/orangePay", params).then(res => res.data).catch(errorHandle)
}
// 认证支付获取短信
export const sendSmsForBankCardPayment = (params) => {
  return initAxios().post('/sendSmsForBankCardPayment', params).then(res => res.data).catch(errorHandle)
}
// 支付宝支付
export const AliPay = (params) => {
  return initAxios().post('/AliPay', params).then(res => res.data).catch(errorHandle)
}
// 微信安全支付
export const WxPay = (params) => {
  return initAxios().post('/WxPay', params).then(res => res.data).catch(errorHandle)
}
// 获取账户数据统计
export const getAccountCount = (params) => {
  return initAxios().post('/getAccountCount', params).then(res => res.data).catch(errorHandle)
}

// 获取注册、修改手机号短信验证码
export const getRegisterSms = params => {
  return initAxios().post('/getRegisterSms', params).then(res => res.data).catch(errorHandle)
}

// 获取找回密码短信验证码
export const getGetBackSms = params => {
  return initAxios().post('/getGetBackSms', params).then(res => res.data).catch(errorHandle)
}

// 获取修改手机、找回提款密码、修改登录密码短信验证码
export const getSms = params => {
  return initAxios().post('/getSms', params).then(res => res.data).catch(errorHandle)
}

// 微信绑定
export const getWechatBindSms = params => {
  return initAxios().post('/getWechatBindSms', params).then(res => res.data).catch(errorHandle)
}

// 获取帮助列表
export const getHelpArticles = (params) => {
  return initAxios().post('/getHelpArticles', params).then(res => res.data).catch(errorHandle)
}
// 上传图片
export const uploadImage = (params) => {
  return initAxios().post('/uploadImage', params).then(res => res.data).catch(errorHandle)
}

// 检测手机号是否已注册
export const checkIsRegistered = (params) => {
    return initAxios().post('/checkIsRegistered', params).then(res => res.data).catch(errorHandle)
}

export const bindAccountFromWechat = params => {
    return initAxios().post("/bindAccountFromWechat", params).then(res => res.data).catch(errorHandle)
}

// 需要和axios catch 配合使用
export function errorHandle (error) {
  let code = error.response.status
  let msgs = {
    400: '语义有误，当前请求无法被服务器理解,请求参数有误',
    401: '请求已经包含了 Authorization 证书，代表着服务器验证已经拒绝了那些证书',
    404: '请求失败，请求所希望得到的资源未被在服务器上发现',
    405: '请求行中指定的请求方法不能被用于请求相应的资源',
    412: '图像验证码错误,服务器在验证在请求的头字段中给出先决条件时，没能满足其中的一个或多个',
    500: '服务器错误'
  }
  if (code in msgs) {
    if (code == 401) {
      alert("身份验证失效，请重新登录")
      bus.$emit('logout')
    } else if (code == 500) {
      alert("网络错误,请稍后重试")
    }
  }
}
