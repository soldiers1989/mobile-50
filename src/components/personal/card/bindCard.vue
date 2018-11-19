<template>
  <div>
    <Header />
    <div class="bind_card">
      <p class="line1">为了资金安全，请绑定实名认证用户本人的银行储蓄卡</p>
      <ul class="line2 cf">
        <li>开户名</li>
        <li>{{userInfo.real_name}}</li>
      </ul>
      <ul class="line3 line4 line7">
        <li>银行名称</li>
        <li @click="selectBank = true">
            <span v-if="bindData.bank_name == 0">请选择银行</span>
            <span v-else>{{bindData.bank_name}}</span>
            <img src="~static/img/icon_arrow.png">
        </li>
      </ul>
      <ul class="line3 line4">
        <li>开户行所在地区</li>
        <li @click="show">
            <span v-if="area.length == 0">请选择地区</span>
            <span v-else>{{area}}</span>
            <img src="~static/img/icon_arrow.png">
        </li>
      </ul>
      <ul class="line3">
          <li>开户行信息</li>
          <li><input type="text" placeholder="请输入支行名称" v-model="bindData.open_bank"></li>
      </ul>
      <ul class="line3">
          <li>银行卡号</li>
          <li><input type="text" placeholder="请输入银行卡号" v-model="bindData.bank_card"></li>
      </ul>
      <ul class="line3 line5">
          <li>重复卡号</li>
          <li><input type="text" placeholder="请再次输入银行卡号" v-model="bindData.repeatBankCard"></li>
      </ul>
      <div class="line6" align="center">
          <button class="submit" :disabled = "submit" @click="validSubmit">保存</button>
      </div>
    </div>

    <!-- 弹窗 -->
    <div id="modal" class="modal" v-if="selectBank">
        <div class="modal-content">
            <header class="modal-header">
                <img src="~static/img/icon_cross.png" alt="取消" class="cancel" @click="selectBank = false">
                <span>选择银行卡</span>
            </header>
            <div class="modal-body">
                <ul class="cf" v-for="(value, key) in bankList" :key="key" @click="selectBankName(value)">
                    <li>
                        <p>{{value}}</p>
                        <p>单笔限额：20000, 单日限额：20000</p>
                    </li>
                    <li class="selected" v-if="bindData.bank_name == value"></li>
                </ul>
            </div>
        </div>
    </div>
    <!-- 地区 -->
    <vue-city-picker ref="picker"  :data="areaList"  @select="select" :cancel-txt="cancelTxt" :confirm-txt="confirmTxt"></vue-city-picker>
  </div>
</template>

<script type="text/ecmascript-6">
    import Header from '../../Header/header'
    import { bus } from '../../../tools/bus'
    import vueCityPicker from 'vue-city-bspicker'
    import { province, city, area } from '../../../tools/city-data.js'
    import { getItem } from '../../../tools/api_methods'
    import { createBankCard, getUserInfo } from '../../../apis/personal'

    export default {
        name: 'bindCard',
        components: {
            Header, vueCityPicker
        },
        data () {
            return {
                title: '添加银行卡',
                selectBank: false,
                submit: false,
                userInfo: {},
                bankList: [],
                cancelTxt: '取消',
                confirmTxt: '确认',
                areaList: [province, city, area],
                area: [],
                bindData: {
                    area: [],
                    bank_name: 0,
                    open_bank: '',
                    bank_card: '',
                    repeatBankCard: '',
                    open_province: '',
                    open_district: ''
                }
            }
        },
        methods: {
            show: function () {
                this.$refs['picker'].show()
            },
            select: function () {
                this.area = arguments[2][0] + ' ' + arguments[2][1] + ' ' + arguments[2][2]
                this.bindData.area = this.area
                this.bindData.open_province = arguments[2][0]
                this.bindData.open_district = arguments[2][1]
            },
            getUserData () {
                this.userInfo = getItem('userInfo')
                this.indexData = getItem('indexData')
                this.bankList = JSON.parse(this.indexData.permissionBank)
            },
            selectBankName (obj) {
                this.bindData.bank_name = obj
                this.selectBank = false
            },
            validSubmit () {
                if (!this.bindData.bank_name) {
                    this.$toast('请选择银行')
                } else if (this.area.length == 0) {
                    this.$toast('请选择开户行所在地区')
                } else if (this.bindData.open_bank == '') {
                    this.$toast('请填写分行名称')
                } else if (this.bindData.bank_card == '') {
                    this.$toast('请填写银行卡号')
                } else if (this.bindData.bank_card != this.bindData.repeatBankCard) {
                    this.$toast('两次填写银行卡号不一致')
                } else {
                    this.submitBind()
                }
            },
            submitBind () {
                let _this = this
                createBankCard(this.bindData).then((res) => {
                    if (res.status == 1) {
                        this.$toast('绑定成功')
                        getUserInfo().then((res) => {
                            _this.$router.push('/showCard')
                        })
                    } else {
                        this.$toast(res.msg)
                    }
                })
            },
            dataInit () {
                this.bindData = {
                    bank_name: 0,
                    open_bank: '',
                    bank_card: '',
                    repeatBankCard: ''
                }
            }
        },
        mounted () {
            bus.$emit('pageTitle', this.title)
            this.getUserData()
            this.dataInit()
        }
    }
</script>

<style lang="less" scoped>
@import "~static/less/reset.less";
@import '~static/less/footerModal.less';
.bind_card {
    .line1 {
        color: @666;
        font-size: @font_size_35;
        padding: 0.27rem 0;
        padding-left: 0.4rem;
        text-align: left;
    }
    .line2 {
        padding: 0 0.4rem;
        height: 1.17rem;
        line-height: 1.17rem;
        background-color: #FFFAD9;
        li {
        color: @333;
        font-size: @font_size_43;
        }
        li:nth-child(1) {
        float: left;
        }
        li:nth-child(2) {
        float: right;
        }
    }
    .line3 {
        display: flex;
        justify-content: space-between;
        height: 1.17rem;
        background-color: @bgc_fff;
        li {
            border-bottom: 1px solid @borderColor;
        }
        li:nth-child(1) {
            flex: 1;
            color: @333;
            font-size: @font_size_43;
            line-height: 1.17rem;
            text-align: left;
            margin-left: 0.4rem;
            white-space: nowrap;
        }
        li:nth-child(2) {
            flex: 2;
            padding-right: 0.4rem;
            line-height: 1.17rem;
            input {
                width: 100%;
                border: none;
                text-align: right;
                color: @333;
                font-size: @font_size_43;

            }
            span {
                color: @999;
                font-size: @font_size_43;
                position: relative;
                top: -0.05rem;
                width: 85%;
                overflow: hidden;
                display: inline-block;
                text-overflow: ellipsis;
                white-space: nowrap;

            }
        }
    }
    .line4 {
        margin-top: 0rem;
        li:nth-child(2) {
            text-align: right;
            line-height: 1.25rem;
            img {
                width: 0.24rem;
                height: 0.43rem;
                position: relative;
                top: -0.43rem;
            }
        }
    }
    .line5 {
        li {
            border: none;
        }
    }
    .line6 {
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
    .line7 {
        margin-top: 0.27rem;
    }
}

    .van-picker {
        position: absolute;
        bottom: 0;
        width: 100%;
        min-width: 10rem;
    }
</style>
