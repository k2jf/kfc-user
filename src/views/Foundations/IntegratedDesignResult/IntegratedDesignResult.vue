<template>
  <div class="foundation-result h-full p-3">
    <div class="h-8 font-bold text-sm">
      校核结果
      <a href="javascript:void(0)" class="float-right underline ido-link font-normal text-xs" @click="exportCsv">
        导出为CSV
      </a>
    </div>
    <Table
      border
      stripe
      :columns="checkColumns"
      :data="checkData" />
  </div>
</template>

<script>
// import D from 'dayjs'
import { Table } from 'iview'
import checkColumns from '@/config/fatigueResult'
// import exportCsv, { csv as Csv } from '@/libs/csv'

export default {
  name: 'IntegratedDesignResult',
  components: { Table },
  data: () => ({
    checkColumns,
    checkData: []
  }),
  async mounted () {
    const id = this.$route.params.foundationId
    const res = await this.$get(`foundations/${id}/fatigueResult`)
    this.checkData = res.body
  },
  methods: {
    exportCsv () {
      // let content = ''
      // const dbLine = '\r\n' + '\r\n'
      // const checkResult = Csv(this.checkColumns, this.checkData)
      // const materialResult = Csv(this.materialColumns, this.materialData)
      // content = checkResult + dbLine + materialResult + dbLine
      // this.piles.forEach(pile => {
      //   content += Csv(pile.columns, pile.data) + dbLine
      // })
      // const filename = '基础任务结果_' + this.taskName + '_' + D().format('YYYY_MM_DD_HH_mm_ss') + '.csv'
      // exportCsv.download(filename, content)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
