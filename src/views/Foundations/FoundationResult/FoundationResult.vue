<template>
  <div class="foundation-result h-full p-3">
    <Row>
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
import { Row, Col, Table } from 'iview'

export default {
  name: 'FoundationResult',
  components: { Row, ICol: Col, Table },
  data () {
    return {
      materialColumns: [],
      materialData: [],
      piles: []
    }
  },
  async mounted () {
    const id = this.$route.params.foundationId
    const res = await this.$get(`foundations/${id}/result`)
    this.pickMaterial(res.body.material)
    this.pickPile(res.body.Pile)
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
          obj[h] = d[i]
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
    }
  }
}
</script>

<style lang="less" scoped>

</style>
