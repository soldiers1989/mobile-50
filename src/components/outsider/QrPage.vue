<template>
  <div>
    <div class="openBrowser" v-if = "isWeChat && isAndroid && AndroidUrl">
      <p>请点击右上角</p>
      <p>选择浏览器打开</p>
    </div>
    <div class="downloadPage" v-if = "isAndroid && AndroidUrl">
        <div class="download-title">手机扫码下载</div>
        <div>
            <div class="download-title red">安卓版</div>
            <div class="qrcodeIcon"><img :src='AndroidUrl'></div>
            <div class="download-title red">微信/QQ内无法下载应用</div>
            <div class="download-title red">浏览器内长按二维码识别下载</div>
        </div>
    </div>
    <div class="downloadPage" v-if = "isIOS && IosUrl">
        <div class="download-title">手机扫码下载</div>
        <div>
            <div class="download-title red">ios版</div>
            <div class="qrcodeIcon"><img :src='IosUrl'></div>
            <div class="download-title red">微信/QQ内无法下载应用</div>
            <div class="download-title red">浏览器内长按二维码识别下载</div>
        </div>
    </div>
    <div v-if = "isAndroid && AndroidUrl == ''" class="result">暂未提供安卓APP下载</div>
    <div v-if = "isIOS && IosUrl == ''" class="result">暂未提供iOSapp下载</div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getItem} from '../../tools/api_methods.js' 
  import {getDownloadApp } from '../../tools/ajax.js'
export default {
  data () {
    return {
      AndroidUrl: '',
      IosUrl: '',
      isAndroid: '',
      isIOS: '',
      isWeChat: true
    }
  },
  methods: {
    update () {
      let _this = this
      let u = navigator.userAgent
      this.isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端
      this.isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
      getDownloadApp().then(res => {
        if (res.status == 1) {
            if (this.isAndroid) {
            _this.AndroidUrl = res.data.androidDownloadUrl
          } else if (this.isIOS) {
            _this.IosUrl = res.data.iosDownloadUrl
          }
          let ua = window.navigator.userAgent.toLowerCase()
          if (ua.match(/MicroMessenger/i) == 'micromessenger') {
              // alert("微信")
              _this.isWeChat = true
          } else {
              // alert("非微信")
              _this.isWeChat = false
          }
        }
      })
    }
  },
  mounted () {
    this.update()
  }
}
</script>

<style scoped>
  .openBrowser {
    background: url(~static/img/qrcode_guide.png) no-repeat;
    background-size: 100% 100%;
    position: fixed;
    right: 1.2%;
    top: 0;
    padding: 0 18px;
    text-align: center;
  }
  .openBrowser p {
    margin: 0;
    line-height: 20px;
    font-size: 0.35rem;
    color: #fff;
  }
  .openBrowser p:nth-child(1) {
    padding-top: 10px;
  }
  .downloadPage {
      font-size: .4rem;
      padding-top: 1rem
  }
  .downloadPage .download-title {
      text-align: center;
      line-height: 1.5rem;
      font-size: 0.4rem;
  }

  .downloadPage .download-title.red {
      color: #f26768;
  }

  .downloadPage .qrcodeIcon {
      width: 5rem;
      height: 5rem;
      margin: .01rem auto;
      border: 1px solid #bfbfbf;
      padding: 0.2rem
  }

  .downloadPage .qrcodeIcon img {
      width: 4.6rem;
      height: 4.6rem
  }
  .result {
      text-align: center;
      padding: 2rem 0;
      font-size: 0.45rem;
  }


</style>
