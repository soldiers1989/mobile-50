<template>
    <div>
        <v-header></v-header>
        <v-news></v-news>
    </div>
</template>

<script type="text/ecmascript-6">
    import {bus} from '../../tools/bus'
    import vHeader from '../../components/Header/header.vue'
    import vNews from './newsListContent.vue'
export default {
    data () {
        return {
            title: '公告资讯'
        }
    },
    components: {
        vHeader, vNews
    },
    methods: {},
    mounted () {
        bus.$emit('pageTitle', this.title)
    }
}
</script>

<style lang="less" scoped>

</style>
