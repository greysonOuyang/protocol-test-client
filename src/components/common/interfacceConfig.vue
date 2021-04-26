<template>
  <el-card class="el-card"
           header="接口配置"
           shadow="never">
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
        <template slot-scope="scope">
          <span class="el-tag el-tag--info el-tag--mini"
                style="cursor: pointer;"
                @click="pwdChange(scope.row,scope.$index,true)">
            查看
          </span>

        </template>
      </el-table-column>
      <el-table-column label="输出"
                       width="180">
        <template slot-scope="scope">
          <span class="el-tag el-tag--info el-tag--mini"
                style="cursor: pointer;"
                @click="pwdChange(scope.row,scope.$index,true)">
            查看
          </span>

        </template>
      </el-table-column>
      <el-table-column label="操作"
                       width="200">

        <template slot-scope="scope">
          <span class="el-tag el-tag--info el-tag--mini"
                style="cursor: pointer;"
                @click="pwdChange(scope.row,scope.$index,true)">
            {{scope.row.isSet?'保存':"修改"}}
          </span>
          <span v-if="!scope.row.isSet"
                class="el-tag el-tag--danger el-tag--mini"
                style="cursor: pointer;">
            删除
          </span>
          <span v-else
                class="el-tag  el-tag--mini"
                style="cursor: pointer;"
                @click="pwdChange(scope.row,scope.$index,false)">
            取消
          </span>
        </template>
      </el-table-column>
    </el-table>

    <el-table :data="paramData"
              border
              stripe
              style="width: 100%；margin-top: 30px">
      <el-table-column :key="item.prop"
                       :label="item.label"
                       :prop="item.prop"
                       :width="item.width"
                       v-for="item of paramDataOpt"></el-table-column>
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
      paramData: "",
      dialogTableVisible: false, // 添加用户弹框
      // 控制是否显示
      dialogFormVisible: false,
      interfaceId: "",
      interfaceName: "",
      paramDataOpt: [{
        prop: "paramName",
        label: "参数名称",
      }, {
        prop: "paramLength",
        label: "参数长度",
      }, {
        prop: "paramValue",
        label: "参数值",
      }],
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
        {
          interfaceId: '1',
          interfaceName: '计划信息'
        }
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
  methods: {
    handleSubmit (data) {
      // 模拟异步请求
      return new Promise((resolve) => {
        resolve(data)
      })
    },
    addInterfaceConfig () {
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