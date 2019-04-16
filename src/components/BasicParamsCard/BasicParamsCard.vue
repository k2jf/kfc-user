<template>
  <div class="basic-params-card">
    <div>
      <Row>
        <ICol span="5">
          参数维护方式：
          <Select style="width:100px" v-model="input">
            <Option value="manual">
              手动录入
            </Option>
            <Option value="excel">
              上传Excel
            </Option>
          </Select>
        </ICol>
        <ICol span="5">
          文件名称：
          <Input style="width:100px" v-model="name" />
          .dat
        </ICol>
        <ICol span="6" style="line-height: 32px;" v-if="input === 'excel'">
          <span class="inline-block ml-6">
            {{ excelTitle }}：
          </span>
          <Upload
            class="inline-block"
            :action="action"
            :show-upload-list="false"
            :on-error="onUploadError"
            :on-success="onUploadSuccess">
            <Button size="small" icon="ios-cloud-upload-outline">
              上传文件
            </Button>
          </Upload>
        </ICol>
        <ICol span="4">
          节点数：
          <Select style="width:80px" v-model="node">
            <!-- eslint-disable-next-line -->
            <Option :value="item" v-for="item in nodes">
              {{ item }}
            </Option>
          </Select>
        </ICol>
        <ICol span="4">
          钢材：
          <Select style="width:80px" v-model="steel">
            <!-- eslint-disable-next-line -->
            <Option :value="item" v-for="item in steels">
              {{ item }}
            </Option>
          </Select>
        </ICol>
      </Row>
    </div>
    <div style="height: 300px" class="mt-6">
      <DataGrid
        :name="basicType"
        :sheetdata="sheetdata"
        :ws="originSheets" />
    </div>
  </div>
</template>

<script>
// geometry： 几何
// seaState： 海况
// geology： 地质
import { Input, Select, Option, Upload, Row, Col, Button, Message } from 'iview'
import DataGrid from '@/components/DataGrid'
import { baseUrl } from '@/config'
import XLSX from 'xlsx'
import mixins from '@/mixins/basicExcel.js'

console.log(mixins)

const DataGrid2 = Object.assign({}, DataGrid, {
  mixins: [mixins]
})

const mapping = {
  'geometry': '几何图形参数表'
}

export default {
  name: 'BasicParamsCard',
  components: {
    Input,
    Select,
    Option,
    Upload,
    Row,
    ICol: Col,
    Button,
    DataGrid: DataGrid2
  },
  props: {
    basicType: {
      type: String,
      required: true
    },
    geometryInfo: {
      type: Object
    }
  },
  data: () => ({
    input: 'excel',
    name: '',
    nodes: [1, 2, 3, 4, 5, 6, 7],
    node: 7,
    steels: ['Q345', 'Q346', 'Q347', 'Q348', 'Q349'],
    steel: 'Q345',
    excelTitle: '',
    action: '',
    projectName: '',
    baseUltimate: 0,
    sheetdata: [],
    originSheets: {}
  }),
  watch: {
    geometryInfo () {
      this.getExcel()
    }
  },
  created () {
    this.excelTitle = mapping[this.basicType]
    this.action = baseUrl + `baseTasks/${this.$route.params.basicId}/upload?fileKey=${this.basicType}`
  },
  methods: {
    async getExcel () {
      try {
        const data = await this.$ky.get(`towerTasks/stream?fileId=${this.geometryInfo.fileId}`).arrayBuffer()
        this._originData = data
        var workbook = XLSX.read(data, { type: 'array' })
        // ??? 几何，海况，地质 sheet页固定吗 暂时按一个 sheet 页处理
        const wsname = Object.keys(workbook.Sheets)[0]
        const ws = workbook.Sheets[wsname]
        const sheetdata = XLSX.utils.sheet_to_json(ws, { header: 1 })
        this.sheetdata = sheetdata
        this.originSheets = ws
      } catch (error) {

      }
    },
    onUploadError () {

    },
    onUploadSuccess () {

    }
  }
}
</script>
