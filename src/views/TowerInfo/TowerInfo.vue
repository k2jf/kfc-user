<template>
  <div class="tower-info h-full p-3">
    <Fiche title="塔架信息">
      <Form
        :model="formValidate"
        :rules="ruleValidate"
        :label-width="180"
        ref="formValidate">
        <Row>
          <!-- 第一行 -->
          <ICol span="12">
            <FormItem label="项目名称：" class="w-9/10">
              <span>{{ formValidate.projectName }}</span>
            </FormItem>
          </ICol>
          <ICol span="12">
            <FormItem label="任务名称：">
              <span>{{ formValidate.taskName }}</span>
            </FormItem>
          </ICol>
          <!-- 第二行 -->
          <ICol span="12">
            <FormItem label="载荷数据来源：" prop="dataOrigin" class="w-9/10">
              <Select placeholder="请选择载荷数据来源" v-model="formValidate.dataOrigin">
                <Option value="beijing">
                  New York
                </Option>
                <Option value="shanghai">
                  London
                </Option>
                <Option value="shenzhen">
                  Sydney
                </Option>
              </Select>
            </FormItem>
          </ICol>
          <ICol span="12">
            <FormItem label="塔架设计参数表：" prop="towerDiameter" class="w-9/10">
              <Upload
                class="float-left"
                style="height: 33px;"
                :before-upload="handleUpload"
                action="ilikeyou">
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
              </div>
            </FormItem>
          </ICol>
          <!-- 第三行 -->
          <ICol span="12">
            <FormItem label="塔架高度：" prop="towerHeight" class="w-9/10">
              <Input v-model="formValidate.towerHeight" />
            </FormItem>
          </ICol>
          <ICol span="12">
            <FormItem label="塔底直径（m）：" prop="towerDiameter" class="w-9/10">
              <Input v-model="formValidate.towerDiameter" />
            </FormItem>
          </ICol>
          <!-- 第四行 -->
          <ICol span="12">
            <FormItem label="塔底疲劳载荷Mxy(kNm)：" prop="fatiguePalyload" class="w-9/10">
              <Input v-model="formValidate.fatiguePalyload" />
            </FormItem>
          </ICol>
          <ICol span="12">
            <FormItem label="塔底极限载荷Mxy(kNm)：" prop="limitPayload" class="w-9/10">
              <Input v-model="formValidate.limitPayload" />
            </FormItem>
          </ICol>
          <!-- 第五行 -->
          <ICol span="12">
            <FormItem label="塔架段数：" prop="towerLegNum" class="w-9/10">
              <Input v-model="formValidate.towerLegNum" />
            </FormItem>
          </ICol>
          <ICol span="12">
            <FormItem label="单工况：" prop="towerDiameter" class="w-9/10">
              <ISwitch v-model="formValidate.switch">
                <span slot="open">开</span>
                <span slot="close">关</span>
              </ISwitch>
            </FormItem>
          </ICol>
          <!-- 第六行 -->
          <ICol span="24">
            <FormItem label="备注：" prop="comment" style="width: 95%;">
              <Input
                type="textarea"
                :autosize="{minRows: 2,maxRows: 5}"
                v-model="formValidate.comment"></Input>
            </FormItem>
          </ICol>
          <!-- 按钮 -->
          <ICol span="24">
            <div class="buttons float-right" style="margin-right: 60px;">
              <Button>塔架校核</Button>
              <Button class="ml-3">
                法兰校核
              </Button>
              <Button class="ml-3">
                门洞校核
              </Button>
              <Button class="ml-3">
                保存审核结果
              </Button>
            </div>
          </ICol>
        </Row>
      </Form>
      <Excel
        title="塔架设计参数表"
        :visible="visible"
        :sheets="sheets"
        @on-ok="onExcelOk"
        @on-cancel="onExcelCancel" />
    </Fiche>
  </div>
</template>
<script>
import { Upload, Button, Row, Col, Input, Form, FormItem, Select, Option, Switch, Icon } from 'iview'
import Fiche from '@/components/Fiche'
import Excel from '@/components/Excel'
import XLSX from 'xlsx'
import { sheetJSFT, makeCols } from '@/config'

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
    Excel
  },
  data () {
    return {
      visible: false,
      sheetJSFT,
      sheets: {},
      file: { name: '' },
      formValidate: {
        projectName: 'xxx项目H1-2',
        taskName: 'xxxxxx',
        towerHeight: 100,
        towerDiameter: 0.5,
        towerLegNum: 3,
        dataOrigin: '',
        fatiguePalyload: 0.5,
        limitPayload: 0.5,
        switch: true,
        comment: ''
      },
      ruleValidate: {
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
  methods: {
    handleUpload (file) {
      this.file = file
      this.readFile(file)
      return false
    },
    handleFileChange (evt) {
      const files = evt.target.files
      if (files && files[0]) this.readFile(files[0])
    },
    readFile (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const bstr = e.target.result
        const wb = XLSX.read(bstr, { type: 'array', cellStyles: true })
        const sheets = {}
        console.log(wb.Sheets)
        for (let wsname in wb.Sheets) {
          const ws = wb.Sheets[wsname]
          const data = XLSX.utils.sheet_to_json(ws, { header: 1 })
          sheets[wsname] = data
        }

        this.sheets = sheets
        console.log(sheets)
        // this.cols = makeCols(ws['!ref'])
      }
      reader.readAsArrayBuffer(file)
    },
    removeFile () {
      this.file = {}
    },
    viewTable () {
      this.visible = true
    },
    onExcelOk () {
      this.visible = false
    },
    onExcelCancel () {
      this.visible = false
    }
  }
}
</script>
<style lang="less" scoped>

</style>
