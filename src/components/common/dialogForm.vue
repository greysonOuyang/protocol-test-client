<template>
	<el-form-item>
		<el-dialog v-bind:title="title"
               @close="addDialogClose"
               :visible.sync="dialogFormVisible"
               :close-on-click-modal="false">
      <el-form ref="addFormRef"
								v-bind:formDesc="formDesc"
               :rules="rulesAddUser"
               :model="desc in formDesc"
               label-width="100px">
        <el-form-item prop="username"
                      label="用户姓名">
          <el-input v-model="formData"></el-input>
        </el-form-item>
      
        <el-form-item>
          <el-button @click="dialogTableVisible = false">取消</el-button>
          <el-button type="primary"
                     @click="onAddUser">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
	</el-form-item>
</template>

<script>
export default {
  name: 'FormDialog',
	props: {
  // 弹窗是否显示
  visible: {
    type: Boolean,
    required: true,
    default: false
  },
  // 弹框标题
  title: String,
  // 弹窗标题
  width: {
    type: String,
    default: '50%'
  },
  // 弹窗其它属性
  dialogAttrs: Object,
  // 是否显示返回按钮, 这里是 false
  isShowBackBtn: {
    type: Boolean,
    default: false
  },
  // 是否显示取消按钮, 这里是 true
  isShowCancelBtn: {
    type: Boolean,
    default: true
  }, 
  // 表单数据
  formData: {
    type: Object,
    required: true
  },
  // 表单项
  formDesc: {
    type: Object,
    required: true
  }
  // ... 其它属性同 vue-ele-form 组件
},

  data () {
    return {

    }
}, methods: {

}
}
</script>