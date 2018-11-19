<template>
  <div>
    <ul class="footer">
     <li :class="{current: path === 'home'}">
         <router-link :to="{name: 'home'}">
           <img src="~static/img/tab_home_selected.png" alt="首页" v-if="path === 'home'">
           <img src="~static/img/tab_home_normol.png" alt="首页" v-else>
          <p>首页</p>
         </router-link>
      </li>
      <li :class="{current: path === 'market'}">
        <router-link :to="{name: 'market'}">
           <img src="~static/img/tab_quotes_selected.png" alt="行情" v-if="path === 'market'">
           <img src="~static/img/tab_quotes_normol.png" alt="行情" v-else>
          <p>行情</p>
        </router-link>
      </li>
      <li :class="{current: path === 'stockPool'}">
        <router-link :to="{name: 'stockPool'}">
           <img src="~static/img/tab_optional_selected.png" alt="自选" v-if="path === 'stockPool'">
           <img src="~static/img/tab_optional_normol.png" alt="自选" v-else>
          <p>自选</p>
        </router-link>
      </li>
      <li :class="{current: path === 'tradeCenter'}">
        <router-link :to="{name: 'tradeCenter'}" >
          <img src="~static/img/tab_transaction_selected.png" alt="交易" v-if="path === 'tradeCenter'">
          <img src="~static/img/tab_transaction_normol.png" alt="交易" v-else>
          <p>交易</p>
        </router-link>
      </li>
      <li :class="{current: path === 'personalCenter'}">
        <router-link :to="{name: 'personalCenter'}" >
           <img src="~static/img/tab_mine_selected.png" alt="我的" v-if="path === 'personalCenter'">
           <img src="~static/img/tab_mine_normol.png" alt="我的" v-else>
          <p>我的</p>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  import {bus} from '../../tools/bus'
  export default {
    data () {
      return {
        path: ''
      }
    },
    mounted () {
        let _this = this
        this.path = this.$route.path.split('/')[1]
        bus.$on('logout', function () {
            _this.$router.push('/login')
        })
    },
     watch: {
      path (newVal, oldVal) {
        this.path = newVal
      }
    }
  }
</script>

<style lang="less" scoped>
@import '../../../static/less/reset.less';

.footer {
  background-color: @bgc_fff;
  width: 100%;
  max-width: 640px;
  height: 1.44rem;
  position: fixed;
  bottom: 0;
  z-index: 999;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -1px 2px 0 rgba(0, 0, 0, 0.05);
  li {
    flex: 1;
    a {
      text-decoration: none;
      img {
        width: 0.69rem;
        height: 0.69rem;
      }
      p {
        font-size: @font_size_32;
        color: @666;
        padding-top: 0.05rem;
      }
    }
  }
}
.current {
  p {
    color: @red !important;
  }
}
</style>
