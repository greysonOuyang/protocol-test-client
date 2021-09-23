<script>
import axios from "axios";

const protocolTypeOpt = [
  {
    value: "none",
    label: "无",
  },
  {
    value: "modbus",
    label: "ModBus",
  },
];
export default {
  // 应用层协议类别
  protocolTypeOpt,

  install(Vue) {
    /**
     * 判断响应是否成功
     * @param res
     * @returns {boolean}
     */
    Vue.prototype.isRequestSuccess = function (res) {
      return (res.data.result === "SUCCESS");
    }

    /**
     * 获取项目表数据
     */
    Vue.prototype.getProjectList = function () {
      axios.post('/project/find/list').then(res => {
        this.projectTable = res.data;
      });
    }

    /**
     * 获取接口表数据
     */
    Vue.prototype.getInterfaceTableData = function (projectId) {
      axios.get('/interface/find/list/by/projectId', {params: {projectId: projectId}}).then(
          res => {
            this.tableData = res.data;
          }
      );
    }
  }
}
</script>