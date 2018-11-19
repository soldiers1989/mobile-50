import router from './index'
import {validLogin} from '../tools/api_methods'

export default function checkRouter (router) {
    let flag = false
    let allowdRouter = ['home', 'login', 'newsList', 'newsDetails',
        'market', 'stockDetail', 'userLogin', 'register', 'forgetPassword', 'bindPhone', 'qrPage', 'wechatCheckBind', 'registProtocol']
    for (let i = 0; i < allowdRouter.length; i++) {
        if (allowdRouter[i] == router) {
            flag = true
            return flag
        }
    }
    return flag
}
