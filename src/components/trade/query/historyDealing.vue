<template>
    <div>
        <table>
            <thead>
            <tr>
                <th>时间</th>
                <th>合约</th>
                <th>价格</th>
                <th>数量</th>
            </tr>
            </thead>
            <tbody>
             <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                 <van-list
                     v-model="loading"
                     :finished="finished"
                     @load="onLoad"
                 >
            <tr v-for="(value, key) in DealList" :key="key">
                <td>
                    <ul>
                        <li>{{value.businessTime | formatDate}}</li>
                        <li>{{value.businessTime | formatDate1}}</li>
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
                <td>{{value.optBusinessPrice}}</td>
                <td>{{value.businessAmount}}</td>
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
    import { bus } from '../../../tools/bus'
    import { formatDate } from '../../../tools/api_methods'
    import { getHistoryMakedealList } from '../../../apis/trade'

    export default {
        // 历史成交
        name: 'historyDealing',
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
                DealList: []
            }
        },
        filters: {
            formatDate (time) {
                var date = new Date(time)
                return formatDate(date, 'yyyy-MM-dd hh:mm:ss').split(' ')[0]
            },
            formatDate1 (time) {
                var date = new Date(time)
                return formatDate(date, 'yyyy-MM-dd hh:mm:ss').split(' ')[1]
            }
        },
        methods: {
            onLoad () {
                let _this = this
                getHistoryMakedealList(this.formData).then(function (res) {
                    if (res.code == 1) {
                        let records = res.data.records.reverse()
                        for (let item of records) {
                            _this.DealList.push(item)
                        }
                        _this.formData.current++
                    }
                    _this.loading = false
                    if (_this.DealList.length >= res.data.total) {
                        _this.finished = true
                    }
                    if (res.data.total === 0) {
                        setTimeout(() => {
                            _this.noData = true
                        }, 150)
                    }
                })

            },
            onRefresh () {
                setTimeout(() => {
                    this.finished = false
                    this.refreshing = false
                }, 1000)
            }
        },
        mounted () {
        }
    }
</script>

<style lang="less" scoped>
    @import "../../../../static/less/reset.less";
    @import "../../../../static/less/queryHistory.less";
</style>
