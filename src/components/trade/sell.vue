<template>
    <div>
        <div class="trade_cell_code">
            <span>合约代码</span>
            <input type="text" v-model="stock_code" @keyup="searchOptions" readonly>
            <div class="trade_select_product" @click="getAllProduct">
                <span>选择</span>
                <img src="~static/img/icon_arrow.png" alt="选择">
            </div>
        </div>

        <div class="standardSearch" v-if="searchStandardOption.length != 0">
            <ul>
                <li v-for="(value, key) in searchStandardOption" :key="key" @click="sendOptions(value, 1)">
                    <span>{{value.optionCode}}</span>
                    <span>{{value.optionName}}</span>
                </li>
            </ul>
        </div>

        <div class="trade_cell">
            <span>合约名称</span>
            <input type="text" v-model="stock_name">
        </div>

        <ul class="trade_data">
            <li>
                <span>现价</span>
                <span :class="{fontRed: wsOptionInfo.LP >= wsOptionInfo.PSP,
                fontGreen:wsOptionInfo.LP < wsOptionInfo.PSP}">{{wsOptionInfo.LP | fillZero}}</span>
            </li>
            <li>
                <span>昨收价</span>
                <span>{{wsOptionInfo.PSP | fillZero}}</span>
            </li>
            <li>
                <span>涨跌幅</span>
                <span :class="{fontRed: wsOptionInfo.LP >= wsOptionInfo.PSP,
                fontGreen:wsOptionInfo.LP < wsOptionInfo.PSP}">{{rate}}</span>
            </li>
            <li>
                <span>行权价格</span>
                <span>{{Number(wsOptionInfo.EP).toFixed(4)}}</span>
            </li>
            <li>
                <span>到期日</span>
                <span>{{optionData.end_date}}</span>
            </li>
            <li>
                <span>剩余天数</span>
                <span>{{optionData.RemainingDays}}</span>
            </li>
        </ul>

        <div class="trade_quote" v-if="showStockPic">
            <v-stock :pictureId="pictureId"></v-stock>
        </div>

        <div class="trade_content">
            <ul class="trade_content_left">
                <li>
                    <span>委托方式</span>
                    <div>
                        <v-button :options="optionButton" @sendButtonValue="sendButtonValue"></v-button>
                    </div>
                </li>
                <li>
                    <span>委托价格</span>
                    <div>
                        <v-number :options="optionPrice" @sendValue="sendPrice"></v-number>
                    </div>
                </li>
                <li>
                    <span>委托数量</span>
                    <div>
                        <v-number :options="optionMount" @sendValue="sendMount"></v-number>
                    </div>
                </li>
                <li class="trade_last_line">
                    <div>
                        <span>最大可卖</span>
                        <span>{{sellMaxMount}}</span>
                    </div>
                    <div @click="goForRule">交易规则</div>
                </li>
            </ul>
            <div class="trade_content_right">
                <ul>
                    <li v-for="item in sale" @click="changeEntrustPrice(wsOptionInfo['SP'+item])">
                        <span>卖{{item}}</span>
                        <span :class="{fontRed: wsOptionInfo['SP' + item] >= wsOptionInfo.PSP,
                        fontGreen: wsOptionInfo['SP' + item] < wsOptionInfo.PSP}">{{wsOptionInfo['SP' + item] | fillZero}}</span>
                        <span>{{wsOptionInfo['SA' + item]}}</span>
                    </li>
                </ul>
                <ul>
                    <li v-for="i in 5" @click="changeEntrustPrice(wsOptionInfo['BP'+i])">
                        <span>买{{i}}</span>
                        <span :class="{fontRed: wsOptionInfo['BP' + i] >= wsOptionInfo.PSP,
                        fontGreen: wsOptionInfo['BP' + i] < wsOptionInfo.PSP}">{{wsOptionInfo['BP' + i] | fillZero}}</span>
                        <span>{{wsOptionInfo['BA' + i]}}</span>
                    </li>
                </ul>
            </div>
        </div>

        <button class="sell_button" @click="validSell">卖出</button>

        <!-- 卖出弹窗 -->
        <div id="modal" class="modal" v-if="confirmSell">
            <div class="modal-content">
                <header class="modal-header">交易确认</header>
                <div class="modal-body">
                    <ul>
                        <li>
                            <span>交易方向：</span>
                            <span>卖出平仓</span>
                        </li>
                        <li>
                            <span>合约代码：</span>
                            <span>{{stock_code}}</span>
                        </li>
                        <li>
                            <span>合约名称：</span>
                            <span>{{stock_name}}</span>
                        </li>
                        <li>
                            <span>剩余天数：</span>
                            <span>{{optionData.RemainingDays}}</span>
                        </li>
                        <li>
                            <span>委托价格：</span>
                            <span v-if="buttonType == 0">{{tradeData.optEntrustPrice}}</span>
                            <span v-if="buttonType == 'OPB'">市价</span>
                        </li>
                        <li>
                            <span>委托数量：</span>
                            <span>{{tradeData.entrustAmount}}（1张=10000份）</span>
                        </li>
                        <li>
                            <span>总手续费：</span>
                            <span>{{totalFreeBuy * tradeData.entrustAmount}}</span>
                        </li>
                        <li>
                            <span>注：持仓递延费休市后按实际持仓张数收取，{{sell_free}}元/张，仅交易日收取</span>
                        </li>
                    </ul>
                </div>
                <footer class="modal-footer">
                    <button id="cancel" @click="confirmSell = false, isSubmit = false">取消</button>
                    <button id="sure" :disabled="isSubmit" @click="sell()">确认</button>
                </footer>
            </div>
        </div>

        <!--上拉多选-->
        <v-pull :pullOptions="pullOptions" @sendOptions="sendOptions"></v-pull>
    </div>
</template>

<script type="text/ecmascript-6">
    import { bus } from '../../tools/bus'
    import vNumber from '../UI/number.vue'
    import vButton from '../UI/button.vue'
    import vStock from '../market/stockPic.vue'
    import vPull from '../UI/pullDialog.vue'
    import { getAllProduct, getProductByParam } from '../../apis/personal'
    import { toast, getItem, checkRealName, confirmDialog } from '../../tools/api_methods'
    import SockJS from 'sockjs-client'
    import Stomp from 'stompjs'
    import { WebScoketUrl } from '../../tools/api'
    import { getInfoOfETF, getOneProductInfo, entrustSell, getCustHoldingsInfoList, getMaxAvailableBuySellQuantity } from '../../apis/trade'
    import {fillZero} from "../../tools/api_methods";

    export default {
        name: 'sell',
        data () {
            return {
                stock_code: '',
                stock_name: '',
                searchStandardOption: [],
                wsOptionInfo: {},
                sale: [5, 4, 3, 2, 1],
                rate: '0.00%',
                optionData: {},
                sell_free: '',
                showPrice: true, // 是否刷新限价的价格
                sellMaxMount: '', // 最大可买,
                optionPrice: {},
                optionMount: {
                    able: false,
                    value: 0
                },
                optionButton: {
                    buttonName: ['市价', '限价'],
                    value: '限价',
                    type: 'sell'
                },
                buttonType: '',
                confirmSell: false,
                isSubmit: false,
                pullOptions: {
                    showFlag: false,
                    title: '请选择持仓',
                    list: [],
                    mention: '暂无持仓'
                },
                tradeData: {
                    stockFinanceHoldId: '',
                    parentStockFinanceId: '',
                    entrustAmount: '',
                    optEntrustPrice: '',
                    entrustBs: 2,
                    optionCode: '',
                    entrustIp: '127.0.0.1',
                    type: 0,
                    productId: 1,
                    entrustProp: 0,
                    entrustSource: "移动端网页"
                },
                mountData: {
                    entrustBs: 2,
                    optionCode: '',
                    optEntrustPrice: '',
                    entrustProp: 0,
                    stockHoldingId: ''
                },
                showStockPic: false,
                pictureId: '',
                totalFreeBuy: '',
                stompClient: null,
                socket: null
            }
        },
        filters: {
            fillZero (str) {
                return fillZero(4, str)
            }
        },
        methods: {
            // 接受改变Button
            sendButtonValue (obj) {
                let op = {}
                if (obj == '市价') {
                    op = {
                        able: 'disabled',
                        value: '市价',
                        type: 'sell'
                    }
                    this.buttonType = "OPB"
                    this.showPrice = false
                } else {
                    op = {
                        able: false,
                        value: this.wsOptionInfo.LP,
                        step: 0.0001,
                        min: 0,
                        type: 'sell'
                    }
                    this.buttonType = 0
                }
                this.changeSellPrice(op)
            },
            // 改变button
            changeButton (op) {
                if (op == undefined) {
                    this.optionButton = {
                        buttonName: ['市价', '限价'],
                        value: '限价',
                        type: 'sell'
                    }
                } else {
                    this.optionButton = op
                }
                op.value == '市价' ? this.buttonType = "OPB" : this.buttonType = 0
            },
            // 更改价格
            changeSellPrice (op) {
                if (op == undefined) {
                    this.optionPrice = {
                        able: 'disabled',
                        value: 0.00
                    }
                } else {
                    this.optionPrice = op
                }
            },
            // 点击五档行情改变价格
            changeEntrustPrice (obj) {
                this.tradeData.type = 2
                this.tradeData.optEntrustPrice = obj
                this.mountData.optEntrustPrice = obj //  在changebutton的方法里调用获取最大数量
                let buttonOp = {
                    buttonName: ['市价', '限价'],
                    value: '限价',
                    type: 'sell'
                }
                this.changeButton(buttonOp)
                let priceOp = {
                    able: false,
                    value: obj,
                    step: 0.0001,
                    min: 0,
                    type: 'sell'
                }
                this.changeSellPrice(priceOp)
            },
            // 接收价格
            sendPrice (obj) {
                this.showPrice = false // 不刷新价格
                this.tradeData.optEntrustPrice = obj
            },
            // 更改数量
            changeMount (op) {
                this.showFlag = false
                if (op == undefined) {
                    this.optionMount = {
                        able: 'disabled',
                        value: 0
                    }
                } else {
                    this.optionMount = op
                }
            },
            // 接受数量
            sendMount (obj) {
                this.tradeData.entrustAmount = obj
            },
            searchOptions () {
                let regx = /^[0-9]*$/
                if (!regx.test(this.stock_code)) {
                    toast('请输入正确的期权代码')
                    this.stock_code = ''
                } else if (this.stock_code.length > 4 && this.stock_code.length < 8) {
                    this.getProductByParam(this.stock_code)
                } else if (this.stock_code.length > 8) {
                    this.stock_code = this.stock_code.slice(0, 8)
                } else if (this.stock_code.length < 4) {
                    this.stock_name = ''
                    this.searchStandardOption = []
                }
            },
            sendOptions (obj, dir) {
                this.disconnect()
                if (dir == undefined) {
                    this.stock_code = obj.content
                    this.stock_name = obj.remark
                    this.tradeData.stockFinanceHoldId = obj.id
                    this.mountData.stockHoldingId = obj.id
                    this.tradeData.parentStockFinanceId = obj.parentId
                } else if (dir == 3) {
                    this.stock_code = obj.optionCode
                    this.stock_name = obj.optionName
                    this.tradeData.stockFinanceHoldId = obj.stockFinanceHoldId
                    this.mountData.stockHoldingId = obj.stockFinanceHoldId
                    this.tradeData.parentStockFinanceId = obj.parentStockFinanceId
                }
                this.showStockPic = true
                this.getSomeOneInfo(this.stock_code)
                this.getOneInfo(this.stock_code)
                let op = {
                    buttonName: ['市价', '限价'],
                    value: '限价',
                    type: 'sell'
                }
                this.changeButton(op)
            },
            validSell () {
                let _this = this
                this.tradeData.optionCode = this.stock_code
                this.buttonType == "OPB" ? this.tradeData.entrustProp = 'OPB' : this.tradeData.entrustProp = this.buttonType
                if (!checkRealName()) {
                    let options = {
                        message: '您还未实名认证，请先实名认证再绑卡',
                        confirmButtonText: '去认证',
                        closeOnClickOverlay: false,
                        lockScroll: true,
                        callBackConfirm: function () {
                            _this.$router.push('/realName')
                        }
                    }
                    confirmDialog(options)
                } else if (String(this.tradeData.entrustAmount).indexOf('.') > -1) {
                    toast("卖出数量不能为小数")
                    let mount = {
                        able: false,
                        value: this.sellMaxMount,
                        step: 1,
                        min: 0,
                        max: this.sellMaxMount
                    }
                    this.changeMount(mount)
                } else if (this.tradeData.optionCode == '') {
                    toast('请输入正确的期权代码')
                } else if (this.tradeData.optEntrustPrice == '') {
                    toast('请选择正确的金额')
                } else if (this.tradeData.entrustAmount == '') {
                    toast('请选择正确的数量')
                } else {
                    this.confirmSell = true
                }
            },
            sell () {
                this.isSubmit = true
                entrustSell(this.tradeData).then(res => {
                    if (res.code == 1) {
                        toast("委托成功， 请在当日委托中查看成交情况")
                        this.disconnect()
                        this.initData()
                        this.getAllProduct()
                    } else {
                        toast(res.msg)
                    }
                }).then(res => {
                    this.isSubmit = false
                    this.confirmSell = false
                })
            },
            // 模糊查询期权代码
            getProductByParam (obj) {
                let _this = this
                this.searchStandardOption = []
                getProductByParam({param: obj}).then(res => {
                    if (res.status == 1) {
                        res.data.data.forEach(function (obj) {
                            _this.searchStandardOption.push({
                                optionName: obj.option_name,
                                optionCode: obj.option_code
                            })
                        })
                    }
                })
            },
            // 获取持仓列表
            getAllProduct () {
                let _this = this
                _this.pullOptions.list = []
                this.pullOptions.showFlag = true
                getCustHoldingsInfoList().then(res => {
                    if (res.code == 1) {
                        res.data.forEach(function (obj) {
                            _this.pullOptions.list.push({
                                content: obj.optionCode,
                                remark: obj.optionName,
                                parentId: obj.parentStockFinanceId,
                                id: obj.id,
                                holdAmount: obj.holdAmount
                            })
                        })
                    }
                })
            },
            getSomeOneInfo (obj) {
                let _this = this
                _this.socket = new SockJS(WebScoketUrl)
                _this.stompClient = Stomp.over(_this.socket)
                _this.stompClient.connect({'username': _this.userid}, function (frame) {
                    _this.stompClient.subscribe('/app/init/api/1.0/getOptionMarket/' + obj, function (message) {
                        _this.updateInfo(JSON.parse(message.body).data)
                    })
                    _this.stompClient.subscribe('/topic/optionInfo/optHqreal/' + obj, function (message) {
                        _this.updateInfo(JSON.parse(message.body))
                    })
                })
            },
            updateInfo (data) {
                let _this = this
                _this.wsOptionInfo = data
                _this.changePrice = (_this.wsOptionInfo.LP - _this.wsOptionInfo.PSP).toFixed(4)
                _this.rate = (Number(_this.changePrice / _this.wsOptionInfo.PSP) * 100).toFixed(2) + '%'
                // this.getMaxSellMount()
                if (this.showPrice) {
                    this.tradeData.entrustAmount = this.sellMaxMount
                    this.tradeData.optEntrustPrice = this.wsOptionInfo.LP
                    this.tradeData.optionCode = this.stock_code
                    let op1 = {
                        able: false,
                        value: this.wsOptionInfo.LP,
                        step: 0.0001,
                        min: 0,
                        type: 'sell'
                    }
                    this.changeSellPrice(op1)
                }
            },
            getBuyFee () {
                let indexData = getItem('indexData')
                this.sell_free = indexData.night_fee_rate
                this.totalFreeBuy = indexData.productFee.sell_brokerage_amount +
                    indexData.productFee.sell_commission_amount +
                    indexData.productFee.sell_fare_amount +
                    indexData.productFee.sell_fee_amount +
                    indexData.productFee.sell_stampduty_amount +
                    indexData.productFee.sell_transfer_amount +
                    indexData.productFee.sell_witness_amount
            },
            disconnect () {
                let _this = this
                this.showPrice = true
                if (_this.stompClient != null) {
                    _this.stompClient.disconnect()
                }
            },
            getOneInfo (code) {
                let _this = this
                getOneProductInfo({optionCode: code}).then(function (res) {
                    _this.optionData = res.data
                })
            },
            getMaxSellMount () {
                let _this = this
                this.mountData.optionCode = this.stock_code
                this.buttonType == "OPB" ? this.mountData.entrustProp = 'OPB' : this.tradeData.mountData = this.buttonType
                getMaxAvailableBuySellQuantity(this.mountData).then(res => {
                    if (res.code == 1) {
                        _this.sellMaxMount = res.data.availableQuantity
                        if (this.showPrice) {
                            _this.tradeData.entrustAmount = _this.sellMaxMount
                            let mount = {
                                able: false,
                                value: _this.sellMaxMount,
                                step: 1,
                                min: 0,
                                max: _this.sellMaxMount
                            }
                            _this.changeMount(mount)
                        }
                    }
                })
            },
            goForRule () {
                this.$router.push({name: 'rule'})
            },
            initData () {
                this.wsOptionInfo = {
                    BA1: 0,
                    BA2: 0,
                    BA3: 0,
                    BA4: 0,
                    BA5: 0,
                    BP1: 0.00,
                    BP2: 0.00,
                    BP3: 0.00,
                    BP4: 0.00,
                    BP5: 0.00,
                    SA1: 0,
                    SA2: 0,
                    SA3: 0,
                    SA4: 0,
                    SA5: 0,
                    SP1: 0.00,
                    SP2: 0.00,
                    SP3: 0.00,
                    SP4: 0.00,
                    SP5: 0.00,
                    LP: 0.00,
                    CP: 0.00,
                    EP: 0.00
                }
                this.rate = '0.00%'
                this.buttonType = 0
                this.optionPrice = {
                    able: 'disabled',
                    value: 0.00
                }
                this.optionMount = {
                    able: 'disabled',
                    value: 0
                }
                this.stock_code = " "
                this.stock_name = " "
                this.sellMaxMount = 0
                this.optionData.end_date = ""
                this.optionData.RemainingDays = ""
                this.showStockPic = false
            }
        },
        components: {
            vNumber, vButton, vPull, vStock
        },
        mounted () {
            this.initData()
            this.getBuyFee()
            let query = this.$route.query
            if (JSON.stringify(query) != '{}') {
                let obj = JSON.parse(query.obj)
                this.mountData.optionCode = obj.optionCode
                this.mountData.stockFinanceHoldId = obj.stockFinanceHoldId
                this.sendOptions(obj, query.type)
            }
        },
        watch: {
            stock_code (newVal, oldVal) {
                if (newVal != oldVal) {
                    this.pictureId = newVal
                }
            },
            wsOptionInfo: {
                deep: true,
                handler: function (newVal, oldVal) {
                    if (newVal.LP != oldVal.LP) {
                        this.getMaxSellMount()
                    }
                }
            }
        },
        beforeDestroy () {
            this.disconnect()
            bus.$off('disconnect')
        }
    }
</script>

<style lang="less" scoped>
    @import "../../../static/less/trade.less";
    @import "~static/less/modal.less";
    @import "~static/less/reset.less";

    .sell_button {
        width: 100%;
        height: 1.39rem;
        background-color: @sellBlue;
        color: @fff;
        font-size: @font_size_45;
        border: none;
    }
</style>
