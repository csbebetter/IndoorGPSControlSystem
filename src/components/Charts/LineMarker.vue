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
      data: [],
      chart: null,
      startTime: null,
      nowTime: null
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

      this.chart.setOption(
        {
          xAxis: {
            scale: true,
            min: 'dataMin'
          },
          yAxis: {
            max: 7, // 设置最大值
            min: 0 // 最小值
          },
          series: [
            {
              symbolSize: 20,
              data: this.data,
              type: 'scatter'
            }
          ]
        }
      )
    },
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
      this.startTime = Date.now()
    },
    // 获取到后台消息的事件，操作数据的代码在onmessage中书写
    webSocketOnMessage(res) {
      this.dataReceiveHandle(res)
      this.nowTime = Date.now()
      if ((this.nowTime - this.startTime) >= 400) {
        this.initChart()
        this.startTime = this.nowTime
      }
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
      if (this.data.length >= 50) {
        this.data.shift()
      }
      if (this.data.length === 0) {
        this.data.push([myObject.TagInfo[0].TimeStamp, myObject.TagInfo[0].Phase])
      } else {
        if (this.data[this.data.length - 1][0] !== myObject.TagInfo[0].TimeStamp) {
          this.data.push([myObject.TagInfo[0].TimeStamp, myObject.TagInfo[0].Phase])
        }
      }
      console.log(this.data)
    }
  }
}
</script>
