<template>
    <div>
        <Header />
        <div class="pay">
            <div class="line1 cf">
                <p>网上银行、银行柜台或ATM等，支持大额入金</p>
                <ul>
                    <li>银行账号：{{gatheringAccount.number}}</li>
                    <li>账户名称：{{gatheringAccount.name}}</li>
                    <li>开户银行：{{gatheringAccount.bank}}</li>
                </ul>
            </div>
            <ul class="line2">
                <li>充值金额</li>
                <li><input type="text" placeholder="请输入充值金额" v-model="formData.amount_of_account"></li>
            </ul>
            <ul class="line2 line3">
                <li>转账方式</li>
                <li @click="selectBank = true"><input type="text" v-model="flag" disabled><img src="~static/img/icon_arrow.png"></li>
            </ul>
            <div class="line4">
                <div class="explain">
                    <p>备注说明</p>
                    <div>
                        <textarea v-model="formData.cust_remark"></textarea>
                    </div>
                </div>
            </div>
            <div class="line5" id="imgForm">
                <div class="show_example">
                    <ul>
                        <li>上传凭证</li>
                        <li class="example_button" @click="showPic = true">查看示例</li>
                    </ul>
                     <input type="file" accept="image/*" @change="loadImg()" class="upload">
                </div>
                <div id="imgDiv" v-if="showFlag">
                    <img id="imgContent">
                </div>
            </div>
            <div class="line6" align="center">
                <button class="submit" :disabled = "submit" @click="valid">确认转账</button>
            </div>
            <ul class="line7">
                <li>关于转账时间的说明：</li>
                <li>1、工作日17点30分前转账的，承诺在资金到账后的半小时内完成充值</li>
                <li>2、工作日17点30分以后转账的，承诺在第二个工作日的早上9:30之前完成充值</li>
                <li>3、非工作日转账的，承诺在下一工作日的早上9:30之前完成充值</li>
                <li>4、请使用实名认证后对应姓名的银卡进行转账</li>
                <li>5、如未能及时充值，请联系客服</li>
                <!-- ：0757-81230672 -->
            </ul>
        </div>

        <!-- 弹窗 -->
        <div id="modal" class="modal" v-if="selectBank">
            <div class="modal-content">
                <header class="modal-header">
                    <img src="~static/img/icon_cross.png" alt="取消" class="cancel" @click="selectBank = false">
                    <span>选择转账方式</span>
                </header>
                <div class="modal-body">
                    <ul class="cf" @click="changeTab('ATM')">
                        <li><p>ATM</p></li>
                        <li :class="{selected: flag == 'ATM'}"></li>
                    </ul>
                    <ul class="cf" @click="changeTab('柜台转账')">
                        <li><p>柜台转账</p></li>
                        <li :class="{selected: flag == '柜台转账'}"></li>
                    </ul>
                    <ul class="cf" @click="changeTab('网上银行')">
                        <li><p>网上银行</p></li>
                        <li :class="{selected: flag == '网上银行'}"></li>
                    </ul>
                    <ul class="cf" @click="changeTab('手机银行')">
                        <li><p>手机银行</p></li>
                        <li :class="{selected: flag == '手机银行'}"></li>
                    </ul>
                    <ul class="cf" @click="changeTab('支付宝')">
                        <li><p>支付宝</p></li>
                        <li :class="{selected: flag == '支付宝'}"></li>
                    </ul>
                    <ul class="cf" @click="changeTab('其它')">
                        <li><p>其它</p></li>
                        <li :class="{selected: flag == '其它'}"></li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- 查看示例 -->
        <van-popup v-model="showPic">
            <div>
                <img src="~static/img/show_example.png">
            </div>
        </van-popup>
    </div>
</template>

<script type="text/ecmascript-6">
import Header from '../../../Header/header'
import {bus} from '../../../../tools/bus'
import $ from 'jquery'
import {offlineTransfer, uploadImage} from '../../../../apis/personal.js'
import {compress, getItem, loading, loadingClose, checkRealName, confirmDialog} from '../../../../tools/api_methods.js'
export default {
    name: 'bankTransform',
    components: {
        Header
    },
    data () {
        return {
            title: '银行转账',
            selectBank: false,
            submit: false,
            showPic: false,
            showFlag: false,
            flag: '',
            imageFile: '',
            formData: {
                amount_of_account: "",
                transfer_type: 0,
                cust_pic_remark: '',
                cust_remark: '本人确认该笔款项用于期权交易之用'
            },
            gatheringAccount: {
                number: '',
                name: '',
                bank: ''
            }

        }
    },
    methods: {
        valid () {
            let _this = this
            let reg = /^[0-9]+.?[0-9]*$/
            let mount = Number(this.formData.amount_of_account)
            if (!checkRealName()) {
                let options = {
                        message: '您还未实名认证，请先实名认证',
                        confirmButtonText: '去认证',
                        closeOnClickOverlay: false,
                        lockScroll: true,
                        callBackConfirm: function () {
                            _this.$router.push('/realName')
                        }
                    }
                confirmDialog(options)
            } else if (mount === '' || mount < 100) {
                this.$toast('请输入充值金额且不得小于100元')
            } else if (!reg.test(this.formData.amount_of_account)) {
                this.$toast("金额输入不正确")
                this.formData.amount_of_account = ''
            } else if (this.formData.cust_remark === '') {
                this.$toast('备注不能为空')
            } else {
                this.offlineTransfer()
            }
        },
        offlineTransfer () {
            let _this = this
            this.submit = true
            loading('加载中')
            offlineTransfer(this.formData).then(function (res) {
                loadingClose()
                if (res.status == 1) {
                    _this.$toast("提交转账回执单成功！")
                    _this.$router.push('recharge')
                } else {
                    _this.$toast(res.msg)
                }
            }).then((res) => {
                this.submit = false
            })
        },
        updateIndexData () {
            let indexData = getItem("indexData")
            if (indexData) {
                this.service_phone = indexData.service_phone
                this.mention_content = indexData.others[27]
                this.gatheringAccount.number = indexData.recharge_bank_account
                this.gatheringAccount.name = indexData.recharge_real_name
                this.gatheringAccount.bank = indexData.recharge_bank_name
            }
        },
        changeTab (tab) {
            this.flag = tab
            this.selectBank = false
            // this.formData.transfer_type = tab
        },
        loadImg() {
        // 获取文件
        this.showFlag = true
        let _this = this
        this.imageFile = $("#imgForm").find("input")[0].files[0]
        if (this.imageFile.size / 1024 / 1024 > 10) {
          _this.$toast("上传图片不能大于10M")
        }
        compress(this.imageFile, 0.1, function (e, data) {
          if (e) {
            _this.$toast(e)
          }
          uploadImage({file: data}).then((res) => {
            if (res.status == 1) {
              _this.formData.cust_pic_remark = res.data.path
            } else {
              _this.$toast(res.msg)
            }
          })
        })
        let reader = new FileReader()
        reader.onload = function (e) {
            this.imgs = e.target.result
            $("#imgContent").attr('src', this.imgs)
        }
            reader.readAsDataURL(this.imageFile)
      }
    },
    mounted () {
        bus.$emit('pageTitle', this.title)
        this.updateIndexData()
        this.changeTab('ATM')
    }

}
</script>

<style lang="less" scoped>
@import '~static/less/reset.less';
@import '~static/less/footerModal.less';
.line1 {
    background-color: @bgc_fff;
    padding-bottom: 0.32rem;
    p {
        color: @333;
        font-size: @font_size_43;
        padding: 0.27rem 0.4rem;
    }
    ul {
        width: 8.53rem;
        height: 3.09rem;
        background-color: #FFFAD9;
        border-radius: 5px;
        margin-left: 0.75rem;
        padding: 0.48rem 0;
        padding-left: 0.53rem;
        li {
            text-align: left;
            line-height: 0.7rem;
            color: @333;
            font-size: @font_size_43;
        }

    }
}
.line2 {
    display: flex;
    justify-content: space-between;
    height: 1.17rem;
    background-color: @bgc_fff;
    margin-top: 0.27rem;
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
    }
}
.line3 {
    margin-top: 0rem;
    li:nth-child(2) {
        input {
            background-color: #fff;
            border: none;
            line-height: 1.15rem;
            text-align: right;
            padding-right: 0.5rem;
            width: 95%;
        }
        img {
            width: 0.24rem;
            height: 0.43rem;
            text-align: right;
            position: relative;
            top: 0.05rem;
        }

    }
}
.line4 {
    background-color: @bgc_fff;
    .explain {
        margin-left: 0.4rem;
        padding-bottom: 0.27rem;
        border-bottom: 1px solid @borderColor;
        p {
        color: @333;
        font-size: @font_size_43;
            text-align: left;
            padding: 0.27rem 0;
        }
        div {
            width: 9.2rem;
            height: 2.53rem;
            border: 1px solid @borderColor;
            textarea {
                width: 100%;
                height: 100%;
                border: none;
                padding: 0.27rem;
                color: @999;
                font-size: @font_size_37;
                resize: none
            }

        }
    }

}
.line5 {
    background-color: @bgc_fff;
    padding-bottom: 0.27rem;
    .show_example {
        padding: 0 0.4rem;
        padding-top: 0.29rem;
        position: relative;
        ul {
            display: flex;
            justify-content: space-between;
            li {
                color: @333;
                font-size: @font_size_43;
                cursor: pointer;
            }
            li:nth-child(2) {
                color: @fontRed;
            }
        }
        .upload {
            position: absolute;
            top: 0.29rem;
            left: 0.4rem;
            opacity: 0;
            z-index: 99;
        }

    }
    #imgDiv {
        width: 1.33rem;
        height: 1.33rem;
        margin-top: 0.27rem;
        margin-left: 0.4rem;
        border: 1px solid @borderColor;
        #imgContent {
            width: 100%;
            height: 100%;
        }
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
    padding: 0.53rem 0.4rem 0.27rem 0.4rem;
    li {
        text-align: left;
        color: @999;
        font-size: @font_size_35;
        line-height: 0.5rem;
    }
}
.modal {
    .modal-body {
        ul {
            height: 1.4rem !important;
            li {
                p {
                    margin-top: 0rem;
                    line-height: 1rem ;

                }
            }
        }
    }
}
</style>

