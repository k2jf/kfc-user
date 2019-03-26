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
  mounted () {
    const cDg = canvasDatagrid({
      parentNode: this.$refs[this.name],
      data: this.sheetdata,
      allowSorting: false,
      allowFreezingColumns: true
    })
    cDg.style.width = '826px'
    cDg.style.height = '400px'
    cDg.style.cellWidth = 80

    // const range = XLSX.utils.decode_range(this.ws['!ref'])
    // console.log(range, this.sheetdata)
    // const schema = []
    // for (var i = range.s.c; i <= range.e.c; ++i) {
    //   schema.push({
    //     title: XLSX.utils.encode_col(i),
    //     name: ''

    //   })
    //   //   cDg.schema[i - range.s.c].title = XLSX.utils.encode_col(i)
    //   console.log(XLSX.utils.encode_col(i))
    // }
    // console.log(schema)
    // cDg.schema = schema
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
