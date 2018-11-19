<template>
    <div>
        <Header/>
        <div class="assets">
            <div class="line1">
                <p>总资产（元）</p>
                <p>{{info.accountAsset | formatMoney}}</p>
            </div>
            <div class="line2">
                <ul>
                    <li>可用资金</li>
                    <li>{{data.cash | formatMoney }}</li>
                </ul>
                <ul>
                    <li>冻结资金</li>
                    <li>{{info.totalFrozenBalance | formatMoney}}</li>
                </ul>
            </div>
            <div class="line2">
                <ul>
                    <li>持仓市值</li>
                    <li>{{info.totalStockMarketValue | formatMoney }}</li>
                </ul>
                <ul>
                    <li>浮动盈亏</li>
                    <li>{{info.totalProfit | formatMoney }}</li>
                </ul>
            </div>
            <div class="line2">
                <ul>
                    <li>可取资金</li>
                    <li>{{data.canExtract | formatMoney }}</li>
                </ul>
                <ul>
                    <li>累计推广收益</li>
                    <li>{{data.totalSpreadIncome | formatMoney }}</li>
                </ul>
            </div>
        </div>
        <div class="recharge">
            <router-link to="/withdraw">
                <button>提现</button>
            </router-link>
            <router-link to="/recharge">
                <button class="red">充值</button>
            </router-link>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import Header from '../../Header/header'
    import {bus} from '../../../tools/bus'
    import {getCustAssetInfo} from '../../../apis/trade'
    import {getAccountCount} from '../../../apis/personal'
    import {formatMoney} from '../../../tools/api_methods'

    export default {
        name: 'assets',
        components: {
            Header
        },
        data () {
            return {
                title: '我的资产',
                navRightTitle: '资金流水',
                info: {},
                data: {}
            }
        },
        filters: {
            formatMoney: formatMoney
        },
        methods: {
            getInfo () {
                getCustAssetInfo({}).then(res => {
                    if (res.code == 1) {
                        this.info = res.data
                    }
                })
            },
            getData () {
                getAccountCount({}).then(res => {
                    if (res.status == 1) {
                        this.data = res.data
                    }
                })
            },
            init () {
                this.info = {
                    accountAsset: '--',
                    totalStockMarketValue: '--',
                    totalProfit: '--',
                    totalFrozenBalance: '--'
                }
                this.data = {
                    canExtract: '--',
                    totalSpreadIncome: '--',
                    cash: '--'
                }
            }
        },
        mounted () {
            this.init()
            bus.$emit('pageTitle', this.title)
            bus.$emit('navRightTitle', this.navRightTitle)
            bus.$emit('showAdd')
            this.getInfo()
            this.getData()
        }
    }

</script>

<style lang="less" scoped>
    @import '~static/less/reset.less';

    .assets {
        background-color: @bgc_fff;
        .line1 {
            height: 2.69rem;
            padding: 0.4rem 0.4rem 0.35rem 0.4rem;
            border-bottom: 1px solid #eee;
            p:nth-child(1) {
                text-align: left;
                font-size: @font_size_4;
                color: @999;
            }
            p:nth-child(2) {
                text-align: center;
                margin-top: 0.27rem;
                font-size: 0.8rem;
                color: @333;
            }
        }
        .line2 {
            height: 1.89rem;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            ul {
                flex: 1;
                text-align: left;
                padding: 0.27rem 0.4rem;
                li:nth-child(1) {
                    font-size: @font_size_4;
                    color: @999;
                }
                li:nth-child(2) {
                    font-size: @font_size_48;
                    color: @333;
                    margin-top: 0.25rem;
                }
            }
            ul:nth-child(1) {
                border-right: 1px solid #eee;
            }

        }
    }

    .recharge {
        margin: 0.67rem 1.07rem;
        display: flex;
        justify-content: space-between;
        button {
            width: 3.47rem;
            height: 1.17rem;
            color: @fff;
            font-size: @font_size_45;
            border: none;
            border-radius: 5px;
        }
        button:nth-child(1) {
            background-color: @yellow;
        }
        .red {
            background-color: @red !important;
        }
    }
</style>
