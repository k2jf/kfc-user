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
          <div class="w-1/2">
            <FormItem label="载荷数据来源：" prop="dataOrigin" class="w-9/10">
              {{ towerFormValidate.dataOrigin }}
              <!-- <Select disabled placeholder="请选择载荷数据来源" v-model="towerFormValidate.dataOrigin">
                <Option value="0">
                  LCC载荷
                </Option>
                <Option value="1">
                  载荷门户
                </Option>
              </Select> -->
            </FormItem>
          </div>
          <div class="w-1/2" v-if="isOnline">
            <FormItem label="仿真任务标号：" prop="simulationId" class="w-9/10">
              <Input v-model="towerFormValidate.simulationId" />
            </FormItem>
          </div>
          <div class="w-1/2" v-if="isOnline">
            <FormItem label="极限后处理任务编号：" prop="limitBackTaskId" class="w-9/10">
              <Input v-model="towerFormValidate.limitBackTaskId" />
            </FormItem>
          </div>
          <div class="w-1/2" v-if="isOnline">
            <FormItem label="疲劳后处理任务编号：" prop="fatigueBackTaskId" class="w-9/10">
              <Input v-model="towerFormValidate.fatigueBackTaskId" />
            </FormItem>
          </div>
          <Divider style="margin-top:0;" />
          <!-- Section 2 Params Excel -->
          <div class="w-1/2">
            <FormItem label="塔架设计参数表：" prop="towerDiameter" class="w-9/10">
              <Upload
                class="float-left"
                style="height: 33px;"
                :action="action"
                :show-upload-list="false"
                :on-preview="onPreview"
                :on-error="onUploadError"
                :on-success="onUploadSuccess">
                <Button size="small" icon="ios-cloud-upload-outline">
                  上传文件
                </Button>
              </Upload>
              <div class="float-left ml-3 text-blue overflow-hidden h-8" v-if="file.name">
                <span class="inline-block overflow-hidden"><Icon type="ios-link" />&ensp;</span>
                <span
                  class="inline-block whitespace-no-wrap overflow-hidden"
                  style="text-overflow: ellipsis;max-width: 250px;">
                  {{ file.name }}
                </span>
                <span class="text-grey-darker overflow-hidden inline-block ml-4 cursor-pointer">
                  <Icon type="md-close" style="margin-top: -1px;" @click.native="removeFile" />
                </span>
                <span
                  class="overflow-hidden inline-block ml-2 cursor-pointer font-bold"
                  @click="viewTable">
                  查看
                </span>
                <Excel
                  title="塔架设计参数表"
                  :visible="visible"
                  :sheets="sheets"
                  :originSheets="originSheets"
                  @on-ok="onExcelOk"
                  @on-cancel="onExcelCancel" />
              </div>
            </FormItem>
          </div>
          <div class="w-1/2">
            <FormItem label="塔架高度：" prop="towerHeight" class="w-9/10">
              <Input v-model="towerFormValidate.towerHeight" />
            </FormItem>
          </div>
          <div class="w-1/2">
            <FormItem label="塔底直径（m）：" prop="towerDiameter" class="w-9/10">
              <Input v-model="towerFormValidate.towerDiameter" />
            </FormItem>
          </div>
          <div class="w-1/2">
            <FormItem label="塔底疲劳载荷Mxy(kNm)：" prop="fatiguePalyload" class="w-9/10">
              <Input v-model="towerFormValidate.fatiguePalyload" />
            </FormItem>
          </div>
          <Divider style="margin-top:0;" />
          <!-- Section 3 Markov -->
          <div class="w-1/2">
            <FormItem label="马尔科夫矩阵：" prop="markov" class="w-9/10">
              <UploadButton
                :action="markovAction"
                :files="markovFiles"
                :display="display"
                @multiple-upload="multipleUpload"
                @on-clear="removeMarkov" />
            </FormItem>
          </div>
          <div class="w-1/2">
            <FormItem label="塔底极限载荷Mxy(kNm)：" prop="limitPayload" class="w-9/10">
              <Input v-model="towerFormValidate.limitPayload" />
            </FormItem>
          </div>
          <div class="w-1/2">
            <FormItem label="塔架段数：" prop="towerLegNum" class="w-9/10">
              <Input v-model="towerFormValidate.towerLegNum" />
            </FormItem>
          </div>
          <div class="w-1/2">
            <FormItem label="单工况：" prop="towerDiameter" class="w-9/10">
              <ISwitch v-model="towerFormValidate.switch">
                <span slot="open">开</span>
                <span slot="close">关</span>
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
          <div class="w-full">
            <div class="buttons float-right" style="margin-right: 60px;">
              <Button style="background-color:#9561e2;border-color:#9561e2;" type="primary">
                塔架校核
              </Button>
              <Button class="ml-3" type="primary">
                法兰校核
              </Button>
              <Button class="ml-3" type="primary">
                门洞校核
              </Button>
              <Button class="ml-3" disabled>
                保存审核结果
              </Button>
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
                <Option value="beijing">
                  算法一
                </Option>
              </Select>
            </FormItem>
          </ICol>
          <ICol span="12">
            <FormItem label="迭代参数" prop="iterationParams" class="w-9/10">
              <Select placeholder="请选择迭代参数" v-model="algorithmFormValidate.iterationParams">
                <Option value="beijing">
                  迭代参数一
                </Option>
              </Select>
            </FormItem>
          </ICol>
          <ICol span="24">
            <FormItem label="迭代参数" prop="iterationParams" class="w-9/10">
              <Table />
            </FormItem>
          </ICol>
        </Row>
      </Form>
    </Fiche>
    <Fiche title="约束条件" class="my-6">
      <Form
        :model="conditionFormValidate"
        :rules="conditionRuleValidate"
        :label-width="120"
        ref="conditionFormValidate">
        <Row>
          <ICol span="6">
            <FormItem label="SRF_BCKlimt >= " prop="SRF_BCKlimt" class="w-9/10">
              <Input v-model="conditionFormValidate.SRF_BCKlimt" />
            </FormItem>
          </ICol>
          <ICol span="6">
            <FormItem label="SRF_ULSlimt >= " prop="SRF_ULSlimt" class="w-9/10">
              <Input v-model="conditionFormValidate.SRF_ULSlimt" />
            </FormItem>
          </ICol>
          <ICol span="6">
            <FormItem label="SRF_FLSlimt >= " prop="SRF_FLSlimt" class="w-9/10">
              <Input v-model="conditionFormValidate.SRF_FLSlimt" />
            </FormItem>
          </ICol>
        </Row>
      </Form>
    </Fiche>
    <div class="text-center mb-6">
      <Button type="primary">
        保存
      </Button>
      <Button class="ml-3">
        取消
      </Button>
    </div>
  </div>
</template>
<script>
import { Upload, Button, Row, Col, Input, Form, FormItem, Select, Table, Option, Switch, Icon, Message, Divider } from 'iview'
import Fiche from '@/components/Fiche'
import Excel from '@/components/Excel'
import { UploadButton } from '@/components/MultipleUpload'
import XLSX from 'xlsx'
import { baseUrl, sheetJSFT } from '@/config'

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
    Divider
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
      towerFormValidate: {
        // projectName: 'xxx项目H1-2',
        // taskName: 'xxxxxx',
        // towerHeight: 100,
        // towerDiameter: 0.5,
        // towerLegNum: 3,
        // dataOrigin: '',
        // fatiguePalyload: 0.5,
        // limitPayload: 0.5,
        // switch: true,
        // comment: ''
      },
      algorithmFormValidate: {

      },
      conditionFormValidate: {

      },
      algorithmRuleValidate: {

      },
      conditionRuleValidate: {

      },
      towerRuleValidate: {
        dataOrigin: [
          { required: true, message: '不能为空', trigger: 'none' }
        ],
        towerHeight: [
          { required: true, message: '不能为空', trigger: 'none' }
        ],
        towerDiameter: [
          { required: true, message: '不能为空', trigger: 'none' }
        ],
        towerLegNum: [
          { required: true, message: '不能为空', trigger: 'none' }
        ],
        fatiguePalyload: [
          { required: true, message: '不能为空', trigger: 'none' }
        ],
        limitPayload: [
          { required: true, message: '不能为空', trigger: 'none' }
        ]
      }
    }
  },
  computed: {
    display () {
      return this.markovFiles.length > 0 ? '点击查看' : '文件上传'
    }
  },
  mounted () {
    this.action = `${baseUrl}towerTasks/${this.$route.params.taskId}/upload?fileKey=towerInput`
    this.markovAction = `${baseUrl}towerTasks/${this.$route.params.taskId}/upload?fileKey=markov`
    this.getTaskInfo()
  },
  methods: {
    // Task Infos
    async getTaskInfo () {
      try {
        const res = await this.$get('towerTasks/' + this.$route.params.taskId)
        const towerFormValidate = {
          projectName: res.body.projectName,
          taskName: res.body.taskName,
          // towerHeight: 100,
          // towerDiameter: 0.5,
          // towerLegNum: 3,
          dataOrigin: res.body.isOnline ? '载荷门户' : 'LCC载荷'
          // fatiguePalyload: 0.5,
          // limitPayload: 0.5,
          // switch: true,
          // comment: ''
        }
        this.isOnline = res.body.isOnline
        this.towerFormValidate = towerFormValidate

        if (res.body.fileInputs.length > 0) {
          const towerInput = res.body.fileInputs.find(f => f.fileKey === 'towerInput')
          const markov = res.body.fileInputs.find(f => f.fileKey === 'markov')
          if (towerInput) {
            this.file = {
              name: towerInput.fileNames[0]
            }
            this.getSingleExcel()
          }
          if (markov) {
            this.markovFiles = markov.fileNames.map(f => ({ name: f }))
          }
        }
      } catch (error) {

      }
    },
    // Get task design excel form server
    async getSingleExcel () {
      const id = this.$route.params.taskId
      try {
        const data = await this.$ky.get(`towerTasks/${id}/stream?fileKey=towerInput`).arrayBuffer()
        this.originData = data
        var workbook = XLSX.read(data, { type: 'array' })
        const sheets = {}
        // console.log(workbook.Sheets)
        for (let wsname in workbook.Sheets) {
          const ws = workbook.Sheets[wsname]
          const data = XLSX.utils.sheet_to_json(ws, { header: 1 })
          sheets[wsname] = data
        }

        this.sheets = sheets
        this.originSheets = workbook.Sheets
      } catch (error) {
        console.log('see errors ======> ', error)
      }
    },
    async removeFile () {
      // delete server excel file
      try {
        const res = await this.$delete(`towerTasks/${this.$route.params.taskId}/inputFile?fileKey=towerInput`, { silent: true })
        if (res.code === 0) {
          Message.success('删除成功')
          this.file = {}
          this.sheets = {}
          this.originSheets = {}
        }
      } catch (error) {
        Message.error('删除失败')
      }
    },
    async removeMarkov () {
      try {
        const res = await this.$delete(`towerTasks/${this.$route.params.taskId}/inputFile?fileKey=markov`, { silent: true })
        if (res.code === 0) {
          this.markovFiles = []
          Message.success('删除成功')
        }
      } catch (error) {
        Message.error('删除失败')
      }
    },
    viewTable () {
      this.visible = true
    },
    async onExcelOk (wbout) {
      var formdata = new FormData()
      const data = new Blob([wbout], { type: 'application/octet-stream' })
      console.log(data)
      formdata.append('file', data, this.file.name)
      const url = `towerTasks/${this.$route.params.taskId}/upload?fileKey=towerInput`
      const res = await this.$post(url, {
        headers: null,
        body: formdata
      })
      if (res.code === 0) {
        this.getSingleExcel()
      }

      this.visible = false
    },
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
      Message.error('上传失败：' + file.message)
    },
    async onUploadSuccess (res, file, fileList) {
      Message.success('上传成功')
      this.file = file
      this.getSingleExcel()
    },
    onPreview (file) {

    },
    async multipleUpload (toBeUploadList) {
      let formData = new FormData()
      toBeUploadList.forEach(t => {
        formData.append('files', t.file, t.name)
      })
      try {
        const res = await this.$post(`towerTasks/${this.$route.params.taskId}/batchUpload?fileKey=markov`, {
          headers: null,
          body: formData
        })
        if (res.code === 0) Message.success('马尔科夫文件上传成功')
      } catch (error) {
        Message.error('马尔科夫文件上传失败')
      }
    }
  }
}
</script>
<style lang="less" scoped>

</style>
