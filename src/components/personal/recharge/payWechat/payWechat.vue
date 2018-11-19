<template>
    <div>
        <Header />
        <div class="pay">
            <div class="line1 cf">
                <ul>
                    <li>第一步：添加微信号<input type="text" class="text-red" v-model="wechatline" disabled />
                        <button type="button" class="copy"
                                v-clipboard:copy="wechatline"
                                v-clipboard:success="onCopy"
                                v-clipboard:error="onError">点击复制
                         </button>
                         微信面对面确认充值(工作日充值时间9:00-17:30)
                    </li>
                    <li>第二步：提交微信转账回执单，方便客服尽快入金</li>
                </ul>
            </div>
            <ul class="line2">
                <li>转账账号</li>
                <li><input type="text" placeholder="请输入转账微信账号" v-model="wechat_id"></li>
            </ul>
            <ul class="line2 line3">
                <li>充值金额</li>
                <li><input type="text" placeholder="请输入充值金额" v-model="formData.amount_of_account"></li>
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
                    </ul>
                     <input type="file" accept="image/*" @change="loadImg()" class="upload">
                </div>
                <div id="imgDiv" v-if="showFlag">
                    <img id="imgContent">
                </div>
            </div>
            <div class="line6" align="center">
                <button class="submit" :disabled = "submit" @click="vaild">提交凭证</button>
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
    </div>
</template>

<script type="text/ecmascript-6">
import Header from '../../../Header/header'
import {bus} from '../../../../tools/bus'
import $ from 'jquery'
import {uploadImage, weixinCertificatePay} from '../../../../apis/personal.js'
import {compress, getItem, loading, loadingClose, checkRealName, confirmDialog} from '../../../../tools/api_methods.js'
export default {
    name: 'payWechat',
    components: {
        Header
    },
    data () {
        return {
            title: '微信转账',
            submit: false,
            showFlag: false,
            imageFile: '',
            wechatline: 'xxxxx2011',
            wechat_id: '',
            formData: {
                uid: '',
                amount_of_account: '',
                picture: '',
                cust_remark: '本人确认该笔款项用于期权交易之用'
            },
        }
    },
    methods: {
        onCopy: function (e) {
            this.$toast("您已经复制成功了！")
        },
        onError: function (e) {
            console.log(e)
        },
        vaild () {
            let _this = this
            let re = /^[0-9]+.?[0-9]*$/
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
            } else if (this.wechat_id == '') {
                this.$toast('请输入转账微信账号！')
            } else if (!re.test(this.formData.amount_of_account)) {
                this.$toast("金额输入不正确！")
                this.formData.amount_of_account = ''
            } else if (this.formData.cust_remark == '') {
                this.$toast('备注不能为空！')
            } else if (this.formData.picture == '') {
                this.$toast("请上传转账凭证！")
            } else {
                this.submitPayWechat()
            }
        },
        submitPayWechat () {
            this.submit = true
            loading('加载中')
            let _this = this
            // this.formData.cust_remark = '转账微信号为：' + this.wechat_id + this.formData.cust_remark
            weixinCertificatePay(this.formData).then(function (res) {
                loadingClose()
                if (res.status == 1) {
                    _this.$toast("提交转账回执单成功！")
                    _this.$router.push('recharge')
                } else {
                    _this.$toast(res.msg)
                }
            }).then((res) => {
                _this.submit = false
            })
      },
      userInfo () {
        let userId = getItem("userInfo")
        this.formData.uid = userId.cust_id
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
          _this.formData.picture = data
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
        this.userInfo()
    }

}
</script>

<style lang="less" scoped>
@import '~static/less/reset.less';
@import '~static/less/footerModal.less';
.line1 {
    background-color: @bgc_fff;
    padding: 0.37rem 0.4rem;
    ul {
        li {
            text-align: left;
            line-height: 0.7rem;
            color: @333;
            font-size: @font_size_4;
            .text-red {
                border: none;
                background-color: @bgc_fff;
                height: 1rem;
                width: 2.2rem;
                margin: 0 0.4rem;
                color: @red;
            }
            .copy {
                padding: 0.12rem 0.25rem;
                background-color: @red;
                color: @fff;
                border-radius: 5px;
                font-size: @font_size_37;
                border: none;
                margin-right: 0.4rem;
            }
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

