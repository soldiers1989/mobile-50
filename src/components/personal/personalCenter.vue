<template>
  <div>
    <div class="main">
      <ul class="line1">
        <li><img src="~static/img/contract_avatar.png"></li>
        <li>{{userData.cellphone}}</li>
      </ul>
      <div class="line2">
        <router-link to="/assets">
            <ul class="cf assets">
                <li><img src="~static/img/my_assets.png" alt="我的资产"></li>
                <li>我的资产</li>
                <li><img src="~static/img/icon_arrow.png"></li>
            </ul>
        </router-link>

        <a @click="goAuth">
            <ul class="cf realName">
                <li><img src="~static/img/my_realname.png" alt="实名认证"></li>
                <li>实名认证</li>
                <li><img src="~static/img/icon_arrow.png"></li>
            </ul>
        </a>

        <router-link to="/showCard">
            <ul class="cf bankCard">
                <li><img src="~static/img/my_bankcard.png" alt="银行卡绑定"></li>
                <li>银行卡绑定</li>
                <li><img src="~static/img/icon_arrow.png"></li>
            </ul>
        </router-link>

        <router-link to="/invitation">
            <ul class="cf recommended">
                <li><img src="~static/img/my_recommended.png" alt="我的推荐码"></li>
                <li>我的推荐码</li>
                <li><img src="~static/img/icon_arrow.png"></li>
            </ul>
        </router-link>

        <router-link to="/setLoginPwd">
            <ul class="cf login_password">
                <li><img src="~static/img/my_login_password.png" alt="登录密码"></li>
                <li>登录密码</li>
                <li><img src="~static/img/icon_arrow.png"></li>
            </ul>
        </router-link>

        <router-link to="/setWithPwd">
            <ul class="cf withdrawal_password">
                <li><img src="~static/img/my_withdrawal_password.png" alt="提现密码"></li>
                <li>提现密码</li>
                <li><img src="~static/img/icon_arrow.png"></li>
            </ul>
        </router-link>

        <router-link to="/aboutUs">
            <ul class="cf about_us">
                <li><img src="~static/img/my_about_us.png" alt="关于我们"></li>
                <li>关于我们</li>
                <li><img src="~static/img/icon_arrow.png"></li>
            </ul>
        </router-link>

        <ul class="cf logout" @click="logout" v-if="!isWechat">
            <li><img src="~static/img/icon_out.png" alt="退出"></li>
            <li>安全退出</li>
            <li><img src="~static/img/icon_arrow.png"></li>
        </ul>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script type="text/ecmascript-6">
import Footer from "../Footer/footer"
import {logout} from '../../apis/personal'
import {setItem, TOKEN_OBJ_ID, confirmDialog, getItem, isWechat, checkRealName, toast} from '../../tools/api_methods'
export default {
  name: 'personalCenter',
  components: {
    Footer
  },
  data () {
    return {
        userData: {
            cellphone: ''
        },
        isWechat: false
    }
  },
    methods: {
        logout () {
            let _this = this
            let options = {
                message: '确定要退出吗？',
                closeOnClickOverlay: false,
                lockScroll: true,
                callBackConfirm: function () {
                    logout()
                    setItem("userInfo", "")
                    setItem(TOKEN_OBJ_ID, "")
                    _this.$toast('退出成功')
                    _this.$router.push({path: "/login/userLogin"})
                }
            }
            confirmDialog(options)
        },
        goAuth () {
            if (!checkRealName()) {
                this.$router.push('/realName')
            } else {
                toast('您已经实名认证无需再次认证')
            }
        }
    },
    mounted () {
        let userInfo = getItem("userInfo")
        this.isWechat = isWechat()
        this.userData.cellphone = userInfo.cellphone
    }
}
</script>

<style lang="less" scoped>
@import "../../../static/less/reset.less";
.main {
  .line1 {
    height: 3.92rem;
    display: flex;
    justify-content: center;
    align-items: center;
     flex-direction: column;
    background-image: linear-gradient(-90deg, #FF6D43 0%, #E72D2D 100%);
    li:nth-child(1) {
        width: 2.13rem;
        height: 2.13rem;
        img {
            width: 100%;
            height: 100%;
        }
    }
    li:nth-child(2) {
        font-size: @font_size_37;
        color: @fff;
        margin-top: 0.27rem;
    }
  }
  .line2 {
    background-color: @bgc_fff;
    margin-top: 0.35rem;
    margin-bottom: 3rem;
    ul {
      height: 1.2rem;
      line-height: 1.2rem;
      border-bottom: 1px solid @borderColor;
      padding: 0 0.43rem;
      li {
        float: left;
        color: @333;
        font-size: @font_size_43;
      }
      li:last-child {
        float: right;
        width: 0.24rem;
        height: 0.43rem;
        display: flex;
        align-items: center;
        margin-top: 0.37rem;
        img {
            width: 100%;
            height: 100%;
        }
      }
    }
    .assets {
        li:nth-child(1) {
            width: 0.53rem;
            height: 0.59rem;
            display: flex;
            align-items: center;
            margin-top: 0.29rem;
            margin-right: 0.43rem;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
    .realName {
        li:nth-child(1) {
            width: 0.59rem;
            height: 0.45rem;
            display: flex;
            align-items: center;
            margin-top: 0.37rem;
            margin-right: 0.4rem;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
    .bankCard {
        li:nth-child(1) {
            width: 0.56rem;
            height: 0.45rem;
            display: flex;
            align-items: center;
            margin-top: 0.37rem;
            margin-right: 0.4rem;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
    .recommended {
        li:nth-child(1) {
            width: 0.56rem;
            height: 0.51rem;
            display: flex;
            align-items: center;
            margin-top: 0.32rem;
            margin-right: 0.4rem;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
    .login_password {
        li:nth-child(1) {
            width: 0.48rem;
            height: 0.56rem;
            display: flex;
            align-items: center;
            margin-top: 0.32rem;
            margin-right: 0.45rem;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
    .withdrawal_password {
        li:nth-child(1) {
            width: 0.48rem;
            height: 0.56rem;
            display: flex;
            align-items: center;
            margin-top: 0.29rem;
            margin-right: 0.45rem;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
    .about_us {
        li:nth-child(1) {
            width: 0.56rem;
            height: 0.61rem;
            display: flex;
            align-items: center;
            margin-top: 0.27rem;
            margin-right: 0.35rem;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
    .logout{
        li:nth-child(1) {
            width: 0.613rem;
            height: 0.56rem;
            display: flex;
            align-items: center;
            margin-top: 0.27rem;
            margin-right: 0.373rem;
            margin-left: -0.07rem;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
  }
}

</style>
