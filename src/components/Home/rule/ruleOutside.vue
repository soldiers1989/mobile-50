<template>
    <div>
        <Header/>
        <div class="rule">
            <div class="line1">
                <h3>合约标的</h3>
                <p>上证50交易型开放式指数证券投资基金（“50ETF”）</p>
            </div>
            <div class="line1 line2">
                <h3>交易时间</h3>
                <p>9:30-11:30、13:00-15:00</p>
                <p>本系统仅支持期权买方的开平仓功能</p>
            </div>
            <div class="line1 line2">
                <h3>合约类型</h3>
                <p>认购期权和认沽期权</p>
            </div>
            <div class="line1 line2">
                <h3>到期日</h3>
                <p>到期月份的第四个星期三和除权日(遇法定节假日顺延)</p>
                <p>因行权和除权手续繁琐,故本系统不支持行权和除权申报,为保障您的利益,将于合约到期日前一天的14:30进行平仓处理,交易结果以实际为准.</p>
            </div>
            <div class="line1 line2">
                <h3>集合竞价</h3>
                <p>9:15-9:25为开盘集合竞价时间</p>
                <p>14:57-15:00为收盘集合竞价时间</p>
            </div>
            <div class="line1 line2">
                <h3>熔断交易规则</h3>
                <p>连续竞价期间，期权合约盘中交易价格较最近参考价格涨跌幅度达到或者超过50%且价格涨跌绝对值达到或者超过5个最小报价单位时，期权合约进入3分钟的集合竞价交易阶段</p>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import Header from '../../Header/header'
    import { bus } from '../../../tools/bus'

    export default {
        name: 'rule',
        components: {
            Header
        },
        data () {
            return {
                title: '交易规则'
            }
        },
        methods: {},
        mounted () {
            bus.$emit('pageTitle', this.title)
        }
    }
</script>

<style lang="less" scoped>
    @import "~static/less/reset.less";

    .rule {
        padding: 0.4rem 0.4rem;
        text-align: left;
        .line1 {
            h3 {
                font-weight: 550;
                color: @333;
                font-size: @font_size_4;
                margin-bottom: 0.13rem;
                position: relative;
                text-indent: 0.25rem;
            }
            h3::before {
                content: '';
                position: absolute;
                width: 0.08rem;
                height: 0.4rem;
                background-color: red;
                border-radius: 5px;
                left: 0;
                top: 0.02rem;
            }
            p {
                color: @666;
                font-size: @font_size_35;
                line-height: 0.65rem;
            }
        }
        .line2 {
            margin-top: 0.4rem;
        }
    }
</style>
