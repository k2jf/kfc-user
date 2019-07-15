<template>
  <div class="tower-info h-full p-3">
    <Fiche title="塔架信息">
      <Form
        :model="towerFormValidate"
        :rules="towerRuleValidate"
        :label-width="180"
        ref="towerFormValidate">
        <div class="flex flex-wrap">
          <!-- Section 1 Info and Payload Origin -->
          <div class="w-1/2">
            <FormItem label="项目名称：" class="w-9/10">
              <span>{{ towerFormValidate.projectName }}</span>
            </FormItem>
          </div>
          <div class="w-1/2">
            <FormItem label="任务名称：">
              <span>{{ towerFormValidate.taskName }}</span>
            </FormItem>
          </div>
          <!-- <div class="w-1/2">
            <FormItem label="载荷数据来源：" prop="loadDatasource" class="w-9/10">
              {{ towerFormValidate.loadDatasource }}
            </FormItem>
          </div> -->
          <div class="w-1/2" v-if="isOnline">
            <FormItem label="仿真任务标号：" prop="simulationId" class="w-9/10">
              <!-- <Input v-model="towerFormValidate.simulationId" /> -->
              {{ towerFormValidate.simulationId }}
            </FormItem>
          </div>
          <div class="w-1/2" v-if="isOnline">
            <FormItem label="极限后处理任务编号：" prop="limitBackTaskId" class="w-9/10">
              <!-- <Input v-model="towerFormValidate.limitBackTaskId" /> -->
              {{ towerFormValidate.limitBackTaskId }}
            </FormItem>
          </div>
          <div class="w-1/2" v-if="isOnline">
            <FormItem label="疲劳后处理任务编号：" prop="fatigueBackTaskId" class="w-9/10">
              <!-- <Input v-model="towerFormValidate.fatigueBackTaskId" /> -->
              {{ towerFormValidate.fatigueBackTaskId }}
            </FormItem>
          </div>
          <!-- <Divider style="margin-top:0;" /> -->
          <!-- Section 2 Params Excel -->
          <div class="w-full">
            <FormItem label="塔架设计参数表：" prop="towerInput" class="w-9/10">
              <Upload
                class="float-left"
                style="height: 33px;"
                :action="action"
                :show-upload-list="false"
                :on-error="onUploadError"
                :on-success="onUploadSuccess">
                <Button size="small" icon="ios-cloud-upload-outline">
                  上传文件
                </Button>
              </Upload>
              <div class="float-left ml-3 text-blue overflow-hidden h-8" v-if="file.name">
                <span class="inline-block overflow-hidden"><Icon type="ios-link" />&ensp;</span>
                <a
                  target="_blank"
                  :href="href"
                  class="inline-block whitespace-no-wrap overflow-hidden"
                  style="text-overflow: ellipsis;max-width: 250px;">
                  {{ file.name }}
                </a>
                <span class="text-grey-darker overflow-hidden inline-block ml-4 cursor-pointer">
                  <Icon type="md-close" style="margin-top: -1px;" @click.native="removeTowerInput" />
                </span>
                <span
                  class="overflow-hidden inline-block ml-2 cursor-pointer font-bold"
                  @click="viewTable">
                  查看
                </span>
                <Excel
                  title="塔架设计参数表"
                  :size="size"
                  :visible="visible"
                  :sheets="sheets"
                  :originSheets="originSheets"
                  @on-ok="onExcelOk"
                  @on-cancel="onExcelCancel" />
              </div>
            </FormItem>
          </div>
          <div class="w-1/2">
            <FormItem label="塔架高度(m)：" prop="towerHeight" class="w-9/10">
              <Input disabled v-model="towerFormValidate.towerHeight" />
            </FormItem>
          </div>
          <div class="w-1/2">
            <FormItem
              label="塔底直径(m)："
              prop="towerDiameter"
              class="w-9/10">
              <Input disabled v-model="towerFormValidate.towerDiameter" />
            </FormItem>
          </div>
          <div class="w-1/2">
            <FormItem label="塔架段数：" prop="towerLegNum" class="w-9/10">
              <Input disabled v-model="towerFormValidate.towerLegNum" />
            </FormItem>
          </div>
          <div class="w-1/2">
            <FormItem
              label="塔底极限载荷Mxy(kNm)："
              prop="limitPayload"
              class="w-9/10">
              <Input disabled v-model="towerFormValidate.limitPayload" />
            </FormItem>
          </div>
          <!-- <Divider style="margin-top:0;" /> -->
          <!-- Section 3 Markov -->
          <div class="w-1/2">
            <FormItem label="马尔科夫矩阵：" prop="markov" class="w-9/10">
              <UploadButton
                :action="markovAction"
                v-model="markovFiles"
                @on-close="onClose"
                @on-remove="removeSigleMarkov"
                @on-clear="clearMarkov" />
              <span class="inline-block ml-3">
                已上传
                <!-- <a class="ido-link">&ensp;{{ markovFiles.length }}&ensp;</a> -->
                <b>{{ markovFiles.length }}</b>
                个文件
              </span>
            </FormItem>
          </div>
          <div class="w-1/2">
            <FormItem
              label="塔底疲劳载荷My(kNm)："
              prop="fatiguePalyload"
              class="w-9/10">
              <Input disabled v-model="towerFormValidate.fatiguePalyload" />
            </FormItem>
          </div>
          <div class="w-1/2">
            <FormItem label="单工况：" prop="workCase" class="w-9/10">
              <ISwitch v-model="towerFormValidate.workCase" />
              </ISwitch>
            </FormItem>
          </div>
          <!-- Seventh Row -->
          <div class="w-full">
            <FormItem label="备注：" prop="comment" style="width: 95%;">
              <Input
                type="textarea"
                :autosize="{minRows: 2,maxRows: 5}"
                v-model="towerFormValidate.comment"></Input>
            </FormItem>
          </div>
          <!-- Btns -->
          <div style="width:95%">
            <div class="buttons float-right">
              <Button
                :disabled="checkDisabled"
                :type="btnChecks[0] ? 'info' : 'default'"
                :loading="checkLoading[0]"
                @click="handleCheck('tower')">
                主体校核
              </Button>
              <Button
                class="ml-3"
                :type="btnChecks[1] ? 'info' : 'default'"
                :disabled="checkDisabled"
                :loading="checkLoading[1]"
                @click="handleCheck('flange')">
                法兰校核
              </Button>
              <Button
                class="ml-3"
                :type="btnChecks[2] ? 'info' : 'default'"
                :disabled="checkDisabled"
                :loading="checkLoading[2]"
                @click="handleCheck('door')">
                门洞校核
              </Button>
              <Button
                class="ml-3"
                :disabled="!canSave"
                type="success"
                @click="saveCheckResult">
                保存校核结果
              </Button>
              <VisualModal
                :multiple="checkMultiple"
                :title="checkTitile"
                :data="checkData"
                v-model="checkVisible" />
            </div>
          </div>
          <!-- </Row>
        </div> -->
        </div>
      </Form>
    </Fiche>
    <Fiche title="算法配置" class="mt-6">
      <Form
        :model="algorithmFormValidate"
        :rules="algorithmRuleValidate"
        :label-width="100"
        ref="algorithmFormValidate">
        <Row>
          <ICol span="12">
            <FormItem label="寻优算法" prop="betterAlgorithm" class="w-9/10">
              <Select placeholder="请选择寻优算法" v-model="algorithmFormValidate.betterAlgorithm">
                <Option value="default-algorithm">
                  默认算法
                </Option>
              </Select>
            </FormItem>
          </ICol>
          <ICol span="12">
            <FormItem label="迭代参数" prop="iterationParams" class="w-9/10">
              <Select placeholder="请选择迭代参数" multiple v-model="algorithmFormValidate.iterationParams">
                <Option value="thickness">
                  壁厚
                </Option>
              </Select>
            </FormItem>
          </ICol>
        </Row>
      </Form>
      <Row>
        <ICol style="text-align:right;width:88px;" class="float-left">
          参数配置
        </ICol>
        <ICol span="21" style="padding-left:10px;" class="overflow-hidden">
          <Table
            disabled-hover
            border
            stripe
            :columns="columns"
            :data="data">
            <template slot="mode" slot-scope="{ row }">
              <Select v-model="row.mode">
                <Option value="continuous">
                  连续
                </Option>
              </Select>
            </template>
            <template slot="config" slot-scope="{ row }">
              <div>
                min: &ensp;&ensp;<Input style="width:40px" :value="row.config.algconfMin" @on-blur="inputChange($event, 'algconfMin')" />&ensp;&ensp;
                max: &ensp;&ensp;<Input style="width:40px" :value="row.config.algconfMax" @on-blur="inputChange($event, 'algconfMax')" />&ensp;&ensp;
                step: &ensp;&ensp;<Input style="width:40px" :value="row.config.algconfStep" @on-blur="inputChange($event, 'algconfStep')" />&ensp;&ensp;
              </div>
            </template>
          </Table>
        </ICol>
      </Row>
    </Fiche>
    <Fiche title="约束条件" class="my-6">
      <Form
        :model="conditionFormValidate"
        :rules="conditionRuleValidate"
        :label-width="120"
        ref="conditionFormValidate">
        <Row>
          <ICol span="6">
            <FormItem label="ULS_SRF >= " prop="ULS_SRF" class="w-9/10">
              <Input v-model="conditionFormValidate.ULS_SRF" />
            </FormItem>
          </ICol>
          <ICol span="6">
            <FormItem label="BCK_SRF >= " prop="BCK_SRF" class="w-9/10">
              <Input v-model="conditionFormValidate.BCK_SRF" />
            </FormItem>
          </ICol>
          <ICol span="6">
            <FormItem label="FLS_SRF >= " prop="FLS_SRF" class="w-9/10">
              <Input v-model="conditionFormValidate.FLS_SRF" />
            </FormItem>
          </ICol>
        </Row>
      </Form>
    </Fiche>
    <div class="text-center my-6">
      <Button type="primary" @click="save">
        保存
      </Button>
      <Button class="ml-3" @click="cancelEdit">
        取消
      </Button>
    </div>
  </div>
</template>
<script>
import {
  Upload,
  Button,
  Row,
  Col,
  Input,
  Form,
  FormItem,
  Select,
  Table,
  Option,
  Switch,
  Icon,
  Message } from 'iview'

import Fiche from '@/components/Fiche'
import Excel from '@/components/Excel'
import VisualModal from '@/components/VisualModal'
import { UploadButton } from '@/components/MultipleUpload'

import XLSX from 'xlsx'
import { baseUrl, sheetJSFT } from '@/config'
import columns from './columnDef'
import { setTimeout } from 'timers'

const data = [{
  variableName: '壁厚',
  unit: 'mm',
  mode: 'continuous',
  config: {
    algconfMin: 10,
    algconfMax: 40,
    algconfStep: 1
  }
}]

const checkTypeList = ['tower', 'flange', 'door']

export default {
  name: 'TowerInfo',
  components: {
    Upload,
    Button,
    Fiche,
    Row,
    ICol: Col,
    Input,
    Form,
    FormItem,
    Select,
    Option,
    ISwitch: Switch,
    Icon,
    Excel,
    UploadButton,
    Table,
    // Divider,
    VisualModal
  },
  data () {
    return {
      visible: false,
      sheetJSFT,
      sheets: {},
      originSheets: {},
      file: { name: '' },
      markovFiles: [],
      action: '',
      isOnline: false,
      markovAction: '',
      originData: null,
      href: '',
      columns,
      data,
      checkVisible: false,
      checkMultiple: false,
      checkTitile: '',
      checkData: {},
      btnChecks: [false, false, false],
      checkLoading: [false, false, false],
      towerFormValidate: {
      },
      algorithmFormValidate: {
        betterAlgorithm: 'default-algorithm',
        iterationParams: ['thickness']
      },
      conditionFormValidate: {
        BCK_SRF: 1,
        ULS_SRF: 1,
        FLS_SRF: 1
      },
      algorithmRuleValidate: {

      },
      conditionRuleValidate: {

      },
      towerRuleValidate: {
        towerInput: [
          { required: true, message: '不能为空', trigger: 'none' }
        ],
        markov: [
          { required: true, message: '不能为空', trigger: 'none' }
        ]
      },
      size: {}
    }
  },
  computed: {
    display () {
      return this.markovFiles.length > 0 ? '重新上传' : '上传文件'
    },
    checkDisabled () {
      return !(this.file.name && this.markovFiles.length > 0)
    },
    canSave () {
      return this.btnChecks.some(Boolean)
    }
  },
  mounted () {
    this.action = `${baseUrl}towerTasks/${this.$route.params.taskId}/upload?fileKey=towerInput`
    this.markovAction = `${baseUrl}towerTasks/${this.$route.params.taskId}/upload?fileKey=markov`
    this.getTaskInfo()
    const width = document.body.clientWidth
    const height = document.body.clientHeight
    this.size = {
      width: width - 120,
      height: height - 80
    }
  },
  methods: {
    // Get task detail infos
    async getTaskInfo () {
      try {
        const res = await this.$get('towerTasks/' + this.$route.params.taskId)
        const towerFormValidate = {
          projectName: res.body.projectName,
          taskName: res.body.taskName,
          towerHeight: res.body.towerHeight,
          towerDiameter: res.body.bottomDiameter,
          towerLegNum: res.body.sectionNumber,
          loadDatasource: res.body.loadDatasource === 1 ? '载荷门户' : 'LCC载荷',
          fatiguePalyload: res.body.bottomFatigue,
          limitPayload: res.body.bottomUltimate,
          comment: res.body.remark
        }

        if (res.body.workCase) {
          towerFormValidate.workCase = res.body.workCase === 1
        } else {
          towerFormValidate.workCase = false
        }

        this.isOnline = res.body.loadDatasource === 1
        this.towerFormValidate = towerFormValidate

        if (res.body.towerInput.length > 0) {
          this.file = {
            name: res.body.towerInput[0].fileName,
            fileId: res.body.towerInput[0].fileId
          }
          this.href = `${baseUrl}towerTasks/stream?fileId=${this.file.fileId}`
          this.getSingleExcel()
        }

        if (res.body.markov.length > 0) {
          this.markovFiles = res.body.markov.map(f => ({
            name: f.fileName,
            fileId: f.fileId
          }))
        }

        if (res.body.towerAlgParams) {
          const algConfig = res.body.towerAlgParams[0]
          this.data = [{
            ...this.data[0],
            config: {
              algconfMin: algConfig.lower,
              algconfMax: algConfig.upper,
              algconfStep: algConfig.step
            }
          }]
        }

        if (res.body.constraints) {
          const algConstraint = res.body.constraints
          algConstraint.forEach(alg => {
            this.conditionFormValidate[alg.name] = alg.value
          })
        }
      } catch (error) {

      }
    },
    // Get task design excel form server
    async getSingleExcel () {
      try {
        const data = await this.$ky.get(`towerTasks/stream?fileId=${this.file.fileId}`).arrayBuffer()
        this.originData = data
        var workbook = XLSX.read(data, { type: 'array' })
        console.log(workbook)
        const sheets = {}
        for (let wsname in workbook.Sheets) {
          const ws = workbook.Sheets[wsname]
          // const data = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false })
          const data = XLSX.utils.sheet_to_json(ws, { header: 1 })
          sheets[wsname] = data
        }

        this.sheets = sheets
        this.originSheets = workbook.Sheets
      } catch (error) {
        console.log('see errors ======> ', error)
      }
    },
    // remove tower input file
    async removeTowerInput () {
      try {
        const res = await this.$delete(`towerTasks/file?fileId=${this.file.fileId}`, { silent: true })
        if (res.code === 0) {
          Message.success('删除成功')
          this.file = {}
          this.sheets = {}
          this.originSheets = {}
          this.getTaskInfo()
        }
      } catch (error) {
        Message.error('删除失败')
      }
    },
    // clear up all markov files
    async clearMarkov () {
      try {
        const res = await this.$delete(`towerTasks/file/batch?taskId=${this.$route.params.taskId}&fileKey=markov`, { silent: true })
        if (res.code === 0) {
          this.markovFiles = []
          this.btnChecks = [false, false, false]
          Message.success('清空成功')
        }
      } catch (error) {
        Message.error('清空失败')
      }
    },
    // remove single markov file when close btn triggered
    async removeSigleMarkov (file) {
      try {
        const res = await this.$delete(`towerTasks/file?fileId=${file.fileId}`, { silent: true })
        if (res.code === 0) {
          Message.success('已删除：' + file.name)
          this.markovFiles = this.markovFiles.filter(m => m.fileId !== file.fileId)
        }
      } catch (error) {
        Message.error('删除失败')
      }
    },
    onClose () {
      this.getTaskInfo()
    },
    viewTable () {
      this.visible = true
    },
    // excel saving
    async onExcelOk (wbout) {
      var formdata = new FormData()
      const data = new Blob([wbout], { type: 'application/octet-stream' })
      formdata.append('file', data, this.file.name)
      const url = `towerTasks/${this.$route.params.taskId}/upload?fileKey=towerInput`
      const res = await this.$post(url, {
        headers: null,
        body: formdata
      })
      if (res.code === 0) {
        this.file = {
          ...this.file,
          fileId: res.body.fileId
        }
        this.getTaskInfo()
      }

      this.visible = false
    },
    // excel closing, remove all changes
    onExcelCancel () {
      this.visible = false
      const sheets = {}
      for (let wsname in this.originSheets) {
        const ws = this.originSheets[wsname]
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 })
        sheets[wsname] = data
      }
      this.sheets = sheets
    },
    onUploadError (err, file, fileList) {
      console.error(err)
      Message.error({
        content: '上传失败：' + file.message,
        duration: 3,
        closable: true

      })
    },
    // tower input upload succeed
    async onUploadSuccess (res, file, fileList) {
      Message.success('上传成功')
      this.file = {
        ...file,
        fileId: res.body.fileId
      }
      this.getTaskInfo()
      // this.getSingleExcel()
    },
    inputChange (event, key) {
      this.data = [{
        ...this.data[0],
        config: {
          ...this.data[0].config,
          [key]: event.target.value
        }
      }]
    },
    // triggered by btn clicks
    async handleCheck (type) {
      const index = checkTypeList.findIndex(l => l === type)
      let checkMultiple = false
      this.$set(this.checkLoading, index, true)
      const mapping = {
        tower: '塔架主体',
        flange: '法兰',
        door: '门洞'
      }
      if (type === 'tower') {
        checkMultiple = true
      }
      await this.getCheckResult(type)
      this.btnChecks.splice(index, 1, true)
      this.checkMultiple = checkMultiple
      this.checkVisible = true
      this.checkTitile = '安全裕度校核 - ' + mapping[type]
    },
    async getCheckResult (type) {
      const index = checkTypeList.findIndex(l => l === type)
      return new Promise(async (resolve, reject) => {
        try {
          const res = await this.$post(`towerTasks/${this.$route.params.taskId}/codeCheck`, {
            silent: true,
            json: {
              type,
              workCase: this.towerFormValidate.workCase ? 1 : 2
            }
          })
          // imitate check loading for now
          let timeout = 600 + Math.round(Math.random() * 600)
          setTimeout(() => {
            this.$set(this.checkLoading, index, false)
            this.checkData = res.body
            resolve()
          }, timeout)
        } catch (error) {
          this.$set(this.checkLoading, index, false)
          reject(error)
        }
      })
    },
    async saveCheckResult () {
      try {
        await this.$post(`towerTasks/${this.$route.params.taskId}/save/checkedResult`, { silent: true })
        Message.success('校核结果保存成功')
      } catch (error) {
        Message.error('校核结果保存失败')
      }
    },
    // update config of tower task
    async save () {
      try {
        const res = await this.$put(`towerTasks/${this.$route.params.taskId}`, {
          silent: true,
          json: {
            remark: this.towerFormValidate.comment,
            workCase: this.towerFormValidate.workCase ? 1 : 2,
            towerAlgParams: [{
              lower: Number(this.data[0].config.algconfMin),
              upper: Number(this.data[0].config.algconfMax),
              step: Number(this.data[0].config.algconfStep)
            }],
            constraints: [
              {
                name: 'ULS_SRF',
                value: Number(this.conditionFormValidate.ULS_SRF),
                operator: 'gte'
              },
              {
                name: 'BCK_SRF',
                value: Number(this.conditionFormValidate.BCK_SRF),
                operator: 'gte'
              },
              {
                name: 'FLS_SRF',
                value: Number(this.conditionFormValidate.FLS_SRF),
                operator: 'gte'
              }]
          }
        })
        if (res.code === 0) {
          Message.success('保存成功')
          setTimeout(() => {
            this.$router.push({ name: 'towers' })
          }, 600)
          // this.getTaskInfo()
        }
      } catch (error) {
        Message.error('网络问题，保存失败')
      }
    },
    cancelEdit () {
      this.$router.push({ name: 'towers' })
    }
  }
}
</script>
