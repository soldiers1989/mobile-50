<template>
  <div>
    <Header />
    <router-view ></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import Header from '../../components/Header/header'
import {bus} from '../../tools/bus'
export default {
    components: {
        Header
    }
}
</script>
