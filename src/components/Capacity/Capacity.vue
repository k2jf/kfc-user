<template>
  <div class="capacity">
    <Row style="line-height: 32px;margin-bottom: 10px;">
      <ICol span="4">
        承载力参数表：
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
      <ICol span="3">
        是否嵌岩：
        <ISwitch v-model="inlaidRock" @on-change="onChange">
          <span slot="open">是</span>
          <span slot="close">否</span>
        </ISwitch>
      </ICol>
      <ICol span="3" v-if="inlaidRock">
        是否中等风化：
        <ISwitch v-model="mediumWeathering">
          <span slot="open">是</span>
          <span slot="close">否</span>
        </ISwitch>
      </ICol>
      <ICol span="4" v-if="inlaidRock">
        抗压端阻力折减系数：
        <Input style="width: 60px" v-model="dragReductionFactor" />
      </ICol>
      <ICol span="3">
        桩腿类型：
        <Select style="width: 60px" v-model="pileShaft">
          <Option value="straight">
            直桩
          </Option>
          <Option value="inclined">
            斜桩
          </Option>
        </Select>
      </ICol>
      <ICol span="3" v-if="pileShaft === 'inclined'">
        斜率：
        <Input style="width: 60px" v-model="slope" />
      </ICol>
      <ICol span="3">
        <Button type="primary" @click="computeCapacity">
          计算承载力
        </Button>
      </ICol>
    </Row>
    <div class="wrap" :style="wrapStyle">
      <h2 class="text-sm bg-grey-lighter pl-2 relative">
        {{ excelName }}
      </h2>
      <div style="height:calc(100% - 40px)">
        <ExcelTable
          name="capacity"
          :sheetdata="sheetdata"
          :ws="originSheets"
          ref="capacityTable" />
      </div>
    </div>
  </div>
</template>

<script>
import { Row, Col, Button, Upload, Switch, Input, Select, Option } from 'iview'
import { baseUrl } from '@/config'
import XLSX from 'xlsx'
import ExcelTable from '@/components/ExcelTable'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'Capacity',
  components: {
    Row,
    ICol: Col,
    Button,
    Upload,
    ISwitch: Switch,
    Input,
    Select,
    Option,
    ExcelTable
  },
  props: {
    excelId: {
      type: Number
    }
  },
  data () {
    return {
      action: '',
      inlaidRock: true,
      mediumWeathering: true,
      dragReductionFactor: '',
      pileShaft: 'straight',
      slope: '',
      sheetdata: [],
      originSheets: {},
      excelName: 'inlaidRock_BC.xlsx'
    }
  },
  computed: {
    ...mapState({
      fileId: state => state.foundation.capacity.fileId,
      fileName: state => state.foundation.capacity.fileName,
      config: state => state.foundation.capacity.config
    }),
    wrapStyle () {
      return {
        height: this.sheetdata.length * 25 + 40 + 'px'
      }
    }
  },
  watch: {
    fileId: {
      handler: function (id) {
        this.getExcel(id)
      },
      immediate: true
    },
    config: {
      handler: function (values) {
        if (values) {
          this.inlaidRock = values.type === 'inlaidRock'
          this.mediumWeathering = values.mediumWeathering
          this.dragReductionFactor = values.dragReductionFactor
          this.pileShaft = values.pileShaft
          this.slope = values.slope || ''
        }
      }
    }
  },
  mounted () {
    this.action = baseUrl + `foundations/${this.$route.params.foundationId}/upload?fileKey=bearingCapacity`
    // this.getExcel()
  },
  beforeDestroy () {
    this.syncCapacity({ capacity: {} })
  },
  methods: {
    ...mapMutations('foundation', ['syncCapacity']),
    async getExcel (id) {
      const type = this.inlaidRock ? 'inlaidRock' : 'nonInlaidRock'
      let data
      if (id) {
        data = await this.$ky(`foundations/stream?fileId=${id}`).arrayBuffer()
        this.excelName = this.fileName
      } else {
        data = await this.$ky.get(`foundations/${this.$route.params.foundationId}/BC/fileTemplate?type=${type}`).arrayBuffer()
      }
      this._originData = data
      const workbook = XLSX.read(data, { type: 'array' })
      const wsname = Object.keys(workbook.Sheets)[0]
      const ws = workbook.Sheets[wsname]
      // ======================================================
      // !IMPORTANT
      // SheetJs will remove no-value row or column, set begin to 'A1'
      // to make sure that display is as same as Excel upload.
      let range = ws['!ref']
      range = 'A1:' + range.split(':')[1]
      ws['!ref'] = range
      // ======================================================
      const sheetdata = XLSX.utils.sheet_to_json(ws, { range, header: 1 })
      this.sheetdata = sheetdata
      this.originSheets = ws
      this.preData = this.transformData(sheetdata)
    },
    onUploadError (error, file) {
      console.error(error)
      this.$Message.error(file.message)
    },
    onUploadSuccess (res, file, fileList) {
      this.$Message.success('上传成功')
      this.excelName = res.body.fileName
      // this.getExcel(res.body.fileId)
      // this.fileId = res.body.fileId
      this.syncCapacity({ capacity: res.body })
    },
    onChange (status) {
      if (this.fileId) return false
      if (status) {
        this.excelName = 'inlaidRock_BC.xlsx'
      } else {
        this.excelName = 'nonInlaidRock_BC.xlsx'
      }
      this.getExcel()
    },
    // 格式转换
    transformData (data) {
      if (data.length === 0) return []
      const formatSheetdata = []
      const range = XLSX.utils.decode_range(this.originSheets['!ref'])
      for (let i = 0; i < data.length; i++) {
        const objData = {}
        for (var k = range.s.c; k <= range.e.c; k++) {
          const key = XLSX.utils.encode_col(k)
          objData[key] = data[i][k] || ''
        }
        formatSheetdata.push(objData)
      }
      return formatSheetdata
    },
    async computeCapacity () {
      const body = {}
      if (this.inlaidRock) {
        body.type = 'inlaidRock'
        body.mediumWeathering = this.mediumWeathering
        body.dragReductionFactor = Number(this.dragReductionFactor)
      } else {
        body.type = 'nonInlaidRock'
      }
      body.pileShaft = this.pileShaft
      if (this.pileShaft === 'inclined') {
        body.slope = Number(this.slope)
      }
      const res = await this.$put(`foundations/bearingCapacity?excelId=${this.fileId}`, {
        json: body
      })
      this.$parent.$parent.$parent.$parent.syncCapacityConfig({
        compression: res.body.compressionBcValue.toFixed(2),
        tension: res.body.tensionBcValue.toFixed(2)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.wrap {
    // height: 340px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    overflow: hidden;

    h2 {
      height: 40px;
      line-height: 40px;
    }
  }
</style>
