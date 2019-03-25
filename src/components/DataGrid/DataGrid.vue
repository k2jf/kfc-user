<template>
  <div class="ido-data-grid h-full w-full" :ref="name">
  </div>
</template>
<script>
// import XLSX from 'xlsx'
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
  mounted () {
    const cDg = canvasDatagrid({
      parentNode: this.$refs[this.name],
      data: this.sheetdata
    })
    cDg.style.width = '100%'
    cDg.style.height = '100%'

    // var range = XLSX.utils.decode_range(this.ws['!ref'])
    // console.log(range)
    // for (var i = range.s.c; i <= range.e.c; ++i) {
    //   cDg.schema[i - range.s.c].title = XLSX.utils.encode_col(i)
    // }
    this.dataGrid = cDg
  }

}
</script>
