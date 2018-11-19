<template></template>
<script type="text/ecmascript-6">
    import { setItem, TOKEN_OBJ_ID, validLogin } from "../../tools/api_methods"
    import { getUserInfo } from '../../tools/ajax.js'
    export default {
        data() {
            return {}
        },
        created: function () {
            let _this = this
            let access_token = this.$route.query.access_token
            let callbackUrl = this.$route.query.callbackUrl
            let openid = this.$route.query.openid
            let recCode = this.$route.query.recCode
            if (access_token) {
                setItem(TOKEN_OBJ_ID, {access_token: access_token})
                getUserInfo().then(function (res) {
                    if (validLogin()) {
                        if (callbackUrl) {
                            _this.$router.push({path: callbackUrl})
                        } else {
                            _this.$router.push({path: "home"})
                        }
                    }
                })
            } else {
                _this.$router.push({path: "/bindPhone/" + openid + "/" + (recCode || "empty")})
            }
        }
    }
</script>
