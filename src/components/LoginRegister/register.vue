<template>
    <div>
        <form class="from">
            <div class="cell">
                <label for="tel">手机号码</label>
                <input type="text" id="tel" placeholder="请输入手机号码" required autocomplete="off"
                       v-model="formData.cellPhone" ref="tel">
                <a href="javascript:;" class="clear" @click="clearTel"></a>
            </div>
            <div class="cell">
                <label for="pic">图形验证码</label>
                <v-piccode @getcaptchaid="getcaptIdPwd"
                           @getcaptdata="getcaptDataPwd"
                           @getcaptcode="getcaptCodePwd">
                </v-piccode>
            </div>
            <div class="cell picphone cf">
                <label for="picPhone">短信验证码</label>
                <input type="text" id="picPhone" placeholder="请输入短信验证码" required autocomplete="off"
                       v-model="formData.phoneCode" ref="picPhone">
                <a href="javascript:;" class="clear clearPic" @click="clearPicPhone"></a>
                <button v-show="sendAuthCode" @click="getAuthCode" type="button">获取短信验证码</button>
                <button v-show="!sendAuthCode" disabled class="time" type="button">{{auth_time}}秒后重新获取</button>
            </div>
            <div class="cell" v-if="isShowRecCode">
                <label for="refCode">推荐码</label>
                <input type="text" id="refCode" placeholder="请输入推荐码" required autocomplete="off"
                       v-model="formData.refCode" ref="refCode">
                <a href="javascript:;" class="clear" @click="clearRefCode"></a>
            </div>
            <div class="cell">
                <label for="pwd">登录密码</label>
                <input type="password" id="pwd" placeholder="请输入登录密码" required autocomplete="off"
                       v-model="formData.password" ref="pwd">
                <a href="javascript:;" class="clear" @click="clearPwd"></a>
            </div>
        </form>
        <div class="protocol">
            <van-checkbox v-model="checked">
                我已阅读并同意
            </van-checkbox>
            <a href="javascript:;" @click="proptocol">服务协议</a>
        </div>
        <div align="center">
            <button class="submit" @click="valid" :disabled="submit">注册</button>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {bus} from '../../tools/bus'
    import vPiccode from '../PicCode/picCode'
    import {requestRegister, getRegisterSms} from '../../apis/personal'
    import {loading, loadingClose, getItem} from '../../tools/api_methods'
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
            vPiccode
        },
        data () {
            return {
                title: '注册',
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
                sendAuthCode: true,
                auth_time: 0,
                isShowRecCode: true,
                checked: false
            }
        },
        methods: {
            clearTel() {
                this.formData.cellPhone = ''
                this.$refs['tel'].focus()
            },
            clearPwd() {
                this.formData.password = ''
                this.$refs['pwd'].focus()
            },
            clearPicPhone() {
                this.formData.phoneCode = ''
                this.$refs['picPhone'].focus()
            },
            clearRefCode() {
                this.formData.refCode = ''
                this.$refs['refCode'].focus()
            },
            getcaptIdPwd(obj) {
                this.formData.picId = obj
            },
            getcaptDataPwd(obj) {
                this.formData.picData = obj
            },
            getcaptCodePwd(obj) {
                this.formData.picCode = obj
            },
            proptocol() {
                this.$router.push({name: 'registProtocol'})
            },
            valid() {
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
                } else if (this.formData.refCode == '') {
                    this.$toast('请输入推荐码')
                } else if (this.formData.password == '') {
                    this.$toast('请输入密码')
                } else if (!regPwd) {
                    this.$toast('密码由6-20位数字或字母组成')
                } else if (!this.checked) {
                    this.$toast('请阅读并同意服务协议')
                } else {
                    this.register()
                }
            },
            register() {
                let _this = this
                this.submit = true
                loading('注册中...')
                this.password = crypt.encrypt(this.formData.password)
                requestRegister({
                    cellphone: this.formData.cellPhone,
                    password: this.password,
                    recCode: this.formData.refCode,
                    phoneCode: this.formData.phoneCode
                }).then((res) => {
                    loadingClose()
                    if (res.status == 1) {
                        _this.$toast('注册成功')
                        _this.$router.push('/login/userLogin')
                        _this.initData()
                    } else {
                        _this.$toast(res.msg)
                    }
                }).then((res) => {
                    this.submit = false
                })
            },
            getAuthCode() {
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
                getRegisterSms({
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
            initData() {
                this.checked = false
                this.formData = {
                    cellPhone: '',
                    picData: '',
                    picCode: '',
                    picId: '',
                    phoneCode: '',
                    password: '',
                    refCode: ''
                }
                this.clear()
                this.sendAuthCode = true
            }
        },
        activated () {
            bus.$emit('pageTitle', this.title)
        },
        mounted () {
            this.initData()
            bus.$emit('pageTitle', this.title)
            if (this.$route.query.code) {
                this.formData.refCode = this.$route.query.code
                this.isShowRecCode = false
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../../../static/less/reset.less";
    @import '../../../static/less/login.less';

    .protocol {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        border: none !important;
        padding-top: 0.4rem;
        padding-left: 0.4rem;

        a {
            font-size: 0.4rem;
            color: #4485ec;
        }

    }
</style>

