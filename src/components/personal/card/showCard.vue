<template>
    <div class="showCard_page">
        <Header />
        <div v-if="cardData.length != 0">
            <ul class="line1">
                <li v-for="(value, key) in cardData" :key="key" @click="modifyCard(value)">
                    <img :src="'../../../static/img/'+value.bank_code+'.png'" id="aa">

                    <p>{{value.bank_card}}</p>
                    <span @click.stop="relieve(value.id)">解除绑定</span>
                </li>
            </ul>
            <div class="line2" align="center">
                <button class="submit" @click="$router.push({name: 'bindCard'})">添加银行卡</button>
            </div>
        </div>
        <div v-if="cardData.length == 0">
            <div class="line3">
                <img src="~static/img/img_bankcard.png">
            </div>
            <div class="line4" align="center">
                <button class="submit" @click="bindCard">绑定银行卡</button>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import Header from '../../Header/header'
import {bus} from '../../../tools/bus'
import {getItem, checkRealName, confirmDialog} from '../../../tools/api_methods'
import {deleteBankCard} from '../../../apis/personal'
import { getUserInfo } from '../../../tools/ajax'
export default {
  name: 'showCard',
  components: {
    Header
  },
  data () {
    return {
        title: '银行卡',
        cardData: []
    }
  },
  methods: {
      relieve (id) {
          let _this = this
        this.$dialog.confirm({
            title: '解除绑定',
            message: '您将无法使用该银行卡进行操作是否确定解除绑定？'
            }).then(() => {
                deleteBankCard({id: id}).then((res) => {
                    _this.$toast("解绑成功")
                    getUserInfo().then((res) => {
                        _this.getBankList()
                    })
                })
            }).catch(() => {
            // on cancel
        })
      },
      bindCard () {
          let _this = this
          if (!checkRealName()) {
                let options = {
                    message: '您还未实名认证，请先实名认证再绑卡',
                    confirmButtonText: '去认证',
                    closeOnClickOverlay: false,
                    lockScroll: true,
                    callBackConfirm: function () {
                        _this.$router.push('/realName')
                    }
                }
              confirmDialog(options)
          } else {
              this.$router.push('/bindCard')
          }
      },
      getBankList () {
          let _this = this
          let userInfo = getItem('userInfo')
          this.cardData = userInfo.bankCards
          for (let i = 0; i < this.cardData.length; i++) {
              _this.bankCardOptions.forEach(function (obj) {
                 if (obj.bankName.indexOf(_this.cardData[i].bank_name) > -1) {
                     _this.cardData[i].bank_code = obj.bankCode
                 }
              })
          }
      },
      getData () {
          let _this = this
          getUserInfo().then((res) => {
            _this.getBankList()
        })
      },
      modifyCard (value) {
          this.$router.push({name: 'changeCard', params: {id: value.id, code: value.bank_code}})
      }
  },
  mounted () {
      bus.$emit('pageTitle', this.title)
      this.getData()
      this.getBankList()
  }
}
</script>

<style lang="less" scoped>
@import "~static/less/reset.less";
.line1 {
    padding: 0.27rem 0.21rem;
    li {
        width: 9.6rem;
        height: 3.76rem;
        position: relative;
        img {
            width: 100%;
            height: 100%;
        }
        p {
            color: @fff;
            font-size: 0.67rem;
            position: absolute;
            top: 2rem;
            left: 2.53rem;
        }
        span {
            color: @fff;
            font-size: 0.4rem;
            position: absolute;
            top: 0.4rem;
            right: 0.54rem;
        }
    }
}
.line2 {
    .submit {
        width: 7.47rem;
        height: 1.17rem;
        color: @ccc;
        font-size: @font_size_45;
        border-radius: 5px;
        margin-top: 1.33rem;
        border: 1px dashed @ddd;
        background-color: #f5f5f5;
        background: url(~static/img/icon_add.png) no-repeat 2.4rem center;
        background-size: 0.48rem 0.48rem;
        text-indent: 1rem;
    }
}
.line3 {
    width: 5.33rem;
    height: 4.88rem;
    margin-top: 2.13rem;
    margin-left: 2.27rem;
    img {
        width: 100%;
        height: 100%;
    }
}
.line4 {
    .submit {
        width: 7.47rem;
        height: 1.17rem;
        background-color: @red;
        border: none;
        color: @eee;
        font-size: @font_size_4;
        border-radius: 5px;
        margin-top: 1.33rem;
    }
}
    .showCard_page {
        padding-bottom: 1.17rem;
    }

</style>
