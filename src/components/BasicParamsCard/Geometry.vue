<template>
  <div class="basic-params-card">
    <div>
      <Row>
        <ICol span="4" style="line-height: 32px;">
          <span class="inline-block w-24 text-right">
            {{ excelTitle }}：
          </span>
          <Upload
            class="inline-block"
            :action="action"
            :show-upload-list="false"
            :on-error="onUploadError"
            :on-success="onUploadSuccess">
            <Button size="small" icon="ios-cloud-upload-outline" :class="fileId ? 'uploaded-color' : ''">
              上传文件
            </Button>
          </Upload>
        </ICol>
        <ICol span="4">
          <span class="inline-block w-24 text-right">Units：</span>
          <Input style="width: 60px" v-model="units" />
        </ICol>
        <ICol span="4">
          <span class="inline-block w-24 text-right">P-Delta：</span>
          <Input style="width: 60px" v-model="pDelta" />
        </ICol>
        <ICol span="4">
          <span class="inline-block w-24 text-right">ShearDef：</span>
          <Input style="width: 60px" v-model="shearDef" />
        </ICol>
        <ICol span="4">
          <span class="inline-block w-24 text-right">No.Pns：</span>
          <Input style="width: 60px" v-model="no_PNS" />
        </ICol>
        <ICol span="4">
          <span class="inline-block w-24 text-right">No.PS：</span>
          <Input style="width: 60px" v-model="no_PS" />
        </ICol>
      </Row>
      <Row class="my-3">
        <ICol span="4">
          <span class="inline-block w-24 text-right">Codes：</span>
          <Input style="width: 60px" v-model="codes" />
        </ICol>
        <ICol span="4">
          <span class="inline-block w-24 text-right">PL Theory：</span>
          <Input style="width: 60px" v-model="plTheory" />
        </ICol>
        <ICol span="4">
          <span class="inline-block w-24 text-right">LRFD PHI：</span>
          <Input style="width: 60px" v-model="lrfdPHI" />
        </ICol>
        <ICol span="6">
          <Button
            type="info"
            class="mx-8"
            @click="createDat">
            生成模型
          </Button>
          <Button @click="clearTable">
            清空表格
          </Button>
        </ICol>
      </Row>
    </div>
    <Excel2Dat
      :excelName="fileName"
      :datName="datName"
      :datContent="datContent"
      :paramType="basicType"
      :sheetdata="sheetdata"
      :ws="originSheets"
      v-if="isSplit" />
    <ExcelWithDat
      :excelName="fileName"
      :datName="datName"
      :datContent="datContent"
      :paramType="basicType"
      :sheetdata="sheetdata"
      :ws="originSheets"
      v-else
      ref="excelWithDat" />
    <div class="transform text-right mt-2">
      <a href="javascript:void 0" class="ido-link" @click="isSplit = !isSplit">
        改变dat显示方式
      </a>
    </div>
  </div>
</template>

<script>
// geometry： 几何
// seaState： 海况
// geology： 地质
import { Input, Upload, Row, Col, Button, Message } from 'iview'
import { baseUrl } from '@/config'
import XLSX from 'xlsx'
import ExcelWithDat from '@/components/ExcelTable/ExcelWithDat'
import Excel2Dat from '@/components/ExcelTable/Excel2Dat'

import { mapState, mapMutations } from 'vuex'

const templateName = 'Monopile.xlsx'

const datMapping = {
  'geometry': 'sacinp.dat',
  'seaState': 'seainp.dat',
  'geology': 'psiinp.dat'
}

export default {
  name: 'Geometry',
  components: {
    Input,
    Upload,
    Row,
    ICol: Col,
    Button,
    Excel2Dat,
    ExcelWithDat

  },
  props: {
    basicType: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      input: 'excel',
      name: '',
      excelTitle: '',
      action: '',
      sheetdata: [],
      originSheets: {},
      datContent: '',
      datName: datMapping[this.basicType],
      isSplit: false,
      codes: '',
      lrfdPHI: '',
      no_PNS: '',
      no_PS: '',
      pDelta: '',
      plTheory: '',
      shearDef: '',
      units: '',
      wsname: ''
    }
  },
  computed: {
    ...mapState({
      fileId: state => state.foundation.geometry.fileId,
      fileName: state => state.foundation.geometry.fileName || templateName
    })
  },
  watch: {
    fileId (id) {
      this.getExcel(id)
      if (id && id > -1) this.getDat(id)
    }
  },
  mounted () {
    this.excelTitle = '几何图形参数表'
    this.action = baseUrl + `foundations/${this.$route.params.foundationId}/upload?fileKey=${this.basicType}`
    this.getExcel(this.fileId)
  },
  methods: {
    ...mapMutations('foundation', ['syncGeometry']),
    async getExcel (fileId) {
      try {
        let data
        if (fileId) {
          data = await this.$ky.get(`foundations/stream?fileId=${fileId}`).arrayBuffer()
        } else {
          data = await this.$ky.get(`foundations/${this.$route.params.foundationId}/fileTemplate?fileKey=${this.basicType}`).arrayBuffer()
        }
        this._originData = data
        const workbook = XLSX.read(data, { type: 'array' })
        const wsname = Object.keys(workbook.Sheets)[0]
        this.wsname = wsname
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
      } catch (error) {

      }
    },
    async getDat (fileId) {
      try {
        const res = await this.$get(`foundations/datFile?excelId=${this.fileId}`)
        this.datContent = res.body.datText
      } catch (error) {
        Message.error(error)
      }
    },
    onUploadError () {
      Message.error('上传失败')
    },
    onUploadSuccess (res, file, fileList) {
      Message.success('上传成功')
      this.syncGeometry({
        geometry: {
          fileId: res.body.fileId,
          fileName: res.body.fileName
        }
      })
    },
    async createDat () {
      await this.updateExcel()
      const res = await this.$put(`foundations/datFile?excelId=${this.fileId}`)
      this.datContent = res.body.datText
    },
    async updateExcel () {
      return new Promise(async (resolve, reject) => {
        const workbook = XLSX.utils.book_new()
        const _ws = this.$refs.excelWithDat.$refs.excelTable.dataGrid.data
        const ws = XLSX.utils.aoa_to_sheet(_ws.map(w => Object.values(w)))
        XLSX.utils.book_append_sheet(workbook, ws, this.wsname)
        const wopts = { bookType: 'xlsx', type: 'array' }
        const wbout = XLSX.write(workbook, wopts)
        const formdata = new FormData()
        const data = new Blob([wbout], { type: 'application/octet-stream' })
        formdata.append('file', data, templateName)
        const url = `foundations/${this.$route.params.foundationId}/upload?fileKey=${this.basicType}`
        const res = await this.$post(url, {
          headers: null,
          body: formdata
        })
        if (res.code === 0) {
          console.log(res)
          // this.file = {
          //   ...this.file,
          //   fileId: res.body.fileId
          // }
          // this.getTaskInfo()
        }
      })
    },
    async clearTable () {
      if (this.fileId) await this.$delete(`foundations/file?fileId=${this.fileId}`)
      this.datContent = ''
      this.syncGeometry({
        geometry: {}
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
<style lang="less">
  .uploaded-color {
    border-color: #51d88a;

    &:active {
      color: #51d88a;
      border-color: #51d88a;
    }
    &:hover {
      color: #51d88a;
      border-color: #51d88a;
    }
    i, span {
      color: #51d88a;
    }
  }
</style>
