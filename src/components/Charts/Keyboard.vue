<template>
  <div :id="id" :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import * as echarts from 'echarts'
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    }
  },
  data() {
    return {
      chart: null,
      xList: [],
      phaseList: [],
      RSSIList: []
    }
  },
  mounted() {
    this.initSocket('ws://192.168.0.110:8080')
    // this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  destroyed() {
    // 页面销毁关闭连接
    this.webSocket.close()
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))

      const xAxisData = this.xList
      const phaseData = this.phaseList
      // const rssiData = this.RSSIList
      this.chart.setOption({
        backgroundColor: '#08263a',
        grid: {
          left: '5%',
          right: '5%'
        },
        xAxis: [{
          show: true,
          data: xAxisData
        }],
        visualMap: {
          show: false,
          min: 0,
          max: 50,
          dimension: 0,
          inRange: {
            color: ['#4a657a', '#308e92', '#b1cfa5', '#f5d69f', '#f5898b', '#ef5055']
          }
        },
        yAxis: [
          {
            max: 7, // 设置最大值
            min: 0, // 最小值
            // splitNumber: 11, // 11个刻度线，也就是10等分
            // nameTextStyle: {
            //   color: '#fff',
            //   padding: [0, 0, 0, 0]
            // },
            axisLine: {
              show: true
            },
            axisLabel: {
              textStyle: {
                color: '#4a657a'
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#08263f'
              }
            },
            axisTick: {
              show: true
            }
          }],
        series: [
          {
            name: 'Simulate Shadow',
            type: 'line',
            data: phaseData,
            z: 2,
            showSymbol: true,
            animationDelay: 0,
            animationEasing: 'linear',
            animationDuration: 1200,
            lineStyle: {
              normal: {
                color: 'transparent'
              }
            },
            areaStyle: {
              normal: {
                color: '#08263a',
                shadowBlur: 50,
                shadowColor: '#000'
              }
            }
          }
        ],
        animationEasing: 'elasticOut',
        animationEasingUpdate: 'elasticOut',
        animationDelay(idx) {
          return idx * 20
        },
        animationDelayUpdate(idx) {
          return idx * 20
        }
      })
    },
    // 建立连接
    initSocket(url1) {
      // 有参数的情况下：
      // let url = `ws://${this.url}/${this.types}`
      // 没有参数的情况:接口
      // const url1 = 'ws://192.168.0.110:8080'
      this.webSocket = new WebSocket(url1)
      this.webSocket.onopen = this.webSocketOnOpen
      this.webSocket.onclose = this.webSocketOnClose
      this.webSocket.onmessage = this.webSocketOnMessage
      this.webSocket.onerror = this.webSocketOnError
    },
    // 建立连接成功后的状态
    webSocketOnOpen() {
      console.log('websocket连接成功')
    },
    // 获取到后台消息的事件，操作数据的代码在onmessage中书写
    webSocketOnMessage(res) {
      this.dataReceiveHandle(res)
      this.initChart()
    },
    // 关闭连接
    webSocketOnClose() {
      this.webSocket.close()
      console.log('websocket连接已关闭')
    },
    // 连接失败的事件
    webSocketOnError(res) {
      console.log('websocket连接失败')
      // 打印失败的数据
      console.log(res)
    },
    dataReceiveHandle(resData) {
      const myObject = JSON.parse(resData.data)
      if (this.xList.length >= 50) {
        this.xList.shift()
        this.phaseList.shift()
        // this.RSSIList.shift()
      }
      if (this.xList.length === 0) {
        this.xList.push(myObject.TagInfo[0].TimeStamp)
        this.phaseList.push(myObject.TagInfo[0].Phase)
        // this.RSSIList.push(myObject.TagInfo[0].RSSI)
      } else {
        if (this.xList[this.xList.length - 1][0] !== myObject.TagInfo[0].TimeStamp) {
          this.xList.push(myObject.TagInfo[0].TimeStamp)
          this.phaseList.push(myObject.TagInfo[0].Phase)
          // this.RSSIList.push(myObject.TagInfo[0].RSSI)
        }
      }
    }
  }
}
</script>
