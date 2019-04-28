<template>
  <div class="table-result h-full px-3 overflow-auto">
    <div class="result">
      <Table
        border
        stripe
        :columns="columns"
        :data="resultData">
        <template slot="title" slot-scope="{ index }">
          {{ index === 0 ? '优化前' : '优化后' }}
        </template>
      </Table>
    </div>
    <div class="py-2" style="line-height:32px;">
      <Row>
        <ICol span="4" v-for="(item, i) in constraints" :key="i">
          {{ item.name }} >= {{ item.value }}
        </ICol>
        <ICol span="6">
          壁厚调整步长：
          <Input style="width:100px" v-model="step" @on-blur="onBlur" />
        </ICol>
      </Row>
    </div>
    <div class="adjust">
      <Table
        border
        stripe
        :height="500"
        :columns="adjustColumns"
        :data="adjustData">
        <template slot="thickness" slot-scope="{ row }">
          <inputNumber
            :step="formatStep"
            :formatter="value => Number(value).toFixed(3)"
            v-model="row.thickness" />
        </template>
      </Table>
    </div>
    <div class="operator text-center pt-4">
      <Button type="primary" class="mr-3">
        保存
      </Button>
      <Button>取消</Button>
    </div>
  </div>
</template>

<script>
import { columns, adjustColumns } from './columns.js'
import { Table, Row, Col, Input, inputNumber, Button } from 'iview'

export default {
  name: 'TableResult',
  components: {
    Table,
    Row,
    ICol: Col,
    Input,
    inputNumber,
    Button
  },
  data: () => ({
    results: {},
    constraints: [],
    columns,
    step: 0.5,
    formatStep: 0.5,
    adjustColumns
  }),
  computed: {
    resultData () {
      const { optWeight, checkedWeight } = this.results
      if (!optWeight || !checkedWeight) return []
      return [this.arr2Obj(checkedWeight), this.arr2Obj(optWeight)]
    },
    adjustData () {
      const { optResult } = this.results
      if (!optResult) return []
      const { headers, items } = optResult
      let _headers = headers.map((h, i) => {
        let _h = h
        if (i === 0) _h = 'height'
        if (i === 4) _h = 'thickness'
        return _h
      })
      _headers = headers.map((h, i) => ({
        key: _headers[i],
        title: h
      }))
      return items.map(item => {
        let obj = {}
        _headers.forEach((h, i) => {
          if (h.key === 'thickness') {
            obj[h.key] = Number(this.strip(item[i]))
          } else {
            obj[h.key] = this.strip(item[i])
          }
        })
        return obj
      })
    }
  },
  mounted () {
    this.getTaskResult()
  },
  methods: {
    async getTaskResult () {
      const res = await this.$get(`towerTasks/${this.$route.params.taskId}/result`)
      this.results = res.body
      this.constraints = res.body.Constraints
    },
    arr2Obj (arr) {
      let obj = {}
      arr.forEach(a => {
        obj[a.name] = this.strip(a.data)
      })
      return obj
    },
    strip (num) {
      return num.toFixed(3)
    },
    onBlur () {
      this.formatStep = Number(this.step)
    }
  }
}
</script>
<style lang="less">
  .table-result td.ido-table-number {
    text-align: right;
  }
</style>
