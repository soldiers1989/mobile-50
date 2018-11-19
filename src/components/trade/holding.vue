<template>
    <div>
        <ul class="holding_title">
            <li>合约</li>
            <li>数量</li>
            <li>成本/现价</li>
            <li>市值/盈亏</li>
        </ul>

        <div v-if="firstGroup.length != 0">
            <div class="holding_content_title">
                <span>到期日</span>
                <span>{{firstGroup[0].exerciseDate | formatDate}}</span>
                <span>剩余{{firstGroup[0].remainDays}}天</span>
            </div>
            <ul class="holding_content_content" v-for="(value, key) in firstGroup" :key="key" @click="goforSell(value)">
                <li>
                    <span>{{value.optionCode}}</span>
                    <span>{{value.optionName}}</span>
                </li>
                <li>
                    <span>{{value.holdAmount}}</span>
                </li>
                <li>
                    <span>{{value.costMoney}}</span>
                    <span :class="{fontRed: value.costMoney <= value.price, fontGreen: value.costMoney > value.price}">{{value.price}}</span>
                </li>
                <li>
                    <span>{{value.marketValue}}</span>
                    <span :class="{fontRed: value.profit >= 0, fontGreen: value.profit < 0}">{{value.profit}}</span>
                </li>
            </ul>
        </div>

        <div v-if="secondGroup.length != 0">
            <div class="holding_content_title">
                <span>到期日</span>
                <span>{{secondGroup[0].exerciseDate | formatDate}}</span>
                <span>剩余{{secondGroup[0].remainDays}}天</span>
            </div>
            <ul class="holding_content_content" v-for="(value, key) in secondGroup" :key="key"
                @click="goforSell(value)">
                <li>
                    <span>{{value.optionCode}}</span>
                    <span>{{value.optionName}}</span>
                </li>
                <li>
                    <span>{{value.holdAmount}}</span>
                </li>
                <li>
                    <span>{{value.costMoney}}</span>
                    <span :class="{fontRed: value.costMoney <= value.price, fontGreen: value.costMoney > value.price}">{{value.price}}</span>
                </li>
                <li>
                    <span>{{value.marketValue}}</span>
                    <span :class="{fontRed: value.profit >= 0, fontGreen: value.profit < 0}">{{value.profit}}</span>
                </li>
            </ul>
        </div>

        <div v-if="thirdGroup.length != 0">
            <div class="holding_content_title">
                <span>到期日</span>
                <span>{{thirdGroup[0].exerciseDate | formatDate}}</span>
                <span>剩余{{thirdGroup[0].remainDays}}天</span>
            </div>
            <ul class="holding_content_content" v-for="(value, key) in thirdGroup" :key="key" @click="goforSell(value)">
                <li>
                    <span>{{value.optionCode}}</span>
                    <span>{{value.optionName}}</span>
                </li>
                <li>
                    <span>{{value.holdAmount}}</span>
                </li>
                <li>
                    <span>{{value.costMoney}}</span>
                    <span :class="{fontRed: value.costMoney <= value.price, fontGreen: value.costMoney > value.price}">{{value.price}}</span>
                </li>
                <li>
                    <span>{{value.marketValue}}</span>
                    <span :class="{fontRed: value.profit >= 0, fontGreen: value.profit < 0}">{{value.profit}}</span>
                </li>
            </ul>
        </div>

        <div v-if="forthGroup.length != 0">
            <div class="holding_content_title">
                <span>到期日</span>
                <span>{{forthGroup[0].exerciseDate | formatDate}}</span>
                <span>剩余{{forthGroup[0].remainDays}}天</span>
            </div>
            <ul class="holding_content_content" v-for="(value, key) in forthGroup" :key="key" @click="goforSell(value)">
                <li>
                    <span>{{value.optionCode}}</span>
                    <span>{{value.optionName}}</span>
                </li>
                <li>
                    <span>{{value.holdAmount}}</span>
                </li>
                <li>
                    <span>{{value.costMoney}}</span>
                    <span :class="{fontRed: value.costMoney <= value.price, fontGreen: value.costMoney > value.price}">{{value.price}}</span>
                </li>
                <li>
                    <span>{{value.marketValue}}</span>
                    <span :class="{fontRed: value.profit >= 0, fontGreen: value.profit < 0}">{{value.profit}}</span>
                </li>
            </ul>
        </div>

        <div class="note" v-if="holdingData.length == 0">
            <img src="~static/img/img_nodata.png">
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {getCustHoldingsInfoList} from '../../apis/trade'
    import {formatDate} from '../../tools/api_methods'

    export default {
        data() {
            return {
                holdingData: [],
                refreshData: null,
                firstGroup: [],
                secondGroup: [],
                thirdGroup: [],
                forthGroup: [],
                fir: 0,
                sec: 0,
                third: 0,
                forth: 0
            }
        },
        methods: {
            getData() {
                let _this = this
                getCustHoldingsInfoList().then(res => {
                    if (res.code == 1) {
                        this.holdingData = res.data
                        for (let i = 0; i < this.holdingData.length; i++) {
                            let mon = new Date(this.holdingData[i].exerciseDate).getMonth() + 1
                            switch (mon) {
                                case _this.fir:
                                    _this.firstGroup.push(_this.holdingData[i])
                                    break
                                case _this.sec:
                                    _this.secondGroup.push(_this.holdingData[i])
                                    break
                                case _this.third:
                                    _this.thirdGroup.push(_this.holdingData[i])
                                    break
                                case _this.forth:
                                    _this.forthGroup.push(_this.holdingData[i])
                                    break
                            }
                        }

                    } else {
                        console.log(res.msg)
                    }
                })
            },
            getMonth() {
                let d = new Date()
                this.fir = d.getMonth() + 1
                this.sec = (this.fir + 1) - 12 <= 0 ? this.fir + 1 : (this.fir + 1) - 12
                this.third = (Math.ceil(this.fir / 3) * 3) - 12 <= 0 ? Math.ceil(this.fir / 3) * 3 : ((Math.ceil(this.fir / 3) + 1) * 3) - 12
                this.forth = ((Math.ceil(this.fir / 3) + 1) * 3) - 12 <= 0 ? (Math.ceil(this.fir / 3) + 1) * 3 : ((Math.ceil(this.fir / 3) + 2) * 3) - 12
            },
            goforSell(obj) {
                let op = {
                    stockFinanceHoldId: obj.id,
                    parentStockFinanceId: obj.parentStockFinanceId,
                    optionCode: obj.optionCode,
                    optionName: obj.optionName,
                    holdAmount: obj.holdAmount
                }
                this.$router.push({name: 'sell', query: {obj: JSON.stringify(op), type: 3}})
            }
        },
        filters: {
            formatDate(time) {
                var date = new Date(time)
                return formatDate(date, 'yyyy-MM-dd')
            }
        },
        mounted() {
            this.getData()
            this.getMonth()
            // this.refreshData = setInterval(this.getData, 8000)
        },
        beforeDestroy() {
            clearInterval(this.refreshData)
        }
    }
</script>

<style lang="less" scoped>
    @import "~static/less/trade.less";
    @import "~static/less/reset.less";
</style>
