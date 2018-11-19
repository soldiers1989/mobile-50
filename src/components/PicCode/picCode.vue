<template>
  <div>
    <div class="pic cf">
      <input type="text" v-model="captchaCode"  placeholder="请输入图形验证码" required ref="pic">
      <a href="javascript:;" class="clear clearPic" @click="clearPic"></a>
      <div class="pic_code">
        <img :src="capData" @click="getCaptcha">
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {requestRegister, createCaptcha, getRegisterSms} from '../../apis/personal'
  import {bus} from '../../tools/bus.js'
  export default {
    data () {
      return {
        captchaId: '',
        capData: '',
        captchaCode: ''
      }
    },
    methods: {
      clearPic () {
        this.captchaCode = ''
        this.$refs['pic'].focus()
      },
      getCaptcha () {
        let _this = this
        this.captchaId = new Date().getTime() + parseInt(Math.random() * 10000)
        createCaptcha({"captchaId": this.captchaId}).then((res) => {
          _this.capData = res.data
        })
        this.$emit('getcaptchaid', this.captchaId)
        this.$emit('getcaptdata', this.capData)
        
      }
    },
    created() {
      bus.$on('clearPicCode', () => {
        this.captchaCode = ''
        this.getCaptcha()
      })
    },
    mounted () {
      this.getCaptcha()
    },
    watch: {
      captchaCode (newVal, oldVal) {
        this.captchaCode = newVal
        this.$emit('getcaptcode', this.captchaCode)
      }
    }
  }
</script>

<style scoped lang='less'>
  .pic {
    position: relative;
    input {
      border: none;
      height: 0.6rem;
      color: #666;
      font-size: 0.4rem;
      position: absolute;
      bottom: 0;
      width: 46%;
    }
    .pic_code {
      float: right;
      width: 40%;
      height: 40px;
      margin-top: -0.3rem;
      margin-bottom: 3px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .clear {
      display: none;
      position: absolute;
      right: 0;
      width: 0.4rem;
      height: 0.4rem;
      margin: -19px 35px 0 0;
      background: url(../../../static/img/delete.png) no-repeat;
      background-size: 0.4rem;
    }
    .clearPic {
      margin: 10px 160px 0 0;
    }
  }
  input::-ms-clear {
    display: none;
  }
  input:valid + .clear {
    display: inline;
  }
</style>
