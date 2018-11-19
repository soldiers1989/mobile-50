<template>
    <div>
        <Header/>
        <table v-if="stockData.length != 0">
            <thead>
            <tr>
                <th>合约</th>
                <th>到期日</th>
                <th>剩余天数</th>
            </tr>
            </thead>
            <tbody>
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                <tr v-for="(value, key) in stockData" :key="key" @click="goForBuy(value)">
                    <td>
                        <p>{{value.option_code}}</p>
                        <p>{{value.option_name}}</p>
                    </td>
                    <td>{{value.exercise_date}}</td>
                    <td>{{value.RemainingDays}}</td>
                </tr>
            </van-pull-refresh>
            </tbody>
        </table>
        <img src="../../../static/img/img_optional.png" alt="没有自选" v-else class="without_data">
        <button v-if="stockData.length == 0" @click="$router.push({name: 'addStock'})">添加自选</button>
        <Footer/>
    </div>
</template>

<script type="text/ecmascript-6">
    import Header from '../Header/header'
    import Footer from '../Footer/footer'
    import { bus } from '../../tools/bus'
    import { getStockPool } from '../../apis/personal'
    import { getItem } from '../../tools/api_methods'

    export default {
        name: 'stockPool',
        components: {
            Header, Footer
        },
        data () {
            return {
                title: '自选',
                navRightTitle: '添加',
                userInfo: {},
                stockData: [],
                refreshing: false,
                path: ''
            }
        },

        methods: {
            getStockPool () {
                let _this = this
                getStockPool(this.userInfo.cust_id).then(function (res) {
                    if (res.status == 1) {
                        _this.stockData = res.data
                    }
                })
            },
            onRefresh () {
                setTimeout(() => {
                    this.getStockPool()
                    this.refreshing = false
                }, 1000)
            },
            goForBuy (value) {
                if (this.path == 'stockPool') {
                    this.$router.push({path: '/marketDetails/' + value.option_code})
                }
            }
        },
        mounted () {
            this.userInfo = getItem('userInfo')
            this.path = this.$route.name
            bus.$emit('pageTitle', this.title)
            bus.$emit('navRightTitle', this.navRightTitle)
            bus.$emit('closeBack')
            bus.$emit('showAdd')
            this.getStockPool()
        }
    }
</script>

<style lang="less" scoped>
    @import "../../../static/less/reset.less";

    table {
        width: 100%;
        background-color: @bgc_fff;
        margin-bottom: 3rem;
        thead, tbody {
            tr {
                display: flex;
                justify-content: space-between;
                align-items: center;
                th {
                    flex: 1;
                    text-align: center;
                }
                th:nth-child(1) {
                    flex: 2;
                    text-align: left;
                    text-indent: 0.96rem;
                }
                td {
                    flex: 1;
                    text-align: center;
                    p {
                        text-align: left;
                    }
                }
                td:nth-child(1) {
                    flex: 2;
                    text-indent: 0.4rem;
                }
            }
        }
        thead {
            tr {
                height: 1.17rem;
                box-shadow: 0 1px 4px 0 rgba(204, 204, 204, 0.50);
                th {
                    color: @333;
                    font-size: @font_size_4;
                }
            }
        }
        tbody {
            tr {
                height: 1.49rem;
                border-bottom: 1px solid @borderColor;
                td {
                    color: @333;
                    font-size: @font_size_35;
                    p {
                        line-height: 0.5rem;
                    }
                }
            }
        }
    }

    .without_data {
        width: 5.33rem;
        height: 4.88rem;
        margin: 1.87rem 2.4rem 0 2.27rem;
    }

    button {
        margin-top: 0.53rem;
        width: 7.47rem;
        height: 1.17rem;
        background-color: @red;
        color: @fff;
        border-radius: 5px;
        border: none;
        font-size: @font_size_45;
    }
</style>
