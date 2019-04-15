import canvasDatagrid from 'canvas-datagrid'

export default {
  mounted () {
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
    cDg.style.width = '100%'
    cDg.style.height = '100%'
    cDg.style.cellWidth = Math.floor(width / 10 + 6) || 80
    cDg.style.cellFont = '12px sans-serif'
    cDg.style.activeCellFont = '12px sans-serif'
    cDg.style.editCellFontSize = '14px'
    cDg.style.rowHeaderCellFont = '12px sans-serif'
    cDg.style.columnHeaderCellFont = '12px sans-serif'

    if (isPayload) {
      cDg.style.cellColor = '#555'
      cDg.style.cellHoverColor = '#555'
      cDg.style.activeCellColor = '#555'
      cDg.style.cellSelectedColor = '#555'
      cDg.style.activeCellHoverColor = '#555'
      cDg.style.activeCellSelectedColor = '#555'

      cDg.style.cellBackgroundColor = 'rgb(232, 232, 232)'
      cDg.style.cellHoverBackgroundColor = '#rgb(232, 232, 232)'
      cDg.style.activeCellBackgroundColor = '#rgb(232, 232, 232)'
      cDg.style.cellSelectedBackgroundColor = '#rgb(232, 232, 232)'
      cDg.style.activeCellHoverBackgroundColor = '#rgb(232, 232, 232)'
      cDg.style.activeCellSelectedBackgroundColor = '#rgb(232, 232, 232)'
    }

    /* eslint-enable */

    this.dataGrid = cDg
  }
}
