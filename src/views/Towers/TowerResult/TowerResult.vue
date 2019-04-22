<template>
  <div class="tower-result h-full">
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
import ChartResult from './ChartResult'
import TableResult from './TableResult'
import { Tabs, TabPane } from 'iview'
export default {
  name: 'TowerResult',
  components: {
    Tabs,
    TabPane,
    ChartResult,
    TableResult
  },
  data: () => ({
    showTable: false
  }),
  methods: {
    onClick (name) {
      console.log(name)
      if (name === 'table' && !this.showTable) this.showTable = true
    }
  }
}
</script>
<style lang="less">
  .ido-result-tabs .ivu-tabs-content {
    height: calc(100% - 50px);
  }
</style>
