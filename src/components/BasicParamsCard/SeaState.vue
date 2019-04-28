<template>
  <div class="basic-params-card">
    <div>
      <Row class="mb-2">
        <ICol span="5" style="line-height: 32px;">
          <span class="inline-block w-24 text-right">
            海况参数表：
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
        <ICol span="5" style="line-height: 32px;">
          <span class="inline-block w-24 text-right">
            载荷参数：
          </span>
          <Upload
            class="inline-block"
            :action="loadAction"
            :show-upload-list="false"
            :on-error="onUploadError"
            :on-success="onLoadUploadSuccess">
            <Button size="small" icon="ios-cloud-upload-outline" :class="fileId ? 'uploaded-color' : ''">
              上传文件
            </Button>
          </Upload>
        </ICol>
        <ICol span="6">
          <Button
            type="info"
            class="mx-8"
            :disabled="!fileId"
            @click="createDat">
            生成模型
          </Button>
          <Button :disabled="!fileId" @click="clearTable">
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
      v-else />
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

const mapping = {
  'geometry': '几何图形参数表'
}

const datMapping = {
  'geometry': 'sacinp.dat',
  'seaState': 'seainp.dat',
  'geology': 'psiinp.dat'
}

export default {
  name: 'SeaState',
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
      loadAction: '',
      sheetdata: [],
      originSheets: {},
      datContent: '',
      datName: datMapping[this.basicType],
      isSplit: false
    }
  },
  computed: {
    ...mapState({
      fileId: state => state.foundation.seaState.fileId,
      fileName: state => state.foundation.seaState.fileName
    })
  },
  watch: {
    fileId (id) {
      if (id && id > -1) {
        this.getExcel(id)
        this.getDat(id)
      }
    }
  },
  created () {
    this.action = baseUrl + `foundations/${this.$route.params.foundationId}/upload?fileKey=seaStateBase`
    this.loadAction = baseUrl + `foundations/${this.$route.params.foundationId}/upload?fileKey=seaStateLoad`
  },
  methods: {
    ...mapMutations('foundation', ['syncSeaState']),
    async getExcel (fileId) {
      try {
        const data = await this.$ky.get(`towerTasks/stream?fileId=${fileId}`).arrayBuffer()
        this._originData = data
        var workbook = XLSX.read(data, { type: 'array' })
        const wsname = Object.keys(workbook.Sheets)[0]
        const ws = workbook.Sheets[wsname]
        const sheetdata = XLSX.utils.sheet_to_json(ws, { header: 1 })
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
      this.syncSeaState({
        seaState: {
          fileId: res.body.fileId,
          fileName: res.body.fileName
        }
      })
    },
    onLoadUploadSuccess (res, file, fileList) {
      Message.success('上传成功')
      this.syncSeaState({
        seaState: {
          fileId: res.body.fileId,
          fileName: res.body.fileName
        }
      })
    },
    async createDat () {
      const res = await this.$put(`foundations/datFile?excelId=${this.fileId}`)
      this.datContent = res.body.datText
    },
    clearTable () {

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
