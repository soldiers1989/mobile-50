<template>
  <div>
    <Header />
    <div class="nav">
      <ul>
        <li><router-link :to="{name: 'rechargeList'}">充值</router-link></li>
        <li><router-link :to="{name: 'cash'}">提现</router-link></li>
        <li><router-link :to="{name: 'transaction'}">交易</router-link></li>
        <li><router-link :to="{name: 'manage'}">递延费</router-link></li>
        <li><router-link :to="{name: 'profit'}">推广收益</router-link></li>
      </ul>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import Header from '../../../Header/header'
import {bus} from '../../../../tools/bus'
export default {
  name: 'flowCenter',
  components: {
      Header
  },
  data () {
      return {
          title: '资金流水'
      }
  },
  mounted () {
      bus.$emit('pageTitle', this.title)
  }
}
</script>

<style lang="less" scoped>
@import '~static/less/reset.less';
.nav {
  background-color: @bgc_fff;
  margin-top: 0.05rem;
  margin-bottom: 0.13rem;
  ul {
    display: flex;
    justify-content: space-between;
    padding: 0 0.4rem;
    height: 1rem;
    li {
      width: 100%;
      height: 100%;
      line-height: 1rem;
      font-size: @font_size_37;
      a {
        display: block;
        height: 100%;
        color: @666;
        text-decoration: none;
      }
      .router-link-active {
        color: @red;
      }
    }
  }
}
</style>
