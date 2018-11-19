<template>
    <div>
        <Header />
        <div v-if="isPay">
            <div class="line1">
                <p class="money">充值金额</p>
                 <div class="btn-group-wrap">
                    <button :class="{selectButton: showMoney==v.value}" class="select-btn"
                            v-for='(v,k) in selectMoneyData' :key=k
                            @click="seleced(v.value, v.number, k)">{{v.value}}
                    </button>
                </div>
                <p class="money">其他金额</p>
                <div class="recharge">
                    <van-field placeholder="请输入金额" class="recharge_text" v-model.trim="choiceMoney"/>
                </div>
            </div>
            <div class="line2">
                <van-radio-group v-model="select" color="#FE3D3D"  @change.native="changeMethod">
                    <ul>
                        <li>
                            <img src="~static/img/icon_wechat.png">
                            <span>微信</span>
                        </li>
                        <li>
                            <van-radio  name="2"></van-radio>
                        </li>
                    </ul>
                    <ul>
                        <li>
                            <img src="~static/img/icon_alipay.png">
                            <span>支付宝</span>
                        </li>
                        <li>
                            <van-radio  name="1"></van-radio>
                        </li>
                    </ul>
                </van-radio-group>
            </div>
            <div align="center" class="button">
                <form  method="POST" @submit.prevent="pay" ref="WexinPayForm">
                    <input type="hidden" name="uid" v-model="uid">
                    <input type="hidden" name="amount_of_account" :value="amount_of_account">
                    <input type="hidden" name="payType" v-model="select">
                    <input type="hidden" name="isMobile" value="true">
                    <button type="submit">立即充值</button>
                </form>
            </div>
            <div class="tip">
            <p>扫码充值说明</p>
            <p>1.请在规定时间内支付成功，否则不能自动到账</p>
            <p>2.请按指定优惠金额支付，否则不能自动到账</p>
            <p>3.微信长按二维码即可支付</p>
            <p>4.支付宝需保存图片到本地，打开支付宝，从相册扫码支付</p>
            <p>5.如二维码过期，请勿支付，不能自动到账</p>
            <p>6.如已支付成功，未到账，请联系客服</p>
        </div>
        </div>
        <div v-if="!isPay">
            <div class="main" v-show="!success">
                <p class="main-title" >订单号: <span id="order_number">{{ order_number }}</span></p>
                <p class="main-title">订单时间：{{ order_time }}</p>
                <div class="main-body">
                    <p>请支付{{ amount }}元，否则不能自动到账</p>
                    <p>￥{{ amount }}</p>
                    <p><span>￥{{ original_amount }}</span>已随机立减{{ discount }}元</p>
                    <div class="src" v-if="!disable"><img :src="qr_code_url" ></div>
                    <!-- 失效的二维码 -->
                    <div class="qrImgFail" v-if="disable">
                        <img src="http://47.107.40.38:8030/images/qr1_invalid.png" v-if="select==1">
                        <img src="http://47.107.40.38:8030/images/qr2_invalid.png" v-if="select==2">
                        <p>二维码已过期失效</p>
                    </div>
                    <p><span>{{minute}}分{{second}}秒</span></p>
                    <p>过期请勿支付，否则不能自动到账</p>
                    <p>如已支付未到账，请联系客服</p>
                </div>
            </div>
            <div class="main-success" v-show="success">
                <p v-if="select == 1">支付宝扫码充值{{ original_amount }}元</p>
                <p v-if="select == 2">微信扫码充值{{ original_amount }}元</p>
                <div class="success-img"><img src="http://47.107.40.38:8030/images/icon_success.png"></div>
                <p>支付成功</p>
                <p @click="window.location.href='{{ return_url }}'">查看余额</p>
            </div>
        </div>

        <!-- 弹窗 -->
        <van-popup v-model="showPop" position="center">
            <div class="popMain">
                <p class="popMain-title">充值提示</p>
                <div class="popMain-center">
                    <p>微信公众号长按二维码识别支付</p>
                    <p>支付宝保存图片到本地，打开支付宝从相册扫码支付</p>
                    <p>APP用户保存图片到本地，打开微信或支付宝从相册扫码支付</p>
                </div>
                <div class="popMain-bottom" align="center" @click="showPop = false">
                    <button class="sure">确定</button>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
    import Header from '../../../Header/header'
    import {bus} from '../../../../tools/bus'
    import {getItem, toast} from "../../../../tools/api_methods"
    import {payMin} from "../../../../tools/ajax"
    import {host} from "../../../../tools/api"
    import axios from 'axios'

export default {
    data () {
        return {
            title: '扫码支付',
            selectMoneyData: [
                {
                    id: 1,
                    value: '100',
                    number: 100
                },
                {
                    id: 2,
                    value: '300',
                    number: 300

                },
                {
                    id: 3,
                    value: '500',
                    number: 500
                },
                {
                    id: 4,
                    value: '1000',
                    number: 1000
                },
                {
                    id: 5,
                    value: '2000',
                    number: 2000
                },
                {
                    id: 6,
                    value: '3000',
                    number: 3000
                },
                {
                    id: 7,
                    value: '5000',
                    number: 5000
                },
                {
                    id: 8,
                    value: '10000',
                    number: 10000
                }
            ],
            showMoney: '100',
            choiceMoney: '',
            select: "",
            showPop: true,
            payUrl: host + '/payMonitor',
            uid: "",
            isPay: true,
            success: false,
            order_number: "",
            order_time: "",
            amount: "",
            original_amount: "",
            discount: "",
            qr_code_url: "",
            return_url: "",
            minutes: 3,
            seconds: 0,
            disable: false
        }
    },
    components: {
        Header
    },
    methods: {
        seleced (value, number, index) {
            this.showMoney = value
            this.choiceMoney = ''
        },
        changeMethod () {
        },
        update () {
            let userInfo = getItem("userInfo")
            this.uid = userInfo.cust_id
        },
        pay () {
            if (this.amount_of_account == "" || this.amount_of_account < 1) {
                toast("金额不能为空且必须不低于1")
                return false
            }
            if ((new Date()).getHours() < 9 || (new Date()).getHours() >= 17) {
                toast("充值时间为09:00~17:00")
                return false
            }
            let _this = this
            payMin({ amount_of_account: this.amount_of_account, uid: this.uid, payType: this.select, isMobile: true })
                .then(function (data) {
                    if (data.status) {
                        _this.isPay = false
                        _this.order_number = data.data.order_number
                        _this.order_time = data.data.order_time
                        _this.amount = data.data.amount
                        _this.original_amount = data.data.original_amount
                        _this.discount = data.data.discount
                        _this.qr_code_url = data.data.qr_code_url
                        _this.return_url = data.data.return_url
                        _this.add()
                        setInterval(_this.fetchOrderInfo, 1500)
                    } else {
                        if (data.msg) {
                            toast(data.msg)
                        } else {
                            toast(data)
                        }
                    }
            }).catch(function (err) {
                console.log(err)
            })
        },
        num: function (n) {
            return n < 10 ? '0' + n : '' + n
        },
        add: function () {
            let _this = this
            let time = window.setInterval(function () {
                if (_this.seconds === 0 && _this.minutes !== 0) {
                    _this.seconds = 59
                    _this.minutes -= 1
                } else if (_this.minutes === 0 && _this.seconds === 0) {
                    _this.seconds = 0
                    window.clearInterval(time)
                } else {
                    _this.seconds -= 1
                }
            }, 1000)
        },
        fetchOrderInfo: function() {
            if (this.seconds > 0 || this.minutes > 0) {
                var _this = this
                var order_number = _this.order_number
                var a = document.getElementById('return_url')
                axios.get('http://47.107.40.38:8030/api/fetchOrderInfo/?order_number=' + order_number).then(function (res) {
                    var data = res.data.data
                    if (data.status == 1) {
                        _this.success = true
                        setTimeout(function () {
                            window.location.href = _this.return_url
                        }, 5000)
                    }
                })
            }
        }
    },
    mounted () {
        bus.$emit('pageTitle', this.title)
        this.select = ""
        this.update()
    },
    computed: {
        amount_of_account () {
            return this.choiceMoney > 0 ? this.choiceMoney : this.showMoney
        },
        second: function () {
            return this.num(this.seconds)
        },
        minute: function () {
            return this.num(this.minutes)
        }
    },
    watch: {
        second: {
            handler: function (newVal) {
                if (this.seconds == 0 && this.minutes == 0) {
                    this.disable = true
                }
                this.num(newVal)
            }
        },
        minute: {
            handler: function (newVal) {
                this.num(newVal)
            }
        }
    }
}
</script>

<style scoped>
    .sure{
        width: 100%;
        height: 100%;
        border: 0;
        font-size: 18px;
        font-weight: 700;
        background: rgba(255,37,38,1);
        color: #FFF;
    }
.line1 {
    padding-bottom: 0.32rem;
    background-color: #fff;
}

.line2 {
    margin-top: 0.27rem;
}

.money {
    font-size: 0.43rem;
    text-align: left;
    padding: 0.4rem;
}

.select-btn {
    width: 1.87rem;
    height: 0.96rem;
    text-align: center;
    border: 0.03rem solid rgba(102,102,102,1);
    border-radius: 0.13rem;
    background-color: #fff;
    color: #333;
    font-size: 14px;
    font-weight: 700;
    margin: 20px 10px 0;
    padding: 0;
}

.selectButton {
    color: #fff;
    background:rgba(255,37,38,1);
    border: 0.03rem solid rgba(255,37,38,1);
}
.recharge {
    padding: 0 0.4rem;
}
.recharge_text {
    width: 100%;
    border: none;
    line-height: 0.9rem;
    border-bottom: 0.02rem solid #e8e8e8;
}

.line2 ul {
    padding: 0 0.4rem;
    height: 1.17rem;
    line-height: 1.17rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;

}
.line2 ul li {
    display: flex;
    align-items: center;
    justify-content: center;
}

.line2 ul li span {
    font-size: 0.43rem;
    margin-left: 0.27rem;
}
.line2 ul li img {
    width: 0.67rem;
    height: 0.67rem;

}
.button {
    margin-top: 1.07rem;
    margin-bottom: 0.8rem;
}
.button button {
    width: 6.4rem;
    height: 1.17rem;
    line-height: 1.17rem;
    background: rgba(254,61,61,1);
    border-radius: 0.59rem;
    font-size: 0.45rem;
    color:rgba(255,255,255,1);
    border: none;
    outline: none;
}
.tip {
    padding: 0 0.4rem 0 0.4rem;
}
.tip p {
    font-size: 0.35rem;
    color: rgba(102,102,102,1);
    line-height: 0.55rem;
    text-align: left;
}

.popMain {
    background-color: #fff;
    width: 7.47rem;
    border-radius: 0.27rem;
}

.popMain-title {
    text-align: center;
    font-size: 0.45rem;
    color: rgba(51,51,51,1);
    line-height: 0.64rem;
    font-weight: 600;
    padding-top: 0.51rem;
    padding-bottom: 0.53rem;
}

.popMain-center {
    padding-bottom: 0.56rem;
    border-bottom: 0.03rem solid rgba(232,232,232,1);
    padding-left: 0.53rem;
    padding-right: 0.4rem;

}

.popMain-center  p {
    font-size: 0.4rem;
    color: rgba(102,102,102,1);
    line-height: 0.56rem;
    text-align: left;
}

.popMain-center  p:nth-child(1) {
    padding-bottom: 0.2rem;
}

.popMain-center  p:nth-child(2) {
    padding-bottom: 0.2rem;
}

.popMain-bottom {
    height: 1.17rem;
    line-height: 1.17rem;
}

#app {
    height: 100vh;
    background-color: #181818;
}

.nav {
    height: 1.17rem;
    text-align: center;
    background-color: #7B0000;
}

.go-back {
    width: 0.24rem;
    height: 0.43rem;
    position: absolute;
    left: 4%;
    top: 2.1%;
}

.title {
    line-height: 1.17rem;
    color: #fff;
    font-size: 0.45rem;
}

.main-title {
    padding: 0.27rem 0 0 0.4rem;
    font-size: 0.37rem;
    line-height: 0.53rem;
}
.main-title:nth-child(2) {
    padding-bottom: 0.47rem;
}

.main-body {
    display: flex;
    flex-direction: column;
    text-align: center;
}

.main-body p {
    font-size: 0.37rem;
}

.main-body p:nth-child(1) {
    color:rgba(254,61,61,1);
    line-height: 0.53rem;
}
.main-body p:nth-child(2) {
    font-size: 0.69rem;
    color: rgba(255,166,38,1);
    line-height: 0.99rem;
    margin-top: 0.13rem;
}
.main-body p:nth-child(3) {
    color: #999;
    line-height: 0.53rem;
    margin-bottom: 0.27rem;
}

.main-body p:nth-child(3) > span {
    color: #666;
    text-decoration: line-through;
    padding-right: 0.3rem;
}
.main-body p:nth-child(5) {
    margin-top: 0.4rem;
    margin-bottom: 0.27rem;
}
.main-body p:nth-child(5) > span {
    font-size: 0.59rem;
    color: rgba(44,132,231,1);
    line-height: 0.8rem;
}

.main-body p:nth-child(6) {
    color: rgba(254,61,61,1);
    line-height: 0.53rem;
}

.main-body p:nth-child(7) {
    color: rgba(102,102,102,1);
    line-height: 0.53rem;
    margin-top: 0.13rem;
}

.main-body .src {
    width: 5.33rem;
    height: 7.2rem;
    margin: auto;
}

.main-body .src img {
    width: 100%;
    height: 100%;
}

.main-body .qrImgFail {
    width: 5.33rem;
    height: 7.2rem;
    margin: auto;
    position: relative;
}

.main-body .qrImgFail > img {
    width: 100%;
    height: 100%;
}

.main-body .qrImgFail > p {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.43rem;
    color: #fff;
    line-height: 0.59rem;
    white-space: nowrap;
}

.main-success {
    display: flex;
    flex-direction: column;
    text-align: center;
}

.main-success p {
    font-size: 0.43rem;
    color: #ccc;
}

.main-success p:nth-child(1) {
    margin: 0.93rem 0 1.33rem 0;
}

.main-success p:nth-child(3) {
    margin: 0.4rem 0 1.07rem 0;
}

.main-success p:nth-child(4) {
    width: 3.2rem;
    height: 1.07rem;
    line-height: 1.07rem;
    background: rgba(254,61,61,1);
    border-radius: 0.51rem;
    color: #fff;
    margin: auto;
}
.main-success .success-img {
    width: 1.23rem;
    height: 1.23rem;
    margin: auto;
}

.main-success .success-img img {
    width: 100%;
    height: 100%;
}
</style>
