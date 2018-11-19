<template>
    <div>
        <Header />
        <div class="inviation">
            <div class="code">
                <img :src="code">
            </div>
            <div class="num">{{refcode}}</div>
            <div class="phoneNum cf">
                <ul>
                    <li>注册时间</li>
                    <li v-for="(value, key) in userData">{{value.registerTime}}</li>
                </ul>
                <ul>
                    <li>手机号码</li>
                    <li v-for="(value, key) in userData">{{value.cellphone}}</li>
                </ul>
            </div>
            <div class="bg"></div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import Header from '../../Header/header'
import {bus} from '../../../tools/bus'
import {getShareCount} from '../../../apis/personal'
export default {
  name: 'invitation',
  components: {
    Header
  },
  data () {
    return {
      title: '我的推荐码',
      code: '',
      refcode: '',
      userData: [],

    }
  },
  methods: {
    getShare () {
        let _this = this
        getShareCount({}).then((res) =>　{
            if (res.status == 1) {
                _this.code = res.data.bar_code
                _this.refcode = res.data.recCode
                _this.userData = res.data.promotionUsers
                for (let value of _this.userData) {
                   value.registerTime = value.registerTime.split(' ')[0]
                }
            }
        })
    }
  },
  mounted () {
    bus.$emit('pageTitle', this.title)
    this.getShare()
  }
}
</script>

<style lang='less' scoped>
@import "~static/less/reset.less";
.inviation {
    .code {
        width: 2.83rem;
        height: 2.83rem;
        background-color: #fff;
        position: absolute;
        bottom: 42%;
        left: 50%;
        transform: translate(-50%, -60%);
        img {
            width: 100%;
            height: 100%;
        }
    }
    .num {
        position: absolute;
        bottom: 37%;
        left: 50%;
        transform: translate(-50%, -62%);
        color: @333;
        font-size: 0.59rem;
    }
    .phoneNum {
        position: absolute;
        bottom: 0%;
        transform: translateY(0%);
        display: flex;
        justify-content: center;
        width: 100%;
        height: 3.2rem;
        overflow-y: scroll;
        ul {
            li {
                color: #F9FCA6;
                font-size: 0.35rem;
                line-height: 0.6rem;
            }
        }
        ul:nth-child(1) {
            padding-right: 1.215rem;
        }
        ul:nth-child(2) {
            padding-left: 1.215rem;
        }
    }
    .bg {
        background: url(~static/img/img_invite.png) no-repeat;
        position: fixed;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -10;
        max-width: 640px;
        zoom: 1;
        background-position: top center;
        background-size: 100% 100%;

    }
}
</style>
