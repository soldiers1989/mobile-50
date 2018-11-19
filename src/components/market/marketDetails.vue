<template>
    <div class="market_details_page">
        <nav class="nav">
            <img src="~static/img/icon_more_white.png" alt="返回" @click="goBack()" class="go-back">
            <p class="title">{{wsOptionInfo.ON}}</p>
            <p class="sub_title">{{wsOptionInfo.OC}}</p>
        </nav>

        <div class="marketDetails_title">
            <div :class="{fontRed: changePrice >= 0, fontGreen: changePrice < 0}">
                <span>{{wsOptionInfo.LP}}</span>
                <span>{{changePrice}}({{rate}})</span>
            </div>
            <ul>
                <li>
                    <span>最高</span>
                    <span>{{wsOptionInfo.HP | fillZero}}</span>
                </li>
                <li>
                    <span>昨收</span>
                    <span>{{wsOptionInfo.PP | fillZero}}</span>
                </li>
                <li>
                    <span>最低</span>
                    <span>{{wsOptionInfo.LP | fillZero}}</span>
                </li>
                <li>
                    <span>总量</span>
                    <span>{{wsOptionInfo.BA | fillZero}}</span>
                </li>
            </ul>
        </div>

        <div class="trade_quote">
            <v-stock :pictureId="pictureId"></v-stock>
        </div>

        <div class="market_details">
            <ul class="market_details_title">
                <li :class="{tabActive: detailsTab == 1}" @click="detailsTab = 1">五档</li>
                <li :class="{tabActive: detailsTab == 2}" @click="detailsTab = 2">详情</li>
            </ul>
            <ul v-if="detailsTab == 1" class="market_details_price">
                <li>
                    <span>买卖</span>
                    <span>价格</span>
                    <span>委托量</span>
                </li>
                <li v-for="item in sale">
                    <span>卖{{item}}</span>
                    <span>{{wsOptionInfo['SP'+item] | fillZero}}</span>
                    <span>{{wsOptionInfo['SA'+item]}}</span>
                </li>
                <li>
                    <p></p>
                </li>
                <li v-for="i in 5">
                    <span>买{{i}}</span>
                    <span>{{wsOptionInfo['BP'+i] | fillZero}}</span>
                    <span>{{wsOptionInfo['BA'+i]}}</span>
                </li>
            </ul>
            <ul v-if="detailsTab == 2" class="market_details_details">
                <li>
                    <p>
                        <span>买价</span>
                        <span>{{wsOptionInfo.BP1 | fillZero}}</span>
                    </p>
                    <p>
                        <span>卖价</span>
                        <span>{{wsOptionInfo.SP1 | fillZero}}</span>
                    </p>
                </li>
                <li>
                    <p>
                        <span>涨幅</span>
                        <span>{{rate}}</span>
                    </p>
                    <p>
                        <span>开盘</span>
                        <span>{{wsOptionInfo.OP | fillZero}}</span>
                    </p>
                </li>
                <li>
                    <p>
                        <span>金额</span>
                        <span>{{(wsOptionInfo.BB/10000).toFixed(2)}}万</span>
                    </p>
                    <p>
                        <span>行权价格</span>
                        <span>{{Number(wsOptionInfo.EP).toFixed(4)}}</span>
                    </p>
                </li>
                <li>
                    <p>
                        <span>合约乘数</span>
                        <span>{{optionData['amount_per_hand']}}</span>
                    </p>
                    <p>
                        <span>证券价格</span>
                        <span>{{stockData[1]}}</span>
                    </p>
                </li>
                <li>
                    <p>
                        <span>持仓量</span>
                        <span>{{wsOptionInfo.UA}}</span>
                    </p>
                    <p>
                        <span>时间价值</span>
                        <span>{{wsOptionInfo.LP}}</span>
                    </p>
                </li>
                <li>
                    <p>
                        <span>涨停价</span>
                        <span>{{optionData['opt_up_price']}}</span>
                    </p>
                    <p>
                        <span>跌停价</span>
                        <span>{{optionData['opt_down_price']}}</span>
                    </p>
                </li>
                <li>

                    <p>
                        <span>上市日</span>
                        <span>{{optionData.begin_date}}</span>
                    </p>
                    <p>
                        <span>到期日</span>
                        <span>{{optionData.end_date}}</span>
                    </p>
                </li>
                <li>
                    <p>
                        <span>剩余天数</span>
                        <span>{{optionData.RemainingDays}}</span>
                    </p>
                    <p>
                        <span></span>
                        <span></span>
                    </p>
                </li>
            </ul>
        </div>

        <div class="marketDetails_button">
            <button @click="delStock" :disabled="submit"  v-if="isInPool">删自选</button>
            <button @click="addStock" :disabled="submit" v-else>加自选</button>
            <button @click="goForBuy">交易</button>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import SockJS from 'sockjs-client'
    import Stomp from 'stompjs'
    import vStock from '../market/stockPic.vue'
    import {WebScoketUrl} from '../../tools/api'
    import {getInfoOfETF, getOneProductInfo} from '../../apis/trade'
    import {addStockToPool, getAllProduct, delStockFromPool, isInPool} from '../../apis/personal'
    import {fillZero} from "../../tools/api_methods";

    export default {
        data () {
            return {
                detailsTab: 1,
                options_code: "",
                wsOptionInfo: {},
                sale: [5, 4, 3, 2, 1],
                changePrice: 0,
                rate: 0,
                getNewlyPrice: null,
                stockData: [],
                optionData: {},
                formData: {
                    optionCode: ""
                },
                submit: false,
                isInPool: false,
                pictureId: ''
            }
        },
        filters: {
            fillZero (str) {
                return fillZero(4, str)
            }
        },
        methods: {
            goBack () {
                this.$router.go(-1)
            },
            getSomeOneInfo () {
                let _this = this
                let now1 = new Date()
                let time1 = now1.getHours() + ':' + now1.getMinutes()
                _this.socket = new SockJS(WebScoketUrl)
                _this.stompClient = Stomp.over(_this.socket)
                _this.stompClient.connect({'username': _this.userid}, function (frame) {
                    _this.stompClient.subscribe('/app/init/api/1.0/getOptionMarket/' + _this.options_code, function (message) {
                        _this.updateInfo(JSON.parse(message.body).data)
                    })
                        _this.stompClient.subscribe('/topic/optionInfo/optHqreal/' + _this.options_code, function (message) {
                            _this.updateInfo(JSON.parse(message.body))
                        })
                    })
            },
            getData () {
                getInfoOfETF().then(res => {
                    // 名称，当前价，涨跌值，涨跌幅，总手数，成交额
                    this.stockData = res
                })
            },
            getOneInfo () {
                let _this = this
                getOneProductInfo({optionCode: _this.options_code}).then(function (res) {
                    _this.optionData = res.data
                })
            },
            updateInfo (data) {
                let _this = this
                _this.wsOptionInfo = data
                _this.changePrice = (_this.wsOptionInfo.LP - _this.wsOptionInfo.PSP).toFixed(4)
                _this.rate = (Number(_this.changePrice / _this.wsOptionInfo.PSP) * 100).toFixed(2) + "%"
            },
            Stock () {
                let _this = this
                isInPool({optionCode: this.$route.params.optionCode}).then(function (res) {
                    if (res.status == 1) {
                        _this.isInPool = res.data.inPool
                    }
                })
            },
            // 加自选
            addStock () {
                let _this = this
                _this.formData.optionCode = this.$route.params.optionCode
                addStockToPool(this.formData).then(function (res) {
                    if (res.status == 1) {
                        _this.isInPool = !_this.isInPool
                        _this.$toast('添加自选成功')
                    } else {
                        _this.$toast(res.msg)
                    }
                }).catch(function () {
                    _this.$toast("添加失败，请稍后再试")
                })
            },
            // 删自选
            delStock () {
                let _this = this
                _this.formData.optionCode = this.$route.params.optionCode
                delStockFromPool(this.formData).then(function (res) {
                    if (res.status == 1) {
                        _this.isInPool = !_this.isInPool
                        _this.$toast('删除自选成功')
                    } else {
                        _this.$toast(res.msg)
                    }
                }).catch(function () {
                    _this.$toast("删除失败，请稍后再试")
                })
            },
            goForBuy () {
                this.$router.push({name: 'buy', params: {optionCode: this.$route.params.optionCode, optionName: this.wsOptionInfo.ON}})
            }
        },
        mounted () {
            this.options_code = this.$route.params.optionCode
            this.pictureId = this.$route.params.optionCode
            this.getSomeOneInfo()
            this.getData()
            this.getOneInfo()
            this.Stock()
            this.getNewlyPrice = setInterval(this.getData, 8000)
        },
        components: {
            vStock
        },
        beforeDestroy () {
            clearInterval(this.getNewlyPrice)
        }
    }
</script>

<style lang="less" scoped>
    @import '~static/less/market.less';
    @import '~static/less/trade.less';

    .market_details_page {
        padding-bottom: 1.39rem;
    }

    .nav {
        height: 1.17rem;
        background-color: @headerRed;
        .go-back {
            width: 0.24rem;
            height: 0.43rem;
            position: absolute;
            left: 4%;
            top: 2.1%;
        }
        p:nth-child(2) {
            height: .61rem;
            line-height: .7rem;
            font-size: @font_size_4;
        }
        p:nth-child(3) {
            height: .56rem;
            line-height: .48rem;
            font-size: @font_size_32;
            color: @fff;
        }
        .title {
            color: @fff;
            font-size: @font_size_45;
        }
        .sub_title {

        }
    }
</style>
