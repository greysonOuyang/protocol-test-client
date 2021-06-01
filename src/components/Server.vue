<template>
  <el-form label-width="120px"
           label-position="right"
           ref="requestServerTable">
    <!-- 启动 -->
    <el-card class="el-card-custom">
      <el-row>
        <el-col :xs="24"
                :sm="12">
          <el-form-item label="端口"
                        style="width: 60%; margin-left: 0px">
            <el-input v-model="port"></el-input>
          </el-form-item>

        </el-col>
        <el-col :xs="24"
                :sm="12">
          <el-form-item label="接口"
                        style="width: 60%; margin-left: 0px">
            <el-select v-model="currentInterfaceId"
                       placeholder="请选择">
              <el-option v-for="item in tableData"
                         :key="item.interfaceId"
                         :label="item.interfaceName"
                         :value="item.interfaceId">
              </el-option>
            </el-select>
          </el-form-item>

        </el-col>

      </el-row>
      <el-row>
        <el-form-item style="text-align: right">
          <el-button v-if="ServerStatus === 'initializing'"
                     type="primary"
                     @click="startServer()">启动服务端
          </el-button>
          <el-button v-if="ServerStatus === 'success'"
                     type="success"
                     round
                     @click="stopServer()">停止服务
          </el-button>
        </el-form-item>
      </el-row>

    </el-card>
    <!--     控制台 -->

    <el-card v-if="ServerStatus === 'success'" class="el-card-custom">
      <!--      <json-console :jsonData="jsonData"></json-console>-->

        <el-row>
          <el-col :span="24">
            <div style="float: right;">
            <el-button
                type="info"
                plain
                @click="stopReceive()">暂停接收
            </el-button>
              <el-button
                  type="info"
                  plain
                  @click="startAgainReceive()">重新接收
              </el-button>
            <el-button
                type="info"
                plain
                onclick="clearAllData()">清空内容
            </el-button>
           </div>
          </el-col>
        </el-row>
        <console-info ref="consoleInfoRef"></console-info>
    </el-card>

  </el-form>
</template>

<script>
import axios from "axios";
import JsonConsole from "@/components/common/JsonConsole";
import ConsoleInfo from "@/components/common/ConsoleInfo";
import stomp from "../stomp"

export default {
  name: 'server',
  components: {
    JsonConsole,
    ConsoleInfo
  },
  created() {
    this.getInterfaceTableData();
  },
  startAgainReceive(){

  },
  clearAllData(){
    this.$refs.consoleInfoRef.clearConsoleData();
  },
  activated() {
    this.getInterfaceTableData();
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
  computed: {
  },
  mounted() {
    // 初始化
    stomp.init();
    //  启用重连 5秒检测一次
    // stomp.reconnect(5)
  },
  destroyed() {
    // 取消订阅
    stomp.unSub("/topic/response");
    stomp.disconnect();
  },
  data() {
    return {
      // 传给consoleInfo控件的数据
      responseData: '',
      text: '',
      // 定时器
      timer: '',
      // netty服务端状态 true启动完成 false 关闭状态
      ServerStatus: 'initializing',
      // 启动时选择的接口 值是接口Id
      currentInterfaceId: '',
      // 启动端口
      port: '',
      paramTabVisiable: false,
      // 当前参数表展示的参数类型
      paramType: '',
      // 修改表数据时选中的接口
      interfaceIdInEdit: '',
      // 表格是否支持编辑
      editModeEnabled: false,
      /** 当前选中行 */
      paramHeader: '参数表',
      //选中多行
      multipleSelection: [],
      checkedDetail: [],
      index: '',
      /** 组件可视化相关 */
      uploadExcelTabVisiable: false, // excel上传组件
      dialogTableVisible: false, // “添加接口”弹窗组件
      // 模拟多趟车的弹窗可视
      addDialogVisible: false,
      /** excel上传相关 */
      // 上传excel文件列表
      file: null,
      limitNum: 5,
      paramTypeOpt: [
        {
          type: 'Int',
        }, {
          type: 'String',
        }, {
          type: 'Hex',
        }, {
          type: 'ASCII',
        }, {
          type: 'Time',
        }
      ],

      // 文件列表
      fileList: [],
      // 添加接口表单
      interfaceData: {},
      // 接口配置表格相关
      tableDesc: [
        {
          label: '接口ID',
          prop: 'interfaceId',
          width: 180
        },
        {
          label: '接口名称',
          prop: 'interfaceName',
          width: 200
        }
      ],
      // 接口表数据
      tableData: [],
      /* 分页相关 */
      currentPage1: 1,
      pageSize: 10,
      pageList: [],
      // 数据录入表格相关
      paramDataOpt: [
        {
          prop: "field",
          label: "参数名称",
        },
        {
          prop: "length",
          label: "参数长度",
        }, {
          prop: "value",
          label: "参数值",
        },
      ],
      // 参数表数据
      paramTable: [],
      //日志输出信息
      consoleInfos: [],
    }
  },
  watch: {
  },
  methods: {
    stopReceive() {
      stomp.unSub("/topic/response");
    },
    // 获取接口表数据
    getInterfaceTableData() {
      var data = {};
      data.currentMode = "server"
      axios.post('/interfaceCtrl/interface/getAllServerInterfaceInfo', data).then(
          res => {
            this.tableData = res.data;
          }
      );
    },
    // 启动服务端
    startServer() {
      if (this.port == '' || this.currentInterfaceId == null) {
        this.$alert("请点击表格中的一行作为启动接口并填写端口号", "提示", {
          confirmButtonText: "确定",
        });
      } else {
        window.sessionStorage.setItem('port', this.port);
        var requestData = {
          port: this.port,
          interfaceId: this.currentInterfaceId
        }
        // HTTP方式启动
        // axios.post('/main/start/server', requestData);
        // STOMP 方式启动
        stomp.stompClient.send("/app/start/server", JSON.stringify(requestData));
        // 初始化成功 就执行订阅
        stomp.sub("/topic/response", data => {
          this.$refs.consoleInfoRef.addConsoleInfo("SERVER_LOG", data);
          this.$refs.consoleInfoRef.showConsoleInfo();
        })

        this.$message.success('启动中...');

        var interval = setInterval(() => {
          let port = window.sessionStorage.getItem('port')
          axios.get('/main/server/status', {params: {'port': port}}).then(
              res => {
                if (res.data === 'initializing') {
                  console.log('启动中');
                } else {
                  let returnData = JSON.stringify(res.data);
                  let result = JSON.parse(returnData);
                  if (result.result === "SUCCESS") {
                    this.$message.success('启动成功');
                    this.ServerStatus = 'success';
                  } else {
                    this.$message.success('启动失败,请按F12查看控制台');
                    console.log(result.msg);
                  }
                  clearInterval(interval);
                }
              }
          );
        }, 2000);
        this.timer = setTimeout(() => {
          clearInterval(interval);
        }, 60000);
      }

    },
    stopServer() {
      let port = window.sessionStorage.getItem('port');
      // window.sessionStorage.setItem('state', false);
      axios.get('/main/stop/server', {params: {'port': port}}).then(res => {
        var isClose = res.data;
        if (isClose) {
          this.ServerStatus = "initializing";
          this.$message.success('关闭成功');
        } else {
          this.$message.error('关闭服务器失败，请重试或者联系管理员');
        }
      });
    },
  }
}
</script>