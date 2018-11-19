<template>
    <div>
        <Header />
        <div class="pay">
            <ul class="line1 cf">
                <li>银行储蓄卡</li>
                <li @click="select"><img src="~static/img/icon_arrow.png"></li>
                <li @click="select">
                    <p v-if="formData.bank_name == ''">请选择银行卡</p>
                    <p v-else>{{formData.bank_name}}</p>
                    <p>单笔限额2000  单日限额10000</p>
                </li>
            </ul>
            <p class="line2">充值前请在个人中心进行实名认证、绑定银行卡<router-link to="/supportBank">支持银行</router-link></p>
            <ul class="line3">
                <li>充值金额</li>
                <li><input type="text" placeholder="请输入充值金额"  v-model="formData.rechargeMount"></li>
            </ul>
            <p class="line2">单次充值不能低于100元</p>
            <ul class="line3">
                <li>银行预留手机号</li>
                <li><input type="text" placeholder="请输入银行预留手机号" v-model="formData.cellPhone"></li>
            </ul>
            <div class="line4" align="center">
                <button class="submit" :disabled = "submit" @click="valid">确认充值</button>
            </div>
        </div>

        <!-- 弹窗 -->
        <div id="modal" class="modal" v-if="selectBank">
            <div class="modal-content">
                <header class="modal-header">
                    <img src="~static/img/icon_cross.png" alt="取消" class="cancel" @click="selectBank = false">
                    <span>选择银行卡</span>
                </header>
                <div class="modal-body" v-for="(value, key) in bankList" :key="key"  @click="selectBankName(value)">
                    <ul class="cf">
                        <li>
                            <p>{{value.bank_name}} {{value.bank_card}}</p>
                            <p>单笔限额2000，单日限额10000</p>
                        </li>
                        <li class="selected" v-if="formData.bankcard_id == value.id"></li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- 充值确认 -->
        <div class="modal-pay" v-if="payConfirm">
            <div class="content">
                <header class="header">充值确认</header>
                <div class="body">
                    <div class="cell">
                        <label for="orderId">订单号：</label>
                        <input type="text" id="orderId" required autocomplete="off" value="" disabled>
                    </div>
                    <div class="cell picphone cf">
                        <label for="picPhone">短信验证码</label>
                        <input type="text" id="picPhone" placeholder="请输入短信验证码" required autocomplete="off">
                        <button v-show="sendAuthCode" @click="getAuthCode" type="button">获取短信验证码</button>
                        <button v-show="!sendAuthCode" disabled class="time" type="button">{{auth_time}}秒后重新获取</button>
                    </div>
                </div>
                <footer class="footer">
                    <button @click="closePayConfirm">取消支付</button>
                    <button :disabled="submit" @click="goToPay">确认支付</button>
                </footer>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import Header from '../../../Header/header'
import {bus} from '../../../../tools/bus'
import {getItem, loading, loadingClose, checkRealName, confirmDialog} from '../../../../tools/api_methods'
import {getUserInfo, bankCardPayment, bankCardPaymentConfirm, sendSmsForBankCardPayment} from '../../../../apis/personal'
export default {
    name: 'unsPay',
    components: {
        Header
    },
    data () {
        return {
            title: '认证支付',
            selectBank: false,
            submit: false,
            payConfirm: false,
            formData: {
                cash_amount: '',
                bank_name: '',
                bankcard_id: '',
                cellPhone: '',
                rechargeMount: '',
                rechargeMethod: '',
                showCellphone: '',
                realName: '',
                idCard: '',
                number: '',
                bankCard: 0,
                cardData: []
            },
            confirmFormData: {
                order_id: "",
                phoneCode: "",
                token: ""
            },
            userInfo: {},
            indexData: {},
            bankList: [],
            sendAuthCode: true,
            auth_time: 0
        }
    },
    methods: {
        valid () {
            let exp = /^1[3456789]\d{9}$/
            let regPhone = exp.test(this.formData.cellPhone)
            let _this = this
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
            } else if (this.userInfo.bankCards.length == 0) {
                let options = {
                        message: '您还未绑定银行卡，请先绑定银行卡',
                        confirmButtonText: '去绑卡',
                        closeOnClickOverlay: false,
                        lockScroll: true,
                        callBackConfirm: function () {
                            _this.$router.push('/bindCard')
                        }
                    }
                confirmDialog(options)
            } else if (this.formData.bankcard_id == '') {
                this.$toast('请选择银行卡')
            } else if (Number(this.formData.rechargeMount) < 100) {
                this.$toast('单次充值不能低于100元')
            } else if (!regPhone){
                this.$toast('请输入正确的手机号码')
            } else {
                this.pay()
            }
        },
        pay () {
            let _this = this
            this.submit = true
            loading('加载中...')
            bankCardPayment(
                {
                id: this.formData.bankcard_id,
                amount_of_account: this.formData.rechargeMount,
                cellphone: this.formData.cellPhone})
                .then((res) => {
                    loadingClose()
                    if (res.status == 1) {
                        _this.payConfirm = true
                        _this.confirmFormData.order_id = res.data.order_id
                        _this.confirmFormData.token = res.data.token
                    } else {
                        _this.$toast(res.msg)
                    }
                }).then((res) => {
                    _this.submit = false
            }).catch(function () {
                    _this.$toast("支付响应失败，请稍后再试")
                    _this.submit = false
            })
        },
        goToPay () {
            let _this = this
            if (!this.confirmFormData.phoneCode) {
                this.$toast("手机验证码不能为空")
                return false
            }
            this.submit = true
            loading('加载中...')
            bankCardPaymentConfirm(this.confirmFormData).then((res) => {
                loadingClose()
                if (res.status == 1) {
                    _this.$toast("充值完成")
                    _this.closePayConfirm()
                    setTimeout(() => {
                        getUserInfo()
                        _this.$router.push({name: "recharge"})
                    }, 2000)
                } else {
                    _this.$toast(res.msg)
                }
            }).then((res) => {
                _this.submit = false
            }).catch(function () {
                _this.$toast("发卡行交易权限受限或卡内余额不足，详情请咨询您的发卡行")
                _this.submit = false
            })
        },
        select () {
            let _this = this
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
            } else if (this.userInfo.bankCards.length == 0) {
                let options = {
                        message: '您还未绑定银行卡，请先绑定银行卡',
                        confirmButtonText: '去绑卡',
                        closeOnClickOverlay: false,
                        lockScroll: true,
                        callBackConfirm: function () {
                            _this.$router.push('/bindCard')
                        }
                    }
                confirmDialog(options)
            } else {
                this.selectBank = true
            }

        },
        getAuthCode () {
            loading('发送中...')
            let _this = this
            sendSmsForBankCardPayment({
                order_id: this.confirmFormData.order_id,
                cellphone: this.formData.cellPhone,
                token: this.confirmFormData.token
                }).then((res) => {
                loadingClose()
                if (res.status == 1) {
                    _this.$toast('已发送')
                    _this.sendAuthCode = false
                    _this.auth_time = 60
                    let auth_timetimer = setInterval(() => {
                    _this.auth_time--
                    if (_this.auth_time <= 0) {
                            _this.sendAuthCode = true
                            clearInterval(auth_timetimer)
                        }
                    }, 1000)
                } else {
                    _this.$toast(res.msg)
                }
            })
        },
        closePayConfirm () {
            this.payConfirm = false
            this.confirmFormData = {
                order_id: "",
                phoneCode: "",
                token: ""
            }
        },
        selectBankName (obj) {
            this.formData.bankcard_id = obj.id
            this.formData.bank_name = obj.bank_name
            this.selectBank = false
        },
        getUserData () {
            this.userInfo = getItem('userInfo')
            this.indexData = getItem('indexData')
            this.bankList =  this.userInfo.bankCards
        }
    },
    mounted () {
        bus.$emit('pageTitle', this.title)
        this.getUserData()
    }

}
</script>

<style lang="less" scoped>
@import '~static/less/reset.less';
@import '~static/less/footerModal.less';
@import '~static/less/payConfirm.less';
.line1 {
    background-color: @bgc_fff;
    height: 1.87rem;
    padding: 0 0.4rem;
    li:nth-child(1) {
        float: left;
        color: @333;
        font-size: @font_size_43;
        line-height: 1.87rem;
    }
    li:nth-child(2) {
        float: right;
        width: 0.24rem;
        height: 0.43rem;
        line-height: 2rem;
        img {
            width: 100%;
            height: 100%;
        }
    }
    li:nth-child(3) {
        float: right;
        padding-right: 0.4rem;
        p {
            text-align: right;
        }
        p:nth-child(1) {
            margin: 0.37rem 0 0.1rem 0;
            color: @333;
            font-size: @font_size_43;
        }
        p:nth-child(2) {
            color: @999;
            font-size: @font_size_35;
        }
    }
}
.line2 {
    color: @999;
    font-size: @font_size_35;
    padding: 0.13rem 0.4rem 0.4rem 0;
    text-align: right;
    a {
        padding-left: 0.48rem;
        color: #4485EC;
    }
}
.line3 {
    display: flex;
    justify-content: space-between;
    height: 1.17rem;
    background-color: @bgc_fff;
    padding: 0 0.4rem;
    li:nth-child(1) {
        flex: 1;
        color: @333;
        font-size: @font_size_43;
        line-height: 1.17rem;
        text-align: left;
    }
    li:nth-child(2) {
        flex: 2;
        input {
            width: 100%;
            border: none;
            text-align: right;
            color: @333;
            font-size: @font_size_43;
            line-height: 1.17rem;
        }
    }
}
.line4 {
    .submit {
        width: 7.47rem;
        height: 1.17rem;
        background-color: @red;
        border: none;
        color: @eee;
        font-size: @font_size_4;
        border-radius: 5px;
        margin-top: 1.33rem;
  }
}
</style>

