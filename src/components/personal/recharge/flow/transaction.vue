<template>
  <div>
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list
            v-model="loading"
            :finished="finished"
            @load="onLoad"
            >
            <div class="flow" v-for="(value, key) in transactionData" :key="key">
                <ul>
                    <li>{{value.flow_type}}</li>
                    <li>{{value.created_time}}</li>
                </ul>
                <ul>
                    <li :class="{red: value.amount_of_account >= 0, green: value.amount_of_account < 0}">{{value.amount_of_account}}</li>
                    <li>余额：{{value.account_left}}</li>
                </ul>
            </div>
            </van-list>
        </van-pull-refresh>

        <div class="note" v-if="noData">
            <img src="~static/img/img_nodata.png">
        </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {bus} from '../../../../tools/bus'
import {getFundsDetails, getPromotionPercentages, withdrawRecord} from '../../../../apis/personal'
export default {
    name: 'transaction',
    data () {
        return {
            formData: {
                type: '借款明细',
                page: 1
            },
            transactionData: [],
            refreshing: false,
            loading: false,
            finished: false,
            noData: false
        }
    },
    methods: {
        onLoad() {
            let _this = this
            getFundsDetails(this.formData).then(function (res) {
                if (res.status == 1) {
                    for (let item of res.data.data) {
                        _this.transactionData.push(item)
                    }
                    _this.formData.page++
                }
                _this.loading = false
                if (_this.transactionData.length >= res.data.total) {
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

<style lang="less" scoped>
@import '~static/less/reset.less';
@import '~static/less/flow.less';
</style>
