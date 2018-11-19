<template>
  <div>
    <form class="from">
        <div class="cell">
            <label for="tel">手机号码</label>
            <input type="text" id="tel" placeholder="请输入手机号码" required autocomplete="off" v-model="formData.cellPhone" ref="tel">
            <a href="javascript:;" class="clear" @click="clearTel"></a>
        </div>
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
            <label for="pwd">登录密码</label>
            <input type="password" id="pwd" placeholder="请输入登录密码" required autocomplete="off" v-model="formData.password" ref="pwd">
            <a href="javascript:;" class="clear" @click="clearPwd"></a>
        </div>
    </form>
    <div align="center">
      <button class="submit" @click="valid" :disabled = "submit" >确定</button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {bus} from '../../tools/bus'
import vPiccode from '../PicCode/picCode'
import {getBackPassword, getGetBackSms} from '../../apis/personal'
import {loading, loadingClose, getItem} from '../../tools/api_methods'
import JSEncrypt from 'jsencrypt'
let crypt = new JSEncrypt()
let public_key = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC8yY4yneut770arIb+hhuwPbV4
qP75ZtfSZmEMK64pldpcGeCbp4uFaOqwXMy7cszsYnD9YnMJLN82zt2ttOU9APcC
HWS1Qi72AkxnyROTIICYU0oi+I+5elogPgkOxKyi2bWb6pR9IkDR3EYmYear0biw
D0DJ3ztdzWa+W1IbOQIDAQAB`
crypt.setKey(public_key)
export default {
  name: 'forgetPwd',
  components: {
    vPiccode
  },
  data () {
    return {
      title: '忘记密码',
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
    clearTel () {
      this.formData.cellPhone = ''
      this.$refs['tel'].focus()
    },
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
        let reg1 = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[35678]|18[0-9]|14[57])[0-9]{8}$/
        let reg2 = /^[0-9a-zA-Z_#]{6,20}$/
        let regPhone = reg1.test(this.formData.cellPhone)
        let regPwd = reg2.test(this.formData.password)
        if (this.formData.cellPhone == '') {
                this.$toast('请输入手机号码')
            } else if (!regPhone) {
                this.$toast('手机号码输入错误')
            } else if (this.formData.picCode == '') {
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
        this.submit = true
        this.password = crypt.encrypt(this.formData.password)
        getBackPassword({
            cellphone: this.formData.cellPhone,
            phoneCode: this.formData.phoneCode,
            password: this.password
        }).then((res) => {
            if (res.status == 1) {
              _this.$toast('设置成功')
              _this.$router.push('/login/userLogin')
            } else {
              _this.$toast(res.msg)
            }
        }).then((res) => {
            this.submit = false
        })
    },
    getAuthCode () {
        if (this.formData.cellPhone == '') {
            this.$toast('请输入手机号码')
            return false
        }
        if (this.formData.picCode == '') {
            this.$toast('请输入图形验证码')
            return false
        }
        loading('发送中...')
        let _this = this
        getGetBackSms({
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
    },
  },
  mounted () {
      bus.$emit('pageTitle', this.title)
  }
}
</script>

<style lang="less" scoped>
@import "../../../static/less/reset.less";
@import '../../../static/less/login.less';
</style>
