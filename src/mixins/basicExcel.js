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
    cDg.style.width = '800px'
    cDg.style.height = '100%'
    cDg.style.cellFont = '12px sans-serif'
    cDg.style.activeCellFont = '12px sans-serif'
    cDg.style.editCellFontSize = '14px'
    cDg.style.rowHeaderCellFont = '12px sans-serif'
    cDg.style.columnHeaderCellFont = '12px sans-serif'



    /* eslint-enable */

    this.dataGrid = cDg

    const el = this.$refs.geometry
    setTimeout(() => {
      const width = el.offsetWidth
      const elWidth = Math.floor((width - 260) / 5)
      if (this.name === 'geometry') {
        this.dataGrid.style.cellWidth = elWidth
        this.dataGrid.setColumnWidth(4, 260)
      }
    })
  }
}
