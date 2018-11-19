<template>
  <div>
    <Header />
    <form class="from">
      <div class="cell">
        <label for="tel">真实姓名</label>
        <input type="text" id="tel" placeholder="请输入您的真实姓名" required autocomplete="off" v-model.trim="cerForm.realName" ref="tel">
        <a href="javascript:;" class="clear" @click="clearTel"></a>
      </div>
      <div class="cell">
        <label for="Id">身份证号</label>
        <input type="text" id="Id" placeholder="请输入您的18位身份证号码" required autocomplete="off" v-model.trim="cerForm.number" ref="id">
        <a href="javascript:;" class="clear" @click="clearPwd"></a>
      </div>
    </form>
    <P class="tip">实名认证将会影响充值与提现，请正确填写</P>
    <div align="center" class="">
      <button class="submit" @click="valid" :disabled = "submit">确定</button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {createCertification, getUserInfo} from '../../../apis/personal'
import {loading, loadingClose} from '../../../tools/api_methods'
import {bus} from '../../../tools/bus'
import Header from '../../Header/header'
export default {
  name: 'realName',
  components: {
    Header
  },
  data () {
    return {
      title: '实名认证',
      cerForm: {
        realName: '',
        number: ''
      },
      submit: false
    }
  },
  methods: {
    clearTel () {
      this.cerForm.realName = ''
      this.$refs['tel'].focus()
    },
    clearPwd () {
      this.cerForm.number = ''
      this.$refs['id'].focus()
    },
    valid () {
      let realName = /^[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*$/
      let idCard = /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/
      let regName = realName.test(this.cerForm.realName)
      let regId = idCard.test(this.cerForm.number)
      if (this.cerForm.realName == '') {
        this.$toast('请输入姓名')
      } else if (!regName) {
        this.$toast('姓名输入不正确')
      } else if (this.cerForm.number == '') {
        this.$toast('请输入身份证号码')
      } else if (!regId) {
        this.$toast('身份证号码输入错误')
      } else {
        this.submiter()
      }
    },
    submiter () {
      this.submit = true
      loading('认证中...')
      createCertification({
        real_name: this.cerForm.realName,
        id_card: this.cerForm.number
      }).then( (res) => {
          loadingClose()
        if (res.status == 1) {
          this.$toast('认证成功')
          getUserInfo().then((res) => {
            this.$router.push('/personalCenter')
          })
        } else {
          this.$toast(res.msg)
        }
      }).then((res) => {
        this.submit = false
      })
    }
  },
  mounted () {
    bus.$emit('pageTitle', this.title)
  }
}
</script>

<style lang="less" scoped>
@import "~static/less/reset.less";
.from {
  margin-top: 0.272rem;
  padding: 0 0.4rem;
  text-align: left;
  box-sizing: border-box;
  background-color: @bgc_fff;
  padding-bottom: 0.4rem;
  .cell {
    border-bottom: 1px solid @borderColor;
    overflow: hidden;
      label {
      color: @333;
      font-size: @font_size_45;
      display: block;
      padding-top: 0.4rem;
    }
    input {
      border: none;
      width: 100%;
      height: 0.6rem;
      margin-top: 0.2rem;
      color: @999;
      font-size: @font_size_4;
    }
    .clear {
      display: none;
      position: absolute;
      right: 0;
      width: 0.4rem;
      height: 0.4rem;
      margin: -19px 22px 0 0;
      background: url(~static/img/delete.png) no-repeat;
      background-size: 0.4rem;
    }
    .clearPic {
      margin: 10px 148px 0 0;
    }
  }
  input::-ms-clear {
    display: none;
  }
  input:valid + .clear {
    display: inline;
  }
}
.tip {
  padding: 0.2rem 0 0 0.4rem;
  color: @999;
  font-size: @font_size_35;
  text-align: left;
}
.submit {
  width: 7.47rem;
  height: 1.17rem;
  background-color: @red;
  border: none;
  color: @fff;
  font-size: @font_size_45;
  border-radius: 5px;
  margin-top: 0.8rem;
}
</style>

