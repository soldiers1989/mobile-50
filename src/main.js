/**
 * Copyright (c) 技术部门出品 zgxt2016@163.com
 */
import Vue from 'vue'
import App from './App'
import router from './router'
import promise from 'es6-promise'
import $ from 'jquery'
import { Dialog, Swipe, SwipeItem, Toast, Button, Popup, Area, List, PullRefresh, Tab, Tabs, Checkbox, RadioGroup, Radio, Field } from 'vant'
import VueClipboard from 'vue-clipboard2'
import fetchToken, { toast, setItem, TOKEN_OBJ_ID, validLogin } from './tools/api_methods'
import { getUserInfo } from './tools/ajax'
import checkRouter from './router/routerGarding'
import Global from './tools/global'

promise.polyfill()
Vue.use(Dialog).use(Swipe).use(SwipeItem).use(Toast).use(Button).use(Popup).use(Area).use(VueClipboard)
    .use(List).use(PullRefresh).use(Global).use(Tab).use(Tabs).use(Checkbox).use(RadioGroup).use(Radio).use(Field)

Vue.config.productionTip = false

function getQueryString (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i")
    var r = window.location.search.substr(1).match(reg)
    if (r != null) return r[2]
    return null
}

router.beforeEach((to, from, next) => {
    let access_token = getQueryString('access_token')
    let callback_url = getQueryString('callback_url')
    if (to.path != 'wechatCheckBind' && access_token && callback_url) {
        setItem(TOKEN_OBJ_ID, {access_token: access_token})
        getUserInfo().then(function (res) {
            if (validLogin()) {
                next()
            }
        })
    }

    if (to.path == '/login/userLogin') {
        sessionStorage.removeItem('token_json_key') // 清除token
        localStorage.removeItem('token_json_key') // 清除token
    }

    if (!fetchToken() && !checkRouter(to.name)) {
        toast('请先登录')
        setTimeout(function () {
            next({path: '/login/userLogin'})
        }, 1000)
    } else {
        next()
    }
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: {App},
    template: '<App/>'
})
