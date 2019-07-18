<template>
  <div class="ido-data-grid h-full w-full overflow-auto" :ref="name"></div>
</template>
<script>
import XLSX from 'xlsx'
import canvasDatagrid from 'canvas-datagrid'

export default {
  name: 'ExcelTable',
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
  watch: {
    sheetdata (value) {
      this.dataGrid.data = this.transformData(value)
      const maxCol = this.sheetdata.reduce((pre, next) => Math.max(pre, next.length), 0)
      console.log(maxCol, this.ws)
      const clientW = document.getElementById('ido-body').offsetWidth - 70
      const cellWidth = Math.floor(clientW / maxCol)
      this.dataGrid.style.cellWidth = cellWidth
    }
  },
  mounted () {
    const cDg = canvasDatagrid({
      parentNode: this.$refs[this.name],
      data: this.transformData(this.sheetdata),
      allowSorting: false,
      allowFreezingColumns: true,
      allowColumnReordering: false,
      showColumnHeaders: false,
      allowColumnResizeFromCell: true,
      showRowHeaders: false,
      selectionMode: 'none'
    })
    /* eslint-disable */
    // custom styles
    cDg.style.width = '100%'
    cDg.style.height = '100%'
    cDg.style.overflowX = 'auto'
    cDg.style.cellFont = '12px sans-serif'
    cDg.style.activeCellFont = '12px sans-serif'
    cDg.style.editCellFontSize = '14px'
    cDg.style.cellWidth = 100
    cDg.style.gridBackgroundColor = '#fff'
    cDg.style.rowHeaderCellFont = '12px sans-serif'
    cDg.style.columnHeaderCellFont = '12px sans-serif'
    /* eslint-enable */
    this.dataGrid = cDg

    // setTimeout(() => {
    // const maxCol = this.sheetdata.reduce((pre, next) => Math.max(pre, next.length), 0)
    // const clientW = document.getElementById('ido-body').offsetWidth - 90
    // const cellWidth = Math.floor(clientW / maxCol)
    // this.dataGrid.style.cellWidth = cellWidth
    // console.log(maxCol, clientW, cellWidth)
    // }, 0)

    this.dataGrid.addEventListener('beforesortcolumn', this.preventDefault)
    this.dataGrid.addEventListener('contextmenu', this.preventDefault)
    this.dataGrid.addEventListener('beforeendedit', this.endedit)
    this.dataGrid.addEventListener('beginedit', this.beginedit)
    this.dataGrid.addEventListener('rendercell', this.rendercell)
  },
  beforeDestroy () {
    this.dataGrid.removeEventListener('beforesortcolumn', this.preventDefault)
    this.dataGrid.removeEventListener('contextmenu', this.preventDefault)
    this.dataGrid.removeEventListener('beforeendedit', this.endedit)
    this.dataGrid.removeEventListener('beginedit', this.beginedit)
    this.dataGrid.removeEventListener('rendercell', this.rendercell)
  },
  methods: {
    preventDefault (e) {
      e.preventDefault()
    },
    rendercell (e) {
      // if ([
      //   '2:2',
      //   '3:2',
      //   '4:2',
      //   '5:2',
      //   '2:4',
      //   '3:4',
      //   '4:4',
      //   '5:4',
      //   '2:6',
      //   '3:6',
      //   '4:6',
      //   '5:6'
      // ].includes(e.cell.gridId)) {
      //   e.ctx.fillStyle = '#BEE9F6'
      // }
    },
    endedit (e) {
      // Abort the edit, We self take over it!!!
      e.abort()
      // If value doesn't change, do nothing
      if (e.newValue !== e.oldValue) {
        // canvas-datagrid default set value to stirng,so we need to
        // manually transform to number
        let value = e.newValue
        // console.log(e.newValue, e.oldValue)
        // console.log(typeof e.newValue, typeof e.oldValue)
        if (typeof e.oldValue === 'number') {
          value = Number(e.newValue)
        }
        if (e.newValue === '') value = null
        const [i, k] = e.cell.gridId.split(':')
        const data = this.dataGrid.data
        const key = Object.keys(data[i])[k]
        data[i][key] = value
        this.dataGrid.data = data
      }
      // BUG: doesn't work!!
      e.ctx.fillStyle = 'red'
    },
    beginedit (e) {
      this.activeInput = e.input
    },
    scrollFunc () {
      if (this.activeInput && this.activeInput.offsetWidth > 10) {
        this.activeInput.value = ''
        this.activeInput.style = 'position: fixed; top: -5px; left: -5px; border: none; opacity: 0; cursor: pointer; width: 1px; height: 1px; line-height: normal; font-weight: normal; font-family: sans-serif; font-size: 16px;'
      }
    },
    transformData (data) {
      /** ================================================================
     * IMPORTENT
     *
     * If the `data canvas-datagrid` received is an array of arrays,
     * and lengths of child array are not all same , there could
     * happen `some columns be lost`, therefore we must transform
     * data to an `array of objects`
     *
     *          ┌─┐       ┌─┐
     *       ┌──┘ ┴───────┘ ┴──┐
     *       │                 │
     *       │       ───       │
     *       │  ─┬┘       └┬─  │
     *       │                 │
     *       │       ─┴─       │
     *       │                 │
     *       └───┐         ┌───┘
     *           │         │
     *           │         │
     *           │         │
     *           │         └──────────────┐
     *           │                        │
     *           │                        ├─┐
     *           │                        ┌─┘
     *           │                        │
     *           └─┐  ┐  ┌───────┬──┐  ┌──┘
     *             │ ─┤ ─┤       │ ─┤ ─┤
     *             └──┴──┘       └──┴──┘
     * ================================================================
     */
      if (data.length === 0) return []
      const formatSheetdata = []
      const range = XLSX.utils.decode_range(this.ws['!ref'])
      for (let i = 0; i < data.length; i++) {
        const objData = {}
        for (var k = range.s.c; k <= range.e.c; k++) {
          const key = XLSX.utils.encode_col(k)
          objData[key] = data[i][k] === 0 ? 0 : (data[i][k] || '')
        }
        formatSheetdata.push(objData)
      }
      return formatSheetdata
    }
  }
}
</script>
<style lang="less">
  #ido-body .ido-data-grid canvas {
    width: 100% !important;
  }
</style>
