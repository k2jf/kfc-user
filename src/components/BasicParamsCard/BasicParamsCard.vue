<template>
  <div class="basic-params-card">
    <div>
      <Row>
        <ICol span="6" style="line-height: 32px;" v-if="input === 'excel'">
          <span class="inline-block w-24 text-right">
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
        <!-- <ICol span="4">
          节点数：
          <Select style="width:80px" v-model="node">
            <Option :value="item" v-for="item in nodes">
              {{ item }}
            </Option>
          </Select>
        </ICol>
        <ICol span="4">
          钢材：
          <Select style="width:80px" v-model="steel">
            <Option :value="item" v-for="item in steels">
              {{ item }}
            </Option>
          </Select>
        </ICol> -->
        <ICol span="4">
          <span class="inline-block w-16 text-right">Units：</span>
          <Input style="width: 60px" />
        </ICol>
        <ICol span="4">
          <span class="inline-block w-16 text-right">P-Delta：</span>
          <Input style="width: 60px" />
        </ICol>
        <ICol span="4">
          <span class="inline-block w-16 text-right">ShearDef：</span>
          <Input style="width: 60px" />
        </ICol>
        <ICol span="4">
          <span class="inline-block w-16 text-right">No.Pns：</span>
          <Input style="width: 60px" />
        </ICol>
      </Row>
      <Row class="my-3">
        <ICol span="6">
          <span class="inline-block w-24 text-right">No.PS：</span>
          <Input style="width: 60px" />
        </ICol>
        <ICol span="4">
          <span class="inline-block w-16 text-right">No.Pns：</span>
          <Input style="width: 60px" />
        </ICol>
        <ICol span="4">
          <span class="inline-block w-16 text-right">No.Pns：</span>
          <Input style="width: 60px" />
        </ICol>
        <ICol span="4">
          <span class="inline-block w-16 text-right">No.Pns：</span>
          <Input style="width: 60px" />
        </ICol>
        <ICol span="4">
          <Button type="info">
            生成模型
          </Button>
        </ICol>
      </Row>
    </div>
    <Excel2Dat
      :excelName="fileName"
      datName="xxx.dat"
      :datContent="DAT"
      :paramType="basicType"
      :sheetdata="sheetdata"
      :ws="originSheets" />
    </Split>
  </div>
  </div>
</template>

<script>
// geometry： 几何
// seaState： 海况
// geology： 地质
import { Input, Select, Option, Upload, Row, Col, Button, Message, Split } from 'iview'
import ExcelTable from '@/components/ExcelTable'
import { baseUrl } from '@/config'
import XLSX from 'xlsx'
import mixins from '@/mixins/basicExcel.js'
import Excel2Dat from '@/components/ExcelTable/ExcelWithDat'

import DAT from './dat'

// const DataGrid2 = Object.assign({}, DataGrid, {
//   mixins: [mixins]
// })

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
    DataGrid: ExcelTable,
    Split,
    Excel2Dat
  },
  props: {
    basicType: {
      type: String,
      required: true
    },
    fileId: {
      type: Number,
      required: true
    },
    fileName: {
      type: String,
      required: true
    }
  },
  data: () => ({
    DAT,
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
    originSheets: {},
    split: 0.9
  }),
  watch: {
    fileId (id) {
      this.getExcel(id)
    }
  },
  created () {
    this.excelTitle = mapping[this.basicType]
    this.action = baseUrl + `foundations/${this.$route.params.foundationId}/upload?fileKey=${this.basicType}`
  },
  methods: {
    async getExcel (fileId) {
      try {
        const data = await this.$ky.get(`towerTasks/stream?fileId=${fileId}`).arrayBuffer()
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
    onUploadSuccess (response, file, fileList) {
      Message.success('上传成功')
      this.$emit('on-change', {
        fileId: response.body.fileId,
        fileName: response.body.fileName
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .table-wrap {
    height: 340px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    overflow: hidden;
  }

  .split-left {
    height: 300px;
  }

  .split-right {
    height: 300px;
  }
  .dat {
    height: 100%;
    overflow: auto;
  }
  h2 {
    height: 40px;
    line-height: 40px;
  }
</style>
