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
import axios from 'axios';

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
      ],
      tableData: [],
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
  created () {
    this.getInterfaceTableData();

  },
  methods: {
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
      var data = {
        interfaceId: this.interfaceId,
        interfaceName: this.interfaceName
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

      this.dialogTableVisible = false;
    },
    handleSuccess (data) {
      this.tableData.push(data)
      // 关闭弹窗

      this.dialogTableVisible = false;
      // 重置formData
      this.formData = {}
      this.$message.success('创建成功');
    }
  }
}
</script>