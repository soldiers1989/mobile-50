/**
 * Copyright (c) 技术部门出品 zgxt2016@163.com
 */
import axios from 'axios'
import { bus } from './bus.js'
import { router } from '../main.js'
import { host } from './api'
import fetchToken, { getItem, setItem, TOKEN_OBJ_ID, TOKEN_EXPIRES_HOURS, setLoginInfo } from './api_methods'

export const UPLOAD_AVATAR_URL = host + '/uploadAvatar'
let is_token_locked = false

// 根据token 获取用户信息
export const getUserInfo = params => {
    return initAxios().post(`/getUserInfo`, params).then(res => res.data).then((res) => {
        if (res.status == 1) {
            setItem('userInfo', res.data)
            if (res.data.is_login_forbidden) {
                bus.$emit('logout')
            }
            if (res.data.notice_pwd_chg != null) {
                alert(res.data.notice_pwd_chg)
            }
            bus.$emit('updateUserInfo')
            bus.$emit('leaveLoginPage')
        } else {
            console.log(res.msg)
        }
    })
}

// 获得accesstoken或者openid
export const getOAuth = params => {
    return initAxios().post(`/oAuth`, params).then(res => res.data)
}

export const checkBankCard = () => {
    let bank_card = getItem('userInfo').bankCards
    let len = bank_card.length
    if (len === 0) {
        alert('请先绑定银行卡')
    }
    return len
}

// 刷新用户token信息
export const refreshToken = params => {
    return axios.create({baseURL: host, timeout: 10000}).post(`/refreshToken`, params).then(res => res.data)
}

// 初始化一个 axios instance
export default function initAxios () {
    let tokenInfo = getItem(TOKEN_OBJ_ID)
    let time = new Date().getTime()
    let token = fetchToken()

    // 如果token被锁
    if (token && is_token_locked) {
        return false
    }

    let authHeader = 'Bearer ' + token
    let init = axios.create({
        baseURL: host,
        headers: {Authorization: authHeader},
        timeout: 10000,
        validateStatus: function (status) {
            return status >= 200 && status < 300
        }
    })
    init.interceptors.request.use(function (config) {
        if (tokenInfo && tokenInfo.expires_time) {
            // 登录过期，删除token信息
            if (tokenInfo.expires_time < time) {
                setItem(TOKEN_OBJ_ID, '')
                config.headers.Authorization = '' // 清空请求的身份验证
                tokenInfo = ''
            }
        }
        return config
    })
    init.interceptors.response.use(function (response) {
        if (tokenInfo && tokenInfo.expires_time) {
            if (tokenInfo.refresh_token && (tokenInfo.expires_time - TOKEN_EXPIRES_HOURS * 0.8 * 3600 * 1000) < time) {
                is_token_locked = true // 锁定token，防止在更新token时其他请求出现验证失败错误
                refreshToken({'refresh_token': tokenInfo.refresh_token}).then((res) => {
                    if (res.status == 1) {
                        setLoginInfo(res.data)
                    } else {
                        setItem('TOKEN_OBJ_ID', '')
                    }
                }).then((res) => {
                    is_token_locked = false
                })
            }
        }
        return response
    })
    return init
}

export function initJavaAxios () {
    let tokenInfo = getItem(TOKEN_OBJ_ID)
    let time = new Date().getTime()
    let token = fetchToken()

    // 如果token被锁
    if (token && is_token_locked) {
        return false
    }

    let init = axios.create({
        headers: {token: token},
        timeout: 10000,
        validateStatus: function (status) {
            return status >= 200 && status < 300
        }
    })
    init.interceptors.request.use(function (config) {
        if (tokenInfo && tokenInfo.expires_time) {
            // 登录过期，删除token信息
            if (tokenInfo.expires_time < time) {
                setItem(TOKEN_OBJ_ID, '')
                config.headers.Authorization = '' // 清空请求的身份验证
                tokenInfo = ''
            }
        }
        return config
    })
    init.interceptors.response.use(function (response) {
        if (tokenInfo && tokenInfo.expires_time) {
            if (tokenInfo.refresh_token && (tokenInfo.expires_time - TOKEN_EXPIRES_HOURS * 0.8 * 3600 * 1000) < time) {
                is_token_locked = true // 锁定token，防止在更新token时其他请求出现验证失败错误
                refreshToken({'refresh_token': tokenInfo.refresh_token}).then((res) => {
                    if (res.status == 1) {
                        setLoginInfo(res.data)
                    } else {
                        setItem('TOKEN_OBJ_ID', '')
                    }
                }).then((res) => {
                    is_token_locked = false
                })
            }
        }
        return response
    })
    return init
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

// 获取注册协议
export const getProtocol = (params) => {
    return initAxios().post('/getProtocol', params).then(res => res.data).catch(errorHandle)
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

// 获取用户股票池列表
export const getStockPool = (params, page) => {
    return initAxios().post('/getStockPool?page=' + page, params).then(res => res.data).catch(errorHandle)
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
    return initAxios().post(host + '/orangePay', params).then(res => res.data).catch(errorHandle)
}
// 认证支付获取短信
export const sendSmsForBankCardPayment = (params) => {
    return initAxios().post('/sendSmsForBankCardPayment', params).then(res => res.data).catch(errorHandle)
}
export const payMin = (params) => {
    return initAxios().post("/payMonitor", params).then(res => res.data).catch(errorHandle)
}
// 获取账户余额
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

// 我的持仓
export const optionGetHoldList = (params) => {
    return initAxios().post('/optionGetHoldList', params).then(res => res.data).catch(errorHandle)
}

// 我的委托
export const optionGetEntrust = (params) => {
    return initAxios().post('/optionGetEntrust', params).then(res => res.data).catch(errorHandle)
}

// 我的交易
export const optionGetMakeDeal = (params) => {
    return initAxios().post('/optionGetMakeDeal', params).then(res => res.data).catch(errorHandle)
}

// 资金明细
export const optionAccountFlow = (params) => {
    return initAxios().post('/optionAccountFlow', params).then(res => res.data).catch(errorHandle)
}
// 期权产品
export const getProduct = () => {
    return initAxios().post('/getOptionOfMouth').then(res => res.data).catch(errorHandle)
}

// 下载app二维码
export const getDownloadApp = params => {
    return initAxios().post('/getDownloadApp', params).then(res => res.data).catch(errorHandle)
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
            alert('身份验证失效，请重新登录')
            bus.$emit('logout')
        } else if (code == 500) {
            alert('网络错误,请稍后重试')
        }
    }
}
