<template>
  <div class="limitedValue-table">
    <Table
      class="ido-table"
      border
      disabled-hover
      :columns="columns"
      :data="baseConfig"
      ref="selection"
      @on-select="onSelect"
      @on-select-cancel="onSelectCancel"
      @on-select-all="onSelectAll"
      @on-select-all-cancel="onSelectNone">
      <!-- 校核类型 -->
      <template slot="name" slot-scope="{ row }">
        {{ baseDictionary[row.name] }}
      </template>
      <!-- 阈值配置 -->
      <!-- ========================================================= -->
      <template slot="config" slot-scope="{ row }">
        <div>
          <div
            class="px-4"
            :class="{
              'has-border': (row.multiple && ind < row.limitedValue.length - 1),
              'multiple-row': row.multiple
            }"
            v-for="(item,ind) in row.limitedValue"
            :key="ind">
            <Row>
              <ICol span="4">
                <div class="item-name">
                  {{ baseDictionary[item.name] }}
                </div>
              </ICol>
              <ICol span="6">
                <Select
                  style="width: 60px"
                  placeholder=""
                  :value="item.operator"
                  @on-change="onSelectChange($event, row, ind)">
                  <Option :value="exp.value" v-for="(exp, index) in expressions" :key="index">
                    {{ exp.label }}
                  </Option>
                </Select>
              </ICol>
              <ICol span="14">
                <Input
                  :value="item.value"
                  style="width: 160px"
                  @on-change="onInputChange($event.target.value, row, ind)"
                  @on-blur="onInputBlur($event.target.value, row, ind)" />
              </ICol>
            </Row>
          </div>
        </div>
      </template>
      <!-- ========================================================= -->
      <!-- 表达式 -->
      <!-- ========================================================= -->
      <template slot="expression" slot-scope="{ row }">
        <div>
          <div
            class="px-4 expression-item"
            :class="{
              'has-border': (row.multiple && ind < row.limitedValue.length - 1),
              'multiple-row': row.multiple,
              'single-row': !row.multiple
            }"
            v-for="(item,ind) in row.limitedValue"
            :key="ind">
            <span v-if="item.name && item.operator && item.value">
              {{ baseDictionary[item.name] }}
              {{ baseDictionary[item.operator] }}
              {{ item.value }}
            </span>
          </div>
        </div>
      </template>
      <!-- ========================================================= -->
    </Table>
  </div>
</template>

<script>
import { Select, Option, Input, Table, Row, Col } from 'iview'
import { baseDictionary, expressions } from '@/config'

const columns = [
  {
    type: 'selection',
    width: 60
  },
  {
    title: '校核类型',
    slot: 'name',
    width: 200
  },
  {
    title: '阈值配置',
    slot: 'config'
  },
  {
    title: '表达式',
    slot: 'expression'
  }
]

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
  props: {
    baseConfig: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      columns,
      baseDictionary,
      expressions
    }
  },
  methods: {
    onSelectChange (value, row, ind) {
      this.equip(...[...arguments, 'operator'])
    },
    onInputBlur (value, row, ind) {
      this.equip(...[...arguments, 'value'])
    },
    onInputChange (value, row, ind) {
      const _limitedValue = [...row.limitedValue]
      Object.assign(_limitedValue[ind], { value })
    },
    equip (value, row, ind, key) {
      const _limitedValue = [...row.limitedValue]
      _limitedValue[ind] = Object.assign({}, _limitedValue[ind], { [key]: value })
      const _row = Object.assign({}, row, { limitedValue: _limitedValue })
      this.$emit('on-table-change', _row)
    },
    onSelect (selection, row) {
      this.handleSelect(row, true)
    },
    onSelectCancel (selection, row) {
      this.handleSelect(row, false)
    },
    handleSelect (row, checked) {
      const _row = Object.assign({}, row, { _checked: checked })
      this.$emit('on-table-change', _row)
    },
    onSelectAll () {
      this.$emit('on-select-all')
    },
    onSelectNone () {
      this.$emit('on-cancel-all')
    }
  }
}
</script>

<style lang="less">
  .limitedValue-table {
    .ivu-table-tbody td:nth-of-type(3) .ivu-table-cell{
      padding: 0
    }
    .ivu-table-tbody td:nth-of-type(4) .ivu-table-cell{
      padding: 0
    }

    .ivu-table-cell {
      overflow: visible;
    }

    .ivu-table {
      overflow: visible !important;
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
.expression-item {
  height: 53px;

  &.multiple-row {
    line-height: 32px;
  }

  &.single-row {
  line-height: 53px;
}
}
</style>
