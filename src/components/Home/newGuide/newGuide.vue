<template>
  <div>
    <Header />
    <img src="~static/img/img_guide.png" alt="新手指引" width="100%">
  </div>
</template>

<script type="text/ecmascript-6">
import {bus} from '../../../tools/bus'
import Header from '../../Header/header'
export default {
    components: {
        Header
    },
    data () {
        return {
        title: '新手指引'
        }
    },
    mounted () {
        bus.$emit('pageTitle', this.title)
    }
}
</script>
