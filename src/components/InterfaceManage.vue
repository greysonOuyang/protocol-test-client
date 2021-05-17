<template>
  <div id="interfaceConfig">
    <el-card class="el-card-custom"
             header="接口配置">
      <div style="margin-bottom: 20px">
        <el-button @click="dialogTableVisible = true"
                   type="primary"
                   icon="el-icon-plus"
                   size="mini">新增</el-button>
        <el-button type="danger"
                   icon="el-icon-delete"
                   size="mini"
                   @click="handleDeleteMulti">删除</el-button>
        <el-button type="primary"
                   size="mini"
                   icon="el-icon-upload2"
                   @click="uploadExcelTabVisiable = true">导入</el-button>
        <el-button type="primary"
                   icon="el-icon-download"
                   size="mini">导出</el-button>
        <el-button type="success"
                   icon="el-icon-delete"
                   size="mini"
                   @click="handleClearMulti">清空</el-button>
      </div>
      <!-- 接口表 -->
      <el-table :data="tableData"
                border
                highlight-current-row
                style="width: 100%"
                @row-click="openDetails"
                ref="tb"
                @current-change="selectCurrentCol"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection"
                         width="60">
        </el-table-column>
        <el-table-column label="序号"
                         align="center"
                         prop="index"
                         width="60">

        </el-table-column>
        <el-table-column prop="interfaceId"
                         label="接口Id"
                         width="200"
                         align='center'></el-table-column>
        <el-table-column prop="interfaceName"
                         label="接口名称"
                         width="200"
                         align='center'></el-table-column>
        <el-table-column label="输入"
                         width="150"
                         align='center'>
          <template slot-scope="scope">
            <el-button size="mini"
                       type="info"
                       @click="viewInPut(scope.$index, scope.row)">查看</el-button>
          </template>
        </el-table-column>

        <el-table-column label="输出"
                         width="150"
                         align='center'>
          <template slot-scope="scope">
            <el-button size="mini"
                       type="info"
                       @click="viewOutPut(scope.$index, scope.row)">查看</el-button>
          </template>
        </el-table-column>

        <el-table-column label="操作"
                         width="120"
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
      <el-dialog title="添加接口"
                 :visible.sync="dialogTableVisible"
                 :close-on-click-modal="false">
        <el-form>
          <el-form-item label="接口ID">
            <el-input v-model="interfaceData.interfaceId"
                      placeholder="请填写唯一值"></el-input>
          </el-form-item>
          <el-form-item label="接口名称">
            <el-input v-model="interfaceData.interfaceName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       @click="addInterfaceConfig()">确定</el-button>
            <el-button @click="dialogTableVisible = false">取消</el-button>
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
                   @click="uploadFile">立即上传</el-button>
        <el-button size="small"
                   @click="cancelUpload()">取消</el-button>
      </el-dialog>
    </el-card>

    <!-- 参数表 -->
    <el-card :header="paramHeader"
             class="el-card-custom">
      <div style="margin-bottom: 30px">
        <el-button @click="saveParamData"
                   type="primary"
                   icon="el-icon-check"
                   size="mini">保存修改</el-button>
        <el-button type="primary"
                   size="mini"
                   @click="handleAddDetails">添加</el-button>
        <!-- <el-switch style="display: block"
                   v-model="editModeEnabled"
                   active-color="#13ce66"
                   inactive-color="#ff4949"
                   active-text="Edit enabled"
                   inactive-text="Edit disabled">
        </el-switch> -->
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
            <span slot="content">{{row[item.prop]}}</span>
          </editable-cell>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios';
import EditableCell from "./common/EditeableCell";

export default {
  name: 'server',
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
      // 当前参数表展示的参数类型
      paramType: '',
      // 启动时选择的接口 值是接口Id
      currentInterfaceId: '',
      // 修改表数据时选中的接口
      interfaceIdInEdit: '',
      editModeEnabled: false,
      /** 当前选中行 */
      paramHeader: '参数表',
      //选中多行
      multipleSelection: [],
      checkedDetail: [],
      // 启动端口
      port: '',
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
          prop: "type",
          label: "参数类型",
        },
        {
          prop: "value",
          label: "参数值",
        },
      ],
      // 参数表数据
      paramTable: [],
    }
  },
  created () {
    this.getInterfaceTableData();
    // this.getParamTableData();
  },
  methods: {
    saveParamData () {
      var requestData = {};
      requestData.interfaceId = this.interfaceIdInEdit;
      if (this.paramType == 'input') {
        requestData.input = this.paramTable
      } else if (this.paramType == 'output') {
        requestData.output = this.paramTable
      }
      axios.post('/main/param/save', requestData);
    },
    openDetails (row, event, column) {
      console.log("输出rowID:")
      console.log(row.id);
    },
    handleClearMulti () {
      this.$confirm('接口配置不易，请主人三思而后行，真的要清空嘛?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() =>
        axios.post('/main/interface/deleteAll').then(
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
     * 选中多行删除
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
            id: v.interfaceId
          }
          requestData.push(data);
        }
        this.doDeleteInterfaceRow(requestData);
        this.tableData.splice(this.multipleSelection[0].index - 1, 1);
      }
    },
    selectCurrentCol (val) {
      this.interfaceIdInEdit = val.interfaceId;
    },
    viewOutPut (index, row) {
      this.paramHeader = '输出参数';
      this.paramTable = row.output;
      this.paramType = 'output';
    },
    viewInPut (index, row) {
      this.paramHeader = '输入参数';
      this.paramTable = row.input;
      this.paramType = 'input';
    },
    handleAddDetails () {
      if (this.paramTable == undefined) {
        this.paramTable = new Array();
      }
      this.paramTable.push({
        field: '',
        length: '',
        type: '',
        value: ''
      });
    },
    /* 多选interface表row */
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    // 文件状态改变时的钩子
    fileChange (file, fileList) {
      console.log("测试")
      console.log(file.raw);
      this.fileList.push(file.raw);
      console.log(this.fileList);
    },
    // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
    beforeUploadFile (file) {
      console.log('before upload');
      console.log(file);
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
              this.getInterfaceTableData();
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
        '/main/interface/findAll'
      ).then(response => {
        this.tableData = response.data;
      });
    },
    handleEdit (index, row) {
      // TODO
      console.log(index, row);
    },
    handleDelete (index, row) {
      // start
      console.log("index", index);
      console.log("row", row);
      var arr = [];

      var data = {
        id: row.interfaceId
      }
      arr.push(data);
      console.log("arr=", arr);
      this.doDeleteInterfaceRow(arr);
      this.dialogTableVisible = false;
    },
    /* 删除接口表一行数据 */
    doDeleteInterfaceRow (arr) {
      axios.post('/main/interface/delete', arr).then(
        response => {
          if (this.isRequestSuccess(response)) {
            this.$message.success('删除成功');
            this.getInterfaceTableData();
          } else {
            this.$message.success('删除失败');
          }
        }
      );
    },
    // 添加一个接口
    addInterfaceConfig () {
      var data = {
        interfaceId: this.interfaceData.interfaceId,
        interfaceName: this.interfaceData.interfaceName
      }
      axios.post('/main/interface/add', data).then(
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
    }
  },
}
</script>