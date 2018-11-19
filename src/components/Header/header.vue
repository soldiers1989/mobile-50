<template>
    <div>
        <nav class="nav">
            <img src="../../../static/img/icon_more_white.png" alt="返回" @click="goBack()" class="go-back" v-if="isShow">
            <span class="title">{{title}}</span>
            <span v-if="isClose" class="add">
        <router-link :to="{name: navRightRouter}">{{navRightTitle}}</router-link>
      </span>
        </nav>
    </div>
</template>

<script type="text/ecmascript-6">
    import { bus } from '../../tools/bus'

    export default {
        data () {
            return {
                title: '',
                navRightTitle: '',
                navRightRouter: '',
                isShow: true,
                isClose: false,
                path: '',
                params: '',
                subPath: ''
            }
        },
        methods: {
            goBack () {
                if (this.path == 'trade' && this.$route.name != 'rule') {
                    this.$router.push({name: 'tradeCenter'})
                } else if (this.path == 'flowCenter') {
                    this.$router.push({name: 'assets'})
                } else if (this.path == 'assets' || this.path == 'showCard') {
                    this.$router.push({name: 'personalCenter'})
                } else if (this.path == 'changeCard') {
                    this.$router.push({name: 'showCard'})
                } else {
                    this.$router.go(-1)
                }
            }
        },
        activated () {
            let _this = this
            this.path = this.$route.path.split('/')[1]
            bus.$on('pageTitle', function (obj) {
                _this.title = obj
            })
        },
        mounted () {
            let _this = this
            this.path = this.$route.path.split('/')[1]
            bus.$on('pageTitle', function (obj) {
                _this.title = obj
            })
            bus.$on('showAdd', function () {
                _this.isClose = true
            })
            bus.$on('closeBack', function () {
                _this.isShow = false
            })
            bus.$on('logout', function () {
                _this.$router.push('/login')
            })
            bus.$on('navRightTitle', function (obj) {
                _this.navRightTitle = obj
                if (_this.navRightTitle == '添加') {
                    _this.navRightRouter = 'addStock'
                }
                if (_this.navRightTitle == '资金流水') {
                    _this.navRightRouter = 'flowCenter'
                }
            })
        },
        watch: {
            path (newVal, oldVal) {
                this.path = newVal
            }
        },
        beforeDestroy () {
            bus.$off('pageTitle')
            bus.$off('navRightTitle')
            bus.$off('closeBack')
            bus.$off('showAdd')
        }
    }
</script>

<style lang="less" scoped>
    @import '../../../static/less/reset.less';

    .nav {
        height: 1.17rem;
        background-color: @headerRed;
        .go-back {
            width: 0.24rem;
            height: 0.43rem;
            position: absolute;
            left: 4%;
            top: 2.1%;
        }
        .title {
            line-height: 1.17rem;
            color: @fff;
            font-size: @font_size_45;
        }
        .add {
            line-height: 1.17rem;
            position: absolute;
            right: 4%;
            a {
                color: @fff;
                font-size: @font_size_43;
            }
        }
    }

</style>
