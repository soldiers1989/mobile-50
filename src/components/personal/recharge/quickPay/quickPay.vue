<template>
    <div>
        <Header />
        <form v-bind:action="IPSQuickPayUrl" method="get"  @submit.prevent="ipsQuickPayCheck" ref="ipsQuickPayForm"
              target="_self">
            <div class="pay">
                <ul class="line3">
                    <li>充值金额</li>
                    <li><input type="text" placeholder="请输入充值金额" name="amount_of_account"></li>
                </ul>
                <p class="line2">入金最少100元/笔起,当日暂无笔数限制</p>
            </div>
            <input type="hidden" name="uid" v-model="formData.uid">
            <div class="line4" align="center">
                <button class="submit" :disabled = "submit">确认充值</button>
            </div>
        </form>
    </div>
</template>

<script type="text/ecmascript-6">
import Header from '../../../Header/header'
import {bus} from '../../../../tools/bus'
import {host} from '../../../../tools/api'
import {getItem} from '../../../../tools/api_methods'
export default {
    name: 'unsPay',
    components: {
        Header
    },
    data () {
        return {
            title: '快捷支付',
            submit: false,
            IPSQuickPayUrl: host + "/IPSPay",
            formData: {
                mount: '',
                uid: 0
            }
        }
    },
    methods: {
        ipsQuickPayCheck () {
            if (this.payBank_mount === 0 || this.payBank_mount < 100) {
                this.$toast("充值金额不能少于100元")
                return false
            }
            // 初始化数据
            this.$refs["ipsQuickPayForm"].submit()
            this.selectBank = {}
            this.formData.mount = ""
            return true
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

