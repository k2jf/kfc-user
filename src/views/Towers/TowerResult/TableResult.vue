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
        <template slot="limit" slot-scope="{row, column}">
          <span :class="markClass(row, column)">{{ row[column.title] }}</span>
        </template>
        <template slot="thickness" slot-scope="{ row, index }">
          <inputNumber
            :step="formatStep"
            :formatter="value => Number(value).toFixed(3)"
            :disabled="row.height === '0.000'"
            v-model="row.thickness"
            @on-change="onNumberChange($event, index, row)" />
        </template>
      </Table>
    </div>
    <div class="operator text-center pt-4">
      <Button type="primary" class="mr-3" @click="save">
        保存
      </Button>
      <Button @click="cancel">
        取消
      </Button>
    </div>
  </div>
</template>

<script>
import { columns, adjustColumns } from './columns.js'
import { Table, Row, Col, Input, inputNumber, Button } from 'iview'
import { mapState, mapGetters, mapActions } from 'vuex'

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
    columns,
    step: 0.5,
    formatStep: 0.5,
    adjustColumns
  }),
  computed: {
    ...mapState({
      results: state => state.tower.results,
      optWeight: state => state.tower.optWeight,
      adjustOptResult: state => state.tower.adjustOptResult
    }),
    ...mapGetters('tower', ['constraints']),
    resultData () {
      const { checkedWeight } = this.results
      if (this.optWeight.length === 0 || !checkedWeight) return []
      return [this.arr2Obj(checkedWeight), this.arr2Obj(this.optWeight)]
    },
    adjustData () {
      const optResult = { ...this.adjustOptResult }
      if (!optResult.items) return []
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
  methods: {
    ...mapActions('tower', ['getResults', 'getAdjustOptResult']),
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
    },
    markClass (row, column) {
      if (this.constraints.length === 0) return ''
      const key = column.title
      const standard = this.constraints.find(c => c.name === key).value
      const value = row[key]
      return value < standard ? 'text-red-light' : ''
    },
    async onNumberChange (value, index) {
      const { optResult } = this.results
      const items = [...optResult.items]
      items[index][4] = value
      let thicknessList = items.filter(item => item[0] !== 0).map(item => item[4])
      try {
        await this.getAdjustOptResult({ towerId: this.$route.params.taskId, thicknessList })
      } catch (error) {
        // If failed, set data to previous status
        this.getResults({ towerId: this.$route.params.taskId })
      }
    },
    async save () {
      try {
        await this.$post(`towerTasks/${this.$route.params.taskId}/save/adjustedResult`)
        this.$Message.success('保存成功')
        this.getResults({ towerId: this.$route.params.taskId })
      } catch (err) {
        console.log(err)
      }
    },
    cancel () {
      this.$router.push({ name: 'towers' })
    }
  }
}
</script>
<style lang="less">
  .table-result td.ido-table-number {
    text-align: right;
  }
</style>
