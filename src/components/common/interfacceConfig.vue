<template>
  <el-card class="el-card-custom"
           header="接口配置">
    <div style="margin-bottom: 20px">
      <el-button @click="dialogTableVisible = true"
                 type="primary">新增</el-button>
      <el-button type="primary"
                 @click="uploadExcelTabVisiable = true">导入</el-button>
      <el-button type="primary">导出</el-button>
    </div>
    <el-table :data="tableData"
              border
              stripe
              style="width: 100%">
      <el-table-column :key="desc.prop"
                       :label="desc.label"
                       :prop="desc.prop"
                       :width="desc.width"
                       v-for="desc of tableDesc"></el-table-column>

      <el-table-column label="输入"
                       width="180">
        <template>
          <el-button size="mini"
                     type="info"
                     @click="view()">查看</el-button>
        </template>
      </el-table-column>

      <el-table-column label="输出"
                       width="180">
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
                     @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini"
                     type="danger"
                     @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

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
          <el-button @click="dialogTableVisible = false">取消</el-button>
          <el-button type="primary"
                     @click="addInterfaceConfig()">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="上传Excel"
               :visible.sync="uploadExcelTabVisiable"
               :close-on-click-modal="false">
      <el-upload drag
                 class="upload-excel"
                 :auto-upload="false"
                 :action="UploadUrl()"
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

</template>

<script>
import axios from 'axios';


export default {
  name: 'interfacceConfig',
  components: {
  },
  data () {
    return {
      // 上传excel文件列表
      limitNum: 1,
      fileList: [],
      // excel组件可视
      uploadExcelTabVisiable: false,
      dialogTableVisible: false, // 添加用户弹框
      // 控制是否显示
      dialogFormVisible: false,
      interfaceData: {},
      interfaceId: "",
      interfaceName: "",

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
      tableData: [],
      formData: {},
    }
  },
  created () {
    this.getInterfaceTableData();

  },
  methods: {
    // 文件状态改变时的钩子
    fileChange (file, fileList) {
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
        form.append('file', this.fileList);
        var headers = {
            'Content-type': 'multipart/form-data'
          }
        axios.post("/api/excelUtil/importExcel",form, headers);
      }
    },
    isRequestSuccess (data) {
      var res = JSON.stringify(data.data);
      var result = JSON.parse(res);
      if (result.result == "SUCCESS") {
        return true;
      } else {
        return false;
      }
    },
    getInterfaceTableData () {
      axios.get(
        '/main/interface/findAll'
      ).then(response => {
        this.tableData = eval(JSON.stringify(response.data));
      });
    },
    handleEdit (index, row) {
      // TODO
      console.log(index, row);
    },
    handleDelete (index, row) {
      // start
      console.log("index",index);
      console.log("row",row);
      var arr = [];

      var data = {
        id: row.interfaceId
      }
      arr.push(data);
      console.log("arr=",arr);
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
      // end
      // TODO
     // console.log(index, row);
    },
    handleSubmit (data) {
      // 模拟异步请求
      return new Promise((resolve) => {
        resolve(data)
      })
    },
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
  }
}
</script>