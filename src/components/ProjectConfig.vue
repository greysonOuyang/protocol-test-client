<template>
  <el-card class="el-card-custom"
           header="项目配置">
    <div style="margin-bottom: 20px">
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
    </div>

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
      <el-table-column prop="projectId"
                       label="项目Id"
                       v-if="false"
                       align='center'></el-table-column>
      <el-table-column prop="projectName"
                       label="项目名称"
                       width="180"
                       align='center'></el-table-column>
      <el-table-column prop="encoderName"
                       label="编码器"
                       width="190"
                       align='center'></el-table-column>
      <el-table-column prop="decoderName"
                       label="解码器"
                       width="190"
                       align='center'></el-table-column>
      <el-table-column prop="messageType"
                       label="消息类型"
                       v-if="false"
                       width="190"
                       align='center'></el-table-column>
      <el-table-column prop="messageDescription"
                       label="消息类型"
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
      <el-form-item label="项目名称">
        <el-input v-model="projectForm.interfaceName"></el-input>
      </el-form-item>
      <el-form>
        <el-form-item label="编码器">
          <el-select v-model="projectForm.encoderId"
                     placeholder="请选择" >
            <el-option v-for="item in encoderOpt"
                       :key="item.encoderId"
                       :label="item.encoderName"
                       :value="item.encoderId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="解码器">
          <el-select v-model="projectForm.decoderId"
                     placeholder="请选择" >
            <el-option v-for="item in decoderOpt"
                       :key="item.decoderId"
                       :label="item.decoderName"
                       :value="item.decoderId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="addServerInterfaceConfig()">确定
          </el-button>
          <el-button @click="dialogTableVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="配置消息类型"
               :visible.sync="messageTypeDialog"
               :close-on-click-modal="false">
      <el-form v-model="messageTypeForm">
        <el-row>
          <el-card class="el-card-custom">
            <el-table border
                      @current-change="handleOne"
                      :data="messageTable">
              <el-table-column v-for="item in messageTypeOpt"
                               :prop="item.prop"
                               :label="item.label"
                               :key="item.prop">
              </el-table-column>
            </el-table>
          </el-card>
          <el-form-item label="消息类型">
            <el-input placeholder="请输入英文单词,建议驼峰命名"
                      v-model="messageTypeForm.messageType"></el-input>
          </el-form-item>
          <el-form-item label="消息类型描述">
            <el-input v-model="messageTypeForm.messageDescription"></el-input>
          </el-form-item>
        </el-row>
      </el-form>

      <el-button type="primary"
                 @click="addConfigRow()">添加消息类型
      </el-button>
      <el-button type="primary"
                 @click="saveMessageType()">保存
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

export default {
  name: "projectConfig",
  components: {

  },
  activated() {
    this.encoderOpt = this.getCodec("1");
    this.decoderOpt = this.getCodec("0");
  },
  data() {
    return {
      // 当前选中
      currentProject: {},
      messageTypeForm: {},
      messageTypeDialog: false,
      projectForm: {},
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
    view(index, row) {

    },
    handleOneCol(val) {
      this.currentProject = val;
    },
    // 添加一行配置项 todo config表单
    addConfigRow() {
      if (this.messageTypeForm !== {}) {
        this.messageTable.push(this.messageTypeForm);
      }
      this.messageTypeForm = {}
    },
    /**
     * 获取编码、解码选项
     */
    getCodec(type) {
      let data = [];
      axios.get('/codec/find/list/by/type', {params: {"type": type}}).then(
          res => {
            data = res.data;
          }
      );
      return data;
    },
    getMessageType(projectId) {
      let data = [];
      axios.get('/message/type/find/list', {params: {"projectId": projectId}}).then(
          res => {
            data = res.data;
          }
      );
      return data;
    },
    saveMessageType() {
      for (const v of this.messageTable) {
        v.projectId = this.currentProject.projectId;
      }
      axios.post('/message/type/save', this.messageTable);
    }
  }
}
</script>