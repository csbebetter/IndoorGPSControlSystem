<template>
  <div class="app-container">

    <div style="margin: 20px 0">
      <el-button type="primary" plain @click="initSocket">开始轮询</el-button>
      <el-button type="success" plain @click="webSocketOnClose">结束轮询</el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="EPC">
        <template slot-scope="scope">
          {{ scope.row.EPC }}
        </template>
      </el-table-column>
      <el-table-column label="Port" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Port }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Phase" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.Phase }}
        </template>
      </el-table-column>
      <el-table-column label="RSSI" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.RSSI }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Timestamp" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.Timestamp }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Time" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ parseTime(scope.row.Timestamp) }}</span> <!--Date.now-->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import parseTime from '@/utils/index'
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: false
    }
  },

  methods: {
    // 建立连接
    initSocket() {
      // 有参数的情况下：
      //let url = `ws://${this.url}/${this.types}`
      // 没有参数的情况:接口
      let url1 = 'ws://192.168.0.110:8080'
      this.webSocket = new WebSocket(url1)
      this.webSocket.onopen = this.webSocketOnOpen
      this.webSocket.onclose = this.webSocketOnClose
      this.webSocket.onmessage = this.webSocketOnMessage
      this.webSocket.onerror = this.webSocketOnError
    },
    // 建立连接成功后的状态
    webSocketOnOpen() {
      console.log('websocket连接成功');
    },
    // 获取到后台消息的事件，操作数据的代码在onmessage中书写
    webSocketOnMessage(res) {
      // res就是后台实时传过来的数据
      var myObject = JSON.parse(res.data);
      var showList = [];
      myObject.TagInfo;
      for (var i in myObject.TagInfo) {
        console.log(myObject.TagInfo[i]);
        var tempJson = {
          "EPC": myObject.TagInfo[i].EPC,
          "Port": myObject.TagInfo[i].Port[myObject.TagInfo[i].Port.length - 1],
          "Phase": myObject.TagInfo[i].Phase[myObject.TagInfo[i].Phase.length - 1],
          "RSSI": myObject.TagInfo[i].RSSI[myObject.TagInfo[i].RSSI.length - 1],
          "Timestamp": myObject.TagInfo[i].TimeStamp[myObject.TagInfo[i].TimeStamp.length - 1]
        }
        showList.push(tempJson);
      }
      
      this.list = showList;

    },
    // 关闭连接
    webSocketOnClose() {
      this.webSocket.close()
      console.log('websocket连接已关闭');
    },
    //连接失败的事件
    webSocketOnError(res) {
      console.log('websocket连接失败');
      // 打印失败的数据
      console.log(res);
    }
  },
  created() {
    // 页面打开就建立连接，根据业务需要
    this.initSocket()
  },
  destroyed() {
    // 页面销毁关闭连接
    this.webSocket.close()
  }
}
</script>


