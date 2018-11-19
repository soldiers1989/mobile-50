<template>
  <div>
      <Header />
      <div class="setPwd">
        <ul class="line1">
            <li>注册手机号</li>
            <li>{{formData.cellPhone}}</li>
        </ul>
        <form class="from">
        <div class="cell">
            <label for="pic">图形验证码</label>
            <v-piccode  @getcaptchaid="getcaptIdPwd"
                        @getcaptdata="getcaptDataPwd"
                        @getcaptcode="getcaptCodePwd">
            </v-piccode>
      </div>
      <div class="cell picphone cf">
            <label for="picPhone">短信验证码</label>
            <input type="text" id="picPhone" placeholder="请输入短信验证码" required autocomplete="off" v-model="formData.phoneCode" ref="picPhone">
            <a href="javascript:;" class="clear clearPic" @click="clearPicPhone"></a>
            <button v-show="sendAuthCode" @click="getAuthCode" type="button">获取短信验证码</button>
            <button v-show="!sendAuthCode" disabled class="time" type="button">{{auth_time}}秒后重新获取</button>
        </div>
        <div class="cell">
            <label for="pwd">设置登录密码</label>
            <input type="password" id="pwd" placeholder="请输入登录密码" required autocomplete="off" v-model="formData.password" ref="pwd">
            <a href="javascript:;" class="clear" @click="clearPwd"></a>
        </div>
    </form>
    <div align="center">
      <button class="submit" @click="valid" :disabled = "submit" >确定</button>
    </div>
      </div>



  </div>
</template>

<script type="text/ecmascript-6">
import {bus} from '../../../tools/bus'
import vPiccode from '../../PicCode/picCode'
import Header from '../../Header/header'
import {updatePassword, getSms} from '../../../apis/personal'
import {getItem, loading, loadingClose} from '../../../tools/api_methods'
import JSEncrypt from 'jsencrypt'
let crypt = new JSEncrypt()
let public_key = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC8yY4yneut770arIb+hhuwPbV4
qP75ZtfSZmEMK64pldpcGeCbp4uFaOqwXMy7cszsYnD9YnMJLN82zt2ttOU9APcC
HWS1Qi72AkxnyROTIICYU0oi+I+5elogPgkOxKyi2bWb6pR9IkDR3EYmYear0biw
D0DJ3ztdzWa+W1IbOQIDAQAB`
crypt.setKey(public_key)
export default {
  name: 'setLoginPwd',
  components: {
    vPiccode, Header
  },
  data () {
    return {
      title: '重置登录密码',
      formData: {
        cellPhone: '',
        picCode: '',
        picData: '',
        picId: '',
        phoneCode: '',
        password: '',
        refCode: ''
      },
      password: '',
      submit: false,
      sendAuthCode:true,
      auth_time: 0
    }
  },
  methods: {
    clearPwd () {
      this.formData.password = ''
      this.$refs['pwd'].focus()
    },
    clearPicPhone () {
      this.formData.phoneCode = ''
      this.$refs['picPhone'].focus()
    },
    clearRefCode () {
      this.formData.refCode = ''
      this.$refs['refCode'].focus()
    },
    getcaptIdPwd (obj) {
      this.formData.picId = obj
    },
    getcaptDataPwd (obj) {
      this.formData.picData = obj
    },
    getcaptCodePwd (obj) {
      this.formData.picCode = obj
    },
    valid () {
        let reg2 = /^[0-9a-zA-Z_#]{6,20}$/
        let regPwd = reg2.test(this.formData.password)
        if (this.formData.picCode == '') {
            this.$toast('请输入图形验证码')
        } else if (this.formData.phoneCode == '') {
            this.$toast('请输入短信验证码')
        } else if (this.formData.password == '') {
            this.$toast('请输入密码')
        } else if (!regPwd) {
            this.$toast('密码由6-20位数字或字母组成')
        } else {
            this.submiter()
        }
    },
    submiter () {
        let _this = this
        this.password = crypt.encrypt(this.formData.password)
        loading('加载中...')
        this.submit = true
        updatePassword({
            phoneCode: this.formData.phoneCode,
            password: this.password
        }).then((res) => {
             loadingClose()
            if (res.status == 1) {
              _this.$toast('修改成功，请重新登录')
              _this.$router.push('/login')
            } else {
              _this.$toast(res.msg)
            }
        }).then((res) => {
            this.submit = false
        })

      },
    getAuthCode () {
        if (this.formData.picCode == '') {
            this.$toast('请输入图形验证码')
            return false
        }
        loading('发送中...')
        let _this = this
        getSms({
            cellphone: this.formData.cellPhone,
            captchaId: this.formData.picId,
            captchaCode: this.formData.picCode
        }).then((res) => {
            loadingClose()
            if (res.status == 1) {
                _this.$toast('已发送')
                _this.sendAuthCode = false
                _this.auth_time = 60
                let auth_timetimer = setInterval(() => {
                    _this.auth_time--
                    if (_this.auth_time <= 0) {
                        _this.sendAuthCode = true
                        clearInterval(auth_timetimer)
                    }
                }, 1000)
            } else {
                _this.$toast(res.msg)
                _this.clear()
            }
        })
    },
    clear() {
        bus.$emit('clearPicCode')
    }
  },
  mounted () {
    bus.$emit('pageTitle', this.title)
    let userInfo = getItem("userInfo")
    this.formData.cellPhone = userInfo.cellphone

  }
}
</script>

<style lang="less" scoped>
@import "~static/less/reset.less";
@import "~static/less/login.less";
.setPwd {
    margin-top: 0.27rem;
    .line1 {
        display: flex;
        justify-content: space-between;
        background-color: #FFFAD9;
        padding: 0.29rem 0.4rem;
        li {
            color: @333;
            font-size: @font_size_43;
        }
    }
}
</style>
