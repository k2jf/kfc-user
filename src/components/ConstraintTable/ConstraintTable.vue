<template>
  <div class="constraint-table">
    <Table
      class="ido-table"
      border
      disabled-hover
      :columns="columns"
      :data="tableData"
      ref="selection">
      <template slot="config" slot-scope="{ row }">
        <div>
          <div
            class="px-4"
            :class="{
              'has-border': (row.multiple && ind < item.length - 1),
              'multiple-row': row.multiple
            }"
            v-for="(item,ind) in row.config"
            :key="ind">
            <Row>
              <ICol span="4">
                <div class="item-name">
                  {{ item }}
                </div>
              </ICol>
              <ICol span="6">
                <Select style="width: 60px" placeholder="">
                  <Option :value="exp" v-for="(exp, index) in expressions" :key="index">
                    {{ exp }}
                  </Option>
                </Select>
              </ICol>
              <ICol span="14">
                <Input style="width: 160px" />
              </ICol>
            </Row>
          </div>
        </div>
      </template>
    </Table>
  </div>
</template>

<script>
import { Select, Option, Input, Table, Row, Col } from 'iview'

const columns = [
  {
    type: 'selection',
    width: 60
  },
  {
    title: '校核类型',
    key: 'checkType'
    // width: 100
  },
  {
    title: '阈值配置',
    key: 'config',
    slot: 'config'
    // width: 300
  },
  {
    title: '表达式',
    key: 'expression'
    // width: 200
  }
]

const tableData = [
  {
    checkType: '模态',
    config: ['频率'],
    expression: '',
    multiple: false
  },
  {
    checkType: '承受力',
    config: ['承受度'],
    expression: '',
    multiple: false
  },
  {
    checkType: '变形',
    config: ['D泥面', 'D桩端', 'R转角'],
    expression: '',
    multiple: true
  },
  {
    checkType: '应力',
    config: ['P1', 'P2'],
    expression: '',
    multiple: true
  },
  {
    checkType: '疲劳',
    config: ['P1'],
    expression: '',
    multiple: false
  }
]

const expressions = ['>', '<', '>=', '<=', '=']

export default {
  name: 'ConstraintTable',
  components: {
    Select,
    Option,
    Input,
    Table,
    Row,
    ICol: Col
  },
  data () {
    return {
      columns,
      tableData,
      expressions
    }
  }
}
</script>

<style lang="less">
  .constraint-table {
    .ivu-table-tbody td:nth-of-type(3) .ivu-table-cell{
      padding: 0
    }

    .ivu-table-cell {
      overflow: visible;
    }
  }

</style>
<style lang="less" scoped>
.item-name {
  height: 32px;
  line-height: 32px;
}
.has-border {
    border-bottom: 1px solid #e8eaec;
  }
  .multiple-row {
    padding-top: 10px;
    padding-bottom: 10px;
  }
</style>
