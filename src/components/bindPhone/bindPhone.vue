<template>
  <div>
    <Header />
    <form class="from">
      <div class="cell">
        <label for="tel">手机号码</label>
        <input type="text" id="tel" placeholder="请输入手机号码" required autocomplete="off" v-model="formData.cellPhone" ref="tel"  @keyup="phoneValue">
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
      <div class="cell" v-if="isShowRecCodeForm && !isRegistered">
        <label for="refCode">推荐码</label>
        <input type="text" id="refCode" placeholder="请输入推荐码" required autocomplete="off" v-model="formData.recCode" ref="recCode">
        <a href="javascript:;" class="clear" @click="clearRefCode"></a>
      </div>
      <div class="cell" v-if="!isRegistered">
        <label for="pwd">登录密码</label>
        <input type="password" id="pwd" placeholder="请输入登录密码" required autocomplete="off" v-model="formData.password" ref="pwd">
        <a href="javascript:;" class="clear" @click="clearPwd"></a>
      </div>
    </form>
    <div align="center">
      <button class="submit" @click="valid" :disabled = "submit">确定</button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {bus} from '../../tools/bus'
import vPiccode from '../PicCode/picCode'
import Header from '../Header/header'
import {getWechatBindSms, getUserInfo, checkIsRegistered, bindAccountFromWechat} from '../../apis/personal'
import {loading, loadingClose, getItem, TOKEN_OBJ_ID, setItem} from '../../tools/api_methods'
import JSEncrypt from 'jsencrypt'
let crypt = new JSEncrypt()
let public_key = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC8yY4yneut770arIb+hhuwPbV4
qP75ZtfSZmEMK64pldpcGeCbp4uFaOqwXMy7cszsYnD9YnMJLN82zt2ttOU9APcC
HWS1Qi72AkxnyROTIICYU0oi+I+5elogPgkOxKyi2bWb6pR9IkDR3EYmYear0biw
D0DJ3ztdzWa+W1IbOQIDAQAB`
crypt.setKey(public_key)
export default {
  name: 'register',
  components: {
    vPiccode, Header
  },
  data () {
    return {
        title: '绑定手机号码',
        formData: {
            cellPhone: '',
            picCode: '',
            picData: '',
            picId: '',
            phoneCode: '',
            password: '',
            recCode: '',
            openid: ''
        },
        password: '',
        isRegistered: false,
        isShowRecCodeForm: true,
        submit: false,
        sendAuthCode: true,
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
      this.formData.recCode = ''
      this.$refs['recCode'].focus()
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
    phoneValue () {
        let reg1 = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[35678]|18[0-9]|14[57])[0-9]{8}$/
        let regPhone = reg1.test(this.formData.cellPhone)
            if (this.formData.cellPhone == '') {
                this.$toast('请输入手机号码')
            } else if (this.formData.cellPhone.length == 11 && !regPhone) {
                this.$toast('手机号码输入错误')
            } else if (this.formData.cellPhone.length == 11) {
                this.checkIsRegistered()
            }
    },
    valid () {
        let reg1 = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[35678]|18[0-9]|14[57])[0-9]{8}$/
        let reg2 = /^[0-9a-zA-Z_#]{6,20}$/
        let regPhone = reg1.test(this.formData.cellPhone)
        let regPwd = reg2.test(this.formData.password)
            if (!regPhone) {
                this.$toast('手机号码输入错误')
            } else if (this.formData.picCode == '') {
                this.$toast('请输入图形验证码')
            } else if (this.formData.phoneCode == '') {
                this.$toast('请输入短信验证码')
            } else {
                this.submitcer()
            }
        },
    submitcer () {
        let _this = this
        this.submit = true
        loading('加载中...')
        this.password = crypt.encrypt(this.formData.password)
        this.formData.openid = this.$route.params.openid
        bindAccountFromWechat({
            cellphone: _this.formData.cellPhone,
            picCode: _this.formData.picCode,
            picId: _this.formData.picId,
            picData: _this.formData.picData,
            phoneCode: _this.formData.phoneCode,
            password: _this.password,
            recCode: _this.formData.recCode,
            openid: _this.formData.openid
        }).then((res) => {
             loadingClose()
            if (res.status == 1) {
                 _this.$toast('绑定成功')
                setItem(TOKEN_OBJ_ID, res.data)
                getUserInfo().then((res) => {
                    _this.$router.push('/personalCenter')
                })
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
        getWechatBindSms({
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
            }
        })
    },
    checkIsRegistered() {
        let _this = this
        checkIsRegistered({cellphone: _this.formData.cellPhone}).then((res) => {
            if (res.status == 1) {
                _this.isRegistered = true
            } else {
                _this.isRegistered = false
            }
        })
    }
  },
  mounted () {
    bus.$emit('pageTitle', this.title)

  },
  created () {
    let recCode = this.$route.params.recCode
    if (recCode && recCode != "empty") {
        this.formData.recCode = recCode
        this.isShowRecCodeForm = false
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../../static/less/reset.less";
@import '../../../static/less/login.less';
</style>

