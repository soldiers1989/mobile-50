<template>
    <div class="stockDetails_market">
        <van-tabs v-model="active" @click.native="changeTab">
            <van-tab v-for="(index, key) in 4" :title="pictureTitle[index - 1]" :key = "key">
                <img :src="src" alt="行情图" id="pic" v-if="showMarketPic">
            </van-tab>
        </van-tabs>
        <p>注意: 本页面行情存在延时，交易请以交易所实时价格为准(净值估算平均偏差：0.04%)</p>
    </div>
</template>

<script type="text/ecmascript-6">
    import { getItem } from '../../tools/api_methods'

    export default {
        data () {
            return {
                refreshPic: null,
                showMarketPic: true,
                src: '',
                middleUrl: '?imagetype=rop&id=',
                mainUrl: '',
                Token: '',
                active: 0,
                pictureTitle: ['分时线', '日K', '周K', '月K']
            }
        },
        props: {
            pictureId: {
                type: String
            }
        },
        methods: {
            refreshPicture () {
                let _this = this
                setTimeout(function () {
                    _this.src = _this.mainUrl + _this.middleUrl + _this.pictureId + '_SO&' + _this.Token
                }, 200)
            },
            getUrl () {
                let indexData = getItem('indexData')
                this.mainUrl = JSON.parse(indexData.imgUrl)[0]
                this.Token = JSON.parse(indexData.imgUrl)[1]
            },
            changeTab () {
                switch (this.active) {
                    case 0:
                        this.middleUrl = '?imagetype=rop&id='
                        break
                    case 1:
                        this.middleUrl = '?imagetype=kxl&type=D&EF=&Formula=&UnitWidth=-5&id='
                        break
                    case 2:
                        this.middleUrl = '?imagetype=kxl&type=W&EF=&Formula=&UnitWidth=-5&id='
                        break
                    case 3:
                        this.middleUrl = '?imagetype=kxl&type=M&EF=&Formula=&UnitWidth=-5&id='
                        break
                }
                this.refreshPicture()
            }
        },
        mounted () {
            this.getUrl()
            this.changeTab()
            this.refreshPic = setInterval(this.refreshPicture, 8000)
        },
        beforeDestroy () {
            clearInterval(this.refreshPic)
        }
    }
</script>

<style lang="less" scoped>
    @import "~static/less/market.less";
</style>
