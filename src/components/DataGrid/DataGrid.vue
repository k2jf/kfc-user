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
    },
    gridStyle: {
      type: Object,
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
    console.log(this.sheetdata)
    const width = this.gridStyle.width.slice(0, -2)
    const isPayload = ['Ultimate', 'Buckling', 'Fatigue'].includes(this.name)
    const cDg = canvasDatagrid({
      parentNode: this.$refs[this.name],
      data: this.transformData(this.sheetdata),
      editable: !isPayload,
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
    cDg.style.width                   = '100%'
    cDg.style.height                  = '100%'
    cDg.style.cellWidth               = Math.floor(width / 10 + 6) || 80
    cDg.style.cellFont                = '12px sans-serif'
    cDg.style.activeCellFont          = '12px sans-serif'
    cDg.style.editCellFontSize        = '14px'
    cDg.style.rowHeaderCellFont       = '12px sans-serif'
    cDg.style.columnHeaderCellFont    = '12px sans-serif'

    if (isPayload) {
      cDg.style.cellColor                            = '#555'
      cDg.style.cellHoverColor                       = '#555'
      cDg.style.activeCellColor                      = '#555'
      cDg.style.cellSelectedColor                    = '#555'
      cDg.style.activeCellHoverColor                 = '#555'
      cDg.style.activeCellSelectedColor              = '#555'

      cDg.style.cellBackgroundColor                  = 'rgb(232, 232, 232)'
      cDg.style.cellHoverBackgroundColor             = '#rgb(232, 232, 232)'
      cDg.style.activeCellBackgroundColor            = '#rgb(232, 232, 232)'
      cDg.style.cellSelectedBackgroundColor          = '#rgb(232, 232, 232)'
      cDg.style.activeCellHoverBackgroundColor       = '#rgb(232, 232, 232)'
      cDg.style.activeCellSelectedBackgroundColor    = '#rgb(232, 232, 232)'
    }

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
    this.dataGrid.addEventListener('contextmenu', this.preventDefault)
    this.dataGrid.addEventListener('beforeendedit', this.endedit)
    if (this.name === 'Ultimate') {
      // this.dataGrid.addEventListener('rendercell', this.rendertext)
    }
  },
  beforeDestroy () {
    this.dataGrid.removeEventListener('beforesortcolumn', this.preventDefault)
    this.dataGrid.removeEventListener('contextmenu', this.preventDefault)
    this.dataGrid.removeEventListener('beforeendedit', this.endedit)
    if (this.name === 'Ultimate') {
      // this.dataGrid.removeEventListener('rendercell', this.rendertext)
    }
  },
  methods: {
    preventDefault (e) {
      e.preventDefault()
    },
    rendertext (e) {
      // console.log(e)
      // if (e.value === '') {
      //   e.cell.width = 20
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
