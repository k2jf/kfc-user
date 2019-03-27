<template>
  <Modal
    :closable="false"
    :mask-closable="false"
    :title="title"
    width="860"
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
        <div class="tab-content-wrap" style="width: 826px;height: 400px;">
          <DataGrid
            :name="tab.label"
            :sheetdata="tab.value"
            :ws="originSheets[tab.label]" />
        </div>
      </TabPane>
    </Tabs>
  </Modal>
</template>

<script>
import { Modal, Tabs, TabPane } from 'iview'
import DataGrid from '@/components/DataGrid'

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
    }
  },
  // data () {
  //   return {
  //     copySheets: {}
  //   }
  // },
  computed: {
    tabs () {
      const tabs = []
      Object.keys(this.sheets).forEach(s => {
        tabs.push({ label: s, value: this.sheets[s] })
      })
      return tabs
    }
  },
  watch: {
    visible (next, pre) {
      // canvasDatagrid be blank if not trigger window resize
      this.$nextTick(() => {
        window.dispatchEvent(new Event('resize'))
      })
    }
    // sheets (value) {
    //   this.copySheets = Object.assign({}, value)
    // }
  },
  methods: {
    ok () {
      console.log(this.sheets)
      this.$emit('on-ok')
    },
    cancel () {
      this.$emit('on-cancel')
    },
    onTabClick () {
      this.$nextTick(() => {
        window.dispatchEvent(new Event('resize'))
      })
    }
  }
}
</script>
<style>
  .ido-excel-tabs .ivu-tabs-content {
    height: calc(100% - 50px);
  }
</style>
