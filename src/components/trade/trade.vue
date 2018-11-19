<template>
    <div>
        <v-header></v-header>
        <ul class="trade_subHeader">
            <li>
                <router-link :to="{name: 'buy'}">买入</router-link>
            </li>
            <li>
                <router-link :to="{name: 'sell'}">卖出</router-link>
            </li>
            <li>
                <router-link :to="{name: 'holding'}">持仓</router-link>
            </li>
            <li>
                <router-link :to="{name: 'cancel'}">撤单</router-link>
            </li>
            <li>
                <router-link :to="{name: 'queryCenter'}">查询</router-link>
            </li>
        </ul>
        <keep-alive v-if="$route.meta.keepAlive">
            <router-view/>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
</template>

<script type="text/ecmascript-6">
    import vHeader from '../Header/header.vue'
    import { bus } from '../../tools/bus'

    export default {
        name: 'sell',
        data () {
            return {
                title: '交易',
                subHeader: true
            }
        },
        methods: {
            goTrade (dir) {
                this.$router.push({name: dir})
            }
        },
        components: {
            vHeader
        },
        mounted () {
            bus.$emit('pageTitle', this.title)
        },
        watch: {
            subHeader (newVal, oldVal) {
            }
        },
        activated () {
            bus.$emit('pageTitle', this.title)
        }
    }
</script>

<style lang="less" scoped>
    @import "~static/less/trade";

    .trade_subHeader {
        height: 1.17rem;
        display: flex;
        justify-content: center;
        line-height: 1.17rem;
        box-shadow: 0 1px 4px 0 rgba(204, 204, 204, 0.50);
        background-color: @fff;
        li {
            text-align: center;
            width: 100%;
            font-size: @font_size_43;
            a {
                color: @333;
                display: block;
            }
            .router-link-active {
                color: @red;
                border-bottom: 0.07rem solid @red;
            }
        }
    }
</style>
