<template>
    <div>
        <Header />
        <div class="pay">
            <ul class="line3">
                <li>充值金额</li>
                <li><input type="text" placeholder="请输入充值金额" name="amount_of_account" v-model="formData.mount"></li>
            </ul>
            <p class="line2">限额为100-3000元/笔，当日暂无笔数限制</p>
        </div>
        <div class="line4" align="center">
            <button @click="payNow()" class="submit" :disabled = "submit">确认充值</button>
        </div>
        <van-dialog v-model="show" show-cancel-button :before-close="beforeClose" confirm-button-text="支付完成" cancel-button-text="取消支付">
            <p style="padding: 10px;display: block">您好，本次交易请按照指定的金额转账，金额与二维码不符会充值失败哦！</p>
            <span style="padding: 10px;display: block">应转账的金额为：<span class="fontRed">{{mount}}</span>元</span>
            <img :src="imgUrl" alt="转账二维码" style="width: 150px">
        </van-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
    import Header from '../../../Header/header'
    import {bus} from '../../../../tools/bus'
    import {host} from '../../../../tools/api'
    import {getItem} from '../../../../tools/api_methods'
    import {WxPay} from "../../../../apis/personal"

    export default {
        name: 'unsPay',
        components: {
            Header
        },
        data () {
            return {
                title: '微信安全支付',
                submit: false,
                formData: {
                    mount: '',
                    uid: 0
                },
                imgUrl: "",
                mount: "",
                show: false
            }
        },
        methods: {
            payNow () {
                if (this.formData.mount === 0 || this.formData.mount < 100 || this.formData.mount == "") {
                    this.$toast("充值金额不能少于100元")
                    return false
                }
                let _this = this
                WxPay({uid: _this.formData.uid, amount_of_account: _this.formData.mount}).then(function (data) {
                    _this.imgUrl = data.data.image
                    _this.mount = data.data.money
                    _this.show = true
                }).catch(function (err) {
                    console.log(err)
                })
            },
            beforeClose (action, done) {
                if (action === 'confirm') {
                    this.$router.push('/assets')
                } else {
                    done()
                }
            }
        },
        mounted () {
            bus.$emit('pageTitle', this.title)
            let userInfo = getItem("userInfo")
            this.formData.uid = userInfo.cust_id
        }

    }
</script>

<style lang="less" scoped>
    @import '~static/less/reset.less';
    .line2 {
        color: @999;
        font-size: @font_size_35;
        padding: 0.24rem 0.4rem;
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
</style>
