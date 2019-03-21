<template>
  <Modal
    :closable="false"
    fullscreen
    :title="title"
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
        <div class="tab-content-wrap w-full h-full">
          <DataGrid
            :name="tab.label"
            :sheetdata="tab.value"
            :data-sheet="tab.label"
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
  computed: {
    tabs () {
      const tabs = []
      Object.keys(this.sheets).forEach(s => {
        tabs.push({ label: s, value: this.sheets[s] })
      })
      console.log(tabs)
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
  },
  methods: {
    ok () {
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
