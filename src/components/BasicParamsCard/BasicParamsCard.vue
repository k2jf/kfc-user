<template>
  <div class="basic-params-card">
    <Row>
      <slot name="params"></slot>
      <ICol span="7">
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
    <!-- <Excel2Dat
      :excelName="fileName"
      :datName="datName"
      :datContent="datContent"
      :paramType="basicType"
      :sheetdata="sheetdata"
      :ws="originSheets"
      v-if="isSplit"
      ref="excel2Dat" /> -->
    <ExcelWithDat
      :excelName="fileName"
      :datName="datName"
      :datContent="datContent"
      :paramType="basicType"
      :sheetdata="sheetdata"
      :ws="originSheets"
      ref="excelWithDat" />
    <!-- <div class="transform text-right mt-2">
      <a href="javascript:void 0" class="ido-link" @click="isSplit = !isSplit">
        改变dat显示方式
      </a>
    </div> -->
  </div>
</template>

<script>
import { Row, Col, Button, Message } from 'iview'

import XLSX from 'xlsx'
import ExcelWithDat from '@/components/ExcelTable/ExcelWithDat'
import Excel2Dat from '@/components/ExcelTable/Excel2Dat'

import { mapState } from 'vuex'

import { datMap, mutationMap, templateNameMap } from './mapping'

export default {
  name: 'BasicParamsCard',
  components: {
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
      sheetdata: [],
      originSheets: {},
      datContent: '',
      datName: datMap[this.basicType],
      isSplit: false
    }
  },
  computed: {
    ...mapState({
      fileId (state) {
        return state.foundation[this.basicType].fileId
      },
      fileName (state) {
        return state.foundation[this.basicType].fileName || templateNameMap[this.basicType]
      },
      config (state) {
        return state.foundation[this.basicType].config || {}
      }
    })
  },
  watch: {
    fileId (id) {
      this.getExcel(id)
      if (id && id > -1) this.getDat(id)
    }
  },
  mounted () {
    this.getExcel(this.fileId)
  },
  beforeDestroy () {
    this.$store.commit(`foundation/${mutationMap[this.basicType]}`, {
      fileId: -1,
      fileName: '',
      config: {}
    })
    this.$store.commit('foundation/syncFatigue', { hasFatigue: false })
  },
  methods: {
    async getExcel (fileId) {
      try {
        let data
        if (fileId && fileId > -1) {
          // 有 fileId,查文件
          data = await this.$ky.get(`foundations/stream?fileId=${fileId}`).arrayBuffer()
        } else {
          // 没有 fileId,查模板
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
        this.preData = this.transformData(sheetdata)
      } catch (error) {
        console.error(error)
      }
    },
    // 如果有 fileId，查 dat
    async getDat (fileId) {
      try {
        const res = await this.$get(`foundations/datFile?excelId=${this.fileId}`)
        this.datContent = res.body.datText
      } catch (error) {
        Message.error(error)
      }
    },
    // 生成模型
    async createDat () {
      // await this.shouldUpdate()
      await this.updateExcel()
      if (this.basicType === 'seaState') this.$parent.$parent.$parent.$parent.updateMxy()
      try {
        const res = await this.$put(`foundations/datFile?excelId=${this.fileId}`, {
          json: this.config
        })
        this.$store.commit(`foundation/${mutationMap[this.basicType]}`, {
          fileId: this.fileId,
          fileName: this.fileName,
          config: this.config
        })
        this.$store.commit('foundation/syncSave', true)
        this.datContent = res.body.datText
        if (!this.isSplit) {
          this.$refs.excelWithDat.modal = true
        }
      } catch (error) {
        console.error(error)
      }
    },
    // 拿到 excel 里的 data
    getExcelData () {
      let _data
      if (this.isSplit) {
        _data = this.$refs.excel2Dat.$refs.excelTable.dataGrid.data
      } else {
        _data = this.$refs.excelWithDat.$refs.excelTable.dataGrid.data
      }
      return _data
    },
    // 判断 Excel 中 data 时候修改
    async shouldUpdate () {
      return new Promise(async (resolve, reject) => {
        const nowData = this.getExcelData()
        if (this._.isEqual(nowData, this.preData)) {
          resolve()
        } else {
          try {
            await this.updateExcel()
            resolve()
          } catch (error) {
            reject(error)
          }
        }
      })
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
    // 更新 Excel
    async updateExcel () {
      return new Promise(async (resolve, reject) => {
        const workbook = XLSX.utils.book_new()
        const _ws = this.getExcelData()
        const ws = XLSX.utils.aoa_to_sheet(_ws.map(w => Object.values(w)))
        XLSX.utils.book_append_sheet(workbook, ws, this.wsname)
        const wopts = { bookType: 'xlsx', type: 'array' }
        const wbout = XLSX.write(workbook, wopts)
        const formdata = new FormData()
        const data = new Blob([wbout], { type: 'application/octet-stream' })
        formdata.append('file', data, this.fileName)
        const url = `foundations/${this.$route.params.foundationId}/upload?fileKey=${this.basicType}`
        const res = await this.$post(url, {
          headers: null,
          body: formdata
        })
        if (res.code === 0) {
          this.$store.commit(`foundation/${mutationMap[this.basicType]}`, {
            fileId: res.body.fileId,
            fileName: res.body.fileName
          })
          resolve()
        } else {
          reject(res.message)
        }
      })
    },
    async clearTable () {
      this.datContent = ''
      this.getExcel()
      // this.$store.commit(`foundation/${mutationMap[this.basicType]}`, {
      //   fileName: '',
      //   fileId: -1
      // })
    }
  }
}
</script>
<style lang="less">
.basic-params-card .ivu-col{
  margin-bottom: 10px;
}
</style>
