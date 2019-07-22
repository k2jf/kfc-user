<template>
  <div class="basic-params-card">
    <div>
      <Row class="mb-2">
        <ICol span="5" style="line-height: 32px;">
          <span class="inline-block w-24 text-right">
            地质参数表：
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
        <ICol span="10">
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
import { Upload, Row, Col, Button, Message } from 'iview'
import { baseUrl } from '@/config'
import XLSX from 'xlsx'
import ExcelWithDat from '@/components/ExcelTable/ExcelWithDat'
import Excel2Dat from '@/components/ExcelTable/Excel2Dat'

import { mapState, mapMutations } from 'vuex'

const templateName = 'Geology.xlsx'

export default {
  name: 'Geology',
  components: {
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
      name: '',
      action: '',
      sheetdata: [],
      originSheets: {},
      datContent: '',
      datName: 'psiinp.dat',
      isSplit: false,
      wsname: ''
    }
  },
  computed: {
    ...mapState({
      fileId: state => state.foundation.geology.fileId,
      fileName: state => state.foundation.geology.fileName || templateName
    })
  },
  watch: {
    fileId (id) {
      this.getExcel(id)
      if (id && id > -1) this.getDat(id)
    }
  },
  created () {
    this.action = baseUrl + `foundations/${this.$route.params.foundationId}/upload?fileKey=geology`
  },
  mounted () {
    this.getExcel(this.fileId)
  },
  methods: {
    ...mapMutations('foundation', ['syncGeology']),
    async getExcel (fileId) {
      try {
        let data
        if (fileId) {
          data = await this.$ky.get(`foundations/stream?fileId=${fileId}`).arrayBuffer()
        } else {
          data = await this.$ky.get(`foundations/${this.$route.params.foundationId}/fileTemplate?fileKey=${this.basicType}`).arrayBuffer()
        }
        this._originData = data
        var workbook = XLSX.read(data, { type: 'array' })
        const wsname = Object.keys(workbook.Sheets)[0]
        this.wsname = wsname
        const ws = workbook.Sheets[wsname]

        let range = ws['!ref']
        range = 'A1:' + range.split(':')[1]
        ws['!ref'] = range

        const sheetdata = XLSX.utils.sheet_to_json(ws, { range, header: 1 })
        this.sheetdata = sheetdata
        this.originSheets = ws
      } catch (error) {

      }
    },
    async getDat (fileId) {
      const res = await this.$get(`foundations/datFile?excelId=${this.fileId}`)
      this.datContent = res.body.datText
    },
    onUploadError () {
      Message.error('上传失败')
    },
    onUploadSuccess (res, file, fileList) {
      Message.success('上传成功')
      this.syncGeology({
        geology: {
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
        const wbout = XLSX.write(workbook, wopts, this.wsname)
        const formdata = new FormData()
        const data = new Blob([wbout], { type: 'application/octet-stream' })
        formdata.append('file', data, this.fileName)
        const url = `foundations/${this.$route.params.foundationId}/upload?fileKey=${this.basicType}`
        const res = await this.$post(url, {
          headers: null,
          body: formdata
        })
        if (res.code === 0) {
          this.syncGeology({
            geology: {
              fileId: res.body.fileId,
              fileName: res.body.fileName
            }
          })
        }
      })
    },
    async clearTable () {
      this.datContent = ''
      this.syncGeology({
        geology: {}
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
