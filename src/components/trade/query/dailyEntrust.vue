<template>
    <div>
         <table>
         <thead>
            <tr>
              <th>合约</th>
              <th>价格</th>
              <th>数量</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(value, key) in EntrustList" :key=key>
              <td>
                <ul>
                    <li>{{value.optionCode}}
                        <span class="red" v-if="value.entrustBs == 1">买入</span>
                        <span class="blue" v-if="value.entrustBs == 2">卖出</span>
                    </li>
                    <li>{{value.optionName}}</li>
                    <li>{{value.entrustTime | formatDate}}</li>
                </ul>
              </td>
                <td v-if="value.entrustProp == 0">{{value.optEntrustPrice}}</td>
                <td v-if="value.entrustProp == 'OPB'">市价</td>
              <td>{{value.entrustAmount}}</td>
              <td>{{value.entrustStatus_text}}</td>
            </tr>
          </tbody>
        </table>
        <div class="note" v-if="EntrustList.length == 0">
            <img src="~static/img/img_nodata.png">
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import {bus} from '../../../tools/bus'
import {formatDate, getItem} from '../../../tools/api_methods'
import {getTodayEntrustList} from '../../../apis/trade'
import {WebScoketUrlAuth} from '../../../tools/api'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import Vue from 'vue'

export default {
    // 当日委托
    name: 'dailyEntrust',
    data () {
        return {
            EntrustList: [],
            token: "",
            socket: {},
            stompClient: {},
            WebScoketUrl: WebScoketUrlAuth
        }
    },
    filters: {
        formatDate (time) {
            var date = new Date(time)
            return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
        }
    },
    methods: {
        getDataFromWs () {
            let _this = this
            _this.token = (getItem('token_json_key')).access_token
            _this.socket = new SockJS(WebScoketUrlAuth)
            _this.stompClient = Stomp.over(_this.socket)
            _this.stompClient.connect({'token': _this.token}, function (frame) {
                _this.stompClient.subscribe('/app/init/api/1.0/getTodayEntrustList', function (message) {
                    let WSData = JSON.parse(message.body)
                    console.log(WSData)
                    if (WSData.code == 1) {
                        _this.EntrustList = WSData.data
                        for (let value of _this.EntrustList) {
                            switch (value.entrustStatus) {
                                case 0:
                                    value.entrustStatus_text = '撤单委托中'
                                    break
                                case 1:
                                    value.entrustStatus_text = '委托中'
                                    break
                                case 2:
                                    value.entrustStatus_text = '委托已报'
                                    break
                                case 3:
                                    value.entrustStatus_text = '已报待撤'
                                    break
                                case 4:
                                    value.entrustStatus_text = '部成待撤'
                                    break
                                case 5:
                                    value.entrustStatus_text = '部成部撤'
                                    break
                                case 6:
                                    value.entrustStatus_text = '已撤单'
                                    break
                                case 7:
                                    value.entrustStatus_text = '部分成交'
                                    break
                                case 8:
                                    value.entrustStatus_text = '已成交'
                                    break
                                case 9:
                                    value.entrustStatus_text = '委托失败（废单）'
                                    break
                                case 10:
                                    value.entrustStatus_text = '撤单失败（撤废）'
                                    break
                            }
                        }
                    }
                })
                _this.stompClient.subscribe('/user/queue/entrustInfo', function (message) {
                    let updateData = JSON.parse(message.body)
                    switch (updateData.entrustStatus) {
                        case 0:
                            updateData.entrustStatus_text = '撤单委托中'
                            break
                        case 1:
                            updateData.entrustStatus_text = '委托中'
                            break
                        case 2:
                            updateData.entrustStatus_text = '委托已报'
                            break
                        case 3:
                            updateData.entrustStatus_text = '已报待撤'
                            break
                        case 4:
                            updateData.entrustStatus_text = '部成待撤'
                            break
                        case 5:
                            updateData.entrustStatus_text = '部成部撤'
                            break
                        case 6:
                            updateData.entrustStatus_text = '已撤单'
                            break
                        case 7:
                            updateData.entrustStatus_text = '部分成交'
                            break
                        case 8:
                            updateData.entrustStatus_text = '已成交'
                            break
                        case 9:
                            updateData.entrustStatus_text = '委托失败（废单）'
                            break
                        case 10:
                            updateData.entrustStatus_text = '撤单失败（撤废）'
                            break
                    }
                    let i = 0
                    let length = _this.EntrustList.length
                    for (i; i <= length; i++) {
                        if (i == length) {
                            _this.EntrustList.unshift(updateData)
                            break
                        }
                        if (_this.EntrustList[i]["id"] == updateData.id) {
                            Vue.set(_this.EntrustList, i, updateData)
                            break
                        }
                    }
                })
            })
        },
        disconnect () {
            let _this = this
            if (_this.stompClient != null) {
                _this.stompClient.disconnect()
            }
            console.log("Disconnected")
        },
    },
    mounted () {
        this.getDataFromWs()
    },
    destroyed () {
        this.disconnect()
    }
}
</script>

<style lang = "less" scoped>
@import "../../../../static/less/reset.less";
@import "../../../../static/less/query.less";
</style>
