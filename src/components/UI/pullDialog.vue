<template>
    <div id="modal" class="modal" v-if="pullOptions.showFlag">
        <div class="modal-content">
            <header class="modal-header">
                <img src="~static/img/icon_cross.png" alt="取消" class="cancel" @click="pullOptions.showFlag = false">
                <span>{{pullOptions.title}}</span>
            </header>
            <div class="modal-body">
                <ul class="cf" v-for="(value, key) in pullOptions.list" :key="key" @click="selectItem(value)">
                    <li>
                        <p>{{value.content}}</p>
                        <p>{{value.remark}}</p>
                    </li>
                    <!--<li class="selected" v-if="bindData.bank_name == value"></li>-->
                </ul>
                <div v-if="pullOptions.list.length == 0" class="modal-mention">
                    <span>
                        {{pullOptions.mention}}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {bus} from '../../tools/bus'
export default {
    name: 'pullDialog',
    data () {
        return {
            options: {
                title: '请选择产品'
            }
        }
    },
    methods: {
        selectItem (item) {
            this.pullOptions.showFlag = false
            this.$emit('sendOptions', item)
        }
    },
    props: {
        pullOptions: {
            type: Object
        }
    },
    mounted () {
    }
}
</script>

<style lang="less" scoped>
    @import "~static/less/reset.less";
    @import '~static/less/footerModal.less';
</style>
