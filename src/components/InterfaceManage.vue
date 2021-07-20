<template>
  <el-form label-width="120px"
           label-position="right"
           ref="interfaceConfigTable">
    <el-form-item label="模式"
                  style="width: 60%; margin-left: 0">
      <el-select v-model="currentMode"
                 placeholder="请选择">
        <el-option v-for="item in modeOpt"
                   :key="item.prop"
                   :label="item.label"
                   :value="item.prop">
        </el-option>
      </el-select>
    </el-form-item>

    <div id="server"
         v-if="currentMode === 'project'">
      <project-config></project-config>
    </div>
    <div id="client"
         v-if="currentMode === 'request'">
      <request-config></request-config>
    </div>
    <div id="interface"
         v-if="currentMode === 'interface'">
      <interface-config></interface-config>
    </div>
  </el-form>
</template>

<script>
import axios from 'axios';
import EditableCell from "./common/EditeableCell";
import RequestConfig from "./RequestConfig"
import InterfaceConfig from "./InterfaceConfig"
import ProjectConfig from "./ProjectConfig"

export default {
  name: 'interfaceConfig',
  inject: ['reload'],
  components: {
    EditableCell,
    RequestConfig,
    ProjectConfig,
    InterfaceConfig
  },
  activated() {
    this.getInterfaceTableData();
  },
  mounted() {
  },
  data() {
    return {
      // 参数表编辑时是否要保存编辑前的数据，用于辅助参数表点击取消后的数据展示
      flag: true,

      lineInfo: [{
        lineNumber: '14',
        description: '14号线'
      }, {
        lineNumber: '18',
        description: '18/22号线'
      },
      ],
      messageTypeOpt: [],
      // 客户端接口表新增弹窗
      clientInterfaceVisible: false,
      // 当前页面展示客户端还是服务端的接口
      currentMode: 'request',
      modeOpt: [{
        prop: 'request',
        label: '请求管理'
      }, {
        prop: 'project',
        label: '项目管理'
      }, {
        prop: 'interface',
        label: '接口管理'
      }],
      // 新增计划信息弹窗是否可见
      addDialogVisible: false,
      // 当前参数表展示的参数类型
      paramType: '',
      // 修改表数据时选中的接口
      interfaceIdInEdit: '',
      // 表格是否支持编辑
      editModeEnabled: false,
      // 选中多行
      multipleSelection: [],
      index: '',
      /** 组件可视化相关 */
      uploadExcelTabVisiable: false, // excel上传组件
      dialogTableVisible: false, // “添加接口”弹窗组件
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

      /* 分页相关 */
      currentPage1: 1,
      pageSize: 10,
      pageList: [],

      tempParamTable: [],
    }
  },
  created() {
    this.getAllServerInterfaceInfo();
    this.getAllInterfaceInfo();
    // this.getInterfaceTableData();
  },
  methods: {






    copyArray(arr) {
      return arr.map((e) => {
        if (typeof e === 'object') {
          return Object.assign({}, e);
        } else {
          return e;
        }
      })
    },


    // 判断请求是否成功
    isRequestSuccess(data) {
      const res = JSON.stringify(data.data);
      const result = JSON.parse(res);
      return result.result === "SUCCESS";
    },
    // 获取接口表数据
    getInterfaceTableData() {
      axios.get(
          '/interfaceCtrl/interface/findAll'
      ).then(response => {
        this.tableData = response.data;
      });
    },

    /* 删除接口表一行数据 */
    doDeleteInterfaceRow(arr) {
      axios.post('/interfaceCtrl/interface/delServerInterfaceConfig', arr).then(
          response => {
            if (this.isRequestSuccess(response)) {
              this.$message.success('删除成功');
              this.getAllServerInterfaceInfo();
            } else {
              this.$message.error('删除失败');
            }
          }
      );
    },

    getAllInterfaceInfo() {
      const data = {};
      data.interfaceType = this.requestType
      axios.post('/interfaceCtrl/interface/getAllInterfaceInfo', data).then(
          res => {
            this.clientInterfaceTable = res.data;
          }
      );
    },


  },
  watch: {
    currentMode(val) {
      if (val === "client") {
        this.getAllInterfaceInfo();
      } else if (val === "server") {
        this.getAllServerInterfaceInfo();
      }
    },
    requestType(val) {
      this.clientInterfaceTable = [];
      if (this.requestType != null) {
        this.getAllInterfaceInfo();
      }
    }
  },
  computed: {
  }
}
</script>