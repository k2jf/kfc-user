<template>
  <div class="ido-data-grid h-full w-full" :ref="name">
  </div>
</template>
<script>
import XLSX from 'xlsx'
import canvasDatagrid from 'canvas-datagrid'

export default {
  name: 'DataGrid',
  props: {
    name: {
      type: String,
      required: true
    },
    ws: {
      type: Object,
      required: true
    },
    sheetdata: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      dataGrid: null
    }
  },
  watch: {
    sheetdata (value) {
      this.dataGrid.data = this.transformData(value)
    }
  },
  mounted () {
    const cDg = canvasDatagrid({
      parentNode: this.$refs[this.name],
      data: this.transformData(this.sheetdata),
      allowSorting: false,
      allowFreezingColumns: true
    })

    /* eslint-disable */
    // custom styles
    cDg.style.width                   = '826px'
    cDg.style.height                  = '400px'
    cDg.style.cellWidth               = 80
    cDg.style.cellFont                = '12px sans-serif'
    cDg.style.activeCellFont          = '12px sans-serif'
    cDg.style.editCellFontSize        = '14px'
    cDg.style.rowHeaderCellFont       = '12px sans-serif'
    cDg.style.columnHeaderCellFont    = '12px sans-serif'
    /* eslint-enable */

    // set schema
    // const range = XLSX.utils.decode_range(this.ws['!ref'])
    // const schema = []
    // for (var i = range.s.c; i <= range.e.c; ++i) {
    //   schema.push({
    //     name: XLSX.utils.encode_col(i),
    //     type: 'number'
    //   })
    // }
    // cDg.schema = schema

    this.dataGrid = cDg
    this.dataGrid.addEventListener('beforesortcolumn', this.preventDefault)
    this.dataGrid.addEventListener('appendeditinput', this.endedit)
  },
  beforeDestroy () {
    this.dataGrid.removeEventListener('beforesortcolumn', this.preventDefault)
  },
  methods: {
    preventDefault (e) {
      e.preventDefault()
    },
    endedit (e) {
      console.log(e)
      // e.value = parseFloat(e.value)
      e.input.value = parseFloat(e.input.value)
      e.ctx.fillStyle = 'red'
    },
    transformData (data) {
      /** ================================================================
     * IMPORTENT
     *
     * If the data that canvas-datagrid received is an array of arrays,
     * and lengths of child array are not all same , there could
     * happen that `some columns be lost`, therefore we must transform
     * data to an `array of objects`
     * ================================================================
     */
      const formatSheetdata = []
      const range = XLSX.utils.decode_range(this.ws['!ref'])
      for (let i = 0; i < data.length; i++) {
        const objData = {}
        for (var k = range.s.c; k <= range.e.c; k++) {
          const key = XLSX.utils.encode_col(k)
          objData[key] = data[i][k] || ''
        }
        formatSheetdata.push(objData)
      }
      return formatSheetdata
    }
  }
}
</script>
