/**
 * Copyright (c) 技术部门出品 zgxt2016@163.com
 */
import axios from 'axios'
import { bus } from '../tools/bus.js'
import initAxios, { initJavaAxios } from "../tools/ajax"
import errorHandle from "../tools/ajax"
import {java_host} from '../tools/api'

// 获取50ETF 行情
export const getInfoOfETF = () => {
    return initAxios().post('/getInfoOfETF').then(res => res.data).catch(errorHandle)
}
// 获取某一产品的信息
export const getOneProductInfo = (params) => {
    return initAxios().post('/getOneProductInfo', params).then(res => res.data).catch(errorHandle)
}
// 获取K线数据
export const getTodayHq = () => {
    return initAxios().post('/getTodayHq').then(res => res.data).catch(errorHandle)
}

// 委托买入
export const buyEntrust = params => {
  return initJavaAxios().post(java_host + `/buyEntrust`, params).then(res => res.data).catch(errorHandle)
}

// 委托卖出
export const entrustSell = params => {
  return initJavaAxios().post(java_host + `/entrustSell`, params).then(res => res.data).catch(errorHandle)
}

// 查询客户持仓
export const getCustHoldingsInfoList = params => {
  return initJavaAxios().get(java_host + `/getCustHoldingsInfoList`, params).then(res => res.data).catch(errorHandle)
}

// 获取客户最大可卖可买
export const getMaxAvailableBuySellQuantity = (params) => {
    return initJavaAxios().post(java_host + `/getMaxAvailableBuySellQuantity`, params).then(res => res.data).catch(errorHandle)
}

// 查询客户资产信息
export const getCustAssetInfo = params => {
  return initJavaAxios().get(java_host + `/getCustAssetInfo`, params).then(res => res.data).catch(errorHandle)
}

// 查询客户历史成交
export const getHistoryMakedealList = params => {
  return initJavaAxios().post(java_host + `/getHistoryMakedealList`, params).then(res => res.data).catch(errorHandle)
}

// 查询客户历史委托
export const getHistoryEntrustList = params => {
  return initJavaAxios().post(java_host + `/getHistoryEntrustList`, params).then(res => res.data).catch(errorHandle)
}

// 查询客户撤单列表
export const getTodayWithdrawList = params => {
  return initJavaAxios().get(java_host + `/getTodayWithdrawList`, params).then(res => res.data).catch(errorHandle)
}

// 撤销委托
export const cancelEntrust = params => {
  return initJavaAxios().post(java_host + `/cancelEntrust`, params).then(res => res.data).catch(errorHandle)
}
