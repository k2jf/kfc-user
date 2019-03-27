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
    console.log('%c 新的开始====================', 'color: red')
    console.log(this.sheetdata)
    const formatSheetdata = []
    const schema = []
    const maxColNum = Math.max.apply(null, this.sheetdata.map(s => s.length))
    const range = XLSX.utils.decode_range(this.ws['!ref'])
    for (let i = 0; i < this.sheetdata.length; i++) {
      const objData = {}
      for (var k = range.s.c; k <= range.e.c; k++) {
        const key = XLSX.utils.encode_col(k)
        // console.log('hhhhh====> ', maxColNum, XLSX.utils.encode_col(i))
        objData[key] = this.sheetdata[i][k] || ''
      }
      console.log('objData is ===> ', objData)
      formatSheetdata.push(objData)
    }
    console.log('formatSheetdata is =======> ', formatSheetdata)
    console.log('%c 结束====================', 'color: blue')

    const cDg = canvasDatagrid({
      parentNode: this.$refs[this.name],
      data: formatSheetdata,
      allowSorting: false,
      allowFreezingColumns: true
    })
    cDg.style.width = '826px'
    cDg.style.height = '400px'
    cDg.style.cellWidth = 80
    // for (var i = range.s.c; i <= range.e.c; ++i) {
    //   //   //   cDg.schema[i - range.s.c].title = XLSX.utils.encode_col(i)
    //   console.log('hhhhh====> ', maxColNum, XLSX.utils.encode_col(i))
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
