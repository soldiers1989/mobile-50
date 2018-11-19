<template>
    <div>
        <ul>
            <li v-for="(value, key) in newsData" :key="key" @click="showDetails(value.id)">
                <span>{{value.title}}</span>
                <span>{{value.created_time.split(' ')[0]}}</span>
            </li>
        </ul>
    </div>
</template>

<script type="text/ecmascript-6">
    import {bus} from '../../tools/bus'
    import {getIndexArticles} from '../../apis/common'
    export default {
        data () {
            return {
                newsData: []
            }
        },
        methods: {
            getArticles () {
                getIndexArticles().then((res) =>{
                    if (res.status == 1) {
                        this.newsData = res.data[3]
                    }
                })
            },
            showDetails (id) {
                this.$router.push('/newsDetails/' + id)
            }
        },
        mounted () {
            this.getArticles()
        }
    }
</script>

<style lang="less" scoped>
    @import '../../../static/less/reset.less';
    ul {
        background-color: @fff;
        margin-bottom: 2rem;
        li {
            padding: 0.27rem 0.4rem;
            border-bottom: 1px solid @borderColor;
            min-height: 1.07rem;
            span {
                color: @333;
                font-size: @font_size_35;
                text-align: left;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 3;
                overflow: hidden;
                line-height: 0.5rem;
                padding: 0.1rem 0 0 0;
            }
            span:nth-child(2) {
                color: @999;
            }
            p {
                color: @999;
                text-align: left;
                font-size: @font_size_35;
                padding: 0.2rem 0 0.1rem 0;
            }
        }
    }
</style>
