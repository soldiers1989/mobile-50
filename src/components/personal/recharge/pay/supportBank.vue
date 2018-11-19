<template>
  <div>
        <Header />
        <div class="line1">认证支付目前只支持以下银行</div>
            <ul class="line2">
              <li>银行名称</li>
              <li>单笔限额</li>
            </ul>
        <div class="line3">
            <ul>
                <li v-for="(value, key) in bankList" :key="key">
                    {{key}}
                </li>
            </ul>
            <ul>
                <li v-for="(value, key) in bankList" :key="key">
                {{value}}
                </li>
            </ul>
      </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {bus} from '../../../../tools/bus'
import Header from '../../../Header/header'
import {getItem} from '../../../../tools/api_methods'
export default {
  name: 'supportBank',
  components: {
    Header
  },
  data () {
    return {
      title: '支持银行',
        bankList: []
    }
  },
  methods: {
      getData () {
          let indexData = getItem('indexData')
          this.bankList = indexData.AuthPayment
      }
  },
  mounted () {
    bus.$emit('pageTitle', this.title)
      this.getData()
  }
}
</script>

<style lang="less" scoped>
@import "~static/less/reset.less";
.line1 {
    color: @999;
    font-size: @font_size_35;
    padding: 0.27rem 0.4rem;
    text-align: left;
}
.line2 {
    border-bottom: 1px solid @borderColor;
    background-color: @bgc_fff;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 1.23rem;
    li  {
        color: @333;
        font-size: @font_size_43;
    }
    li:nth-child(1) {
        text-indent: 6px;
    }
}
.line3 {
    background-color: @bgc_fff;
    display: flex;
    justify-content: space-around;
    ul {
        li {
            color: @333;
            font-size: @font_size_4;
            line-height: 1rem;
        }

    }
}
</style>
