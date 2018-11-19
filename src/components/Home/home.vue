<template>
    <div>
        <!-- 轮播图 -->
        <van-swipe :autoplay="3000">
            <van-swipe-item v-for="(v,k) in swipeImg" :key="k">
                <div class="swiper">
                    <img :src="v.picUrl">
                </div>
            </van-swipe-item>
        </van-swipe>

    <!-- 充值、在线客服、交易规则、新手指引 -->
    <ul class="cf line">
        <li>
            <router-link to="/recharge">
                <img src="~static/img/home_recharge.png" alt="充值">
                <p>充值</p>
            </router-link>
        </li>
        <li>
            <router-link to="/onlineService">
                <img src="~static/img/home_customer.png" alt="在线客服">
                <p>在线客服</p>
             </router-link>
        </li>
        <li>
            <router-link :to="{name: 'rule'}">
                <img src="~static/img/home_rule.png" alt="交易规则">
                <p>交易规则</p>
            </router-link>
        </li>
        <li>
            <router-link to="/newGuide">
                <img src="~static/img/home_novice.png" alt="新手指引">
                <p>新手指引</p>
            </router-link>
        </li>
    </ul>

        <!-- 公告 -->
        <div class="line2">
            <ul class="cf">
                <li>行业资讯</li>
                <li>
                    <router-link :to="{name: 'newsList'}">
                        <span>更多</span>
                        <img src="~static/img/icon_arrow.png" alt="">
                    </router-link>
                </li>
            </ul>
            <v-news></v-news>
        </div>
        <Footer/>
    </div>
</template>

<script type="text/ecmascript-6">
  import Footer from "../../components/Footer/footer"
  import vNews from '@/components/News/newsListContent.vue'
  import {bus} from '../../tools/bus'
  import {getIndexData} from '../../apis/common'
  import {getItem} from '../../tools/api_methods'
  import banner1 from '../../../static/img/banner1.png'
  import banner2 from '../../../static/img/banner2.png'
  export default {
    components: {
      Footer, vNews
    },
    data () {
      return {
        path: '',
        swipeImg: [
            {picUrl: banner1},
            {picUrl: banner2}
        ]
      }
    },
      methods: {
        getDate () {
            let indexData = getItem('indexData')
            if (indexData) {
                this.swipeImg = indexData.others[13] || this.swipeImg
            }
        }
      },
      mounted () {
          this.getDate()
      },
      created () {
          this.getDate()
      }

  }
</script>

<style lang="less" scoped>
    @import '../../../static/less/reset.less';

    .b {
        border: 1px solid rebeccapurple;
    }

    .swiper {
        height: 5.33rem;
        display: flex;
        img {
            height: 100%;
            width: 100%;
        }
    }

    .line {
        height: 2.96rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: @bgc_fff;
        li {
            float: left;
            flex-grow: 1;
            img {
                width: 1.653rem;
                height: 1.653rem;
            }
            p {
                color: @333;
                font-size: @font_size_4;
            }
        }
    }

    .line2 {
        background-color: @bgc_fff;
        margin-top: 0.27rem;
        ul:nth-child(1) {
            height: 1.33rem;
            line-height: 1.53rem;
            padding: 0 0.4rem;
            border-bottom: 1px solid @borderColor;
            li:nth-child(1) {
                font-size: @font_size_48;
                color: @333;
                float: left;
                font-weight: bold;
            }
            li:nth-child(2) {
                font-size: @font_size_4;
                float: right;
                a {
                    color: @999;
                }
                img {
                    width: .19rem;
                    height: .33rem;
                }
            }
        }
        ul:nth-child(2) {
            padding-bottom: 1.6rem;
            li {
                margin: 0.27rem 0.4rem 0 0.4rem;
                border-bottom: 1px solid @borderColor;
                span {
                    color: @333;
                    font-size: @font_size_35;
                    text-align: left;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 3;
                    overflow: hidden;
                    line-height: 0.5rem;
                    padding: 0.1rem 0 0 0;
                }
                p {
                    color: @999;
                    text-align: left;
                    font-size: @font_size_35;
                    padding: 0.2rem 0 0.1rem 0;
                }
            }
        }
    }
</style>
