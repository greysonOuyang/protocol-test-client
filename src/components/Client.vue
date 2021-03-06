<template>
  <div class="clientMain">
    <el-form :model="requestData"
             label-width="120px"
             label-position="right"
             ref="requestTable">

      <!-- 请求类型选择 -->
      <el-form-item :label="$t('requestType')">
        <el-radio-group v-model="requestData.requestType"
                        :placeholder="$t('select')">
          <el-radio label="HTTP">HTTP/S</el-radio>
          <el-radio label="WebSocket">WebSocket/S</el-radio>
          <el-radio label="TCP">TCP/S</el-radio>
          <el-radio label="UDP">UDP</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 请求接口 -->
      <el-form-item label="请求接口"
                    style="width: 60%; margin-left: 0">
        <el-col :xs="24"
                :sm="12">
          <el-select v-model="requestId"
                     clearable
                     placeholder="请选择">
            <el-option v-for="item in requestInterfaceSelection"
                       :key="item.requestId"
                       :label="item.requestName"
                       :value="item.requestId">
            </el-option>
          </el-select>
        </el-col>
        <el-col :xs="24"
                :sm="12">
          <!-- 应用层协议选择 -->
          <el-form-item v-if="requestData.requestType == 'TCP'"
                        :label="'应用层协议：'">
            <el-select v-model="change.protocolType"
                       style="width: 150px">
              <el-option v-for="item in protocolTypeOpt"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

      </el-form-item>

      <!-- UDP相关 -->
      <el-form-item v-if="requestData.requestType == 'UDP'"
                    label="UDP">
        <el-col :xs="24"
                :sm="14">
          <el-form-item prop="host">
            <el-input :placeholder="$t('tcpHostPlaceholder')"
                      v-model="requestData.host">
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="0"
                :sm="1">&nbsp;</el-col>
        <el-col :xs="24"
                :sm="7">
          <el-form-item>
            <el-input type="number"
                      min="0"
                      max="65535"
                      :placeholder="$t('tcpPortPlaceholder')"
                      v-model="requestData.port"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <!-- HTTP相关 -->
      <el-form-item v-if="requestData.requestType == 'HTTP'"
                    :label="$t('requestUrl')"
                    prop="url"
                    :rules="[
              { required: true, message: $t('requestTips') },
              {
                pattern: /^(http|https):\/\/.+$/,
                message: $t('httpUrlInvalidTips'),
              },
            ]"
                    required>
        <el-input :placeholder="$t('httpUrlPlaceholder')"
                  v-model="requestData.url">
          <el-select v-model="requestData.method"
                     slot="prepend"
                     placeholder="请选择"
                     style="width: 6rem;color: #222;">
            <el-option value="GET">GET</el-option>
            <el-option value="POST">POST</el-option>
            <el-option value="OPTIONS">OPTIONS</el-option>
            <el-option value="HEAD">HEAD</el-option>
            <el-option value="PUT">PUT</el-option>
            <el-option value="DELETE">DELETE</el-option>
            <el-option value="TRACE">TRACE</el-option>
            <el-option value="CONNECT">CONNECT</el-option>
            <el-option value="PATCH">PATCH</el-option>
            <el-option value="OTHER">OTHER</el-option>
          </el-select>
        </el-input>
      </el-form-item>
      <!-- WebSocket相关 -->
      <el-form-item v-if="requestData.requestType == 'WebSocket'"
                    :label="$t('requestUrl')"
                    prop="url"
                    :rules="[
              { required: true, message: $t('requestTips') },
              {
                pattern: /^(ws|wss):\/\/.+$/,
                message: $t('websocketUrlInvalidTips'),
              },
            ]"
                    required>
        <el-input :placeholder="$t('websocketUrlPlaceholder')"
                  v-model="requestData.url"></el-input>
      </el-form-item>
      <!-- 请求地址 -->
      <el-form-item v-if="requestData.requestType === 'TCP'"
                    :label="$t('requestUrl')"
                    >
        <el-col :xs="24"
                :sm="2">
          <el-form-item>
            <el-checkbox v-model="requestData.isSSL">SSL</el-checkbox>
          </el-form-item>
        </el-col>

        <el-col :xs="24"
                :sm="14">
          <el-form-item prop="host">
            <el-input :placeholder="$t('tcpHostPlaceholder')"
                      v-model="requestData.host">
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="0"
                :sm="1">&nbsp;</el-col>
        <el-col :xs="24"
                :sm="7">
          <el-form-item>
            <el-input type="number"
                      min="0"
                      max="65535"
                      :placeholder="$t('tcpPortPlaceholder')"
                      v-model="requestData.port"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <!-- 证书选择 -->
      <el-form-item :label="$t('certSetting')"
                    v-if="requestData.isSSL">
        <el-col :span="24">
          <el-radio-group v-model="requestData.cert">
            <el-radio label="DEFAULT">{{ $t("certDefault") }}</el-radio>
            <el-radio label="PEM">{{ $t("certPem") }}</el-radio>
            <el-radio label="PFX">{{ $t("certPfx") }}</el-radio>
            <el-radio label="JKS">{{ $t("certJks") }}</el-radio>
          </el-radio-group>
        </el-col>
        <el-col :span="24"
                v-if="
                requestData.cert == 'PEM' ||
                  requestData.cert == 'PFX' ||
                  requestData.cert == 'JKS'
              ">
          <el-input type="textarea"
                    :placeholder="$t('certKey')"
                    v-model="requestData.certKey"></el-input>
        </el-col>
        <el-col :span="24"
                v-if="
                requestData.cert == 'PEM' ||
                  requestData.cert == 'PFX' ||
                  requestData.cert == 'JKS'
              ">
          <el-input type="textarea"
                    :placeholder="$t('certValue')"
                    v-model="requestData.certValue"></el-input>
        </el-col>
        <el-col v-if="
                requestData.cert == 'PEM' ||
                  requestData.cert == 'PFX' ||
                  requestData.cert == 'JKS'
              ">
          <el-button type="primary"
                     size="small"
                     style="margin-right: 5px;"
                     @click="$refs.readCertKey.click()">{{ $t("btnReadCertKey") }}</el-button>
          <input type="file"
                 style="display: none"
                 accept=".pem,.key,.p12,.jks,.txt"
                 ref="readCertKey"
                 @change="loadCertKey" />
          <el-button type="primary"
                     size="small"
                     @click="$refs.readCertValue.click()">{{ $t("btnReadCertValue") }}</el-button>
          <input type="file"
                 style="display: none"
                 accept=".pem,.key,.p12,.jks,.txt"
                 ref="readCertValue"
                 @change="loadCertValue" />
        </el-col>
      </el-form-item>
      <el-form-item
                    label="请求形式:">
        <el-radio-group v-model="contentFormat">
          <el-radio v-for="item in contentFormatOpt"
                    :label="item.value"
                    :key="item.value"
                    >{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- http下的配置 -->
      <div id="httpConfig"
           v-if="watchBodyShowWhich() === 'config'">
        <el-row v-if="isExistInput">
          <el-form-item v-model="ConfigDataForm"
                        v-for="item in inputConfigArr"
                        :model="item.configKey"
                        :key="item.configKey"
                        :label="item.configName">
            <el-input v-model="selectArr[item.configKey]"></el-input>
          </el-form-item>
        </el-row>

        <el-row v-if="isExistSelect">
          <el-form-item
                        v-for="item in SelectConfigArr"
                        :key="item.configKey"
                        :label="item.configName">
            <el-select v-model="selectArr[item.configKey]">
              <el-option v-for="item in configSelectValueArr[item.index]"
                         :key="item.key"
                         :label="item.label"
                         :value="item.label"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
      </div>

      <!-- 构造Body ModBus 读取操作-->
      <div class="modBusParam"
           v-if="watchBodyShowWhich() == 'modbusRead'">
        <el-row>
          <el-col :xs="24"
                  :sm="12">
            <el-form-item :label="'功能码'">
              <el-input :placeholder="'例如：0x04--读'"
                        v-model="functionCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24"
                  :sm="12">
            <el-form-item :label="'起始地址'">
              <el-input :placeholder="'例如：1'"
                        v-model="startAddress"></el-input>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :xs="24"
                  :sm="12">
            <el-form-item :label="'寄存器个数'">
              <el-input :placeholder="'例如：3'"
                        v-model="registerCount"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24"
                  :sm="12">
            <el-form-item :label="'写入数据'">
              <el-input :placeholder="'例如：000A'"
                        v-model="writeData"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <!-- 构造Body ModBus 控制命令操作-->
      <div class="modBusParam"
           v-if="watchBodyShowWhich() == 'modbusOperator'">
        <el-row>
          <el-col :xs="24"
                  :sm="12">
            <el-form-item :label="'功能码'">
              <el-input :placeholder="'例如：0x10--写'"
                        v-model="functionCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24"
                  :sm="12">
            <el-form-item :label="'起始地址'">
              <el-input :placeholder="'例如：10672'"
                        v-model="startAddress"></el-input>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :xs="24"
                  :sm="12">
            <el-form-item :label="'寄存器个数'">
              <el-input :placeholder="'例如：373'"
                        v-model="registerCount"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24"
                  :sm="12">
            <el-form-item :label="'播放文本时长'">
              <el-input :placeholder="'请输入播放时长，1-127分钟'"
                        v-model="contextSlect.showTime"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-input type="textarea"
                    :rows="4"
                    placeholder="请输入文本下发内容"
                    v-model="contextSlect.textcont">
            <el-row></el-row>
          </el-input>
        </el-row>
        <el-row>
          <el-form-item :label="'播控位置'">
            <el-radio v-model="locationSelection"
                      label="0">所有</el-radio>
            <el-radio v-model="locationSelection"
                      label="1">车站级</el-radio>
            <el-radio v-model="locationSelection"
                      label="2">播控级</el-radio>
          </el-form-item>
          <el-form-item :label="'选择车站'" v-if="locationSelection === '1'">

          <el-select v-model="contextSlect.stationId"
                     clearable
                     placeholder="请选择">
            <el-option v-for="item in stationOpt"
                       :key="item.stationId"
                       :label="item.stationName"
                       :value="item.stationId">
            </el-option>
          </el-select>
          </el-form-item>
          <el-form-item :label="'播控位置'" v-if="locationSelection === '2'">
            <el-input type="textarea"
                      :rows="4"
                      placeholder="请输入播控点位，英文逗号分隔，末位不需要逗号"
                      v-model="contextSlect.playerLocation">
              <el-row></el-row>
            </el-input>
          </el-form-item>

          <!-- TODO 如果是终止后两个不用展示 -->
          <el-form-item :label="'是否启动'">
            <el-radio v-model="contextSlect.isOpen"
                      label="1">启动</el-radio>
            <el-radio v-model="contextSlect.isOpen"
                      label="0">终止</el-radio>
          </el-form-item>
          <el-form-item :label="'选择显示方式'">
            <el-radio v-model="contextSlect.showType"
                      label="0">底部滚动</el-radio>
            <el-radio v-model="contextSlect.showType"
                      label="1">全屏显示</el-radio>
          </el-form-item>
          <el-form-item :label="'是否有时限控制'">
            <el-radio v-model="contextSlect.limitStyle"
                      label="0">不控制</el-radio>
            <el-radio v-model="contextSlect.limitStyle"
                      label="1">启用时限控制</el-radio>
          </el-form-item>
          <el-form-item :label="'请选择优先级'">
            <el-radio-group v-model="contextSlect.priority">
              <el-radio :label="0">线网级</el-radio>
              <el-radio :label="1">线路级</el-radio>
              <el-radio :label="2">车站级</el-radio>
              <el-radio :label="3">车载级</el-radio>
              <el-radio :label="4">区域级</el-radio>
              <el-radio :label="5">设备级</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
      </div>

      <!-- 请求的body内容 json格式 -->
      <el-form-item :label="$t('requestBody')"
                    v-if="watchBodyShowWhich() === 'json'">
        <el-input type="textarea"
                  :placeholder="$t('requestBodyPlaceholder')"
                  v-model="requestData.body"></el-input>
      </el-form-item>

      <!--  WebSocket的SubProtocols -->
      <el-form-item label="SubProtocols"
                    v-if="requestData.requestType == 'WebSocket'">
        <el-col :span="24">
          <el-form-item v-for="(item) in requestData.subPrnpmotocols"
                        :key="item.key">
            <el-col :xs="20"
                    :sm="21">
              <el-input v-model="item.value"
                        :placeholder="$t('inputValue')"></el-input>
            </el-col>
            <el-col :xs="1"
                    :sm="1">&nbsp;</el-col>
            <el-col :xs="3"
                    :sm="2">
              <el-button @click.prevent="removeSubProtocols(item)"
                         size="small"
                         type="danger">{{ $t("btnRemove") }}</el-button>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-button type="primary"
                     size="small"
                     @click="addSubProtocols">{{
                $t("btnAdd")
              }}</el-button>
        </el-col>
      </el-form-item>
      <!-- 请求的Header内容 -->
      <el-form-item :label="$t('requestHeaders')"
                    v-if="
              requestData.requestType == 'HTTP' ||
                requestData.requestType == 'WebSocket'
            ">
        <el-col :span="24">
          <el-form-item v-for="(item, index) in requestData.headers"
                        :key="index">
            <el-col :xs="24"
                    :sm="10">
              <el-input v-model="item.key"
                        :placeholder="$t('inputName')"></el-input>
            </el-col>
            <el-col :xs="0"
                    :sm="1">&nbsp;</el-col>
            <el-col :xs="20"
                    :sm="10">
              <el-input v-model="item.value"
                        :placeholder="$t('inputValue')"></el-input>
            </el-col>
            <el-col :xs="1"
                    :sm="1">&nbsp;</el-col>
            <el-col :xs="3"
                    :sm="2">
              <el-button @click.prevent="removeHeader(item)"
                         size="small"
                         type="danger">{{ $t("btnRemove") }}</el-button>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-button type="primary"
                     size="small"
                     @click="addHeader">{{
                $t("btnAdd")
              }}</el-button>
        </el-col>
      </el-form-item>
      <!-- 请求的SNI server name内容 -->
      <!-- <el-form-item label="ServerName(SNI)"
                        v-if="requestData.requestType == 'TCP'">
            <el-input :placeholder="$t('requestServerNamePlaceholder')"
                      v-model="requestData.serverName"></el-input>
          </el-form-item> -->

      <!-- 请求统计信息 -->
      <el-form-item :label="$t('requestCount')"
                    required>
        <el-col :xs="24"
                :sm="6">
          <el-form-item prop="count"
                        :rules="[
                  {
                    required: true,
                    type: 'number',
                    min: 0,
                    message: $t('requestCountTips'),
                  },
                ]"
                        required>
            <el-input :placeholder="
                    requestData.requestType == 'HTTP'
                      ? $t('requestCountPlaceholder')
                      : $t('requestTcpCountPlaceholder')
                  "
                      v-model.number="requestData.count"></el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="1">&nbsp;</el-col>
        <el-col :xs="24"
                :sm="8">
          <el-form-item prop="average"
                        :rules="[
                  {
                    required: true,
                    type: 'number',
                    min: 0,
                    message: $t('requestAverageTips'),
                  },
                ]"
                        required>
            <el-input :placeholder="
                    requestData.requestType == 'HTTP'
                      ? $t('requestAveragePlaceholder')
                      : $t('requestTcpAveragePlaceholder')
                  "
                      v-model.number="requestData.average"></el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="1">&nbsp;</el-col>
        <el-col :xs="24"
                :sm="8">
          <el-form-item prop="interval"
                        :rules="[
                  {
                    required: true,
                    type: 'number',
                    min: 1,
                    message: $t('requestIntervalTips'),
                  },
                ]"
                        required>
            <el-input :placeholder="
                    requestData.requestType == 'HTTP'
                      ? $t('requestIntervalPlaceholder')
                      : $t('requestTcpIntervalPlaceholder')
                  "
                      v-model.number="requestData.interval"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item v-show="isStatistics">{{
            statisticsInfo
          }}</el-form-item>
      <el-form-item>
        <div style="display: flex;flex-wrap: wrap;">
          <div style="margin-right: 0.6rem">
            <el-checkbox v-model="requestConfig.printResInfo"
                         :label="$t('requestConfigPrintInfo')"></el-checkbox>
          </div>
          <div style="margin-right: 0.6rem;">
            <el-input :placeholder="$t('requestConfigTimeout')"
                      type="number"
                      v-model.number="requestConfig.timeout"></el-input>
          </div>
          <div style="margin-right: 0.6rem;">
            <el-checkbox v-model="requestConfig.keepAlive"
                         :label="$t('requestConfigKeepAlive')"></el-checkbox>
          </div>
          <div style="flex: 1;"
               v-show="
                  requestConfig.keepAlive && requestData.requestType == 'HTTP'
                ">
            <el-input :placeholder="$t('requestConfigPoolSize')"
                      type="number"
                      v-model.number="requestConfig.poolSize"></el-input>
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <div v-if="
                requestConfig.printResInfo &&
                  requestData.count * requestData.average > printShowLimit
              ">
          {{ $t("requestConfigPrintInfoTips") }}
        </div>
        <el-button type="primary"
                   :loading="isExecuting"
                   @click="execute">{{
              isExecuting ? $t("btnIsExecute") : $t("btnExecute")
            }}</el-button>
        <el-button v-show="isExecuting"
                   @click="executeCancel">{{
              $t("btnCancel")
            }}</el-button>
      </el-form-item>
    </el-form>
    <div v-show="isExecuted">
      <div id="response-heander"
           :style="watchResponseHeaderColor">
        <!-- 请求进度 -->
        <div class="response-header-box"
             v-show="responseSucceeded != 0 || responseFailed != 0">
          <div class="response-header-label">
            <b>{{ $t("executeProgress") }}</b>
          </div>
          <div class="response-header-body">
            <div style="line-height: 34px;"
                 class="sm-margin-left-0x">
              {{ $t("succee") }}:&nbsp;
            </div>
            <div style="color: #28a745;font-size: 36px;">
              {{ responseSucceeded }}
            </div>
            <div class="small">{{ $t("fail") }}:&nbsp;</div>
            <div style="color: #dc3545;font-size: 36px;">
              {{ responseFailed }}
            </div>
            <div class="small">
              &nbsp;{{ responseSucceeded + responseFailed }} /
              {{
                    requestData.requestType == "HTTP"
                      ? requestData.count * requestData.average
                      : requestData.count
                  }}
            </div>
          </div>
        </div>
        <!-- 请求统计信息-->
        <div class="response-header-box"
             v-show="responseTimeCount.length > 0">
          <div class="response-header-label"
               style="align-items: flex-start;">
            <b style="line-height: 34px;">{{ $t("responseTimesCount") }}</b>
          </div>
          <div class="response-header-body"
               style="flex-direction: column;align-items: flex-start;">
            <div style="display: flex;flex-wrap: wrap;"
                 v-for="(item, index) in responseTimeCount"
                 :key="index">
              <div class="small sm-margin-left-0x">
                {{ $t("responseCode") }}:{{ item.code }}
              </div>
              <div class="small">

                {{ $t("responseCount") }}:{{ item.count }}
              </div>
              <div class="small">
                {{ $t("responseTotalTime") }}:{{ item.total }}ms
              </div>
              <div class="small">
                {{ $t("responseMaxTime") }}:{{ item.max }}ms
              </div>
              <div class="small">
                {{ $t("responseMeanTime") }}:{{ item.mean }}ms
              </div>
            </div>
          </div>
        </div>
        <!-- 数据信息 -->
        <div class="response-header-box"
             v-show="requestDataLen != 0 || responseDataLen != 0">
          <div class="response-header-label">
            <b>{{ $t("dataLenInfo") }}</b>
          </div>
          <div class="response-header-body">
            <div style="display: flex;flex-wrap: wrap;">
              <div class="small sm-margin-left-0x">
                {{ $t("requestDataLen") }}:{{ requestDataLen }} byte
              </div>
              <div class="small">
                {{ $t("responseDataLen") }}:{{ responseDataLen }} byte
              </div>
            </div>
          </div>
        </div>
        <!-- 服务器指标 -->
        <div class="response-header-box"
             v-show="serverMetrics != null && serverMetrics.processors != 0">
          <div class="response-header-label">
            <b>{{ $t("serverMemory") }}</b>
          </div>
          <div class="response-header-body">
            <div style="display: flex;flex-wrap: wrap;">
              <div class="small sm-margin-left-0x">
                {{ $t("serverProcessors") }}:{{ serverMetrics.processors }}
              </div>
              <div class="small">
                {{ $t("serverMaxMemory") }}:{{ serverMetrics.maxMemory }} m
              </div>
              <div class="small">
                {{ $t("serverTotalMemory") }}:{{
                      serverMetrics.totalMemory
                    }}
                m
              </div>
              <div class="small">
                {{ $t("serverFreeMemory") }}:{{ serverMetrics.freeMemory }}
                m
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-button type="text" @click="clearContent()">清空内容</el-button>
      <console-info ref="consoleInfoRef" dataMsg="dataMsg" tag="tag" logType="logType"></console-info>
    </div>
  </div>
</template>

<script>
export { default } from '../assets/js/Client';
</script>
