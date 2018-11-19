<template>
  <div>
    <form class="from">
      <div class="cell">
        <label for="tel">账号</label>
        <input type="text" id="tel" placeholder="请输入账号" required autocomplete="off" v-model.trim="formData.cellphone" ref="tel">
        <a href="javascript:;" class="clear" @click="clearTel"></a>
      </div>
      <div class="cell">
        <label for="pwd">密码</label>
        <input type="password" id="pwd" placeholder="请输入密码" required autocomplete="off" v-model.trim="formData.password" ref="pwd">
        <a href="javascript:;" class="clear" @click="clearPwd"></a>
      </div>
    </form>
    <div align="center">
      <button class="submit" @click="valid" :disabled = "submit">登录</button>
      <div class="pwd_bottom" align="center">
        <router-link to="/login/forgetPassword" class="fl">忘记密码</router-link>
        <router-link to="/login/register" class="fr">立即注册</router-link>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {requestLogin, getUserInfo, setItem} from '../../apis/personal'
import {setLoginInfo, validLogin, loading, loadingClose, getItem} from '../../tools/api_methods'
import {bus} from '../../tools/bus'
import JSEncrypt from 'jsencrypt'
let crypt = new JSEncrypt()
let public_key = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC8yY4yneut770arIb+hhuwPbV4
qP75ZtfSZmEMK64pldpcGeCbp4uFaOqwXMy7cszsYnD9YnMJLN82zt2ttOU9APcC
HWS1Qi72AkxnyROTIICYU0oi+I+5elogPgkOxKyi2bWb6pR9IkDR3EYmYear0biw
D0DJ3ztdzWa+W1IbOQIDAQAB`
crypt.setKey(public_key)
export default {
  name: 'login',
  data () {
    return {
      title: '登录',
       formData: {
        cellphone: '',
        password: ''
      },
      password: '',
      submit: false
    }
  },
  methods: {
    clearTel () {
      this.formData.cellphone = ''
      this.$refs['tel'].focus()
    },
    clearPwd () {
      this.formData.password = ''
      this.$refs['pwd'].focus()
    },
    valid () {
      let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[35678]|18[0-9]|14[57])[0-9]{8}$/
      let regx = reg.test(this.formData.cellphone)
      if (this.formData.cellphone == '') {
        this.$toast('请输入账号')
      } else if (!regx) {
        this.$toast('账号输入不正确')
      } else if (this.formData.password == '') {
        this.$toast('请输入密码')
      } else {
        this.login()
      }
    },
    login () {
        let _this = this
        this.submit = true
        loading('登录中...')
        this.password = crypt.encrypt(this.formData.password)
        requestLogin({
            username: this.formData.cellphone,
            password: this.password
        }).then((res) => {
             loadingClose()
            if (res.status == 1) {
                _this.$toast('登录成功')
            setLoginInfo(res.data)
            getUserInfo().then((res) => {
                _this.$router.push('/')
          })
        } else {
          _this.$toast(res.msg)
        }
        }).then((res) => {
            this.submit = false
        })
    }
  },
  created () {
    let access_token = this.$route.query.access_token
    if (access_token) {
      setLoginInfo({'access_token': access_token})
      getUserInfo().then(res => {
        if (validLogin()) {
          this.$router.push({path: "/"})
        }
      }).catch((error) => {
        console.log(error)
      })
    }
  },
  mounted () {
    bus.$emit('pageTitle', this.title)
  }
}
</script>

<style lang="less" scoped>
@import "../../../static/less/reset.less";
@import '../../../static/less/login.less';
.pwd_bottom {
    margin-top: 0.4rem;
    overflow: hidden;
    width: 7.47rem;
    a {
        font-size: @font_size_4;
    }
    a:nth-child(1) {
        color: @999;
    }
    a:nth-child(2) {
        color: @red;
    }
}
</style>

