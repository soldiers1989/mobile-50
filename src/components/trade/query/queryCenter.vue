<template>
  <div>
    <div class="nav">
      <ul>
        <li><router-link :to="{name: 'dailyEntrust'}">当日委托</router-link></li>
        <li><router-link :to="{name: 'historyEntrust'}">历史委托</router-link></li>
        <li><router-link :to="{name: 'dailyDealing'}">当日成交</router-link></li>
        <li><router-link :to="{name: 'historyDealing'}">历史成交</router-link></li>
      </ul>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'queryCenter'
}
</script>

<style lang="less" scoped>
@import '../../../../static/less/reset.less';
.nav {
  background-color: @bgc_fff;
  margin-top: 0.07rem;
  ul {
    display: flex;
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
