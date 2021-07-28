<template>
 <div id="main">
   <el-card class="el-card-custom"
            header="项目配置">
     <el-form style="margin-bottom: 20px">
       <el-button @click="btnAddProject"
                  type="primary"
                  icon="el-icon-plus"
                  size="mini">新增
       </el-button>
       <el-button type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="handleDeleteMulti">删除
       </el-button>
     </el-form>

     <el-table :data="projectTable"
               border
               highlight-current-row
               style="width: 100%"
               ref="tb"
               @current-change="selectCurrentCol"
               @selection-change="handleSelectionChange">
       <el-table-column type="selection"
                        width="60">
       </el-table-column>
       <el-table-column prop="projectId"
                        label="项目Id"
                        v-if="false"
                        align='center'></el-table-column>
       <el-table-column prop="projectName"
                        label="项目名称"
                        width="180"
                        align='center'></el-table-column>
       <el-table-column prop="encoderDesc"
                        label="编码器"
                        width="190"
                        align='center'></el-table-column>
       <el-table-column prop="decoderDesc"
                        label="解码器"
                        width="190"
                        align='center'></el-table-column>
       <el-table-column prop="messageBelongId"
                        label="消息类型"
                        v-if="false"
                        width="190"
                        align='center'></el-table-column>
       <el-table-column label="操作"
                        width="110"
                        align='center'>
         <template slot-scope="scope">
           <el-button size="mini"
                      type="info"
                      @click="view(scope.$index, scope.row)">查看
           </el-button>
         </template>
       </el-table-column>

     </el-table>

     <el-dialog title="新增项目"
                :visible.sync="dialogTableVisible"
                :close-on-click-modal="false">
       <el-form>

         <el-form-item label="项目名称">
           <el-input v-model="projectForm.projectName"></el-input>
         </el-form-item>
           <el-form-item label="编码器">
             <el-select v-model="projectForm.encoderId"
                        placeholder="请选择" >
               <el-option v-for="item in encoderOpt"
                          :key="item.codecId"
                          :label="item.codecDesc"
                          :value="item.codecId">
               </el-option>
             </el-select>
           </el-form-item>

         <el-form-item label="解码器">
           <el-select v-model="projectForm.decoderId"
                      placeholder="请选择" >
             <el-option v-for="item in decoderOpt"
                        :key="item.codecId"
                        :label="item.codecDesc"
                        :value="item.codecId">
             </el-option>
           </el-select>
         </el-form-item>
         <el-form-item label="设置消息类型">
           <el-select v-model="projectForm.messageBelongId"
                      placeholder="请选择" >
             <el-option v-for="item in projectMessageOpt"
                        :key="item.messageBelongId"
                        :label="item.messageDesc"
                        :value="item.messageBelongId">
             </el-option>
           </el-select>
         </el-form-item>

         <el-form-item>
           <el-button type="primary"
                      @click="addProject()">确定
           </el-button>
           <el-button @click="dialogTableVisible = false">取消</el-button>
         </el-form-item>
       </el-form>
     </el-dialog>

<!--         <el-dialog title="配置消息类型"-->
<!--                    :visible.sync="messageTypeDialog"-->
<!--                    :close-on-click-modal="false">-->
<!--           <el-form v-model="messageTypeForm">-->
<!--             <el-row>-->
<!--               <el-card class="el-card-custom">-->
<!--                 <el-table border-->
<!--                           @current-change="handleOne"-->
<!--                           :data="messageTable">-->
<!--                   <el-table-column v-for="item in messageTypeOpt"-->
<!--                                    :prop="item.prop"-->
<!--                                    :label="item.label"-->
<!--                                    :key="item.prop">-->
<!--                   </el-table-column>-->
<!--                 </el-table>-->
<!--               </el-card>-->
<!--               <el-form-item label="消息类型">-->
<!--                 <el-input placeholder="请输入英文单词,建议驼峰命名"-->
<!--                           v-model="messageTypeForm.messageType"></el-input>-->
<!--               </el-form-item>-->
<!--               <el-form-item label="消息类型描述">-->
<!--                 <el-input v-model="messageTypeForm.messageDescription"></el-input>-->
<!--               </el-form-item>-->
<!--             </el-row>-->
<!--           </el-form>-->

<!--           <el-button type="primary"-->
<!--                      @click="addConfigRow()">添加消息类型-->
<!--           </el-button>-->
<!--           <el-button type="primary"-->
<!--                      @click="saveMessageType()">保存-->
<!--           </el-button>-->
<!--           <el-button @click="messageTypeDialog=false">取消</el-button>-->
<!--         </el-dialog>-->

   </el-card>
   <interface-config ref="interfaceConfigRef" v-if="tableVisible === 'interface'" :currentProject="selectProjectId" :messageType="projectForm.projectMessageType"></interface-config>
 </div>

</template>
<script>
import axios from "axios";
import InterfaceConfig from "./InterfaceConfig";

export default {
  name: "projectConfig",
  components: {
    InterfaceConfig,
  },
  created() {
    this.getCodec();
    this.getProjectMessageOpt();
    this.getProjectList();
  },
  activated() {
    this.getCodec();
    this.getProjectMessageOpt();
    this.getProjectList();
  },
  data() {
    return {
      projectMessageOpt: {},
      tableVisible: 'project',
      // 被单选中
      projectInSelect: {},
      selectProjectId: "",
      // 多选
      multipleSelection: [],
      projectTable: [],
      // 当前选中
      currentProject: {},
      messageTypeForm: {},
      messageTypeDialog: false,
      messageBelongId: "",
      projectForm: {
        projectName: "",
        encoderId: "",
        decoderId: "",
      },
      dialogTableVisible: false,
      encoderOpt: [],
      decoderOpt: [],
      // 消息类型
      messageOpt: [],
      messageTable: [],
      messageTypeOpt: [
        {
          prop: "messageType",
          label: "消息类型",
        },{
          prop: "messageDescription",
          label: "消息类型描述",
        },
      ],
    }
  },
  methods: {
    getProjectMessageOpt() {
      axios.get('/message/type/find/message/list').then(res => {
        this.projectMessageOpt = res.data;
      });
    },
    btnAddProject() {
      this.dialogTableVisible = true
    },
    selectCurrentCol(val) {
      this.projectInSelect = val;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    view(index, row) {
      this.projectInSelect = row;
      this.tableVisible = "interface";
      this.selectProjectId = row.projectId;
      this.$refs.interfaceConfigRef.getInterfaceTableData(row.projectId);
      this.$refs.interfaceConfigRef.getMessageTypeOpt(row.messageBelongId);
    },
    // 添加一行配置项 todo config表单
    addConfigRow() {
      if (this.messageTypeForm !== {}) {
        this.messageTable.push(this.messageTypeForm);
      }
      this.messageTypeForm = {}
    },
    addProject() {
      const data = {
        messageBelongId: this.messageBelongId,
        projectEntity: this.projectForm
      }
      axios.post('/project/save', this.projectForm);
      this.dialogTableVisible = false;
      this.$message.success('添加成功');
      this.getProjectList();
    },
    /**
     * 获取编码、解码选项
     */
    getCodec() {
      axios.get('/codec/find/all').then(
          res => {
           let arr = res.data;
            arr.forEach(
                (item) => {
                  let data = {
                    codecId: item.codecId,
                    codecDesc: item.codecDesc
                  };
                  // data.codecId = item.codecId;
                  // data.codecDesc = item.codecDesc;
                  if (item.codecType === "1") {
                    this.encoderOpt.push(data)
                  } else if (item.codecType === "0") {
                    this.decoderOpt.push(data);
                  }
                }
            )
          }
      );
    },
    // getMessageType(projectId) {
    //   let data = [];
    //   axios.get('/message/type/find/list', {params: {"projectId": projectId}}).then(
    //       res => {
    //         data = res.data;
    //       }
    //   );
    //   return data;
    // },
    // saveMessageType() {
    //   for (const v of this.messageTable) {
    //     v.projectId = this.projectInSelect.projectId;
    //   }
    //   axios.post('/message/type/save', this.messageTable);
    // },
    /**
     * 选中多行删除  服务端删除
     */
    handleDeleteMulti() {
      if (this.multipleSelection.length === 0) {
        this.$alert("请先选择要删除的数据", "提示", {
          confirmButtonText: "确定",
        });
      } else {
        axios.delete('/project/delete', {params: {projectId: this.multipleSelection[0].projectId}}).then(
            response => {
              if (this.isRequestSuccess(response)) {
                this.$message.success('删除成功');
                this.getProjectList();
              } else {
                this.$message.error('删除失败');
              }
            }
        );
        this.projectTable.splice(this.multipleSelection[0].index - 1, 1);
      }
    },
  }
}
</script>