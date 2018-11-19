<template>
  <div class="backTop" v-if="topShow">
    <a href="javascript:scrollTo(0,0)" >
      <img src="~static/img/icon_back_to_top.png" alt="返回顶部">
    </a>
  </div>
</template>

<script type="text/ecmascript-6">
  import $ from 'jquery'
export default {
  data () {
    return {
      topShow: false
    }
  },
  mounted () {
    let _this = this
    $(window).scroll(function() {
      // 被卷去页面的高度
      _this.scrollTop = $(document).scrollTop()
      if (_this.scrollTop >= 300) {
        _this.topShow = true
      } else {
        _this.topShow = false
      }
    })
  }
}
</script>

<style scoped>
  .backTop {
    position: fixed;
    bottom: 8%;
    left: 75%;
    padding: 10px;
  }
  .backTop img {
    width: 42px;
  }
</style>
