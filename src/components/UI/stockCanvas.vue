<template>
    <div class="canvas_page">
        <div class="data_sec" v-if="realData != 0">
            最低<span :class="{fontRed: Nmin(realData) >= 0, fontGreen: Nmin(realData) < 0}">{{Nmin(realData)}}</span>
            最高<span :class="{fontRed: Nmax(realData) >= 0, fontGreen: Nmax(realData) < 0}">{{Nmax(realData)}}</span>
        </div>
        <div v-if="realData == 0" class="data_sec">
            <span>暂无数据</span>
        </div>
        <div class="canvas_boder" v-if="wid > 320">
            <canvas id="myCanvas" class="canvas" width="308px" height="340px"></canvas>
        </div>
        <div class="canvas_boder" v-if="wid <= 320">
            <canvas id="myCanvas" class="canvas" width="260px" height="340px"></canvas>
        </div>
        <div class="box_xline">
            <ul class="xLine">
                <li>10:00</li>
                <li>10:30</li>
                <li>11:00</li>
                <li>11:30</li>
                <li>13:30</li>
                <li>14:00</li>
                <li>14:30</li>
            </ul>
        </div>
        <div v-if="showY == 'base'">
            <ul class="top_sec">
                <li v-for="item in rate">
                    <span>+{{item}}%</span>
                </li>
            </ul>
            <div class="middle_line">+0%</div>
            <ul class="bottom_sec">
                <li v-for="item in rate"><span>-{{item}}%</span></li>
            </ul>
        </div>

        <div v-if="showY == 'short'">
            <ul class="top_sec" v-if="realData != 0">
                <li v-for="item in rateList"><span>+{{Math.abs(item)}}%</span></li>
            </ul>
            <div class="middle_line">+0%</div>
            <ul class="bottom_sec" v-if="realData != 0">
                <li v-for="item in rateList">
                    <span>-{{Math.abs(item)}}%</span></li>
            </ul>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import { bus } from '../../tools/bus'
    import { getInfoOfETF, getTodayHq } from '../../apis/trade'

    export default {
        data () {
            return {
                openPrice: 0.319,
                data: [],
                realData: [],
                rate: 10,
                showY: 'base',
                rateList: [],
                mul: 0,
                n: '',
                max: 0,
                wid: '',
                canvasWidth: ''
            }
        },
        props: {},
        methods: {
            getCanvas () {
                let c, cxt
                c = document.getElementById('myCanvas')
                cxt = c.getContext('2d')
                this.canvasWidth = c.width
                /* cxt.fillStyle = '#ff0000',
                cxt.fillRect(0,0,150,75) */
                cxt.beginPath()
                cxt.moveTo(10 + 0.5, 10 + 0.5)
                cxt.lineTo(10 + 0.5, 300 + 0.5)
                cxt.lineTo(this.canvasWidth - 10 + 0.5, 300 + 0.5)
                cxt.lineTo(this.canvasWidth - 10 + 0.5, 10 + 0.5)
                cxt.lineWidth = 1.0
                cxt.stroke()
                cxt.save()
                this.xLine()
                this.yLine()
                this.point()
            },
            xLine () {
                // x轴
                let c
                c = document.getElementById('myCanvas')
                let cxt = c.getContext('2d')
                let base
                this.wid > 320 ? base = 36 : base = 30
                for (let i = 1; i < 8; i++) {
                    cxt.moveTo(10 + i * base + 0.5, 300 + 0.5)
                    cxt.lineTo(10 + i * base + 0.5, 295 + 0.5)
                    cxt.lineWidth = 1.0
                    cxt.stroke()
                }
            },
            yLine () {
                // y轴,每个数据用unshift 插入到最前面
                let _this = this
                let c
                c = document.getElementById('myCanvas')
                let cxt = c.getContext('2d')
                this.canvasWidth = c.width
                // let n = 5
                let base = 29
                this.showY = 'short'
                for (let i = 1; i < 10; i++) {
                    cxt.beginPath()
                    cxt.moveTo(10, (10 + base * i) + 0.5)
                    cxt.lineTo(_this.canvasWidth - 10, (10 + base * i) + 0.5)
                    cxt.strokeStyle = '#cccccc'
                    cxt.stroke()
                    cxt.save()
                }
            },
            point () {
                let _this = this
                setTimeout(function () {
                    let c, ctx
                    c = document.getElementById('myCanvas')
                    ctx = c.getContext('2d')
                    let gap
                    _this.wid > 320 ? gap = 1.2 : gap = 1
                    let base = (29 / _this.rate).toFixed(5)
                    ctx.beginPath()
                    ctx.moveTo(10, 155 - (base * Number(_this.realData[0])) + 0.5)
                    for (let i = 0; i < _this.realData.length; i++) {
                        ctx.lineTo(10 + gap * i, 155 - (base * Number(_this.realData[i])) + 0.5)
                        ctx.strokeStyle = '#333333'
                    }
                    ctx.stroke()
                    ctx.save()
                }, 500)
            },
            getMax (arr) {
                var max = Math.abs(arr[0])
                for (let i = 0; i < arr.length; i++) {
                    if (max < Math.abs(arr[i])) {
                        max = Math.abs(arr[i])
                    }
                }
                return max
            },
            Nmin (arr) {
                var min = arr[0]
                for (let i = 0; i < arr.length; i++) {
                    if (min > arr[i]) {
                        min = arr[i]
                    }
                }
                return min
            },
            Nmax (arr) {
                var max = arr[0]
                for (let i = 0; i < arr.length; i++) {
                    if (max < arr[i]) {
                        max = arr[i]
                    }
                }
                return max
            },
            getMin (arr) {
                var min = Math.abs(arr[0])
                for (let i = 0; i < arr.length; i++) {
                    if (Math.abs(arr[i]) < min) {
                        min = Math.abs(arr[i])
                    }
                }
                return min
            },
            getData () {
                let _this = this
                getTodayHq().then(res => {
                    let list = []
                    for (let i = 930; i < 1131; i++) {
                        if (i < 1000) {
                            i = '0' + i.toString()
                        }
                        let item = i.toString().split('')
                        let key = item[0] + item[1] + ':' + item[2] + item[3]
                        if (Number(item[2] + item[3]) < 60) {
                            list.push(key)
                        }
                    }
                    for (let i = 1300; i < 1500; i++) {
                        let item = i.toString().split('')
                        let key = item[0] + item[1] + ':' + item[2] + item[3]
                        if (Number(item[2] + item[3]) < 60) {
                            list.push(key)
                        }
                    }
                    if (JSON.stringify(res.data) != '{}') {
                        for (let i = 0; i < list.length; i++) {
                            if (res[list[i]] != undefined) {
                                _this.realData.push(res[list[i]])
                            }
                        }
                        _this.data = _this.getMax(_this.realData)
                        _this.dataMin = _this.getMin(_this.realData)
                        _this.rate = _this.data / 5
                        _this.rateList = []
                        for (let i = 1; i < 6; i++) {
                            _this.rateList.push(parseInt((_this.rate * i) * 100) / 100)
                        }
                        _this.point()
                    }
                })
            }
        },
        created () {
            this.wid = document.body.clientWidth
        },
        mounted () {
            this.realData = []
            this.getData()
            this.getCanvas()
        },
        beforeDestroy () {
        }
    }
</script>

<style lang="less">
    @import "~static/less/reset.less";

    .b {
        border: 1px solid red;
    }

    .data_sec {
        font-size: 0.4rem;
        line-height: 0.6rem;
    }

    .data_sec span {
        padding: 0 0.5rem;
    }

    .box_xline {
    }

    @media all and (min-width: 374px) {
        .canvas_page {
            min-width: 320px;
            height: 390px;
        }

        .canvas_boder {
            background-color: #fff;
            box-sizing: border-box;
            width: 375px;
            height: 380px;
            overflow: hidden;
        }

        .canvas {
            margin-top: 10px;
            margin-left: 20px;
        }

        .xLine {
            width: 280px;
            font-size: 0.25rem;
            display: flex;
            justify-content: center;
            position: absolute;
            left: 60px;
            top: 350px;
            box-sizing: border-box;
        }

        .xLine li {
            width: 36px;
        }

        .middle_line {
            font-size: 0.25rem;
            position: absolute;
            left: 25px;
            top: 185px;
        }

        .top_sec {
            font-size: 0.25rem;
            display: flex;
            flex-direction: column-reverse;
            height: 145px;
            position: absolute;
            left: 5px;
            top: 40px;
            color: red;
        }

        .top_sec li {
            display: block;
            flex-grow: 1;
            position: relative;
        }

        .top_sec li span {
            position: absolute;
            top: -2px;
        }

        .bottom_sec {
            font-size: 0.25rem;
            display: flex;
            flex-direction: column;
            height: 145px;
            position: absolute;
            left: 5px;
            top: 195px;
            color: green;
        }

        .bottom_sec li {
            display: table-cell;
            flex-grow: 1;
            text-align: center;
            vertical-align: bottom;
            position: relative;
        }

        .bottom_sec li span {
            position: absolute;
            bottom: 0;
        }

        .middle_line_right {
            font-size: 0.25rem;
            position: absolute;
            left: 335px;
            top: 165px;
        }

        .top_sec_right {
            font-size: 0.25rem;
            color: red;
            display: flex;
            flex-direction: column-reverse;
            height: 145px;
            position: absolute;
            left: 335px;
            top: 30px;
        }

        .top_sec_right li {
            display: block;
            flex-grow: 1;
            position: relative;
        }

        .top_sec_right li span {
            position: absolute;
            top: -2px;
        }

        .bottom_sec_right {
            font-size: 0.25rem;
            display: flex;
            color: green;
            flex-direction: column;
            height: 145px;
            position: absolute;
            left: 335px;
            top: 180px;
        }

        .bottom_sec_right li {
            display: table-cell;
            flex-grow: 1;
            text-align: center;
            vertical-align: bottom;
            position: relative;
        }

        .bottom_sec_right li span {
            position: absolute;
            bottom: 0;
        }
    }

    @media all and (max-width: 373px) {
        .canvas_page {
            min-width: 320px;
            height: 360px;
        }

        .canvas_boder {
            background-color: #fff;
            box-sizing: border-box;
            width: 320px;
            height: 380px;
            overflow: hidden;
        }

        .canvas {
            margin-top: 10px;
            margin-left: 10px;
        }

        .xLine {
            width: 240px;
            font-size: 0.15rem;
            display: flex;
            justify-content: center;
            position: absolute;
            left: 45px;
            top: 340px;
            box-sizing: border-box;
        }

        .xLine li {
            width: 30px;
            text-align: center;
        }

        .middle_line {
            font-size: 0.25rem;
            position: absolute;
            left: 25px;
            top: 185px;
        }

        .top_sec {
            font-size: 0.25rem;
            display: flex;
            flex-direction: column-reverse;
            height: 145px;
            position: absolute;
            left: 5px;
            top: 40px;
            color: red;
        }

        .top_sec li {
            display: block;
            flex-grow: 1;
            position: relative;
        }

        .top_sec li span {
            position: absolute;
            top: -2px;
        }

        .bottom_sec {
            font-size: 0.25rem;
            display: flex;
            flex-direction: column;
            height: 145px;
            position: absolute;
            left: 5px;
            top: 195px;
            color: green;
        }

        .bottom_sec li {
            display: table-cell;
            flex-grow: 1;
            text-align: center;
            vertical-align: bottom;
            position: relative;
        }

        .bottom_sec li span {
            position: absolute;
            bottom: 0;
        }

        .middle_line_right {
            font-size: 0.25rem;
            position: absolute;
            left: 335px;
            top: 165px;
        }

        .top_sec_right {
            font-size: 0.25rem;
            color: red;
            display: flex;
            flex-direction: column-reverse;
            height: 145px;
            position: absolute;
            left: 335px;
            top: 30px;
        }

        .top_sec_right li {
            display: block;
            flex-grow: 1;
            position: relative;
        }

        .top_sec_right li span {
            position: absolute;
            top: -2px;
        }

        .bottom_sec_right {
            font-size: 0.25rem;
            display: flex;
            color: green;
            flex-direction: column;
            height: 145px;
            position: absolute;
            left: 335px;
            top: 180px;
        }

        .bottom_sec_right li {
            display: table-cell;
            flex-grow: 1;
            text-align: center;
            vertical-align: bottom;
            position: relative;
        }

        .bottom_sec_right li span {
            position: absolute;
            bottom: 0;
        }
    }
</style>
