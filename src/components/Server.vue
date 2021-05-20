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
        <!-- <el-col :xs="24"
                :sm="12">
          <div>
            <p>当前服务启动端口为：{{port}}, 接口为{{tableData.interfaceName}}</p>
          </div>
        </el-col> -->
        <!-- <el-col :xs="24"
                :sm="12">

        </el-col> -->
        <el-form-item style="text-align: right">
          <el-button v-if="!ServerStatus"
                     type="primary"
                     @click="startServer()">启动服务端</el-button>
          <el-button v-if="ServerStatus"
                     type="success"
                     round
                     @click="stopServer()">停止服务</el-button>
        </el-form-item>
      </el-row>

    </el-card>
    <!-- 控制台 -->
    <!-- <el-card v-if="this.state = true" class="el-card-custom">
                <el-form-item label="输入数据">

                </el-form-item>
                <el-input class="input-data"
                          type="textarea"
                          :rows="2"
                          size="medium"
                          v-model="inputText">
                </el-input>
                <el-form-item label="输出数据">
                </el-form-item>
                <el-input type="textarea"
                          :rows="2"
                          v-model="outputText">
                </el-input>

              </el-card> -->

  </el-form>
</template>

<script>
import axios from 'axios';

export default {
  name: 'server',
  created () {
    this.getInterfaceTableData();
  },
  activated () {
    this.getInterfaceTableData();
  },
  data () {
    return {
      // netty服务端状态 true启动完成 false 关闭状态
      ServerStatus: false,
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
      tableData: [
      ],
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
    }
  },
  methods: {
    // 获取接口表数据
    getInterfaceTableData () {
      axios.get(
        '/interfaceCtrl/interface/findAll'
      ).then(response => {
        this.tableData = response.data;
      });
    },
    // 启动服务端
    startServer () {
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
        axios.post('/main/start/server', requestData);
        this.$message.success('启动中...');
        var interval = setInterval(() => {
          let port = window.sessionStorage.getItem('port')
          axios.get('/main/server/status', { params: { 'port': port } }).then(
            res => {
              this.ServerStatus = res.data;
            }
          );
          if (this.ServerStatus) {
            clearInterval(interval);
          }
        }, 2000);
      }

    },
    stopServer () {
      let port = window.sessionStorage.getItem('port');
      // window.sessionStorage.setItem('state', false);
      axios.get('/main/stop/server', { params: { 'port': port } }).then(res => {
        var isClose = res.data;
        if (isClose) {
          this.ServerStatus = false;
          this.$message.success('关闭成功');
        } else {
          this.$message.error('关闭服务器失败，请重试或者联系管理员');
        }
      });
    },
  },
}
</script>