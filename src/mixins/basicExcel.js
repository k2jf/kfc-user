import canvasDatagrid from 'canvas-datagrid'

export default {
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
    cDg.style.cellFont = '12px sans-serif'
    cDg.style.activeCellFont = '12px sans-serif'
    cDg.style.editCellFontSize = '14px'
    cDg.style.rowHeaderCellFont = '12px sans-serif'
    cDg.style.columnHeaderCellFont = '12px sans-serif'

    if (this.name === 'geometry') {
      cDg.style.cellWidth = 100
      cDg.setColumnWidth(4, 240)
    }

    /* eslint-enable */

    this.dataGrid = cDg
  }
}
