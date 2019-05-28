<template>
  <div class="table-result h-full px-3 overflow-auto" ref="table-result">
    <div class="result">
      <div class="h-8 text-right">
        <a class="ido-link" href="javascript:void 0;" @click="copyFlange">复制表格</a>
      </div>
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
      <div class="h-8 text-right">
        <a class="ido-link" href="javascript:void 0;" @click="copySRF">复制表格</a>
      </div>
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
import { Table, Row, Col, Input, inputNumber, Button, Message } from 'iview'
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
    },
    copyFlange () {
      const data = this.resultData.map(r => Object.values(r))
      data[0].splice(0, 1, '优化前')
      data[1].splice(0, 1, '优化后')
      let html = ''
      for (let i = 0; i < this.columns.length; i++) {
        html += this.columns[i].title + '\t'
      }
      html += '\r\n'
      for (let j = 0; j < data.length; j++) {
        let row = ''
        for (let k = 0; k < data[j].length; k++) {
          row += data[j][k] + '\t'
        }
        html += row + '\r\n'
      }
      this.handleCopy(html)
    },
    copySRF () {
      let html = ''
      for (let i = 0; i < this.adjustColumns.length; i++) {
        html += this.columns[i].title + '\t'
      }
      html += '\r\n'
      for (let j = 0; j < this.adjustData.length; j++) {
        let row = ''
        row += this.adjustData[j]['height'] + '\t'
        row += this.adjustData[j]['ULS_SRF'] + '\t'
        row += this.adjustData[j]['BCK_SRF'] + '\t'
        row += this.adjustData[j]['FLS_SRF'] + '\t'
        row += this.adjustData[j]['thickness'] + '\t'
        html += row + '\r\n'
      }
      this.handleCopy(html)
    },
    handleCopy (html) {
      const textarea = document.createElement('textarea')
      textarea.style.height = '10px'
      textarea.style.width = '20px'
      textarea.style.opacity = 0
      textarea.value = html
      this.$refs['table-result'].appendChild(textarea)
      textarea.select()
      document.execCommand('Copy')
      Message.success('已经复制到剪贴板')
      this.$refs['table-result'].removeChild(textarea)
    }
  }
}
</script>
<style lang="less">
  .table-result td.ido-table-number {
    text-align: right;
  }
</style>
