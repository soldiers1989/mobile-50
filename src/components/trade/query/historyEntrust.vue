<template>
    <div>
         <table>
         <thead>
            <tr>
                <th>时间</th>
                <th>合约</th>
                <th>价格</th>
                <th>数量</th>
                <th>状态</th>
            </tr>
          </thead>
            <tbody>
                <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                <van-list
                    v-model="loading"
                    :finished="finished"
                    @load="onLoad"
                >
                    <tr v-for="(value, key) in EntrustList" :key=key>
                        <td>
                            <ul>
                                <li>{{value.entrustTime | formatDate}}</li>
                                <li>{{value.entrustTime | formatDate1}}</li>
                            </ul>
                        </td>
                        <td>
                            <ul>
                                <li>{{value.optionCode}}
                                    <span class="red" v-if="value.entrustBs == 1">买入</span>
                                    <span class="blue" v-if="value.entrustBs == 2">卖出</span>
                                </li>
                                <li>{{value.optionName}}</li>
                            </ul>
                        </td>
                        <td v-if="value.entrustProp == 0">{{value.optEntrustPrice}}</td>
                        <td v-if="value.entrustProp == 'OPB'">市价</td>
                        <td>{{value.entrustAmount}}</td>
                        <td>{{value.entrustStatus_text}}</td>
                    </tr>
                </van-list>
                </van-pull-refresh>
            </tbody>
        </table>
        <div class="note" v-if="noData">
            <img src="~static/img/img_nodata.png">
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import {bus} from '../../../tools/bus'
import {formatDate} from '../../../tools/api_methods'
import {getHistoryEntrustList} from '../../../apis/trade'
export default {
    // 历史委托
    name: 'historyEntrust',
    data () {
        return {
            refreshing: false,
            loading: false,
            finished: false,
            noData: false,
            formData: {
                size: 10,
                current: 1,
                obj: {}
            },
            EntrustList: []
        }
    },
    filters: {
        formatDate(time) {
            var date = new Date(time)
            return formatDate(date, 'yyyy-MM-dd hh:mm:ss').split(' ')[0]
        },
        formatDate1(time) {
            var date = new Date(time)
            return formatDate(date, 'yyyy-MM-dd hh:mm:ss').split(' ')[1]
        }
    },
    methods: {
        onLoad() {
            let _this = this
            getHistoryEntrustList(this.formData).then(function (res) {
                if (res.code == 1) {
                    let records = res.data.records.reverse()
                    for (let item of records) {
                        _this.EntrustList.push(item)
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
                    _this.formData.current++
                }
                _this.loading = false
                if (_this.EntrustList.length >= res.data.total) {
                    _this.finished = true
                }
                if (res.data.total === 0) {
                    setTimeout(() => {
                        _this.noData = true
                    }, 150)
                }
            })

        },
        onRefresh() {
            setTimeout(() => {
                this.finished = false
                this.refreshing = false
            }, 1000)
        }
    }
}
</script>

<style lang = "less" scoped>
@import "../../../../static/less/reset.less";
@import "../../../../static/less/queryHistory.less";
</style>
