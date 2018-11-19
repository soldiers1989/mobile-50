<template>
    <div>
        <Header />
        <div class="main">
           <div class="logo">
                <img :src="logoSrc.picUrl" alt="logo">
           </div>
           <p class="version">{{logoSrc.url}}</p>
        </div>
        <!-- <ul class="line">
            <li>官方网站</li>
            <li>www.baidu.com</li>
        </ul> -->

        <p class="copyRight">{{indexData.copyright}}</p>
    </div>
</template>

<script type="text/ecmascript-6">
import {bus} from '../../../tools/bus'
import Header from '../../Header/header'
import {getItem} from '../../../tools/api_methods'
export default {
    name: 'aboutUs',
    components: {
        Header
    },
    data () {
        return {
            title: '关于我们',
            logoSrc: [],
            indexData: {}
        }
    },
    methods: {

    },
    mounted () {
        bus.$emit('pageTitle', this.title)
        this.indexData = getItem('indexData')
        this.logoSrc = this.indexData.others[12][0]
    }
}
</script>

<style lang="less" scoped>
@import '~static/less/reset.less';
.main {
    background-color: @bgc_fff;
    padding: 0.8rem;
    .logo {
        width: 2.13rem;
        height: 2.13rem;
        margin: 0 auto;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .version {
        font-size: @font_size_43;
        color: @333;
        padding-top: 0.267rem;
    }

}
.line {
    display: flex;
    justify-content: space-between;
    height: 1.17rem;
    background-color: @bgc_fff;
    padding-left: 0.4rem;
    margin-top: 0.27rem;
    li {
        color: @333;
        font-size: @font_size_43;
        line-height: 1.17rem;
        border-bottom: 1px solid @borderColor;
    }
    li:nth-child(1) {
        flex: 1;
        text-align: left;
    }
    li:nth-child(2) {
        flex: 1;
        text-align: right;
        padding-right: 0.4rem;
    }
}
.line2 {
    margin: 0rem;
}
.copyRight {
    position: fixed;
    bottom: 0.8rem;
    left: 50%;
    transform: translateX(-50%);
    color: @999;
    font-size: 0.347rem;
    line-height: 0.5rem;
    width: 100%;
}
</style>
