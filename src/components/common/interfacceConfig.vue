<template>
  <div>

    <el-card class="el-card-port">
      <el-form-item label="端口"
                    style="width: 80%; margin-left: 0px">
        <el-input v-model="port"></el-input>
      </el-form-item>
    </el-card>

    <el-card class="el-card-custom"
             header="接口配置">
      <div style="margin-bottom: 20px">
        <el-button @click="dialogTableVisible = true"
                   type="primary"
                   size="mini">新增</el-button>
        <el-button type="primary"
                   icon="el-icon-plus"
                   size="mini"
                   @click="handleAddDetails">添加</el-button>
        <el-button type="success"
                   icon="el-icon-delete"
                   size="mini"
                   @click="handleDeleteDetails">删除</el-button>
        <el-button type="primary"
                   size="mini"
                   @click="uploadExcelTabVisiable = true">导入</el-button>
        <el-button type="primary"
                   size="mini">导出</el-button>
      </div>
      <!-- 接口表 -->
      <el-table :data="tableData"
                border
                highlight-current-row
                style="width: 100%"
                @row-click="openDetails"
                :row-class-name="rowClassName"
                ref="tb"
                @current-change="handleCuurntChange"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection"
                         width="55">
        </el-table-column>
        <el-table-column label="序号"
                         align="center"
                         prop="index"
                         width="50">
        </el-table-column>
        <el-table-column prop="interfaceId"
                         label="接口Id"></el-table-column>
        <el-table-column prop="interfaceName"
                         label="接口名称"></el-table-column>
        <el-table-column label="输入"
                         width="140">
          <template>
            <el-button size="mini"
                       type="info"
                       @click="view()">查看</el-button>
          </template>
        </el-table-column>

        <el-table-column label="输出"
                         width="140">
          <template>
            <el-button size="mini"
                       type="info"
                       @click="view()">查看</el-button>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="primary"
                       icon="el-icon-edit"
                       @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini"
                       type="danger"
                       icon="el-icon-delete"
                       @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
      <!-- 分页 -->
      <div class="block"
           style="text-align: right">
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage1"
                       :page-sizes="[10, 20, 30, 40]"
                       :page-size="10"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="tableData.length"></el-pagination>
      </div>

      <!-- 添加用户弹框 -->
      <el-dialog title="添加接口"
                 :visible.sync="dialogTableVisible"
                 :close-on-click-modal="false">
        <el-form>
          <el-form-item label="接口ID">
            <el-input v-model="interfaceData.interfaceId"></el-input>
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
                   @click="uploadExcelTabVisiable = false">取消</el-button>
      </el-dialog>
    </el-card>
    <el-form-item style="text-align: right">
      <el-button type="primary"
                 @click="submit()">启动服务端</el-button>
    </el-form-item>
    <!-- 参数表 -->
    <el-card :header="paramHeader"
             v-model="paramHeader"
             class="el-card-custom">
      <el-table :data="paramTable"
                border
                stripe
                style="width: 100%；margin-top: 100px">
        <el-table-column :key="item.prop"
                         :label="item.label"
                         :prop="item.prop"
                         :width="item.width"
                         v-for="item of paramDataOpt"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'interfacceConfig',
  components: {

  },
  mounted () {
    this.getInterfaceTableData();
  },

  data () {
    return {
      /** 当前选中行 */
      currentRow: null,
      paramHeader: '输出参数',
      //选中的从表数据
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
          prop: "paramName",
          label: "参数名称",
        },
        {
          prop: "paramLength",
          label: "参数长度",
        }, {
          prop: "fieldType",
          label: "参数类型",
        },
        {
          prop: "paramValue",
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
    openDetails (row, event, column) {
      console.log("输出rowID:")
      console.log(row.id);
    },
    // 启动服务端
    submit () {
      var ovj = JSON.stringify(this.currentRow);
      console.log("当前端口是：" + this.port);
      var requestData = {
        port: this.port,
        interfaceId: this.currentRow.interfaceId
      }
      console.log(this.requestData)
      axios.post('/main/start/server', requestData).then(res => {

      })
    },
    /**
     * 选中多行
     */
    handleDeleteDetails () {
      if (this.checkedDetail.length == 0) {
        this.$alert("请先选择要删除的数据", "提示", {
          confirmButtonText: "确定",
        });
      } else {
        // this.handleDelete(scope.$index, scope.row)
        this.tableData.splice(this.checkedDetail[0].index - 1, 1);
      }
    },
    /**
     * 选中单行
     */
    handleCuurntChange (val) {
      this.currentRow = val;
      var data = JSON.stringify(val);
      this.requestData.interfaceId = this.currentRow.getInterfaceId;
      console.log("当前行是：")
    },
    handleAddDetails () {
      if (this.tableData == undefined) {
        this.tableData = new Array();
      }

      this.tableData.push({
        interfaceId: '',
        interfaceName: ''
      });
    },
    rowClassName ({ row, rowIndex }) {

      row.index = rowIndex + 1;
    },
    handleSizeChange: function (pageSize) {
      this.pageSize = pageSize;
      this.handleCurrentChange(this.currentPage1);
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage1 = currentPage;
      this.currentChangePage(this.tableData, currentPage);
    },
    currentChangePage (list, currentPage) {
      let from = (currentPage - 1) * this.pageSize;
      let to = currentPage * this.pageSize;
      this.pageList = [];
      for (; from < to; from++) {
        if (list[from]) {
          this.pageList.push(list[from]);
        }
      }
    },
    handleSelectionChange (selection) {
      if (selection.length > 1) {
        this.$refs.tb.clearSelection();
        this.$refs.tb.toggleRowSelection(selection.pop());
      } else {
        this.checkedDetail = selection;
      }
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
        axios.post("/api/excelUtil/importExcel", form, config);
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
        this.currentChangePage(this.tableData, 1);
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
      axios.post('/main/interface/delete', arr).then(
        response => {
          if (this.isRequestSuccess(response)) {
            this.$message.success('删除成功');
            this.getInterfaceTableData();
          } else {
            this.$message.success('删除失败');
          }
        }
      )

      this.dialogTableVisible = false;
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
  // 获取参数表数据
  getParamTableData () {
    axios.get(
      '/main/interface/findAll'
    ).then(response => {
      this.paramTable = eval(JSON.stringify(response.data));
    });
  }
}
</script>