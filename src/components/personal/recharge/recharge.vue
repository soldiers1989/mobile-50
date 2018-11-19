<template>
    <div>
        <Header />
        <div class="recharge">
            <p class="line1">请选择支付通道</p>
            <!-- <router-link to="/unsPay">
                <ul class="line2 cf">
                    <li><img src="~static/img/icon_certified.png" alt="认证支付"></li>
                    <li>
                        <p>认证支付</p>
                        <p>入金免手续费</p>
                    </li>
                    <li><img src="~static/img/icon_arrow.png"></li>
                </ul>
            </router-link> -->
            <router-link to="/bankTransform">
                <ul class="line2 cf">
                    <li><img src="~static/img/icon_bank.png" alt="银行转账"></li>
                    <li>
                        <p>银行转账</p>
                        <p>入金免手续费，支持大额入金</p>
                    </li>
                    <li><img src="~static/img/icon_arrow.png"></li>
                </ul>
            </router-link>
            <!--<router-link to="/payWechat" >-->
                <!--<ul class="line2 cf">-->
                    <!--<li class="wechat"><img src="~static/img/icon_wechat.png" alt="微信支付"></li>-->
                    <!--<li>-->
                        <!--<p>微信支付</p>-->
                        <!--<p>需提交凭证</p>-->
                    <!--</li>-->
                    <!--<li><img src="~static/img/icon_arrow.png"></li>-->
                <!--</ul>-->
            <!--</router-link>-->
            <router-link to="/quickPay" v-if="isSupportHBIPS">
                <ul class="line2 cf">
                    <li><img src="~static/img/icon_fast.png" alt="认证支付"></li>
                    <li>
                        <p>快捷支付</p>
                        <p></p>
                    </li>
                    <li><img src="~static/img/icon_arrow.png"></li>
                </ul>
            </router-link>
            <router-link to="/code" v-if="isSupportM">
                <ul class="line2 cf">
                    <li class="ali"><img src="~static/img/icon_scan.png" alt="扫码支付"></li>
                    <li>
                        <p>扫码支付</p>
                        <p></p>
                    </li>
                    <li><img src="~static/img/icon_arrow.png"></li>
                </ul>
            </router-link>
            <router-link to="/aliPay" v-if="isAliPay">
                <ul class="line2 cf">
                    <li class="ali"><img src="~static/img/icon_alipay.png" alt="支付宝支付"></li>
                    <li>
                        <p>支付宝支付</p>
                        <p></p>
                    </li>
                    <li><img src="~static/img/icon_arrow.png"></li>
                </ul>
            </router-link>
            <router-link to="/WxPay" v-if="isSupportWx">
                <ul class="line2 cf">
                    <li class="ali"><img src="~static/img/icon_wechat.png" alt="微信支付"></li>
                    <li>
                        <p>微信安全支付</p>
                        <p></p>
                    </li>
                    <li><img src="~static/img/icon_arrow.png"></li>
                </ul>
            </router-link>
            <router-link to="/XPay" v-if="isSupportXPay">
                <ul class="line2 cf">
                    <li class="ali"><img src="~static/img/icon_fast.png" alt="微信支付"></li>
                    <li>
                        <p>快捷支付</p>
                        <p>测试中！请勿充值！</p>
                    </li>
                    <li><img src="~static/img/icon_arrow.png"></li>
                </ul>
            </router-link>
            <div class="line3">
                <p>温馨提示: </p>
                <p>充值金额请加零头（如1000.15），方便我们确认您的汇款！</p>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import Header from '../../Header/header'
import {bus} from '../../../tools/bus'
import {getItem} from "../../../tools/api_methods"

export default {
  name: 'recharge',
  components: {
    Header
  },
  data () {
    return {
        title: '账户充值',
        isSupportHBIPS: 0,
        isAliPay: 0,
        isSupportWx: 0,
        isSupportXPay: 0,
        isSupportM: 0
    }
  },
  methods: {
      upIndexData () {
            let indexData = getItem('indexData')
            this.isSupportHBIPS = indexData.is_support_hbIps
            this.isAliPay = indexData.is_support_aliPay
            this.isSupportWx = indexData.is_support_WxPay
            this.isSupportXPay = indexData.is_support_xpay
            this.isSupportM = indexData.is_support_m
      }
  },
  mounted () {
      bus.$emit('pageTitle', this.title)
      this.upIndexData()
  }
}
</script>

<style lang="less" scoped>
@import '~static/less/reset.less';
.recharge {
    .line1 {
        padding: 0.27rem 0.4rem;
        color: @666;
        font-size: @font_size_35;
        text-align: left;
    }
    .line2 {
        background-color: @bgc_fff;
        border-bottom: 1px solid @borderColor;
        padding: 0 0.4rem;
        li {
            margin: 0.37rem 0;
        }
        li:nth-child(1) {
            float: left;
            width: 1.26rem;
            height: 0.8rem;
            img {
                width: 100%;
                height: 100%;
            }
        }
        li:nth-child(2) {
            float: left;
            padding-left: 0.27rem;
            line-height: 0.55rem;
            margin-top: 10px;
            p:nth-child(1) {
                color: @333;
                font-size: @font_size_43;
                text-align: left;
            }
            p:nth-child(2) {
                color: @999;
                font-size: @font_size_32;
                text-align: left;
            }
        }
        li:nth-child(3) {
            float: right;
            width: 0.24rem;
            height: 0.43rem;
            line-height: 1.23rem;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .wechat {
            width: 1.12rem !important;
            height: 0.98rem !important;
            margin-right: 0.14rem;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .ali {
            width: 1.03rem !important;
            height: 1.03rem !important;
            margin-right: 0.23rem;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
    .line3 {
        position: fixed;
        left: 0.4rem;
        bottom: 0.53rem;
        p {
            text-align: left;
            color: @999;
            font-size: @font_size_35;
        }
        p:nth-child(1) {
            padding-bottom: 0.4rem;
        }
        p:nth-child(2) {
            padding-bottom: 0.2rem;
        }
        p:nth-child(3) {
            line-height: 0.5rem;
            padding-bottom: 0.2rem;
        }
    }
}
</style>
