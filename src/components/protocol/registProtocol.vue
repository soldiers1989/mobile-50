<template>
    <div>
        <Header />
       <div class="container">
            <div v-html="content"></div>
       </div>
       <v-top></v-top>
    </div>
</template>

<script type="text/ecmascript-6">
import Header from '@/components/Header/header.vue'
import {bus} from '../../tools/bus'
import {getProtocol} from '../../tools/ajax.js'
import vTop from '../backTop/backTop'
export default {
    components: {
        Header, vTop
    },
    data() {
        return {
            title: '服务协议',
            content: ''
        }
    },
    methods: {
        getProtocol() {
            getProtocol({type: 3}).then( res => {
                if (res.status == 1) {
                    this.content = res.data.content
                }
            })
            .catch(err => {
                console.log(err)
            })
        }
    },
    mounted() {
        bus.$emit('pageTitle', this.title)
        this.getProtocol()
    }
}
</script>

<style lang = "less" scoped>
@import "../../../static/less/reset.less";
.container {
    padding: 0.3rem;
    background-color: @fff;
}
</style>



