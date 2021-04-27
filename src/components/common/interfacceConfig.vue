<template>
  <el-card class="el-card-custom"
           header="接口配置">
    <div style="margin-bottom: 20px">
      <el-button @click="dialogTableVisible = true"
                 type="primary">新增</el-button>
      <el-button type="primary">导入</el-button>
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
        <template >
          <el-button size="mini"
                     type="info"
                     @click="view()">查看</el-button>
        </template>
      </el-table-column>

      <el-table-column label="输出"
                       width="180">
        <template >
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
          <el-input v-model="interfaceId"></el-input>
        </el-form-item>
        <el-form-item label="接口名称">
          <el-input v-model="interfaceName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogTableVisible = false">取消</el-button>
          <el-button type="primary"
                     @click="addInterfaceConfig()">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-card>

</template>

<script>
export default {
  name: 'FormDialog',
  data () {
    return {
      dialogTableVisible: false, // 添加用户弹框
      // 控制是否显示
      dialogFormVisible: false,
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
        // },
        // {
        //   label: '输入',
        //   prop: 'input'
        // },
        // {
        //   label: '输出',
        //   prop: 'output'
        // },
        // {
        //   label: '操作',
        //   prop: 'operation'
        // }
      ],
      tableData: [
      ],
      formData: {},
      formDesc: {
        name: {
          type: 'input',
          label: '姓名'
        },
        date: {
          type: 'date',
          label: '年龄',
          valueFormatter (value) {
            const date = new Date(value * 1000)
            return date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate()
          }
        },
        address: {
          type: 'input',
          label: '地址'
        }
      },
    }
  },
  mounted () {
    this.$axios({
      method: "get",
      url: "http://localhost:7090/main/interface/findAll",
    
    }.then(response => {
        this.tableData = response;
        })
    )
  },
  methods: {
    handleEdit (index, row) {
      // TODO
      console.log(index, row);
    },
    handleDelete (index, row) {
      // TODO
      console.log(index, row);
    },
    handleSubmit (data) {
      // 模拟异步请求
      return new Promise((resolve) => {
        resolve(data)
      })
    },
    addInterfaceConfig () {

      this.$axios({
        method: "post",
        url: "http://localhost:7090/main/interface/add", // 接口地址
        data: {
          id: this.interfaceId,
          name: this.interfaceName
        }
      })
        .then(response => {
          console.log(response, "success");   // 成功的返回      
        })
        .catch(error => console.log(error, "error")); // 失败的返回



      var data = {};
      data.interfaceId = this.interfaceId;
      data.interfaceName = this.interfaceName;
      this.handleSuccess(data);
    },
    handleSuccess (data) {
      this.tableData.push(data)
      // 关闭弹窗

      this.dialogTableVisible = false
      // 重置formData
      this.formData = {}
      this.$message.success('创建成功')
    }
  }
}
</script>