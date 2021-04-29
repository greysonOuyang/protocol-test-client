<template>
  <div>
    <!--添加按钮-->
    <el-button type="primary" @click="addData">添加接口</el-button>
    <!--表格-->
    <el-table
            :data="tableData"
            border
            style="width: 100%">
      <el-table-column
              fixed
              prop="date"
              label="日期"
              width="150">
      </el-table-column>
      <el-table-column
              prop="name"
              label="姓名"
              width="120">
      </el-table-column>
      <el-table-column
              prop="province"
              label="省份"
              width="120">
      </el-table-column>
      <el-table-column
              prop="city"
              label="市区"
              width="120">
      </el-table-column>
      <el-table-column
              prop="address"
              label="地址"
              width="300">
      </el-table-column>
      <el-table-column
              prop="zip"
              label="邮编"
              width="120">
      </el-table-column>
      <el-table-column
              fixed="right"
              label="操作"
              width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="updateData(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--对话框-->
    <el-dialog :title="titleMap[dialogTitle]" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="日期" :label-width="formLabelWidth">
          <el-date-picker
                  v-model="form.date"
                  type="date"
                  value-format="yyyy-MM-dd"        
                  placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="省份" :label-width="formLabelWidth">
          <el-input v-model="form.province" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="市区" :label-width="formLabelWidth">
          <el-input v-model="form.city" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="地址" :label-width="formLabelWidth">
          <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="邮编" :label-width="formLabelWidth">
          <el-input v-model="form.zip" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
    export default {
        data(){
            return{
                tableData: [{
                    date: '2016-05-02',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1518 弄',
                    zip: 200333
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1517 弄',
                    zip: 200333
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1519 弄',
                    zip: 200333
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    province: '上海',
                    city: '普陀区',
                    address: '上海市普陀区金沙江路 1516 弄',
                    zip: 200333
                }],
                titleMap : {
                    addData : "添加数据",
                    updateData : "修改数据"
                },
                dialogTitle : "",
                dialogFormVisible : false,
                formLabelWidth : '120px',
                form : {},
            }
        },
        methods : {
            addData(){
                this.form = {};
                this.dialogFormVisible = true;
                this.dialogTitle = "addData";
            },
            updateData(row){
                this.dialogFormVisible = true;
                this.dialogTitle = "updateData";
                this.form = row;
            },
            submit(){
                this.dialogFormVisible = false;
                if (this.dialogTitle == "addData") {
                    console.log(this.form);
                    alert("向服务器发送添加的请求！");
                } else {
                    console.log(this.form);
                    alert("向服务器发送修改的请求！");
                }
            }
        }
    }
</script>