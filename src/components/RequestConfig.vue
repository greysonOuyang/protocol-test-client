<template>

  <el-card class="el-card-custom">
    <el-form v-if="clientInterfaceOpt != null && clientInterfaceOpt.length !== 0">
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

      <el-form-item>
        <el-button @click="requestDialogVisible = true"
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
    </el-form>



      <!-- 请求配置表格 -->
      <el-table :data="requestTable"
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
        <el-table-column
            label="请求配置"
            v-if="requestType === 'TCP'"
                         width="110"
                         align='center'>
          <template slot-scope="scope">
            <el-button size="mini"
                       type="info"
                       @click="configTableVisible = true;">查看
            </el-button>
          </template>
        </el-table-column>

      </el-table>

    <el-dialog title="新增请求"
               :visible.sync="requestDialogVisible"
               :close-on-click-modal="false">
      <el-form v-model="requestForm">
        <el-form-item v-if="this.requestType === 'HTTP'"
                      :label="selectTitle">
          <el-select v-model="requestForm.requestMethod"
                     placeholder="请选择">
            <el-option v-for="item in selectOption"
                       :key="item.prop"
                       :label="item.label"
                       :value="item.prop">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="子协议"
                      v-if="this.requestType === 'TCP'">
          <el-select v-model="requestForm.protocolType"
                     placeholder="请选择">
            <el-option v-for="item in protocolTypeOpt"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请求名称">
          <el-input v-model="requestForm.requestName"></el-input>
        </el-form-item>
        <el-form-item label="端口"
                      v-if="this.requestType === 'TCP'">
          <el-input v-model="requestForm.port"></el-input>
        </el-form-item>
        <el-form-item label="请求地址">
          <el-input v-model="requestForm.address"></el-input>
        </el-form-item>
        <el-form-item label="请求内容">
          <el-input v-model="requestForm.content"
                    type="textarea"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="addRequest()">确定
          </el-button>
          <el-button @click="requestDialogVisible = false">取消</el-button>
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
          <el-form-item label="配置Key">
            <el-input placeholder="请输入英文单词,建议驼峰命名"
                      v-model="configForm.configKey"></el-input>
          </el-form-item>
          <el-form-item label="配置名称">
            <el-input v-model="configForm.configName"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
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
          <el-form-item v-if="configForm.configType !== 'input'"
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

    <el-dialog :visible.sync="configTableVisible"
               title="请求配置表">
      <el-table border
                :data="clientConfigTableData">
        <el-table-column v-for="item in ConfigOpt"
                         :prop="item.key"
                         :label="item.label"
                         :key="item.key">
        </el-table-column>
      </el-table>
    </el-dialog>
  </el-card>
</template>

<script>
import axios from "axios";
import EditableCell from "./common/EditeableCell";
import global from "../Global";


export default {
  name: 'requestConfig',
  components: {
    EditableCell,
  },
  data() {
    return {
      requestDialogVisible: false,
      protocolTypeOpt: global.protocolTypeOpt,
      requestForm: {},
      // 表格是否支持编辑
      editModeEnabled: false,
      // 隐藏接口Id列
      idShow: false,
      // 请求表数据
      requestTable: [],
      // 当前选择的要展示的列表的请求类型
      requestType: 'HTTP',
      // 请求配置弹窗
      requestConfigDialog: false,
      // 表单配置项数据
      configTableData: [],
      // 选中多行
      multipleSelection: [],
      // 是否展示配置请求表
      configTableVisible: false,
      clientConfigTableData: [],
      configForm: {},
      // 配置项
      ConfigOpt: [
        {
          key: 'configId',
          label: '配置Id'
        }, {
          key: 'requestId',
          label: '请求Id'
        }, {
          key: 'configKey',
          label: '配置Key'
        }, {
          key: 'configName',
          label: '配置名称'
        }, {
          key: 'configType',
          label: '配置类型'
        }, {
          key: 'selectionId',
          label: '选项Id'
        }, {
          key: 'configValue',
          label: '对应值'
        },
      ],
      configTypeOpt: [
        {
          prop: 'select',
          label: '下拉框'
        }, {
          prop: 'input',
          label: '输入框'
        },
      ],
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
    }
  },
  methods: {
    addRequest() {
      axios.post('/request/save', this.requestForm).then(
          res => {
            this.getRequestData();
          }
      );
      this.clientInterfaceVisible = false;
      this.requestForm = {}
    },
    getRequestData () {
      axios.get('/request/find/list/by/type', {params: {requestType: this.requestType}}).then(
          res => {
            this.requestTable = res.data;
          }
      );
    },
    /* 多选interface表row */
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleOneCol(val) {
      this.clientConfigTableData = val.configList;
    },
    clearInterfaceConfig() {
      this.$confirm('接口配置不易，请主人三思而后行，真的要清空嘛?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() =>
          axios.get('/interfaceCtrl/interface/delAllInterfaceInfo', {params: {'requestType': this.requestType}}).then(
              response => {
                if (this.isRequestSuccess(response)) {
                  this.$message.success('清空成功！');
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
    delConfigInterface() {
      if (this.multipleSelection.length === 0) {
        this.$alert("请先选择要删除的数据", "提示", {
          confirmButtonText: "确定",
        });
      } else {
        axios.post('/interfaceCtrl/interface/delInterfaceConfig', this.multipleSelection).then(
            response => {
              if (this.isRequestSuccess(response)) {
                this.$message.success('删除成功');
                this.getAllInterfaceInfo();
              } else {
                this.$message.error('删除失败');
              }
            }
        );
        this.tableData.splice(this.multipleSelection[0].index - 1, 1);
      }
    },
    btnConfigRequest() {
      if (this.multipleSelection.length !== 1) {
        this.$alert("请先选择一个接口数据", "提示", {
          confirmButtonText: "确定",
        });
      } else {
        this.requestConfigDialog = true;
      }
    },
    // 保存配置请求
    saveConfigRequest() {
      const data = {
        configList: this.configTableData,
        id: this.multipleSelection[0].id
      };
      console.log("configList" + data.configList)
      axios.post('config/save', data).then(
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
    cancel() {
      this.requestConfigDialog = false;
      this.configTableData = [];
    },
    // 添加一行配置项 todo config表单
    addConfigRow() {
      if (this.configForm !== {}) {
        this.configTableData.push(this.configForm);
      }
      this.configForm = {}
    }
  },
  computed: {
    selectTitle: function () {
      if (this.requestType === 'HTTP') {
        return '请求形式'
      }
    },
    selectOption: function () {
      if (this.requestType === 'HTTP') {
        return [
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
        ];
      }
    },
    clientInterfaceOpt: function () {
      let opt = [{
        prop: "requestName",
        label: "请求名称",
      },{
          prop: "address",
          label: "请求地址",
        }, {
          prop: "content",
          label: "请求内容",
        }];
      if (this.requestType === 'HTTP') {
        opt.push(  {
          prop: "requestMethod",
          label: "请求方式",
        })
        return opt;
      } else if (this.requestType === 'TCP') {
        opt.push({
              prop: "port",
              label: "端口",
            },
            {
              prop: "protocolType",
              label: "子协议",
            });
        return opt;
      } else {
        return opt;
      }
    },
  }
}
</script>