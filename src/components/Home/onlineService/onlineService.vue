<template>
  <div>
    <Header />
    <div class="line"></div>
    <!-- <img src="~static/img/img_service.png" class="line"> -->
    <img :src="cust_qr" class="wechat">
  </div>
</template>

<script type="text/ecmascript-6">
  import Header from '../../Header/header'
  import {getItem} from '../../../tools/api_methods'
  import {bus} from '../../../tools/bus'
  export default {
    components: {
      Header
    },
    data () {
      return {
        cust_qr: '',
        title: '在线客服'
      }
    },
    methods: {
      updateIndexData () {
          let indexData = getItem("indexData")
          if (indexData) {
              this.cust_qr = indexData.cust_qr
          }
      }
    },
    created () {
        let _this = this
        this.updateIndexData()
        bus.$on('updateIndexData', function () {
            _this.updateIndexData()
        })
    },
    mounted () {
        bus.$emit('pageTitle', this.title)
    },
    beforeDestroy () {
        bus.$off('updateIndexData')
    }
  }
</script>

<style scoped lang="less">
.line {
    background: url(~static/img/img_service.png) no-repeat;
    position: fixed;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -10;
    max-width: 640px;
    margin-top: 0.4rem;
    margin-left: 0.05rem;
    zoom: 1;
    background-position: top center;
    background-size: contain;
}
.wechat {
    position: absolute;
    top: 6rem;
    left: 40%;
    width: 40%;
}
</style>
