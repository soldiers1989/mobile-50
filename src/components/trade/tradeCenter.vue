<template>
  <div class="tradeCenter_page">
      <ul class="tradeCenter_header">
        <li @click="goTrade('buy')">
          <img src="~static/img/transaction_buy.png" alt="" style="padding-right: 0.23rem;">
          <p>买入</p>
        </li>
        <li @click="goTrade('sell')">
            <img src="~static/img/transaction_sell.png" alt="" style="padding-right: 0.23rem;">
          <p>卖出</p>
        </li>
        <li @click="goTrade('cancel')">
            <img src="~static/img/transaction_withdrawal.png" alt="">
          <p>撤单</p>
        </li>
        <li @click="goTrade('holding')">
            <img src="~static/img/transaction_position.png" alt="">
          <p>持仓</p>
        </li>
        <li @click="goTrade('dailyEntrust', 1)">
            <img src="~static/img/transaction_commission.png" alt="">
          <p>委托查询</p>
        </li>
        <li @click="goTrade('dailyDealing', 3)">
            <img src="~static/img/transaction_deal.png" alt="">
          <p>成交查询</p>
        </li>
      </ul>
      <v-holding></v-holding>
    <v-footer></v-footer>
  </div>
</template>

<script type="text/ecmascript-6">
import vFooter from '../Footer/footer.vue'
import vHolding from '../trade/holding.vue'
  export default {
    data () {
      return {}
    },
    methods: {
      goTrade (dir, tab) {
        this.$router.push({name: dir})
      }
    },
    components: {
      vFooter, vHolding
    }
  }
</script>

<style lang="less" scoped>
  @import "../../../static/less/trade";
  .tradeCenter_page {
    padding-bottom: 1.44rem;
  }

  .tradeCenter_header {
    height: 4.88rem;
    display: flex;
    justify-content: flex-start;
    background-color: @fff;
    flex-wrap: wrap;
      li {
        width: 25%;
          padding-top: 0.62rem;
        p {
          font-size: @font_size_4;
          color: @666;
            margin-top: 0.03rem;
        }
          img {
            height: 0.92rem;
          }
      }
  }

</style>
