<template>
  <el-form label-width="120px"
           label-position="right"
           ref="interfaceConfigTable">
    <el-form-item label="模式"
                  style="width: 60%; margin-left: 0px">
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
         v-if="currentMode == 'server'">
      <el-card class="el-card-custom"
               header="接口配置">
        <div style="margin-bottom: 20px">
          <el-button @click="btnAddPlanInfo()"
                     type="primary"
                     size="mini">添加计划信息
          </el-button>
          <el-button type="primary"
                     icon="el-icon-download"
                     size="mini"
                     @click="downLoadExcelTabVisiable">模板文件下载
          </el-button>
          <el-button @click="dialogTableVisible = true"
                     type="primary"
                     icon="el-icon-plus"
                     size="mini">新增
          </el-button>
          <el-button type="danger"
                     icon="el-icon-delete"
                     size="mini"
                     @click="handleDeleteMulti">删除
          </el-button>
          <el-button type="primary"
                     size="mini"
                     icon="el-icon-upload2"
                     @click="uploadExcelTabVisiable = true">导入
          </el-button>

          <el-button type="success"
                     icon="el-icon-delete"
                     size="mini"
                     @click="handleClearMulti">清空
          </el-button>
        </div>
        <!-- 接口表 -->
        <el-table :data="tableData"
                  border
                  highlight-current-row
                  style="width: 100%"
                  ref="tb"
                  @current-change="selectCurrentCol"
                  @selection-change="handleSelectionChange">
          <el-table-column type="selection"
                           width="60">
          </el-table-column>
          <!-- <el-table-column label="序号"
                         align="center"
                         prop="index"
                         width="60">

        </el-table-column> -->
          <el-table-column prop="interfaceId"
                           label="接口Id"
                           v-if="idShow"
                           align='center'></el-table-column>
          <el-table-column prop="interfaceType"
                           label="消息类型"
                           width="180"
                           align='center'></el-table-column>
          <el-table-column prop="interfaceName"
                           label="接口名称"
                           width="190"
                           align='center'></el-table-column>
          <el-table-column label="输入"
                           width="110"
                           align='center'>
            <template slot-scope="scope">
              <el-button size="mini"
                         type="info"
                         @click="viewInPut(scope.$index, scope.row)">查看
              </el-button>
            </template>
          </el-table-column>

          <el-table-column label="输出"
                           width="110"
                           align='center'>
            <template slot-scope="scope">
              <el-button size="mini"
                         type="info"
                         @click="viewOutPut(scope.$index, scope.row)">查看
              </el-button>
            </template>
          </el-table-column>

          <el-table-column label="操作"
                           width="90"
                           align='center'>
            <template slot-scope="scope">
              <el-button size="mini"
                         type="danger"
                         circle
                         icon="el-icon-remove-outline"
                         @click="handleDelete(scope.$index, scope.row)"></el-button>
            </template>
          </el-table-column>

        </el-table>
        <!-- <div class="block">
        <span class="demonstration"></span>
        <el-pagination layout="prev, pager, next"
                       :total="50">
        </el-pagination>
      </div> -->

        <!-- 添加用户弹框 -->
        <el-dialog title="新增接口"
                   :visible.sync="dialogTableVisible"
                   :close-on-click-modal="false">
          <el-form>
            <el-form-item label="消息类型">
              <el-select v-model="interfaceData.interfaceType"
                         placeholder="请选择">
                <el-option v-for="item in messageTypeOpt"
                           :key="item.type"
                           :label="item.description"
                           :value="item.description">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="接口名称">
              <el-input v-model="interfaceData.interfaceName"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"
                         @click="addServerInterfaceConfig()">确定
              </el-button>
              <el-button type="primary"
                         @click="addInterfaceConfig()">确定缓存
              </el-button>
              <el-button @click="dialogTableVisible = false">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>

        <!-- 新增模拟多趟车弹框 -->
        <el-dialog title="新增接口"
                   :visible.sync="addDialogVisible"
                   :close-on-click-modal="false">
          <el-form>
            <el-form-item label="接口名称">
              <el-input v-model="interfaceData.interfaceName"></el-input>
            </el-form-item>
            <el-form-item label="站台数">
              <el-input v-model="interfaceData.stationCount"></el-input>
            </el-form-item>
            <el-form-item label="列车趟数">
              <el-input v-model="interfaceData.trainCount"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"
                         @click="addPlanInfo()">确定
              </el-button>
              <el-button @click="addDialogVisible = false">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <el-dialog title="上传Excel"
                   :visible.sync="uploadExcelTabVisiable"
                   :close-on-click-modal="false">
          <el-upload drag
                     class="upload-excel"
                     :auto-upload="false"
                     action="/api/excelUtil/importExcel"
                     :limit=limitNum
                     accept=".xlsx"
                     :on-change="fileChange"
                     :on-exceed="exceedFile"
                     :on-success="handleSuccess"
                     :on-error="handleError"
                     :file-list="fileList">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
          <br />
          <el-button size="small"
                     type="primary"
                     @click="uploadFile">立即上传
          </el-button>
          <el-button size="small"
                     @click="cancelUpload()">取消
          </el-button>
        </el-dialog>
      </el-card>

      <!-- 参数表 -->
      <el-card v-if="paramTabVisible"
               :header="paramHeader"
               class="el-card-custom">
        <div style="margin-bottom: 20px">
          <!--          <el-switch v-model="editModeEnabled"-->
          <!--                     style="margin-right: 20px"-->
          <!--                     active-color="#13ce6"-->
          <!--                     inactive-color="#ff4949"-->
          <!--                     active-text="编辑"-->
          <!--                     inactive-text="查看">-->
          <!--          </el-switch>-->
          <el-button v-model="editModeEnabled"
                     @click="editParamData"
                     type="primary"
                     icon="el-icon-check"
                     size="mini">编辑
          </el-button>
          <el-button type="primary"
                     size="mini"
                     icon="el-icon-plus"
                     @click="handleAddDetails">添加
          </el-button>
          <el-button v-if="editModeEnabled"
                     @click="saveParamData"
                     type="primary"
                     icon="el-icon-check"
                     size="mini">保存
          </el-button>
          <el-button @click="cancelParamEdit"
                     v-if="editModeEnabled"
                     type="primary"
                     icon="el-icon-check"
                     size="mini">取消
          </el-button>

        </div>

        <el-table :data="paramTable"
                  border
                  stripe
                  style="width: 100%;">

          <el-table-column :key="item.prop"
                           :label="item.label"
                           :prop="item.prop"
                           :width="item.width"
                           v-for="item in paramDataOpt">
            <editable-cell slot-scope="{row}"
                           :can-edit="editModeEnabled"
                           v-model="row[item.prop]">
              <span slot="content">{{ row[item.prop] }}</span>
            </editable-cell>
          </el-table-column>
          <el-table-column label="参数类型">
            <editable-cell slot-scope="{row}"
                           editable-component="el-select"
                           :can-edit="editModeEnabled"
                           close-event="change"
                           v-model="row.paramType">

              <el-tag size="medium"
                      type="primary"
                      slot="content">
                {{ row.paramType }}
              </el-tag>

              <template slot="edit-component-slot">
                <el-option v-for="item in paramTypeOpt"
                           :key="item.paramType"
                           :label="item.paramType"
                           :value="item.paramType">
                </el-option>
              </template>
            </editable-cell>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <div id="client"
         v-if="currentMode == 'client'">
      <el-card class="el-card-custom"
               header="接口配置">
        <!-- 请求类型选择 -->
        <!-- <el-form-item label="请求形式">
          <el-radio-group v-model="requestType"
                          placeholder="请选择">
            <el-radio label="HTTP">HTTP/S</el-radio>
            <el-radio label="WebSocket">WebSocket/S</el-radio>
            <el-radio label="TCP">TCP/S</el-radio>
            <el-radio label="UDP">UDP</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="请求形式">
          <el-select v-model="requestType"
                     placeholder="请选择">
            <el-option v-for="item in requestTypeOpt"
                       :key="item.prop"
                       :label="item.label"
                       :value="item.prop">
            </el-option>
          </el-select>
        </el-form-item>

        <div v-if="clientInterfaceOpt != null && clientInterfaceOpt.length != 0">
          <el-form-item>
            <el-button @click="clientInterfaceVisible = true"
                       type="primary"
                       icon="el-icon-plus"
                       size="mini">新增
            </el-button>
            <el-button @click="btnConfigRequest()"
                       type="primary"
                       icon="el-icon-plus"
                       size="mini">配置请求
            </el-button>
            <el-button type="danger"
                       icon="el-icon-delete"
                       size="mini"
                       @click="delConfigInterface">删除
            </el-button>
            <el-button type="danger"
                       icon="el-icon-delete"
                       size="mini"
                       @click="clearInterfaceConfig">清空
            </el-button>
          </el-form-item>

          <!-- 客户端的接口表格 -->
          <el-table :data="clientInterfaceTable"
                    border
                    stripe
                    style="width: 100%;"
                    @current-change="handleOneCol"
                    @selection-change="handleSelectionChange">
            <el-table-column type="selection"
                             width="60">
            </el-table-column>
            <el-table-column prop="id"
                             label="id"
                             v-if="idShow"
                             align='center'></el-table-column>
            <el-table-column :show-overflow-tooltip=true
                             v-for="item in clientInterfaceOpt"
                             :key="item.prop"
                             :label="item.label"
                             :prop="item.prop">
              <editable-cell slot-scope="{row}"
                             :can-edit="editModeEnabled"
                             v-model="row[item.prop]">
                <span slot="content">{{ row[item.prop] }}</span>
              </editable-cell>
            </el-table-column>
            <el-table-column label="请求配置"
                             width="110"
                             align='center'>
              <template slot-scope="scope">
                <el-button size="mini"
                           type="info"
                           @click="viewConfig(scope.$index, scope.row)">查看
                </el-button>
              </template>
            </el-table-column>

          </el-table>
        </div>

        <el-dialog title="新增接口"
                   :visible.sync="clientInterfaceVisible"
                   :close-on-click-modal="false">
          <el-form v-model="clientInterfaceForm">
            <el-form-item v-if="this.requestType == 'HTTP'"
                          :label="selectTitle">
              <el-select v-model="clientInterfaceForm.currentSelect"
                         placeholder="请选择">
                <el-option v-for="item in selectOption"
                           :key="item.prop"
                           :label="item.label"
                           :value="item.prop">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="请求名称">
              <el-input v-model="clientInterfaceForm.requestName"></el-input>
            </el-form-item>
            <el-form-item label="端口"
                          v-if="this.requestType == 'TCP'">
              <el-input v-model="clientInterfaceForm.port"></el-input>
            </el-form-item>
            <el-form-item label="请求地址">
              <el-input v-model="clientInterfaceForm.url"></el-input>
            </el-form-item>
            <el-form-item label="请求内容">
              <el-input v-model="clientInterfaceForm.content"
                        type="textaria"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"
                         @click="addClientInterface()">确定
              </el-button>
              <el-button @click="clientInterfaceVisible = false">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>

        <el-dialog title="配置请求"
                   :visible.sync="requestConfigDialog"
                   :close-on-click-modal="false">
          <el-form v-model="configForm">
            <el-row>
              <el-card class="el-card-custom">
                <el-table border
                          :data="configTableData">
                  <el-table-column v-for="item in ConfigOpt"
                                   :prop="item.key"
                                   :label="item.label"
                                   :key="item.key">
                    <!-- <el-input v-model="configTableData.item.key"></el-input> -->
                  </el-table-column>
                </el-table>
              </el-card>
              <!-- <el-col :xs="24"
                      :sm="12">
                
              </el-col>
              <el-col :xs="24"
                      :sm="12">
                
              </el-col> -->
              <el-form-item label="配置Key">
                <el-input placeholder="请输入英文单词,建议驼峰命名"
                          v-model="configForm.configKey"></el-input>
              </el-form-item>
              <el-form-item label="配置名称">
                <el-input v-model="configForm.configName"></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <!-- <el-col :xs="24"
                      :sm="12">
                
              </el-col>
              <el-col :xs="24"
                      :sm="12">
                
              </el-col> -->
              <el-form-item label="配置类型">
                <el-select v-model="configForm.configType"
                           placeholder="选择类型">
                  <el-option v-for="item in configTypeOpt"
                             :key="item.prop"
                             :label="item.label"
                             :value="item.prop">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="configForm.configType != 'input'"
                            label="配置类型对应值">
                <el-input placeholder="多个值之间用中文分号分割"
                          v-model="configForm.configValue"></el-input>
              </el-form-item>

            </el-row>
          </el-form>

          <el-button type="primary"
                     @click="addConfigRow()">添加配置
          </el-button>
          <el-button type="primary"
                     @click="saveConfigRequest()">保存
          </el-button>
          <el-button @click="cancel()">取消</el-button>
        </el-dialog>
      </el-card>
      <el-dialog :visible.sync="configTableVisible"
                 title="请求配置表">
        <el-table border
                  :data="clientConfigTableData">
          <el-table-column v-for="item in ConfigOpt"
                           :prop="item.key"
                           :label="item.label"
                           :key="item.key">
            <!-- <el-input v-model="configTableData.item.key"></el-input> -->
          </el-table-column>
        </el-table>
      </el-dialog>

    </div>
  </el-form>
</template>

<script>
import axios from 'axios';
import EditableCell from "./common/EditeableCell";
import cloneDeep from "lodash/cloneDeep";

export default {
  name: 'interfaceConfig',
  inject: ['reload'],
  components: {
    EditableCell
  },
  activated () {
    this.getInterfaceTableData();
  },
  mounted () {
  },
  data () {
    return {
      // 参数表编辑时是否要保存编辑前的数据，用于辅助参数表点击取消后的数据展示
      flag: true,
      clientConfigTableData: [],
      // 是否展示配置请求表
      configTableVisible: false,
      configForm: {},
      configTypeOpt: [
        {
          prop: 'select',
          label: '下拉框'
        }, {
          prop: 'input',
          label: '输入框'
        },
        // {
        //   prop: 'singleSelect',
        //   label: '单选框'
        // },
      ],
      // 配置项
      ConfigOpt: [
        {
          key: 'configKey',
          label: '配置Key'
        }, {
          key: 'configName',
          label: '配置名称'
        }, {
          key: 'configType',
          label: '配置类型'
        }, {
          key: 'configValue',
          label: '类型对应值'
        },
      ],
      // 表单配置项数据
      configTableData: [],
      messageTypeOpt: [
        {
          type: '0x01',
          description: '心跳信息'
        }, {
          type: '0x02',
          description: '列车信息'
        }, {
          type: '0x03',
          description: '计划信息'
        }, {
          type: '0x04',
          description: '首末班信息'
        }, {
          type: '0x05',
          description: '车门隔离状态信息'
        }, {
          type: '0x06',
          description: '站台门隔离状态信息'
        },
      ],
      clientInterfaceForm: {},
      // 选择项
      requestMethodOpt: [
        {
          prop: 'GET',
          label: 'GET'
        }, {
          prop: 'POST',
          label: 'POST'
        }, {
          prop: 'DELETE',
          label: 'DELETE'
        }, {
          prop: 'PUT',
          label: 'PUT'
        }, {
          prop: 'PATCH',
          label: 'PATCH'
        },
      ],
      // 客户端接口表数据
      clientInterfaceTable: [],
      httpInterfaceOpt: [
        {
          prop: "requestName",
          label: "请求名称",
        },
        {
          prop: "requestMethod",
          label: "请求方式",
        },
        {
          prop: "url",
          label: "请求地址",
        }, {
          prop: "content",
          label: "请求内容",
        },
      ], tcpInterfaceOpt: [
        {
          prop: "requestName",
          label: "请求名称",
        },
        {
          prop: "port",
          label: "端口",
        },
        {
          prop: "url",
          label: "请求地址",
        }, {
          prop: "content",
          label: "请求内容",
        },
      ],
      // 请求配置弹窗
      requestConfigDialog: false,
      // 客户端接口表新增弹窗
      clientInterfaceVisible: false,
      // 当前选择的要展示的列表的请求类型
      requestType: 'HTTP',
      // 当前页面展示客户端还是服务端的接口
      currentMode: 'client',
      requestTypeOpt: [
        {
          prop: 'HTTP',
          label: 'HTTP/S'
        }, {
          prop: 'WebSocket',
          label: 'WebSocket/S'
        }, {
          prop: 'TCP',
          label: 'TCP/S'
        }, {
          prop: 'UDP',
          label: 'UDP'
        },
      ],
      modeOpt: [{
        prop: 'client',
        label: '客户端'
      }, {
        prop: 'server',
        label: '服务端'
      }],
      // 新增计划信息弹窗是否可见
      addDialogVisible: false,
      // 参数表是否可见
      paramTabVisible: false,
      // 隐藏接口Id列
      idShow: false,
      // 当前参数表展示的参数类型
      paramType: '',
      // 修改表数据时选中的接口
      interfaceIdInEdit: '',
      // 表格是否支持编辑
      editModeEnabled: false,
      /** 当前选中行 */
      paramHeader: '参数表',
      // 选中多行
      multipleSelection: [],
      index: '',
      /** 组件可视化相关 */
      uploadExcelTabVisiable: false, // excel上传组件
      dialogTableVisible: false, // “添加接口”弹窗组件
      /** excel上传相关 */
      // 上传excel文件列表
      file: null,
      limitNum: 5,
      // 文件列表
      fileList: [],
      paramTypeOpt: [
        {
          paramType: 'Int',
        }, {
          paramType: 'String',
        }, {
          paramType: 'Hex',
        }, {
          paramType: 'ASCII',
        }, {
          paramType: 'Time',
        }
      ],
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
          prop: "paramField",
          label: "参数名称",
        },
        {
          prop: "paramLength",
          label: "参数长度",
        }, {
          prop: "paramValue",
          label: "参数值",
        },
      ],
      // 参数表数据
      paramTable: [],
      tempParamTable: [],
    }
  },
  created () {
    this.getAllServerInterfaceInfo();
    this.getAllInterfaceInfo();
    // this.getInterfaceTableData();
  },
  methods: {
    // 取消参数表编辑
    cancelParamEdit () {
      this.editModeEnabled = false;
      this.paramTable = this.tempParamTable;
      this.tempParamTable = [];
    },
    editParamData () {
      this.editModeEnabled = true;
      this.getAllServerInterfaceInfo();
    },
    saveParamData () {
      var requestData = {};
      requestData.interfaceId = this.interfaceIdInEdit;
      if (this.paramType == 'input') {
        requestData.input = this.paramTable,
          requestData.paramIO = 'input'
      } else if (this.paramType == 'output') {
        requestData.output = this.paramTable
        requestData.paramIO = 'output'
      }
      axios.post('/paramCtrl/param/save', requestData);
      this.$message.success('保存成功');
      this.getAllServerInterfaceInfo();
      this.editModeEnabled = false;
    },
    handleClearMulti () {
      this.$confirm('接口配置不易，请主人三思而后行，真的要清空嘛?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() =>
        axios.post('/interfaceCtrl/interface/deleteAll').then(
          response => {
            if (this.isRequestSuccess(response)) {
              this.$message.success('清空成功，请重新导入数据');
              this.getInterfaceTableData();
            } else {
              this.$message.success('删除失败，请重新尝试');
            }
          }
        ).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        }))

    },
    /**
     * 选中多行删除  服务端删除
     */
    handleDeleteMulti () {
      if (this.multipleSelection.length == 0) {
        this.$alert("请先选择要删除的数据", "提示", {
          confirmButtonText: "确定",
        });
      } else {
        var requestData = [];
        for (const v of this.multipleSelection) {
          var data = {
            interfaceConfigId: v.interfaceId
          }
          requestData.push(data);
        }
        this.doDeleteInterfaceRow(requestData);
        this.tableData.splice(this.multipleSelection[0].index - 1, 1);
      }
    },
    clearInterfaceConfig () {
      var data = {
        requestType: this.requestType,
        currentMode: this.currentMode,
      };
      this.$confirm('接口配置不易，请主人三思而后行，真的要清空嘛?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() =>
        axios.post('/interfaceCtrl/interface/delAllInterfaceInfo', data).then(
          response => {
            if (this.isRequestSuccess(response)) {
              this.$message.success('清空成功，请重新录入数据');
              this.getAllInterfaceInfo();
            } else {
              this.$message.success('删除失败，请重新尝试');
            }
          }
        ).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        }))

    },
    delConfigInterface () {
      if (this.multipleSelection.length == 0) {
        this.$alert("请先选择要删除的数据", "提示", {
          confirmButtonText: "确定",
        });
      } else {
        var requestData = [];
        for (const v of this.multipleSelection) {
          var data = {
            interfaceConfigId: v.id
          }
          requestData.push(data);
        }
        this.doDeleteInterface(requestData);
        this.tableData.splice(this.multipleSelection[0].index - 1, 1);
      }
    },
    /* 删除接口表一行数据 */
    doDeleteInterface (arr) {
      axios.post('/interfaceCtrl/interface/delInterfaceConfig', arr).then(
        response => {
          if (this.isRequestSuccess(response)) {
            this.$message.success('删除成功');
            this.getAllInterfaceInfo();
          } else {
            this.$message.error('删除失败');
          }
        }
      );
    },
    handleOneCol (val) {
      this.clientConfigTableData = val.configList;
    },
    selectCurrentCol (val) {
      this.interfaceIdInEdit = val.interfaceId;
    },
    viewConfig (index, row) {
      this.configTableVisible = true;
    },
    viewOutPut (index, row) {
      this.paramTabVisible = true;
      this.paramHeader = '输出参数';
      this.paramTable = row.output;
      this.paramType = 'output';
    },
    viewInPut (index, row) {
      this.paramTabVisible = true;
      this.paramHeader = '输入参数';
      this.paramTable = row.input;
      console.log(this.paramTable);
      this.paramType = 'input';
    },
    copyArray (arr) {
      return arr.map((e) => {
        if (typeof e === 'object') {
          return Object.assign({}, e);
        } else {
          return e;
        }
      })
    },
    handleAddDetails () {
      if (this.paramTable === undefined || this.paramTable === null) {
        this.paramTable = [];
      }
      this.editModeEnabled = true;
      console.log("拷贝数据前")
      console.log(this.tempParamTable);
      if (this.flag) {
        this.tempParamTable = cloneDeep(this.paramTable);
        console.log("拷贝数据了")
        this.flag = false;
      }
      console.log("每次添加数据前")
      console.log(this.tempParamTable);

      this.paramTable.push({
        paramField: '',
        paramLength: '',
        paramType: '',
        paramValue: ''
      });
      console.log("每次添加数据后")
      console.log(this.tempParamTable);
    },
    /* 多选interface表row */
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    // 文件状态改变时的钩子
    fileChange (file, fileList) {
      this.fileList.push(file.raw);
    },
    // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
    beforeUploadFile (file) {
      let extension = file.name.substring(file.name.lastIndexOf('.') + 1);
      let size = file.size / 1024 / 1024;
      if (extension !== 'xlsx') {
        this.$message.warning('只能上传后缀是.xlsx的文件');
      }
      if (size > 10) {
        this.$message.warning('文件大小不得超过10M');
      }
    },
    // 文件超出个数限制时的钩子
    exceedFile (files, fileList) {
      this.$message.warning(`只能选择 ${this.limitNum} 个文件，当前共选择了 ${files.length + fileList.length} 个`);
    },
    // 文件上传成功时的钩子
    handleSuccess (res, file, fileList) {
      this.$message.success('文件上传成功');
    },
    // 文件上传失败时的钩子
    handleError (err, file, fileList) {
      this.$message.error('文件上传失败');
    },
    UploadUrl: function () {
      // 因为action参数是必填项，我们使用二次确认进行文件上传时，直接填上传文件的url会因为没有参数导致api报404，所以这里将action设置为一个返回为空的方法就行，避免抛错
      return ""
    },
    downLoadExcelTabVisiable () {
      var data = {
        interfaceName: "planInfo"
      }
      axios.post("/api/excelUtil/exportExcel", data, { responseType: 'arraybuffer' }).then(res => {
        // 处理返回的文件流
        // let blob = new Blob([res.data], {type: "application/vnd.ms-excel"}); 

        // let objectUrl = URL.createObjectURL(blob); 

        // window.location.href = objectUrl; 
        const content = res.data;
        const blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
        var date = "表格数据模板" +
          new Date().getFullYear() +
          "" +
          (new Date().getMonth() + 1) +
          "" +
          new Date().getDate();
        const fileName = date + name + ".xls";
        if ("download" in document.createElement("a")) {
          // 非IE下载
          const elink = document.createElement("a");
          elink.download = fileName;
          elink.style.display = "none";
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
        } else {
          // IE10+下载
          navigator.msSaveBlob(blob, fileName);
        }
      })


      // .then(
      //   response => {
      //     if (this.isRequestSuccess(response)) {
      //       this.$message.success('导出成功');
      //       this.fileList = [];
      //       this.getInterfaceTableData();
      //     } else {
      //       this.$message.success('导出失败');
      //     }
      //   }
      // )
    },
    uploadFile () {
      if (this.fileList.length === 0) {
        this.$message.warning('请上传文件');
      } else {
        let form = new FormData();
        for (let i = 0; i < this.fileList.length; i++) {
          form.append('file' + (i + 1), this.fileList[i]);
        }
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data;boundary = ' + new Date().getTime()
          }
        }
        axios.post("/api/excelUtil/importExcel", form, config).then(
            response => {
              if (this.isRequestSuccess(response)) {
                this.$message.success('导入成功');
                this.fileList = [];
                this.getAllServerInterfaceInfo();
              } else {
                this.$message.success('导入失败');
              }
            }
        )
      }
      this.uploadExcelTabVisiable = false;
    },
    cancelUpload () {
      this.uploadExcelTabVisiable = false;
      if (this.fileList.length != 0) {
        this.fileList = [];
      }
    },
    // 判断请求是否成功
    isRequestSuccess (data) {
      var res = JSON.stringify(data.data);
      var result = JSON.parse(res);
      if (result.result == "SUCCESS") {
        return true;
      } else {
        return false;
      }
    },
    // 获取接口表数据
    getInterfaceTableData () {
      axios.get(
        '/interfaceCtrl/interface/findAll'
      ).then(response => {
        this.tableData = response.data;
      });
    },
    handleEdit (index, row) {
      // TODO
      console.log(index, row);
    },
    handleDelete (index, row) {
      var arr = [];
      var data = {
        interfaceConfigId: row.interfaceId
      }
      arr.push(data);
      this.doDeleteInterfaceRow(arr);
      this.dialogTableVisible = false;
    },
    /* 删除接口表一行数据 */
    doDeleteInterfaceRow (arr) {
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
    btnAddPlanInfo () {
      if (this.multipleSelection.length == 0) {
        this.$alert("请先选择一个接口数据", "提示", {
          confirmButtonText: "确定",
        });
      } else {
        this.addDialogVisible = true;
      }
    },
    // 基于一个计划信息接口模板, 添加一个计划信息接口，
    addPlanInfo () {
      var requestData = this.interfaceData;
      requestData.interfaceType = "计划信息";
      for (const v of this.multipleSelection) {
        requestData.interfaceId = v.interfaceId;
      }
      axios.post('interfaceCtrl/planInfo/create', requestData);
      this.$message.success('新增成功');
      // 重置formData
      this.interfaceData = {}
      this.addDialogVisible = false;
    },
    // 添加一个接口  数据库方式的方法
    addServerInterfaceConfig () {
      var data = {
        interfaceType: this.interfaceData.interfaceType,
        interfaceName: this.interfaceData.interfaceName,
        currentMode: this.currentMode,
      }
      axios.post('/interfaceCtrl/interface/server/add', data).then(
        response => {
          if (this.isRequestSuccess(response)) {
            this.$message.success('创建成功');
            this.getAllServerInterfaceInfo();
          } else {
            this.$message.success('创建失败');
          }
        }
      )
      // 重置formData
      this.interfaceData = {}
      this.dialogTableVisible = false;
    },
    // 缓存方式的方法
    addInterfaceConfig () {
      var data = {
        interfaceType: this.interfaceData.interfaceType,
        interfaceName: this.interfaceData.interfaceName,
      }
      console.log("上送到是：", data.currentMode)
      axios.post('/interfaceCtrl/interface/add', data).then(
        response => {
          if (this.isRequestSuccess(response)) {
            this.$message.success('创建成功');
            this.getInterfaceTableData();
          } else {
            this.$message.success('创建失败');
          }
        }
      )
      // 重置formData
      this.interfaceData = {}
      this.dialogTableVisible = false;
    },
    addClientInterface () {
      var data = {};
      data.requestType = this.requestType;
      data.clientInterface = this.clientInterfaceForm;
      data.clientInterface.currentMode = this.currentMode;
      data.clientInterface.requestMethod = this.clientInterfaceForm.currentSelect;
      axios.post('/interfaceCtrl/interface/save', data).then(
        res => {
          this.getAllInterfaceInfo();
        }
      );
      this.clientInterfaceVisible = false;
      this.clientInterfaceForm = {}
    },
    getAllInterfaceInfo () {
      var data = {};
      data.interfaceType = this.requestType
      axios.post('/interfaceCtrl/interface/getAllInterfaceInfo', data).then(
        res => {
          this.clientInterfaceTable = res.data;
        }
      );
    },
    getAllServerInterfaceInfo () {
      var data = {};
      data.currentMode = this.currentMode
      axios.post('/interfaceCtrl/interface/getAllServerInterfaceInfo', data).then(
        res => {
          this.tableData = res.data;
        }
      );
    },
    btnConfigRequest () {
      if (this.multipleSelection.length != 1) {
        this.$alert("请先选择一个接口数据", "提示", {
          confirmButtonText: "确定",
        });
      } else {
        this.requestConfigDialog = true;
      }
    },
    // 保存配置请求
    saveConfigRequest () {
      var data = {
        configList: this.configTableData,
        id: this.multipleSelection[0].id
      }
      console.log("configList" + data.configList)
      axios.post('/interfaceCtrl/request/config/save', data).then(
        res => {
          if (this.isRequestSuccess(res)) {
            this.$message.success('保存成功');
            this.getAllInterfaceInfo();

          } else {
            this.$message.success('保存失败');
          }
        }
      );
      this.requestConfigDialog = false;
      this.configTableData = [];
    },
    cancel () {
      this.requestConfigDialog = false;
      this.configTableData = [];
    },
    // 添加一行配置项 todo config表单
    addConfigRow () {
      if (this.configForm != {}) {
        this.configTableData.push(this.configForm);
      }
      this.configForm = {}
    }
  },
  watch: {
    // editModeEnabled(val) {
    //   if (val) {
    //     this.tempParamTable = this.copyArray(this.paramTable);
    //   }
    // },
    currentMode (val) {
      if (val == "client") {
        this.getAllInterfaceInfo();
      } else if (val == "server") {
        this.getAllServerInterfaceInfo();
      }
    },
    requestType (val) {
      this.clientInterfaceTable = [];
      if (this.requestType != null) {
        this.getAllInterfaceInfo();
      }
    }
  },
  computed: {
    selectTitle: function () {
      if (this.requestType == 'HTTP') {
        return '请求形式'
      }
    },
    selectOption: function () {
      if (this.requestType == 'HTTP') {
        return this.requestMethodOpt;
      }
    },
    clientInterfaceOpt: function () {
      if (this.requestType == 'HTTP') {
        return this.httpInterfaceOpt;
      } else if (this.requestType == 'TCP') {
        return this.tcpInterfaceOpt;
      }
    },
  }
}
</script>