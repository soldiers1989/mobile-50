<template>
    <div>
        <Header />
        <div class="pay">
            <ul class="line3">
                <li>提现金额</li>
                <li><input type="text" placeholder="请输入提现金额" v-model="formData.cash_amount"></li>
            </ul>
            <p class="line2">当前账户余额{{data.canExtract}}元</p>
            <ul class="line5 line6">
                <li>到账银行卡</li>
                <li @click="select">
                    <span v-if="formData.bank_name == ''">请选择银行卡</span>
                    <span v-else>{{formData.bank_name}}</span>
                    <img src="~static/img/icon_arrow.png">
                </li>
            </ul>
            <p class="line2">手续费每笔5元</p>
            <ul class="line3 line1">
                <li>提现密码</li>
                <li><input type="password" placeholder="请输入提现密码" v-model="formData.withdraw_pw"></li>
            </ul>
            <div class="line4" align="center">
                <button class="submit" :disabled = "submit" @click="valid">提现</button>
            </div>
            <div class="line7">提现请在工作日9:00-16:00内申请，T+1个工作日内到账 <br />提现手续费单笔最少5元，提现1250元以上每笔手续费率为0.4%</div>
            <ul class="line8">
                <li>温馨提示：</li>
                <li>禁止洗钱、信用卡套现、虚假交易等行为，一经发现并确认，将终止该账户的使用</li>
            </ul>
        </div>

        <!-- 弹窗 -->
        <div id="modal" class="modal" v-if="selectBank">
            <div class="modal-content">
                <header class="modal-header">
                    <img src="~static/img/icon_cross.png" alt="取消" class="cancel" @click="selectBank = false">
                    <span>选择银行卡</span>
                </header>
                <div class="modal-body">
                    <ul class="cf" v-for="(value, key) in bankList" :key="key"  @click="selectBankName(value)">
                        <li>
                            <p>{{value.bank_name}} {{value.bank_card}}</p>
                            <!-- <p>单笔限额2000 单日限额10000</p> -->
                        </li>
                        <li class="selected"  v-if="formData.bankcard_id == value.id"></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import Header from '../../Header/header'
import {bus} from '../../../tools/bus'
import {getItem, loading, loadingClose, checkRealName, confirmDialog} from '../../../tools/api_methods'
import {withdraw, getUserInfo, getAccountCount} from '../../../apis/personal'
import JSEncrypt from 'jsencrypt'
let crypt = new JSEncrypt()
let public_key = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC8yY4yneut770arIb+hhuwPbV4
qP75ZtfSZmEMK64pldpcGeCbp4uFaOqwXMy7cszsYnD9YnMJLN82zt2ttOU9APcC
HWS1Qi72AkxnyROTIICYU0oi+I+5elogPgkOxKyi2bWb6pR9IkDR3EYmYear0biw
D0DJ3ztdzWa+W1IbOQIDAQAB`
crypt.setKey(public_key)
export default {
    name: 'withdraw',
    components: {
        Header
    },
    data () {
        return {
            title: '提现',
            selectBank: false,
            submit: false,
            bankList: [],
            formData: {
                withdraw_pw: '',
                cash_amount: '',
                bank_name: '',
                bankcard_id: ''
            },
            userInfo:{},
            indexData: {},
            password: '',
            data: {}
        }
    },
    methods: {
        valid () {
            let _this = this
            let exp = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/
            let reg = exp.test(this.formData.cash_amount)
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
            } else if( this.formData.cash_amount == '') {
                this.$toast('请输入提现金额')
            } else if (!reg) {
                this.$toast('金额输入不正确')
            } else if (Number(this.data.canExtract) <= Number(this.formData.cash_amount)) {
                this.$toast('余额不足，无法提现')
            } else if (this.formData.bankcard_id == '') {
                this.$toast('请选择银行卡')
            } else if (this.formData.withdraw_pw == ''){
                this.$toast('请输入提现密码')
            } else {
                this.withdraw()
            }
        },
        withdraw () {
            let _this = this
            this.submit = true
            loading('加载中...')
            this.password = crypt.encrypt(this.formData.withdraw_pw)
            withdraw({
                cash_amount: this.formData.cash_amount,
                withdraw_pw: this.password,
                bankcard_id: this.formData.bankcard_id
            }).then((res) => {
                loadingClose()
                if (res.status == 1) {
                    _this.$toast('您的申请已提交成功！T+2工作日到账，实际以银行到账时间为准')
                    _this.$router.push('/assets')
                } else {
                    _this.$toast(res.msg)
                }
            }).then((res) => {
                this.submit = false
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
        selectBankName (obj) {
            this.formData.bankcard_id = obj.id
            this.formData.bank_name = obj.bank_name
            this.selectBank = false
        },
        getData () {
            getAccountCount({}).then(res => {
                    if (res.status == 1) {
                        this.data = res.data
                    }
                })
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
        this.getData()
    }

}
</script>

<style lang="less" scoped>
@import '~static/less/reset.less';
@import '~static/less/footerModal.less';
.line1 {
    margin-top: 0 !important;
}
.line2 {
    color: @999;
    font-size: @font_size_35;
    padding: 0.27rem 0.4rem 0.27rem 0.4rem;
    text-align: left;
}
.line3 {
    display: flex;
    justify-content: space-between;
    height: 1.17rem;
    background-color: @bgc_fff;
    padding: 0 0.4rem;
    margin-top: 0.27rem;
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
.line5 {
        display: flex;
        justify-content: space-between;
        height: 1.17rem;
        background-color: @bgc_fff;
        li:nth-child(1) {
            flex: 1;
            color: @333;
            font-size: @font_size_43;
            line-height: 1.17rem;
            text-align: left;
            margin-left: 0.4rem;
        }
        li:nth-child(2) {
            flex: 2;
            padding-right: 0.4rem;
            input {
                width: 100%;
                border: none;
                text-align: right;
                color: @333;
                font-size: @font_size_43;
                line-height: 1.17rem;
            }
            span {
                color: @999;
                font-size: @font_size_37;
                margin-right: 0.27rem;
                position: relative;
                top: -0.05rem;
            }
        }
    }
    .line6 {
        margin-top: 0rem;
        li:nth-child(2) {
            text-align: right;
            line-height: 1.4rem;
            img {
                width: 0.24rem;
                height: 0.43rem;
            }
        }
    }
    .line7 {
        color: @999;
        font-size: @font_size_35;
        line-height: 0.6rem;
        text-align: left;
        padding: 0.53rem 0.4rem 2.8rem 0.4rem;
    }
    .line8 {
        padding: 0 0.4rem;
        padding-top: 1rem;
        li {
            color: @999;
            font-size: @font_size_35;
            text-align: left;
            line-height: 0.5rem;
        }
    }
.modal .modal-content .modal-body ul {
    line-height: 1.65rem;
}
.modal .modal-content .modal-body ul li:nth-child(1) p:nth-child(1) {
    margin: 0;
}
</style>

