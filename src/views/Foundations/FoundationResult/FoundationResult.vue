<template>
  <div class="foundation-result h-full">
    <Tabs :animated="false" class="h-full ido-result-tabs" @on-click="onClick">
      <TabPane
        class="h-full"
        label="图表"
        name="chart">
        <ChartResult />
      </TabPane>
      <TabPane class="h-full" label="表格" name="table">
        <TableResult v-if="showTable" />
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import { Tabs, TabPane } from 'iview'
import TableResult from './FoundationTableResult'
import ChartResult from './FoundationChartResult'

export default {
  name: 'FoundationResult',
  components: {
    Tabs,
    TabPane,
    TableResult,
    ChartResult
  },
  data () {
    return {
      showTable: false
    }
  },
  methods: {
    onClick (name) {
      if (name === 'table' && !this.showTable) this.showTable = true
    }
  }
}
</script>

<style lang="less">
.foundation-result .ivu-tabs-content {
  height: 100%;
}
</style>
