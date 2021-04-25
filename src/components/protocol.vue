<template>
  <!-- 自定义ModBus协议编辑弹框 -->
  <div>
    <!-- 内容主体区域 -->
    <el-dialog title="自定义Modbus协议"
               :close-on-click-modal="false"
               :visible.sync="showDialog"
               width="60%"
               @close="setDialogClosed">
      <el-form ref="addFormRef"
               label-width="100px">
        <el-form-item label="业务标识符:">
          <el-row :gutter="4">
            <el-col :span="12"
                    class="affairIdentification">
              <el-input v-model="affairIdentification"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="协议标识符:">
          <el-row :gutter="4">
            <el-col :span="12">
              <el-input v-model="total"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="3.3	长度:">
          <el-row :gutter="4">
            <el-col :span="12">
              <el-input v-model="index"
                        placeholder="总帧数"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="数据长度:">
          <el-row :gutter="4">
            <el-col :span="12">
              <el-input v-model="dataLength"
                        placeholder="总帧数"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="主备机状态:">
          <el-row :gutter="4">
            <el-col :span="12">
              <el-input v-model="deviceStatus"
                        placeholder="总帧数"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="消息种类:">
          <el-row :gutter="4">
            <el-col :span="12">
              <el-input v-model="msgType"
                        placeholder="总帧数"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="消息尾:">
          <el-row :gutter="4">
            <el-col :span="12">
              <el-input v-model="dataTail"
                        placeholder="总帧数"></el-input>
            </el-col>
          </el-row>
        </el-form-item>

        <el-row>
          <el-col style="text-align: center">
            <el-button @click="showDialog = false">确定</el-button>
            <el-button @click="showDialog = false">返 回</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 控制对话框显示隐藏
      showDialog: false,
      affairIdentification: "",
    };
  },
  methods: {
    // 编辑初始化页面内容
    async init () {
      this.showDialog = true;
    },
    // 关闭对话框触发
    setDialogClosed () {
      // 子组件调用父组件方法，并传递参数
      this.$emit("refreshFather");
    },
  },
};
</script>

<style lang="less" scoped></style>
