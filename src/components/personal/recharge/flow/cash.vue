<template>
  <div>
        <div class="flow" v-for="(value, key) in cashData" :key="key">
            <ul>
                <li>提现金额</li>
                <li>{{value.created_time}}</li>
            </ul>
            <ul>
                <li :class="{red: value.cash_amount >= 0, green: value.cash_amount < 0}" >{{value.cash_amount}}</li>
                <li>状态：{{value.entrustStatus_text}}</li>
            </ul>
        </div>

        <div class="note" v-if="cashData.length == 0">
            <img src="~static/img/img_nodata.png">
        </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {bus} from '../../../../tools/bus'
import {getFundsDetails, getPromotionPercentages, withdrawRecord} from '../../../../apis/personal'
export default {
    name: 'cash',
    data () {
        return {
            formData: {
                type: '提现明细',
                page: 1
            },
            cashData: [],
            refreshing: false,
            loading: false,
            finished: false,
            noData: false
        }
    },
    methods: {
        getData () {
            let _this = this
            getFundsDetails(this.formData).then(function (res) {
                if (res.status == 1) {
                    _this.cashData = res.data
                    for (let value of _this.cashData) {
                            switch (value.cash_status) {
                                case 0:
                                    value.entrustStatus_text = '待审核'
                                    break
                                case 1:
                                    value.entrustStatus_text = '待打款'
                                    break
                                case 2:
                                    value.entrustStatus_text = '审核失败'
                                    break
                                case 3:
                                    value.entrustStatus_text = '已打款'
                                    break
                                case 4:
                                    value.entrustStatus_text = '撤销成功'
                                    break
                            }
                        }
                }
            })
        }

    },
    mounted () {
            this.getData()
        }

}
</script>

<style lang="less" scoped>
@import '~static/less/reset.less';
@import '~static/less/flow.less';
</style>
