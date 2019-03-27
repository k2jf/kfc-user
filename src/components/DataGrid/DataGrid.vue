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
      this.dataGrid.data = value
    }
  },
  mounted () {
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
    for (let i = 0; i < this.sheetdata.length; i++) {
      const objData = {}
      for (var k = range.s.c; k <= range.e.c; k++) {
        const key = XLSX.utils.encode_col(k)
        objData[key] = this.sheetdata[i][k] || ''
      }
      formatSheetdata.push(objData)
    }

    const cDg = canvasDatagrid({
      parentNode: this.$refs[this.name],
      data: formatSheetdata,
      allowSorting: false,
      allowFreezingColumns: true
    })
    cDg.style.width = '826px'
    cDg.style.height = '400px'
    cDg.style.cellWidth = 80
    /** ================================================================
     * set schema
     *
     * for (var i = range.s.c; i <= range.e.c; ++i) {
     *   cDg.schema[i - range.s.c].title = XLSX.utils.encode_col(i)
     *   console.log('hhhhh====> ', maxColNum, XLSX.utils.encode_col(i))
     * }
     * console.log(schema)
     * cDg.schema = schema
     * ================================================================
     */
    this.dataGrid = cDg
    this.dataGrid.addEventListener('beforesortcolumn', this.preventDefault)
  },
  beforeDestroy () {
    this.dataGrid.removeEventListener('beforesortcolumn', this.preventDefault)
  },
  methods: {
    preventDefault (e) {
      e.preventDefault()
    }
  }
}
</script>
