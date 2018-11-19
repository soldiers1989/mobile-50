<template>
    <div id="app">
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"/>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
</template>

<script>
    import { getIndexData } from './apis/common'
    import { setItem } from './tools/api_methods'
    import { bus } from './tools/bus'

    export default {
        name: 'App',
        methods: {
            getData () {
                getIndexData().then(function (res) {
                    if (res.status == 1) {
                        setItem('indexData', res.data)
                        bus.$emit('updateIndexData')
                        let platform_name = res.data.platform_name
                        document.title = platform_name
                    }
                })
            }
        },
        provide () {
            return {
                reload: this.reload
            }
        },
        mounted () {
            this.getData()
        },
        filters: {
            formatDate (time) {
                var date = new Date(time)
                return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
            }
        }
    }
</script>

<style>
    @import "../static/css/reset.css";

    #app {
        font-family: PingFangSC-Medium, 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
    }
</style>
