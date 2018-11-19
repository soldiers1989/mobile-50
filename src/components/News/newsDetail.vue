<template>
    <div class="article_page">
        <v-header></v-header>
        <article>
            <h2>{{articleData.title}}</h2>
            <div v-html="articleData.content"></div>
        </article>
    </div>
</template>

<script type="text/ecmascript-6">
    import {getArticle} from '../../apis/common'
    import vHeader from '@/components/Header/header.vue'
    import {bus} from '../../tools/bus'
    export default {
        data () {
            return {
                id: '',
                title: '详情',
                articleData: {}
            }
        },
        methods: {
            getData () {
                getArticle({id: this.id}).then((res) => {
                    if (res.status == 1) {
                        this.articleData = res.data
                    }
                })
            }
        },
        components: {
            vHeader
        },
        mounted () {
            bus.$emit('pageTitle', this.title)
            this.id = this.$route.params.id
            this.getData()
        }
    }
</script>

<style lang="less">
    @import "../../../static/less/reset";
    .article_page{
        background-color: @fff;
    }
    article {
        padding: 0.4rem;
    }
    h2 {
        font-weight: 550;
        font-size: 0.45rem;
    }
</style>
