<template>
    <div>
        <div class="trade_cell_code">
            <span>合约代码</span>
            <input type="text" placeholder="请输入合约代码" v-model="stock_code" @keyup="searchOptions" />
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
                <span :class="{fontRed: wsOptionInfo.LP >= wsOptionInfo.PSP, fontGreen:wsOptionInfo.LP < wsOptionInfo.PSP}">{{wsOptionInfo.LP | fillZero}}</span>
            </li>
            <li>
                <span>昨收价</span>
                <span>{{wsOptionInfo.PSP | fillZero}}</span>
            </li>
            <li>
                <span >涨跌幅</span>
                <span :class="{fontRed: wsOptionInfo.LP >= wsOptionInfo.PSP, fontGreen:wsOptionInfo.LP < wsOptionInfo.PSP}">{{rate}}</span>
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
                        <span>预估金额</span>
                        <span>{{totalMount}}</span>
                    </div>
                    <div @click="goForRule">交易规则</div>
                </li>
            </ul>
            <div class="trade_content_right">
                <ul>
                    <li v-for="item in sale" @click="changeEntrustPrice(wsOptionInfo['SP'+item])">
                        <span>卖{{item}}</span>
                        <span :class="{fontRed: wsOptionInfo.PSP <= wsOptionInfo['SP'+item], fontGreen:wsOptionInfo.PSP > wsOptionInfo['SP'+item]}">{{wsOptionInfo['SP'+item] | fillZero}}</span>
                        <span>{{wsOptionInfo['SA'+item]}}</span>
                    </li>
                </ul>
                <ul>
                    <li v-for="i in 5" @click="changeEntrustPrice(wsOptionInfo['BP'+i])">
                        <span>买{{i}}</span>
                        <span :class="{fontRed: wsOptionInfo.PSP <= wsOptionInfo['BP'+i], fontGreen:wsOptionInfo.PSP > wsOptionInfo['BP'+i]}">{{wsOptionInfo['BP'+i] | fillZero}}</span>
                        <span>{{wsOptionInfo['BA'+i]}}</span>
                    </li>
                </ul>
            </div>
        </div>

        <p class="tip">市价委托单笔不可超过10张，限价委托单笔不可超过30张</p>

        <button class="buy_button" @click="validBuy">买入</button>

        <!-- 买入弹窗 -->
        <div id="modal" class="modal" v-if="confirmBuy">
        <div class="modal-content">
            <header class="modal-header">交易确认</header>
            <div class="modal-body">
            <ul>
                <li>
                    <span>交易方向：</span>
                    <span>买入开仓</span>
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
                    <span>注：持仓递延费休市后按实际持仓张数收取，{{buy_free}}元/张，仅交易日收取</span>
                </li>
            </ul>
            </div>
            <footer class="modal-footer">
                <button id="cancel" @click="confirmBuy = false, isSubmit = false">取消</button>
                <button id="sure" :disabled="isSubmit" @click="buy()">确认</button>
            </footer>
        </div>
        </div>

        <!--上拉多选-->
        <v-pull :pullOptions="pullOptions" @sendOptions="sendOptions"></v-pull>
    </div>
</template>

<script type="text/ecmascript-6">
    import {bus} from '../../tools/bus'
    import vStock from '../market/stockPic.vue'
    import vNumber from '../UI/number.vue'
    import vButton from '../UI/button.vue'
    import vPull from '../UI/pullDialog.vue'
    import {getAllProduct, getProductByParam, getUserInfo} from '../../apis/personal'
    import {toast, getItem, checkRealName, confirmDialog, fillZero} from '../../tools/api_methods'
    import SockJS from 'sockjs-client'
    import Stomp from 'stompjs'
    import {WebScoketUrl} from '../../tools/api'
    import { getOneProductInfo, buyEntrust } from '../../apis/trade'

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
                showPrice: true, // 是否刷新限价的价格
                buy_free: '',
                totalFreeBuy: '',
                optionPrice: {},
                optionMount: {
                    able: false,
                    value: 0
                },
                optionButton: {
                    buttonName: ['市价', '限价'],
                    value: '限价',
                    type: 'buy'
                },
                buttonType: '',
                confirmBuy: false,
                isSubmit: false,
                pullOptions: {
                    showFlag: false,
                    title: '请选择产品',
                    list: []
                },
                tradeData: {
                    entrustAmount: 1,
                    optEntrustPrice: '',
                    entrustBs: 1,
                    optionCode: '',
                    entrustIp: '127.0.0.1',
                    type: 2,
                    productId: 1,
                    cautionMoney: 0,
                    optionName: '',
                    lostWinId: 0,
                    entrustSource: "移动端网页"
                },
                mountData: {
                    entrustBs: 1,
                    optionCode: '',
                    optEntrustPrice: '',
                    entrustProp: 0
                },
                pictureId: '',
                showStockPic: false,
                title: '交易',
                balance: '',
                totalPay: '',
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
                this.showPrice = true
                let op = {}
                if (obj == '市价') {
                    op = {
                        able: 'disabled',
                        value: '市价',
                        type: 'buy'
                    }
                    this.buttonType = 'OPB'
                    this.showPrice = false
                } else {
                    op = {
                        able: false,
                        value: this.wsOptionInfo.LP,
                        step: 0.0001,
                        min: 0,
                        type: 'buy'
                    }
                    this.buttonType = '0'
                    this.showPrice = true
                }
                this.changeSellPrice(op)
            },
            // 改变button
            changeButton (op) {
                if (op == undefined) {
                    this.optionButton = {
                        buttonName: ['市价', '限价'],
                        value: '限价',
                        type: 'buy'
                    }
                } else {
                    this.optionButton = op
                }
                op.value == '市价' ? this.buttonType = "OPB" : this.buttonType = '0'
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
                this.showPrice = false
                this.tradeData.type = 2
                this.tradeData.optEntrustPrice = obj
                this.mountData.optEntrustPrice = obj //  在changebutton的方法里调用获取最大数量
                let buttonOp = {
                    buttonName: ['市价', '限价'],
                    value: '限价',
                    type: 'buy'
                }
                this.changeButton(buttonOp)
                let priceOp = {
                    able: false,
                    value: obj,
                    step: 0.0001,
                    min: 0,
                    type: 'buy'
                }
                this.changeSellPrice(priceOp)
            },
            // 接收价格
            sendPrice (obj) {
                this.showPrice = false // 不刷新价格
                this.tradeData.optEntrustPrice = obj
                this.mountData.optEntrustPrice = obj
            },
            // 更改数量
            changeMount (op) {
                this.showPrice = false
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
                } else {
                    this.stock_code = obj.optionCode
                    this.stock_name = obj.optionName
                    this.searchStandardOption = []
                }
                this.showStockPic = true
                this.getSomeOneInfo(this.stock_code)
                this.getOneInfo(this.stock_code)
                let op = {
                    buttonName: ['市价', '限价'],
                    value: '限价',
                    type: 'buy'
                }
                this.changeButton(op)
            },
            validBuy () {
                let _this = this
                this.tradeData.optionCode = this.stock_code
                this.buttonType == 1 ? this.tradeData.entrustProp = 'OPB' : this.tradeData.entrustProp = this.buttonType
                this.totalPay = (this.tradeData.optEntrustPrice * 10000 + this.totalFreeBuy) * this.tradeData.entrustAmount
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
                } else if (this.tradeData.optionCode == "") {
                    toast("请输入正确的期权代码")
                } else if (this.tradeData.optEntrustPrice == "") {
                    toast("请选择正确的金额")
                } else if (this.tradeData.entrustAmount == "" || this.tradeData.entrustAmount == 0) {
                    toast("请选择正确的数量")
                } else if (String(this.tradeData.entrustAmount).indexOf('.') > -1) {
                    let m = Math.floor(this.tradeData.entrustAmount)
                    toast("委托数量不能为小数")
                    let op = {
                        able: false,
                        step: 1,
                        value: m,
                        min: 0
                    }
                    this.changeMount(op)
                } else if (this.balance < this.totalPay) {
                    let options = {
                        message: '余额不足，是否去充值',
                        confirmButtonText: '去充值',
                        closeOnClickOverlay: false,
                        lockScroll: true,
                        callBackConfirm: function () {
                            _this.$router.push('/recharge')
                        }
                    }
                    confirmDialog(options)
                } else {
                    this.confirmBuy = true
                }
            },
            buy () {
                let _this = this
                this.isSubmit = true
                buyEntrust(this.tradeData).then(res => {
                    if (res.code == 1) {
                        toast("委托成功")
                        _this.disconnect()
                        _this.initData()
                    } else {
                        toast(res.msg)
                    }
                }).then(res => {
                    this.isSubmit = false
                    this.confirmBuy = false
                })
            },
            // 模糊查询期权代码
            getProductByParam (obj) {
                let _this = this
                this.searchStandardOption = []
                getProductByParam({param: obj}).then(res => {
                    if (res.status == 1) {
                        res.data.forEach(function (obj) {
                            _this.searchStandardOption.push({
                                optionName: obj.option_name,
                                optionCode: obj.option_code
                            })
                        })
                    }
                })
            },
            getAllProduct () {
                let _this = this
                this.pullOptions.showFlag = true
                getAllProduct().then(res => {
                    if (res.status == 1) {
                        res.data.forEach(function (obj) {
                            _this.pullOptions.list.push({
                                content: obj.option_code,
                                remark: obj.option_name
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
                    _this.stompClient.subscribe('/app/init/api/1.0/getOptionMarket/' + obj, function (message){
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
                _this.changePrice == 0 ? _this.rate = (Number(_this.changePrice / _this.wsOptionInfo.PSP) * 100).toFixed(2) + "%" : '0.00%'
                // 第一次赋值，有值就不赋值
                if (this.showPrice) {
                    let op1 = {
                        able: false,
                        value: this.wsOptionInfo.LP,
                        step: 0.0001,
                        min: 0,
                        type: 'buy'
                    }
                    this.changeSellPrice(op1)
                    let op = {
                        able: false,
                        step: 1,
                        value: 1,
                        min: 0
                    }
                    this.changeMount(op)
                    this.tradeData = {
                        entrustAmount: 1,
                        optEntrustPrice: this.wsOptionInfo.LP,
                        entrustBs: 1,
                        optionCode: this.stock_code,
                        optionName: this.stock_name,
                        entrustIp: '127.0.0.1',
                        entrustProp: '0',
                        productId: 1,
                        cautionMoney: 0,
                        lostWinId: 0,
                        entrustSource: "移动端网页"
                    }
                    this.mountData = {
                        entrustBs: 1,
                        optionCode: this.stock_code,
                        optEntrustPrice: this.wsOptionInfo.LP,
                        entrustProp: 0
                    }
                }
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
            getBuyFee () {
                let indexData = getItem('indexData')
                this.buy_free = indexData.night_fee_rate
                this.totalFreeBuy = indexData.productFee.buy_brokerage_amount +
                    indexData.productFee.buy_commission_amount +
                    indexData.productFee.buy_fare_amount +
                    indexData.productFee.buy_fee_amount +
                    indexData.productFee.buy_stampduty_amount +
                    indexData.productFee.buy_transfer_amount +
                    indexData.productFee.buy_witness_amount
            },
            goForRule () {
                this.$router.push({name: 'rule'})
            },
            seleced(value, number, index) {
                if (this.optionMount.able == "disabled") {
                    toast("请先选择合约")
                } else {
                    this.tradeData.entrustAmount = value
                    this.optionMount.value = value
                    if (this.buttonType == 'OPB' && value > 10) {
                        this.optionMount.value = 10
                        this.tradeData.entrustAmount = 10
                        toast("买入数量超出最大可委托的数量")
                    }
                    if (value > 30) {
                        this.optionMount.value = 30
                        this.tradeData.entrustAmount = 30
                        toast("买入数量超出最大可委托的数量")
                    }
                }
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
                this.buttonType = '0'
                this.optionPrice = {
                    able: 'disabled',
                    value: 0
                }
                this.optionMount = {
                    able: 'disabled',
                    value: 0
                }
                this.stock_code = ""
                this.stock_name = ""
                this.optionData.end_date = ""
                this.optionData.RemainingDays = ""
                this.showStockPic = false
            },
            getUserInfo () {
                let _this = this
                getUserInfo().then((res) => {
                    let userInfo = getItem('userInfo')
                    _this.balance = userInfo.cust_capital_amount
                })
            }
        },
        components: {
            vNumber, vButton, vPull, vStock
        },
        computed: {
            totalMount () {
                if (this.tradeData.optEntrustPrice) {
                    return parseInt((this.tradeData.optEntrustPrice * 10000 + this.totalFreeBuy) * this.tradeData.entrustAmount)
                } else {
                    return 0
                }
            }
        },
        watch: {
            showPrice (newVal, oldVal) {
            },
            stock_code (newVal, oldVal) {
                if (newVal != oldVal) {
                    this.pictureId = newVal
                }
            }
        },
        activated () {
            bus.$emit('pageTitle', this.title)
            this.getUserInfo()
            if (this.stock_code && !this.stompClient.connected) {
                let obj = {}
                obj.optionCode = this.stock_code
                obj.optionName = this.stock_name
                this.sendOptions(obj, 1)
            }
        },
        mounted () {
            this.initData()
            bus.$emit('pageTitle', this.title)
            bus.$on('disconnect', () => {
                this.disconnect()
            })
            let params = this.$route.params
            if (JSON.stringify(params) != '{}') {
                this.sendOptions(params, 1)
            }
            this.getBuyFee()
            this.getUserInfo()
        },
        beforeDestroy () {
            this.disconnect()
            bus.$off('disconnect')
        }
    }
</script>

<style lang="less" scoped>
    @import "~static/less/trade.less";
    @import "~static/less/modal.less";
    @import "~static/less/reset.less";
    .buy_button {
        width: 100%;
        height: 1.39rem;
        background-color: @red;
        color: @fff;
        font-size: @font_size_45;
        border: none;
        margin-bottom: 1.8rem;
    }
    .tip {
        background-color: @bgc_fff;
        padding: 0.27rem 0;
        padding-bottom: 0.43rem;
        text-align: center;
        color: #999;
        font-size: 0.32rem;
    }
    .selectButton {
        color: #fff !important;
        background: #EA3939 !important;
        border: 0.02rem solid #EA3939 !important;
    }
</style>
