<template>
  <el-form label-width="120px"
           label-position="right"
           ref="iscsManagerTab">
    <el-form-item label="功能选择">
      <el-radio-group v-model="functionSelect">
        <el-radio label="manage">管理综合监控</el-radio>
        <el-radio label="contextSend">文本下发</el-radio>
      </el-radio-group>
    </el-form-item>
<!--    <el-form-item :label="'选择车站'" v-if="functionSelect === 'manage'">-->
<!--      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>-->
<!--      <div style="margin: 15px 0;"></div>-->
<!--      <el-checkbox-group v-model="checkStations" @change="handleStationsChange">-->
<!--        <el-checkbox v-for="station in stations" :label="station.stationName" :key="station.stationId">-->
<!--          {{ station.stationName }}-->
<!--        </el-checkbox>-->
<!--      </el-checkbox-group>-->
<!--    </el-form-item>-->

    <el-form-item label="综合监控程序" v-if="functionSelect === 'manage'">
      <el-col :xs="24"
              :sm="12">
        <el-input
            placeholder="输入jar包路径，如D:\iscs.jar"
            v-model="jarPath">
          <el-row></el-row>
        </el-input>
      </el-col>
      <el-col :xs="24"
              :sm="12">
        <el-button type="primary"
                   size="mini"
                   icon="el-icon-upload"
                   style="margin-left: 12px;"
                   @click="updateIscs()">更新
        </el-button>
        <el-button type="primary"
                   size="mini"
                   icon="el-icon-upload"
                   style="margin-left: 12px;"
                   @click="restartIscs()">重启
        </el-button>
      </el-col>
    </el-form-item>
    <el-form-item :label="'点表'" v-if="functionSelect === 'manage'">
      <el-col :xs="24"
              :sm="12">
        <el-input
            placeholder="输入本地点表路径，如D:\playCtrl_map_code.xsls"
            v-model="excelPath">
          <el-row></el-row>
        </el-input>
      </el-col>
      <el-col :xs="24"
              :sm="12">
        <el-button type="primary"
                   size="mini"
                   icon="el-icon-upload"
                   style="margin-left: 12px;"
                   @click="updateExcel()">更新
        </el-button>
      </el-col>
    </el-form-item>
    <el-form-item :label="'执行shell命令'" v-if="functionSelect === 'manage'">
      <el-col :xs="24"
              :sm="12">
        <el-input
            placeholder="输入命令"
            v-model="shellCommand">
          <el-row></el-row>
        </el-input>
      </el-col>
      <el-col :xs="24"
              :sm="12">
        <el-button type="primary"
                   size="mini"
                   icon="el-icon-upload"
                   style="margin-left: 12px;"
                   @click="executeCommand()">执行
        </el-button>
      </el-col>
    </el-form-item>
    <el-row v-if="functionSelect === 'contextSend'">

      <el-form-item :label="'接口位置'">
        <el-radio v-model="requestData.interfaceSelection"
                  label="0">中心
        </el-radio>
        <el-radio v-model="requestData.interfaceSelection"
                  label="1">车站
        </el-radio>
      </el-form-item>
      <el-form-item :label="'选择车站'" v-if="requestData.interfaceSelection === '1'">
        <el-select v-model="requestData.stationId"
                   clearable
                   placeholder="请选择">
          <el-option v-for="item in stations"
                     :key="item.stationId"
                     :label="item.stationName"
                     :value="item.stationId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="'播控区域'" >
        <el-radio v-model="requestData.playerSelection"
                  label="1">指定位置
        </el-radio>
        <el-radio v-model="requestData.playerSelection" v-if="requestData.interfaceSelection === '1'"
                  label="0">站内所有
        </el-radio>
        <el-radio v-model="requestData.playerSelection" v-if="requestData.interfaceSelection === '0'"
                  label="2">指定车站
        </el-radio>
      </el-form-item>
      <el-form-item :label="'选择车站'" v-if="requestData.interfaceSelection === '0' && requestData.playerSelection === '2'">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="checkStations" @change="handleStationsChange">
          <el-checkbox v-for="station in stations" :label="station.stationName" :key="station.stationId">
            {{ station.stationName }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-row v-if="requestData.playerSelection === '1'">
        <el-col :xs="24"
                :sm="10">
          <el-form-item label="起始位置">
            <el-input type="number"
                      min="0"
                      max="65535"
                      :placeholder="'输入数字，包含当前点位'"
                      v-model="requestData.startAddress"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24"
                :sm="10">
          <el-form-item label="结束位置">
            <el-input type="number"
                      min="0"
                      max="65535"
                      :placeholder="'输入数字，包含当前点位'"
                      v-model="requestData.endAddress"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item :label="'指令'">
        <el-radio v-model="requestData.attribute.showType"
                  label="0">普通文本
        </el-radio>
        <el-radio v-model="requestData.attribute.showType"
                  label="1">紧急文本
        </el-radio>
        <el-radio v-model="requestData.attribute.showType"
                  label="2">撤销文本
        </el-radio>
      </el-form-item>
      <el-form-item :label="'文本内容'">
        <el-input type="textarea"
                  :rows="4"
                  placeholder="请输入文本"
                  v-model="requestData.context">
          <el-row></el-row>
        </el-input>
      </el-form-item>
      <el-form-item :label="'请选择优先级'">
        <el-radio-group v-model="requestData.attribute.priority">
          <el-radio :label="0">线网级</el-radio>
          <el-radio :label="1">线路级</el-radio>
          <el-radio :label="2">车站级</el-radio>
          <el-radio :label="3">车载级</el-radio>
          <el-radio :label="4">区域级</el-radio>
          <el-radio :label="5">设备级</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="'是否有时限控制'">
        <el-radio v-model="requestData.attribute.limitStyle"
                  label="0">不控制
        </el-radio>
        <el-radio v-model="requestData.attribute.limitStyle"
                  label="1">启用时限控制
        </el-radio>
      </el-form-item>
      <el-form-item :label="'播放时长'" v-if="requestData.attribute.limitStyle === '1'">
        <el-input placeholder="单位：分钟, 默认10分钟"
                  v-model="requestData.attribute.showTime"></el-input>
      </el-form-item>
      <el-form-item style="text-align: right">
        <el-button
            type="primary"
            @click="execute()">开始执行
        </el-button>
      </el-form-item>
      <el-button type="text" @click="clearContent()">清空内容</el-button>
      <console-info ref="iscsConsoleInfo" dataMsg="dataMsg" tag="tag" logType="logType"></console-info>
    </el-row>

  </el-form>

</template>

<script>
import stomp from "../stomp";
import axios from "axios";
import ConsoleInfo from "./common/ConsoleInfo";

const stationOpt = [
  {
    "stationId": "0.18.0",
    "stationName": "万顷沙",
  }, {
    "stationId": "0.18.1",
    "stationName": "横沥",
  }, {
    "stationId": "0.18.2",
    "stationName": "番禺广场-18",
  }, {
    "stationId": "0.18.3",
    "stationName": "南村万博",
  }, {
    "stationId": "0.18.4",
    "stationName": "沙溪",
  }, {
    "stationId": "0.18.5",
    "stationName": "龙潭",
  }, {
    "stationId": "0.18.6",
    "stationName": "磨碟沙",
  }, {
    "stationId": "0.18.7",
    "stationName": "冼村",
  }, {
    "stationId": "0.22.0",
    "stationName": "番禺广场-22",
  }, {
    "stationId": "0.22.1",
    "stationName": "市广路",
  }, {
    "stationId": "0.22.2",
    "stationName": "广州南站",
  }, {
    "stationId": "0.22.3",
    "stationName": "陈头岗",
  }
];

export default {
  name: 'IscsManager',
  components: {
    ConsoleInfo
  },
  data() {
    return {
      checkAll: false,
      checkStations: [],
      stations: stationOpt,
      isIndeterminate: true,
      uploadVisible: false,

      jarPath: "",
      excelPath: "",
      shellCommand: "",
      functionSelect: "contextSend",

      // 请求数据
      requestData: {
        // 当前车站 车站接口使用
        stationId: "",
        // 接口位置
        interfaceSelection: "1",
        // 文本内容
        context: "",
        // 播控区域选择方式
        playerSelection: "0",
        // 车站列表 中心接口使用
        stationList: this.checkStations,
        // 播控起始位置
        startAddress: null,
        // 播控结束位置
        endAddress: null,
        // 文本属性
        attribute: {
          isOpen: "1",
          showType: "1",
          limitStyle: "1",
          priority: "1",
          showTime: "10",
        },
      }
      }
  },
  // mounted() {
  //   // 初始化
  //   stomp.init(() => {
  //     this.subResponse();
  //   });
  //   //  启用重连 5秒检测一次
  //   // stomp.reconnect(5)
  // },
  // destroyed() {
  //   // 取消订阅
  //   stomp.unSub("/topic/response");
  //   stomp.disconnect();
  // },
  methods: {
    clearContent() {
      this.$refs.iscsConsoleInfo.clearContent();
    },
    execute() {
      axios.post("/iscs/execute/context", this.requestData).then();
    },
    recover() {

    },
    updateIscs() {
      const data = {
        stationIds: this.checkStations,
        jarPath: this.jarPath
      };
      axios.post("/iscs/update/iscs", data);
    },
    updateExcel() {
      const data = {
        stationIds: this.checkStations,
        jarPath: this.excelPath
      };
      axios.post("/iscs/update/excel", data);
    },
    restartIscs() {
      const data = {
        stationIds: this.checkStations
      };
      axios.post("/iscs/restart", data);
    },
    executeCommand() {

    },
    handleCheckAllChange(val) {
      if (val) {
        for (const station of stationOpt) {
          this.checkStations.push(station.stationName);
        }
      } else {
        this.checkStations = [];
      }
      this.isIndeterminate = false;
    },
    handleStationsChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.stations.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.stations.length;
      // this.$emit('handle-change-layer', this.checkStations)
    }
  }

}
</script>

<style lang="scss">
</style>