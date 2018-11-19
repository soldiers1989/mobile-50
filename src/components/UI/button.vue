<template>
    <div class="UI-button">
        <button :class="{
                buttonSellActive: options.value == options.buttonName[0] && options.type == 'sell',
                buttonBuyActive: options.value == options.buttonName[0] && options.type == 'buy',
                sellButton: options.type == 'sell',
                buyButton: options.type == 'buy'
                }"
                @click="changeButton(options.buttonName[0])">{{options.buttonName[0]}}</button>
        <button :class="{
                buttonSellActive: options.value == options.buttonName[1] && options.type == 'sell',
                buttonBuyActive: options.value == options.buttonName[1] && options.type == 'buy',
                sellButton: options.type == 'sell',
                buyButton: options.type == 'buy'
                }"
                 @click="changeButton(options.buttonName[1])">{{options.buttonName[1]}}</button>
    </div>
</template>

<script type="text/ecmascript-6">
    import {bus} from '../../tools/bus'
export default {
    data () {
        return {
        }
    },
    props: {
        options: {
            type: Object
        }
    },
    methods: {
        changeButton (obj) {
            this.options.value = obj
            this.$emit('sendButtonValue', this.options.value)
        }
    },
    mounted () {
         // console.log(this.options)
    }
}
</script>

<style lang="less" scoped>
    @import "../../../static/less/ui.less";
    .sellButton {
        border: @uiBorder solid @sellBlue;
    }

    .buyButton {
        border: @uiBorder solid @red;
    }

    .buttonSellActive {
        background-color: @sellBlue;
        color: @fff;
    }

    .buttonBuyActive {
        background-color: @red;
        color: @fff;
    }
</style>
