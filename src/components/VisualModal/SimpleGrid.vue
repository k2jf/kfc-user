<template>
  <div ref="simple-grid">
    <div class="h-6 text-right">
      <a class="ido-link" href="javascript:void 0;" @click="handleCopy">复制表格</a>
    </div>
    <Table
      class="ido-table"
      border
      stripe
      :columns="columns"
      :data="sheetdata">
    </Table>
  </div>
</template>
<script>
import { Table, Message } from 'iview'

export default {
  name: 'SimpleGrid',
  components: { Table },
  props: {
    copyData: {
      type: Object,
      required: true
    },
    sheetdata: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true
    }
  },
  methods: {
    handleCopy () {
      const { headers, items } = this.copyData
      if (!headers || headers.length === 0) {
        Message.error('无效复制')
        /* eslint-disable-next-line */
        return
      }
      let html = ''
      for (let i = 0; i < headers.length; i++) {
        html += headers[i] + '\t'
      }
      html += '\r\n'
      for (let j = 0; j < items.length; j++) {
        let row = ''
        for (let k = 0; k < items[j].length; k++) {
          row += items[j][k] + '\t'
        }
        html += row + '\r\n'
      }
      const textarea = document.createElement('textarea')
      textarea.style.height = '10px'
      textarea.style.width = '20px'
      textarea.style.opacity = 0
      textarea.value = html
      this.$refs['simple-grid'].appendChild(textarea)
      textarea.select()
      document.execCommand('Copy')
      Message.success('已经复制到剪贴板')
      this.$refs['simple-grid'].removeChild(textarea)
    }
  }
}
</script>
