<template>
    <div class="UI-number">
        <button @click="minus" :disabled="options.able" :class="{bgGrey: options.value== '市价'}">-</button>
        <input type="text" :disabled="options.able"
               v-model="options.value"
               :class="{bgGrey: options.value== '市价'}"
               @keyup="checkMount">
        <button @click="plus" :disabled="options.able" :class="{bgGrey: options.value== '市价'}">+</button>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        data () {
            return {}
        },
        methods: {
            plus () {
                let integer = this.options.value.toString().split('.')[0]
                let decimals = this.options.value.toString().split('.')[1]
                if (decimals == undefined || decimals.length == 0) {
                    this.options.value = ((this.options.value * 10000 + this.options.step * 10000) / 10000)
                } else {
                    // this.options.value = ((this.options.value * 10000 + this.options.step * 10000) / 10000)
                    let num = Number(this.options.value) + this.options.step
                    this.fixed(num, 4)
                    this.options.value = this.fixed(num, 4)
                }
                if (this.options.value < this.options.min) {
                    this.options.value = this.options.min
                } else if (this.options.value > this.options.max) {
                    this.options.value = this.options.max
                }
                this.$emit('sendValue', this.options.value)
            },
            minus () {
                let integer = this.options.value.toString().split('.')[0]
                let decimals = this.options.value.toString().split('.')[1]
                if (decimals == undefined || decimals.length == 0) {
                    this.options.value = ((this.options.value * 10000 - this.options.step * 10000) / 10000)
                } else {
                    this.options.value = ((this.options.value * 10000 - this.options.step * 10000) / 10000).toFixed(4)
                }
                if (this.options.value < this.options.min) {
                    this.options.value = this.options.min
                } else if (this.options.value > this.options.max) {
                    this.options.value = this.options.max
                }
                this.$emit('sendValue', this.options.value)
            },
            checkMount () {
                // 超出两位保留两位
                this.options.value = this.options.value.replace(/[^0-9.]/g, '')
                let integer = this.options.value.split('.')[0]
                let decimals = this.options.value.split('.')[1]
                if (decimals != undefined && decimals.length > 4) {
                    decimals = decimals.substr(0, 4)
                    this.options.value = Number(integer + '.' + decimals)
                }
                if (this.options.value > this.options.max) {
                    this.options.value = this.options.max
                }
                this.$emit('sendValue', this.options.value)
            },
            fixed (num, n) {
                /*
                * num 数字
                * n  保留几位小数
                * */
                let i = parseInt(Math.ceil(num * Math.pow(10, n + 1)) / 10)
                return i / Math.pow(10, n)
            }
        },
        props: {
            options: {
                type: Object
            }
        },
        mounted () {
            this.fixed(4)
        },
        watch: {
            options (newValue, oldValue) {
                // console.log(newValue)
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../../../static/less/ui";

    .bgGrey {
        background-color: #f5f5f5;
    }
</style>
