<template>
  <div class="ido-data-grid h-full w-full" :ref="name">
  </div>
</template>
<script>
import XLSX from 'xlsx'
// import mixins from '@/mixins/towerExcel.js'
// import canvasDatagrid from 'canvas-datagrid'

export default {
  name: 'DataGrid',
  // mixins: [mixins],
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
    },
    gridStyle: {
      type: Object
      // required: true
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
    this.dataGrid.addEventListener('beforesortcolumn', this.preventDefault)
    this.dataGrid.addEventListener('contextmenu', this.preventDefault)
    this.dataGrid.addEventListener('beforeendedit', this.endedit)
  },
  beforeDestroy () {
    this.dataGrid.removeEventListener('beforesortcolumn', this.preventDefault)
    this.dataGrid.removeEventListener('contextmenu', this.preventDefault)
    this.dataGrid.removeEventListener('beforeendedit', this.endedit)
  },
  methods: {
    preventDefault (e) {
      e.preventDefault()
    },
    endedit (e) {
      // Abort the edit, We self take over it!!!
      e.abort()
      // If value doesn't change, do nothing
      if (e.newValue !== e.oldValue) {
        // canvas-datagrid default set value to stirng,so we need to
        // manually transform to number
        let value = e.newValue
        if (typeof e.oldValue === 'number') {
          value = Number(e.newValue)
        }
        const [i, k] = e.cell.gridId.split(':')
        const data = this.dataGrid.data
        const key = Object.keys(data[i])[k]
        data[i][key] = value
        this.dataGrid.data = data
      }
      // BUG: doesn't work!!
      e.ctx.fillStyle = 'red'
    },
    transformData (data) {
      /** ================================================================
     * IMPORTENT
     *
     * If the data canvas-datagrid received is an array of arrays,
     * and lengths of child array are not all same , there could
     * happen `some columns be lost`, therefore we must transform
     * data to an `array of objects`
     * ================================================================
     */
      if (data.length === 0) return []
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
