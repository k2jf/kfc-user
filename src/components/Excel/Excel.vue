<template>
  <Modal
    :closable="false"
    :mask-closable="false"
    :title="title"
    :width="size.width"
    :styles="{ top: '40px'}"
    :value="visible"
    ok-text="保存"
    @on-ok="ok"
    @on-cancel="cancel">
    <Tabs
      :animated="false"
      class="h-full ido-excel-tabs"
      @on-click="onTabClick">
      <TabPane
        class="h-full"
        :label="tab.label"
        :name="tab.label"
        v-for="tab in tabs"
        :key="tab.label">
        <div class="tab-content-wrap" :style="gridStyle">
          <DataGrid
            :gridStyle="gridStyle"
            :name="tab.label"
            :sheetdata="tab.value"
            :ws="originSheets[tab.label]"
            :ref="tab.label" />
        </div>
      </TabPane>
    </Tabs>
  </Modal>
</template>

<script>
import { Modal, Tabs, TabPane } from 'iview'
import DataGrid from '@/components/DataGrid'
import XLSX from 'xlsx'

export default {
  name: 'Excel',
  components: {
    Modal,
    Tabs,
    TabPane,
    DataGrid
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    sheets: {
      type: Object,
      required: true
    },
    originSheets: {
      type: Object,
      required: true
    },
    size: {
      type: Object,
      required: true
    }
  },
  // data () {
  //   return {
  //     customLabel: h => {
  //       return h('span', {
  //         class:
  //       })
  //     }
  //   }
  // },
  computed: {
    tabs () {
      const tabs = []
      Object.keys(this.sheets).forEach(s => {
        tabs.push({ label: s, value: this.sheets[s] })
      })
      return tabs
    },
    gridStyle () {
      return {
        width: this.size.width - 34 + 'px',
        height: this.size.height - 180 + 'px'
      }
    }
  },
  watch: {
    visible (next, pre) {
      // canvasDatagrid be blank if not trigger window resize
      this.$nextTick(() => {
        window.dispatchEvent(new Event('resize'))
      })
    }
  },
  methods: {
    ok () {
      const workbook = XLSX.utils.book_new()
      this.tabs.forEach((t) => {
        const _ws = this.$refs[t.label][0].dataGrid.data
        /**
         * _ws is an array of arrays of JS values,
         * MUST use `XLSX.utils.aoa_to_sheet` to transfrom it
         * to a worksheet resembling the excel data
         */
        const ws = XLSX.utils.aoa_to_sheet(_ws.map(w => Object.values(w)))
        XLSX.utils.book_append_sheet(workbook, ws, t.label)
      })
      const wopts = { bookType: 'xlsx', type: 'array' }
      const wbout = XLSX.write(workbook, wopts)
      this.$emit('on-ok', wbout)
    },
    cancel () {
      this.$emit('on-cancel')
    },
    onTabClick () {
      this.$nextTick(() => {
        window.dispatchEvent(new Event('resize'))
      })
    },
    editable (value) {
      if (['Ultimate', 'Buckling', 'Fatigue'].includes(value)) {
        return 'text-red-light'
      }
    }
  }
}
</script>
<style>
  .ido-excel-tabs .ivu-tabs-content {
    height: calc(100% - 50px);
  }
</style>
