<template>
  <div id="main">
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
        <el-table-column prop="description"
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
      <!-- 添加用户弹框 -->
      <el-dialog title="新增接口"
                 :visible.sync="dialogTableVisible"
                 :close-on-click-modal="false">
        <el-form>
          <!-- 请求类型选择 -->
          <el-form-item label="消息类型">
            <el-select v-model="interfaceData.messageTypeId"
                       placeholder="请选择">
              <el-option v-for="item in MessageTypeOpt"
                         :key="item.messageTypeId"
                         :label="item.messageDescription"
                         :value="item.messageTypeId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="接口名称">
            <el-input v-model="interfaceData.interfaceName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       @click="addInterface()">确定
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
        <br/>
        <el-button size="small"
                   type="primary"
                   @click="uploadFile">立即上传
        </el-button>
        <el-button size="small"
                   @click="cancelUpload()">取消
        </el-button>
      </el-dialog>
    </el-card>
    <param-config ref="paramConfigRef" paramTabVisible="paramTabVisible"></param-config>
  </div>
</template>
<script>
import axios from "axios";
import ParamConfig from "./ParamConfig";

export default {
  name: "projectConfig",
  props: ['currentProject', 'messageType'],
  components: {
    ParamConfig
  },
  created() {
  },
  watch: {
    // currentProject(val) {
    //   this.getInterfaceTableData(val);
    // },
  },
  data() {
    return {
      MessageTypeOpt: {},
      dialogTableVisible: false,
      uploadExcelTabVisiable: false,
      addDialogVisible: false,
      // 添加接口表单
      interfaceData: {},
      // 隐藏接口Id列
      idShow: false,
      // 接口表数据
      tableData: [],
      /** excel上传相关 */
      // 上传excel文件列表
      file: null,
      limitNum: 5,
      // 文件列表
      fileList: [],
      paramTabVisible: false,
      // 选中多行
      multipleSelection: [],
    }
  },
  methods: {
    getMessageTypeOpt(messageBelongId) {
      axios.get('/message/type/find/opt/list', {params: {messageBelongId: messageBelongId}}).then(res => {
        this.MessageTypeOpt = res.data;
      });
    },
    btnAddPlanInfo() {
      if (this.multipleSelection.length === 0) {
        this.$alert("请先选择一个接口数据", "提示", {
          confirmButtonText: "确定",
        });
      } else {
        this.addDialogVisible = true;
      }
    },
    // 基于一个计划信息接口模板, 添加一个计划信息接口，
    addPlanInfo() {
      const requestData = this.interfaceData;
      requestData.interfaceType = "计划信息";
      for (const v of this.multipleSelection) {
        requestData.interfaceId = v.interfaceId;
      }
      axios.post('paramCtrl/planInfo/create', requestData).then(
          response => {
            if (this.isRequestSuccess(response)) {
              this.$message.success('创建成功');
              this.getAllServerInterfaceInfo();
            } else {
              this.$message.info('创建失败');
            }
          });
      this.$message.success('新增成功');
      // 重置formData
      this.interfaceData = {}
      this.addDialogVisible = false;
    },
    downLoadExcelTabVisiable() {
      const data = {
        interfaceName: "planInfo"
      };
      axios.post("/api/excelUtil/exportExcel", data, {responseType: 'arraybuffer'}).then(res => {
        // 处理返回的文件流
        const content = res.data;
        const blob = new Blob([res.data], {type: "application/vnd.ms-excel"});
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
    },
    uploadFile() {
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
    cancelUpload() {
      this.uploadExcelTabVisiable = false;
      if (this.fileList.length !== 0) {
        this.fileList = [];
      }
    },
    /**
     * 选中多行删除  服务端删除
     */
    handleDeleteMulti() {
      if (this.multipleSelection.length === 0) {
        this.$alert("请先选择要删除的数据", "提示", {
          confirmButtonText: "确定",
        });
      } else {
        axios.post('/interfaceCtrl/interface/delServerInterfaceConfig', this.multipleSelection).then(
            response => {
              if (this.isRequestSuccess(response)) {
                this.$message.success('删除成功');
                this.getAllServerInterfaceInfo();
              } else {
                this.$message.error('删除失败');
              }
            }
        );
        this.tableData.splice(this.multipleSelection[0].index - 1, 1);
      }
    },
    handleClearMulti() {
      this.$confirm('接口配置不易，请主人三思而后行，真的要清空嘛?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() =>
          axios.post('/interface/deleteAll').then(
              res => {
                this.$message.success('清空成功');
                // this.getInterfaceTableData();
              }
          ).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          }))
    },
    // 添加一个接口  数据库方式的方法
    addInterface() {
      this.interfaceData.currentProject = this.currentProject
      axios.post('/interface/save', this.interfaceData).then(
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
    selectCurrentCol(val) {
      this.interfaceIdInEdit = val.interfaceId;
    },
    /* 多选interface表row */
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    viewOutPut(index, row) {
      this.paramTabVisible = true;
      this.paramHeader = '输出参数';
      this.paramType = 'output';
      this.$refs.paramConfigRef.getParamTable(index, this.paramType)

    },
    viewInPut(index, row) {
      this.paramTabVisible = true;
      this.paramHeader = '输入参数';
      this.paramType = 'input';
      this.$refs.paramConfigRef.getParamTable(index, this.paramType)
    },
    handleDelete(index, row) {
      var arr = [];
      var data = {
        interfaceConfigId: row.interfaceId
      }
      arr.push(data);
      axios.post('/interface/del/list', arr).then(
          response => {
            if (this.isRequestSuccess(response)) {
              this.$message.success('删除成功');
              this.getAllServerInterfaceInfo();
            } else {
              this.$message.error('删除失败');
            }
          }
      );
      this.dialogTableVisible = false;
    },
    getAllServerInterfaceInfo() {
      const data = {};
      data.currentMode = this.currentMode
      axios.post('/find/list/by/projectId', data).then(
          res => {
            this.tableData = res.data;
          }
      );
    },
    // 文件状态改变时的钩子
    fileChange(file, fileList) {
      this.fileList.push(file.raw);
    },
    // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
    beforeUploadFile(file) {
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
    exceedFile(files, fileList) {
      this.$message.warning(`只能选择 ${this.limitNum} 个文件，当前共选择了 ${files.length + fileList.length} 个`);
    },
    // 文件上传成功时的钩子
    handleSuccess(res, file, fileList) {
      this.$message.success('文件上传成功');
    },
    // 文件上传失败时的钩子
    handleError(err, file, fileList) {
      this.$message.error('文件上传失败');
    },
    UploadUrl: function () {
      // 因为action参数是必填项，我们使用二次确认进行文件上传时，直接填上传文件的url会因为没有参数导致api报404，所以这里将action设置为一个返回为空的方法就行，避免抛错
      return ""
    },
  },
}
</script>