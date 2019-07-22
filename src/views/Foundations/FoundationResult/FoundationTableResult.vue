<template>
  <div class="foundation-result h-full p-3 overflow-auto">
    <Row>
      <ICol span="24" class="mb-3">
        <div class="h-8 font-bold text-sm">
          校核结果
          <a href="javascript:void(0)" class="float-right underline ido-link font-normal text-xs" @click="exportExcel">
            导出为CSV
          </a>
        </div>
        <Table
          border
          stripe
          :columns="checkColumns"
          :data="checkData" />
      </ICol>
      <ICol span="24" class="mb-3">
        <div class="h-8 font-bold text-sm">
          基础几何参数
        </div>
        <Table
          border
          stripe
          :columns="materialColumns"
          :data="materialData" />
      </ICol>
      <ICol
        span="24"
        class="mb-3"
        v-for="(item, idx) in piles"
        :key="idx">
        <div class="h-8 font-bold text-sm">
          刚度矩阵{{ idx + 1 }}
        </div>
        <Table
          border
          stripe
          :columns="item.columns"
          :data="item.data" />
      </ICol>
    </Row>
  </div>
</template>

<script>
import D from 'dayjs'
import { baseUrl } from '@/config'
import { Row, Col, Table } from 'iview'
import exportCsv, { csv as Csv } from '@/libs/csv'
import { monopile, highMonopile } from '@/config/foundationResult'

export default {
  name: 'FoundationTableResult',
  components: { Row, ICol: Col, Table },
  data () {
    return {
      materialColumns: [],
      materialData: [],
      piles: [],
      checkColumns: [],
      checkData: []
    }
  },
  async mounted () {
    const id = this.$route.params.foundationId
    const res = await this.$get(`foundations/${id}/result`)
    if (res.body.foundationForm === 1) {
      this.checkColumns = monopile
    } else {
      this.checkColumns = highMonopile
    }
    this.checkData = [res.body.checkedResult]
    this.pickMaterial(res.body.material)
    this.pickPile(res.body.Pile)
    this.taskName = res.body.taskName
  },
  methods: {
    pickMaterial (data) {
      this.materialColumns = data.header.map(d => ({
        title: d,
        key: d
      }))
      this.materialData = data.body.map(d => {
        let obj = {}
        data.header.forEach((h, i) => {
          obj[h] = typeof d[i] === 'number' ? d[i].toFixed(2) : d[i]
        })
        return obj
      })
    },
    pickPile (data) {
      this.piles = data.map(d => {
        const columns = d.header.map(h => ({
          title: h,
          key: h
        }))
        const itemData = d.body.map(b => {
          let obj = {}
          d.header.forEach((h, i) => {
            obj[h] = b[i]
          })
          return obj
        })
        return { columns, data: itemData }
      })
    },
    exportCsv () {
      let content = ''
      const dbLine = '\r\n' + '\r\n'
      const checkResult = Csv(this.checkColumns, this.checkData)
      const materialResult = Csv(this.materialColumns, this.materialData)
      content = checkResult + dbLine + materialResult + dbLine
      this.piles.forEach(pile => {
        content += Csv(pile.columns, pile.data) + dbLine
      })
      const filename = '基础任务结果_' + this.taskName + '_' + D().format('YYYY_MM_DD_HH_mm_ss') + '.csv'
      exportCsv.download(filename, content)
    },
    async exportExcel () {
      try {
        const res = await this.$ky(`foundations/${this.$route.params.foundationId}/foToLo`)
        if (!res.ok) {
          const result = await res.json()
          if (result.code === 1) {
            throw Error(result.message)
          }
        } else {
          window.open(`${baseUrl}foundations/${this.$route.params.foundationId}/foToLo`)
        }
      } catch (error) {
        console.error(error)
        this.$Message.error(error.message)
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
