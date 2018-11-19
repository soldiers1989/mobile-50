<template>
    <div>
        <v-header></v-header>
        <div class="search_product">
            <img src="~static/img/icon_search.png" alt="">
            <input type="text" placeholder="请输入合约代码或简称" v-model="code" @keyup="onSubmit">
        </div>
        <ul class="product_list" v-for="(value, key) in productList" :key="key">
            <li>
                <span @click="selectStock(value)">
                    <img src="../../../static/img/icon_plus_optional.png" alt="添加" v-if="value.pool.length == 0">
                    <img src="../../../static/img/icon_selected.png" alt="选中" v-else>
                </span>
                <span @click="goForDetail(value)">{{value.option_code}}</span>
                <span @click="goForDetail(value)">{{value.option_name}}</span>
            </li>
        </ul>
    </div>
</template>

<script type="text/ecmascript-6">
import vHeader from '@/components/Header/header.vue'
import {bus} from '../../tools/bus'
import {addStockToPool, getAllProductLogin, delStockFromPool, getProductByParam} from '../../apis/personal'
import {getItem, toast} from '../../tools/api_methods'
    export default {
        name: 'addStock',
        components: {
            vHeader
        },
        data () {
            return {
                title: '添加自选',
                productList: [],
                formData: {
                    optionCode: "",
                },
                code: ""
            }
        },
        methods: {
            // 模糊搜索
            onSubmit () {
                let _this = this
                let value = this.code
                if (value.length >= 3 && value.length <= 13) {
                    getProductByParam({param: this.code}).then(function (res) {
                       if (res.status == 1) {
                            _this.productList = res.data
                        }
                    })
                }
            },
            // 获取所有期权
            getAllProduct () {
                let _this = this
                getAllProductLogin({}).then(function (res) {
                    if (res.status == 1) {
                        _this.productList = res.data
                    }
                })
            },
            selectStock (value) {
                if (value.pool.length == 0) {
                    // 添加
                    let _this = this
                    this.formData.optionCode = value.option_code
                    addStockToPool(this.formData).then(function (res) {
                        if (res.status == 1) {
                            _this.getAllProduct()
                            _this.$toast('添加自选成功')
                        } else {
                            _this.$toast(res.msg)
                        }
                    }).catch(function () {
                        _this.$toast("添加失败，请稍后再试")
                    })

                } else {
                    // 删除
                    let _this = this
                    this.formData.optionCode = value.option_code
                    delStockFromPool(this.formData).then(function (res) {
                        if (res.status == 1) {
                            _this.getAllProduct()
                            _this.$toast('删除自选成功')
                        } else {
                            _this.$toast(res.msg)
                        }
                    }).catch(function () {
                        _this.$toast("删除失败，请稍后再试")
                    })
                }
            },
            goForDetail (value) {
                this.$router.push({path: '/marketDetails/' + value.option_code})
            }
        },
        mounted () {
            bus.$emit('pageTitle', this.title)
            this.getAllProduct()
        }
    }
</script>

<style lang="less" scoped>
    @import "~static/less/stockpool.less";
</style>
