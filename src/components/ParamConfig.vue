<template>
  <!-- 参数表 -->
  <el-card v-if="paramTabVisible"
           header="参数表"
           class="el-card-custom">
    <div style="margin-bottom: 20px">
      <el-button v-model="editModeEnabled"
                 @click="editParamData"
                 type="primary"
                 icon="el-icon-check"
                 size="mini">编辑
      </el-button>
      <el-button type="primary"
                 size="mini"
                 icon="el-icon-plus"
                 @click="handleAddDetails">添加
      </el-button>
      <el-button v-if="editModeEnabled"
                 @click="saveParamData"
                 type="primary"
                 icon="el-icon-check"
                 size="mini">保存
      </el-button>
      <el-button @click="cancelParamEdit"
                 v-if="editModeEnabled"
                 type="primary"
                 icon="el-icon-check"
                 size="mini">取消
      </el-button>

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
          <span slot="content">{{ row[item.prop] }}</span>
        </editable-cell>
      </el-table-column>

      <el-table-column label="参数类型">
        <editable-cell slot-scope="{row}"
                       editable-component="el-select"
                       :can-edit="editModeEnabled"
                       close-event="change"
                       v-model="row.type">

          <el-tag size="medium"
                  type="primary"
                  slot="content">
            {{ row.type }}
          </el-tag>

          <template slot="edit-component-slot">
            <el-option v-for="item in paramTypeOpt"
                       :key="item.paramType"
                       :label="item.paramType"
                       :value="item.paramType">
            </el-option>
          </template>
        </editable-cell>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import axios from "axios";
import EditableCell from "./common/EditeableCell";
import cloneDeep from "lodash/cloneDeep";

export default {
  name: "paramConfig",
  props: ['paramTabVisible'],
  components: {
    EditableCell,
  },
  data() {
    return {
      // 参数表是否可见
      paramTabVisible: false,
      // 参数表数据
      paramTable: [],
      // 表格是否支持编辑
      editModeEnabled: false,
      paramTypeOpt: [
        {
          paramType: 'Int',
        }, {
          paramType: 'String',
        }, {
          paramType: 'Hex',
        }, {
          paramType: 'ASCII',
        }, {
          paramType: 'Time',
        }
      ],
      // 数据录入表格相关
      paramDataOpt: [
        {
          prop: "paramId",
          label: "参数Id",
        }, {
          prop: "interfaceId",
          label: "接口Id",
        }, {
          prop: "index",
          label: "写入下标",
        },
        {
          prop: "field",
          label: "参数名称",
        },
        {
          prop: "length",
          label: "参数长度",
        }, {
          prop: "value",
          label: "参数值",
        }, {
          prop: "paramIo",
          label: "输入输出类型",
        },
      ],
    }
  },
  methods: {
    // 取消参数表编辑
    cancelParamEdit() {
      this.editModeEnabled = false;
      this.paramTable = this.tempParamTable;
      this.tempParamTable = [];
    },
    editParamData() {
      this.editModeEnabled = true;
      this.getAllServerInterfaceInfo();
    },
    saveParamData() {
      axios.post('param/save', this.paramTable);
      this.$message.success('保存成功');
      this.getAllServerInterfaceInfo();
      this.editModeEnabled = false;
    },
    handleAddDetails() {
      if (this.paramTable === undefined || this.paramTable === null) {
        this.paramTable = [];
      }
      this.editModeEnabled = true;
      if (this.flag) {
        this.tempParamTable = cloneDeep(this.paramTable);
        this.flag = false;
      }
      this.paramTable.push({
        paramField: '',
        paramLength: '',
        paramType: '',
        paramValue: ''
      });
      console.log(this.tempParamTable);
    },
    getParamTable(interfaceId, paramIo) {
      axios.get('param/get/all/by/paramIo', {params: {'interfaceId': interfaceId, 'paramIo': paramIo}})
          .then(
              res => {
                this.paramTable = res.data;
              }
          );
    }
  }
}
</script>