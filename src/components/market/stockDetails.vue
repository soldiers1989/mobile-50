<template>
    <div>
        <v-header></v-header>
        <div class="stockDetails_title">
            <div :class="{fontRed:stockData[2]>=0, fontGreen: stockData[2] < 0}">{{stockData[1]}}</div>
            <ul>
                <li>
                    <span>涨跌</span>
                    <span :class="{fontRed:stockData[2]>=0, fontGreen: stockData[2] < 0}">{{stockData[2]}}</span>
                </li>
                <li>
                    <span>幅度</span>
                    <span :class="{fontRed:stockData[2]>=0, fontGreen: stockData[2] < 0}">{{Number(stockData[3]).toFixed(2)}}%</span>
                </li>
                <li>
                    <span>成交量</span>
                    <span>{{stockData[4]}}</span>
                </li>
                <li>
                    <span>金额</span>
                    <span>{{stockData[5]}}万</span>
                </li>
            </ul>
        </div>

        <div class="trade_quote">
            <v-canvas></v-canvas>
            <p>
                注意: 本页面行情存在延时，交易请以交易所实时价格为准
            </p>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import vHeader from '@/components/Header/header.vue'
    import vStock from './stockPic.vue'
    import { bus } from '../../tools/bus'
    import { getInfoOfETF } from '../../apis/trade'
    import vCanvas from '@/components/UI/stockCanvas'

    export default {
        data () {
            return {
                title: '50ETF行情',
                getNewlyPrice: null,
                stockData: [],
                canvasData: []
            }
        },
        components: {
            vHeader, vStock, vCanvas
        },
        methods: {
            getData () {
                getInfoOfETF().then(res => {
                    // 名称，当前价，涨跌值，涨跌幅，总手数，成交额
                    this.stockData = res
                })
            }
        },
        mounted () {
            bus.$emit('pageTitle', this.title)
            this.getData()
            this.getNewlyPrice = setInterval(this.getData, 80000)
        },
        beforeDestroy () {
            clearInterval(this.getNewlyPrice)
        }
    }
</script>

<style lang="less" scoped>
    @import "~static/less/market.less";
    @import "~static/less/trade.less";
</style>
