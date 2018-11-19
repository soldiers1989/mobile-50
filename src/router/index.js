import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home/home.vue'
import Login from '@/components/LoginRegister/login.vue'
import Trade from '@/components/trade/trade'
import QueryCenter from '@/components/trade/query/queryCenter'
import FlowCenter from '@/components/personal/recharge/flow/flowCenter'
import WechatCheckBind from '@/components/wechatCheckBind/wechatCheckBind.vue'
import QrPage from '@/components/outsider/QrPage.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: Home,
            name: 'home',
            redirect: '/home',
            children: [
                {
                    path: '/home',
                    component: Home,
                    name: 'home'
                }]
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
            redirect: '/login/UserLogin',
            children: [{
                path: 'register',
                name: 'register',
                component: resolve =>
                    require(['@/components/LoginRegister/register.vue'], resolve),
                meta: {
                    keepAlive: true
                }
            },
                {
                    path: 'forgetPassword',
                    name: 'forgetPassword',
                    component: resolve =>
                        require(['@/components/LoginRegister/forgetPwd.vue'], resolve),
                    meta: {
                        keepAlive: false
                    }
                },
                {
                    path: 'userLogin',
                    name: 'userLogin',
                    component: resolve =>
                        require(['@/components/LoginRegister/loginForm.vue'], resolve),
                    meta: {
                        keepAlive: false
                    }
                }
            ]
        },
        {
            path: '/newsList',
            name: 'newsList',
            component: resolve =>
                require(['@/components/News/newsList'], resolve),
            meta: {
                keepAlive: false
            }
        },
        {
            path: '/newsDetails/:id',
            name: 'newsDetails',
            component: resolve =>
                require(['@/components/News/newsDetail'], resolve),
            meta: {
                keepAlive: false
            }
        },
        {
            path: '/stockPool',
            name: 'stockPool',
            component: resolve =>
                require(['@/components/StockPool/stockPool'], resolve),
            meta: {
                keepAlive: false
            }
        },
        {
            path: '/addStock',
            name: 'addStock',
            component: resolve =>
                require(['@/components/StockPool/addStock'], resolve),
            meta: {
                keepAlive: false
            }
        },
        {
            path: '/personalCenter',
            name: 'personalCenter',
            component: resolve =>
                require(['@/components/personal/personalCenter'], resolve),
            meta: {
                keepAlive: false
            }
        },
        {
            path: '/assets',
            name: 'assets',
            component: resolve =>
                require(['@/components/personal/assets/assets'], resolve),
            meta: {
                keepAlive: false
            }
        },
        {
            path: '/withdraw',
            name: 'withdraw',
            component: resolve =>
                require(['@/components/personal/withdraw/withdraw'], resolve),
            meta: {
                keepAlive: false
            }
        },
        {
            path: '/setWithPwd',
            name: 'setWithPwd',
            component: resolve =>
                require(['@/components/personal/setWithPwd/setWithPwd'], resolve),
            meta: {
                keepAlive: false
            }
        },
        {
            path: '/invitation',
            name: 'invitation',
            component: resolve =>
                require(['@/components/personal/invitation/invitation'], resolve),
            meta: {
                keepAlive: false
            }
        },
        {
            path: '/setLoginPwd',
            name: 'setLoginPwd',
            component: resolve =>
                require(['@/components/personal/setLoginPwd/setLoginPwd'], resolve),
            meta: {
                keepAlive: false
            }
        },
        {
            path: '/recharge',
            name: 'recharge',
            component: resolve =>
                require(['@/components/personal/recharge/recharge'], resolve),
            meta: {
                keepAlive: false
            }
        },
        {
            path: '/unsPay',
            name: 'unsPay',
            component: resolve =>
                require(['@/components/personal/recharge/pay/unsPay'], resolve),
            meta: {
                keepAlive: false
            }
        },
        {
            path: '/supportBank',
            name: 'supportBank',
            component: resolve =>
                require(['@/components/personal/recharge/pay/supportBank'], resolve),
            meta: {
                keepAlive: false
            }
        },
        {
            path: '/bankTransform',
            name: 'bankTransform',
            component: resolve =>
                require(['@/components/personal/recharge/bankTransform/bankTransform'], resolve),
            meta: {
                keepAlive: false
            }
        },
        {
            path: '/payWechat',
            name: 'payWechat',
            component: resolve =>
                require(['@/components/personal/recharge/payWechat/payWechat'], resolve),
            meta: {
                keepAlive: false
            }
        },
        {
            path: '/quickPay',
            name: 'quickPay',
            component: resolve =>
                require(['@/components/personal/recharge/quickPay/quickPay'], resolve),
            meta: {
                keepAlive: false
            }
        },
        {
            path: '/aliPay',
            name: 'aliPay',
            component: resolve =>
                require(['@/components/personal/recharge/payAli/aliPay'], resolve),
            meta: {
                keepAlive: false
            }
        },
        {
            path: '/WxPay',
            name: 'WxPay',
            component: resolve =>
                require(['@/components/personal/recharge/payWechat/wxPay'], resolve),
            meta: {
                keepAlive: false
            }
        },
        {
            path: "/XPay",
            name: "XPay",
            component: resolve =>
                require(['@/components/personal/recharge/quickPay/XPay'], resolve),
            meta: {
                keepAlive: false
            }
        },
        {
            path: "/code",
            name: "code",
            component: resolve =>
                require(["@/components/personal/recharge/quickPay/code"], resolve)
        },
        {
            path: '/realName',
            name: 'realName',
            component: resolve =>
                require(['@/components/personal/realName/realName'], resolve),
            meta: {
                keepAlive: false
            }
        },
        {
            path: '/bindCard',
            name: 'bindCard',
            component: resolve =>
                require(['@/components/personal/card/bindCard'], resolve),
            meta: {
                keepAlive: false
            }
        },
        {
            path: '/changeCard/:id/:code',
            name: 'changeCard',
            component: resolve =>
                require(['@/components/personal/card/changeCard'], resolve),
            meta: {
                keepAlive: false
            }
        },
        {
            path: '/showCard',
            name: 'showCard',
            component: resolve =>
                require(['@/components/personal/card/showCard'], resolve),
            meta: {
                keepAlive: false
            }
        },
        {
            path: '/tradeCenter',
            name: 'tradeCenter',
            component: resolve =>
                require(['@/components/trade/tradeCenter'], resolve),
            meta: {
                keepAlive: false
            }
        },
        {
            path: '/newGuide',
            name: 'newGuide',
            component: resolve =>
                require(['@/components/Home/newGuide/newGuide'], resolve),
            meta: {
                keepAlive: false
            }
        },
        {
            path: '/onlineService',
            name: 'onlineService',
            component: resolve =>
                require(['@/components/Home/onlineService/onlineService'], resolve),
            meta: {
                keepAlive: false
            }
        },
        {
            path: '/bindPhone/:openid/:recCode',
            name: 'bindPhone',
            component: resolve =>
                require(['@/components/bindPhone/bindPhone'], resolve),
            meta: {
                keepAlive: false
            }
        },
        {
            path: '/trade',
            name: 'trade',
            component: Trade,
            redirect: '/trade/buy',
            meta: {
                keepAlive: false
            },
            children: [
                {
                    path: 'buy',
                    name: 'buy',
                    component: resolve =>
                        require(['@/components/trade/buy'], resolve),
                    meta: {
                        keepAlive: true
                    }
                },
                {
                    path: 'sell',
                    name: 'sell',
                    component: resolve =>
                        require(['@/components/trade/sell'], resolve),
                    meta: {
                        keepAlive: true
                    }
                },
                {
                    path: 'cancel',
                    name: 'cancel',
                    component: resolve =>
                        require(['@/components/trade/cancel'], resolve),
                    meta: {
                        keepAlive: false
                    }
                },
                {
                    path: 'holding',
                    name: 'holding',
                    component: resolve =>
                        require(['@/components/trade/holding'], resolve),
                    meta: {
                        keepAlive: false
                    }
                },
                {
                    path: 'queryCenter',
                    name: 'queryCenter',
                    redirect: '/trade/queryCenter/dailyEntrust',
                    component: QueryCenter,
                    children: [{
                        path: 'dailyEntrust',
                        name: 'dailyEntrust',
                        component: resolve =>
                            require(['@/components/trade/query/dailyEntrust'], resolve),
                        meta: {
                            keepAlive: false
                        }
                    },
                        {
                            path: 'dailyDealing',
                            name: 'dailyDealing',
                            component: resolve =>
                                require(['@/components/trade/query/dailyDealing'], resolve),
                            meta: {
                                keepAlive: false
                            }
                        },
                        {
                            path: 'historyEntrust',
                            name: 'historyEntrust',
                            component: resolve =>
                                require(['@/components/trade/query/historyEntrust'], resolve),
                            meta: {
                                keepAlive: false
                            }
                        },
                        {
                            path: 'historyDealing',
                            name: 'historyDealing',
                            component: resolve =>
                                require(['@/components/trade/query/historyDealing'], resolve),
                            meta: {
                                keepAlive: false
                            }
                        }
                    ]
                }
            ]
        },
        {
            path: '/trade/rule',
            name: 'rule',
            component: resolve =>
                require(['@/components/Home/rule/rule'], resolve),
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/market',
            name: 'market',
            component: resolve =>
                require(['@/components/market/market'], resolve)
        },
        {
            path: '/stockDetail',
            name: 'stockDetail',
            component: resolve =>
                require(['@/components/market/stockDetails'], resolve)
        },
        {
            path: '/marketDetails/:optionCode',
            name: 'marketDetails',
            component: resolve =>
                require(['@/components/market/marketDetails'], resolve)
        },
        {
            path: '/flowCenter',
            name: 'flowCenter',
            redirect: '/flowCenter/rechargeList',
            component: FlowCenter,
            children: [{
                path: 'cash',
                name: 'cash',
                component: resolve =>
                    require(['@/components/personal/recharge/flow/cash'], resolve)
            },
                {
                    path: 'transaction',
                    name: 'transaction',
                    component: resolve =>
                        require(['@/components/personal/recharge/flow/transaction'], resolve)
                },
                {
                    path: 'manage',
                    name: 'manage',
                    component: resolve =>
                        require(['@/components/personal/recharge/flow/manage'], resolve)
                },
                {
                    path: 'profit',
                    name: 'profit',
                    component: resolve =>
                        require(['@/components/personal/recharge/flow/profit'], resolve)
                },
                {
                    path: 'rechargeList',
                    name: 'rechargeList',
                    component: resolve =>
                        require(['@/components/personal/recharge/flow/rechargeList'], resolve)
                }
            ]
        },
        {
            path: '/aboutUs',
            name: 'aboutUs',
            component: resolve =>
                require(['@/components/personal/aboutUs/aboutUs'], resolve)
        },
        {
            path: '/registProtocol',
            name: 'registProtocol',
            component: resolve =>
                require(['@/components/protocol/registProtocol'], resolve)
        },
        {
            path: '/wechatCheckBind',
            name: 'wechatCheckBind',
            component: WechatCheckBind
        },
        {
            path: '/qrPage',
            name: 'qrPage',
            component: QrPage
        }
    ]
})
