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
            <tr v-for="(value, key) in DealList" :key="key">
              <td>
                <ul>
                    <li>{{value.optionCode}}
                        <span class="red" v-if="value.entrustBs == 1">买入</span>
                        <span class="blue" v-if="value.entrustBs == 2">卖出</span>
                    </li>
                    <li>{{value.optionName}}</li>
                    <li>{{value.businessTime | formatDate}}</li>
                </ul>
              </td>
              <td>{{value.optBusinessPrice}}</td>
              <td>{{value.businessAmount}}</td>
              <td>
                  <span v-if="value.businessAmount == value.entrustAmount">全部成交</span>
                  <span v-else>部分成交</span>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="note" v-if="DealList.length == 0">
            <img src="~static/img/img_nodata.png">
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import {bus} from '../../../tools/bus'
import {formatDate, getItem} from '../../../tools/api_methods'
import {WebScoketUrlAuth} from '../../../tools/api'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import Vue from 'vue'
export default {
    // 当日成交
    name: 'dailyDealing',
    data () {
        return {
            DealList: [],
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
                _this.stompClient.subscribe('/app/init/api/1.0/getTodayMakedealList', function (message) {
                    let WSData = JSON.parse(message.body)
                    if (WSData.code == 1) {
                        _this.DealList = WSData.data
                    }
                })
                _this.stompClient.subscribe('/user/queue/makedealInfo', function (message) {
                    let updateData = JSON.parse(message.body)
                    let i = 0
                    let length = _this.DealList.length
                    for (i; i <= length; i++) {
                        if (i == length) {
                            _this.DealList.unshift(updateData)
                            break
                        }
                        if (_this.DealList[i]["id"] == updateData.id) {
                            Vue.set(_this.DealList, i, updateData)
                            break
                        }
                    }
                })
            })
        }
    },
    mounted () {
        this.getDataFromWs()
    }
}
</script>

<style lang = "less" scoped>
@import "../../../../static/less/reset.less";
@import "../../../../static/less/query.less";
</style>
