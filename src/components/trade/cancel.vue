<template>
    <div>
       <ul class="cancel_title">
           <li>合约</li>
           <li>价格</li>
           <li>委托数量</li>
           <li>状态</li>
           <li>操作</li>
       </ul>

        <ul v-for="(value, key) in cancelData" :key="key" class="cancel_content" v-if="cancelData.length != 0">
            <li>
                <span class="fir_line">
                    <span>{{value.optionCode}}</span>
                    <span class="bgRed" v-if="value.entrustBs == 1">买入</span>
                    <span class="bgBlue" v-if="value.entrustBs == 2">卖出</span>
                </span>
                <span>{{value.optionName}}</span>
                <span>{{value.entrustTime | formatDate}}</span>
            </li>
            <li>{{value.optEntrustPrice}}</li>
            <li>{{value.entrustAmount}}</li>
            <li>{{value.entrustStatus_text}}</li>
            <li>
                <button @click="revoke(value)" :class="{bgRed: cancel == false, bgGrey: id == value.id}" :disabled = "id == value.id">撤单</button>
            </li>
        </ul>

        <!-- 撤销弹窗 -->
        <div id="modal" class="modal" v-if="confirm">
            <div class="modal-content">
                <header class="modal-header">撤销确认</header>
                <footer class="modal-footer">
                    <button id="cancel" @click="remove">取消</button>
                    <button id="sure" @click="confirmCancel">确认</button>
                </footer>
            </div>
        </div>

        <div class="note" v-if="cancelData.length == 0">
            <img src="~static/img/img_nodata.png">
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import {bus} from '../../tools/bus'
import {formatDate, confirmDialog} from '../../tools/api_methods'
import {getTodayWithdrawList, cancelEntrust} from '../../apis/trade'
export default {
    data () {
        return {
            confirm: false,
            cancel: false,
            id: '',
            cancelData: []
        }
    },
    filters: {
        formatDate (time) {
            var date = new Date(time)
            return formatDate(date, 'yyyy-MM-dd hh:mm:ss').split(' ')[1]
        }
    },
    methods: {
        getData () {
            let _this = this
            getTodayWithdrawList({}).then(res => {
                if (res.code == 1) {
                    _this.cancelData = res.data
                    for (let value of _this.cancelData) {
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
        },
        revoke (value) {
            this.id = value.id
            this.confirm = true
        },
        remove () {
            this.confirm = false
            this.id = null
        },
        confirmCancel () {
            let _this = this
            cancelEntrust({entrustId: this.id}).then(res => {
                if (res.code == 1) {
                    _this.confirm = false
                    _this.id = null
                    _this.getData()
                    _this.$toast('取消委托成功！')
                } else {
                    _this.confirm = false
                    _this.id = null
                    _this.getData()
                    _this.$toast(res.msg)
                }
            })
        }
    },
    mounted () {
        this.getData()
    }
}
</script>

<style lang = "less" scoped>
@import "~static/less/modal.less";
@import "~static/less/trade.less";
   .cancel_title {
       margin-top: 0.05rem;
   }
</style>
