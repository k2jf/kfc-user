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
                  style="width: 50px"
                  placeholder=""
                  :value="item.operator"
                  @on-change="onSelectChange($event, row, ind)">
                  <Option :value="exp.value" v-for="(exp, index) in expressions" :key="index">
                    {{ exp.label }}
                  </Option>
                </Select>
              </ICol>
              <ICol span="12">
                <Input
                  :value="item.value"
                  style="width: 100%"
                  @on-change="onInputChange($event.target.value, row, ind)" />
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
      <!-- windLoad 风机载荷 -->
      <!-- ========================================================= -->
      <template slot="windLoad" slot-scope="{ row, index }">
        <Input :value="row.windLoad" @on-change="onConfigChange($event.target.value, index, 'windLoad')" />
      </template>
      <!-- ========================================================= -->
      <!-- combination 载荷组合系数 -->
      <!-- ========================================================= -->
      <template slot="combination" slot-scope="{ row, index }">
        <Input :value="row.combination" @on-change="onConfigChange($event.target.value, index, 'combination')" />
      </template>
      <!-- ========================================================= -->
      <!-- dead 自重 -->
      <!-- ========================================================= -->
      <template slot="dead" slot-scope="{ row, index }">
        <Input :value="row.dead" @on-change="onConfigChange($event.target.value, index, 'dead')" />
      </template>
      <!-- ========================================================= -->
      <!-- waveLoad 波流载荷 -->
      <!-- ========================================================= -->
      <template slot="waveLoad" slot-scope="{ row, index }">
        <Input :value="row.waveLoad" @on-change="onConfigChange($event.target.value, index, 'waveLoad')" />
      </template>
      <!-- ========================================================= -->
      <!-- members 结构重要性系数 -->
      <!-- ========================================================= -->
      <template slot="members" slot-scope="{ row, index }">
        <Input :value="row.members" @on-change="onConfigChange($event.target.value, index, 'members')" />
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
    width: 50
  },
  {
    title: '校核类型',
    slot: 'name',
    width: 100
  },
  {
    title: '阈值配置',
    slot: 'config',
    width: 300
  },
  {
    title: '表达式',
    slot: 'expression'
  },
  {
    title: '风机载荷',
    slot: 'windLoad'
  },
  {
    title: '载荷组合系数',
    slot: 'combination'
  },
  {
    title: '自重',
    slot: 'dead'
  },
  {
    title: '波流载荷',
    slot: 'waveLoad'
  },
  {
    title: '结构重要性系数',
    slot: 'members'
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
      expressions,
      magicConfig: [...this.baseConfig]
    }
  },
  watch: {
    baseConfig (_) {
      this.magicConfig = [..._]
    }
  },
  beforeDestroy () {
    this.magicConfig = []
  },
  methods: {
    onSelectChange (value, row, ind) {
      this.equip(...[...arguments, 'operator'])
    },
    onInputChange (value, ...others) {
      this.equip(...[Number(value), ...others, 'value'])
    },
    equip (value, row, ind, key) {
      // ind 是 limitedValue 里的下标，不是 row 的下标
      const _limitedValue = [...row.limitedValue]
      _limitedValue[ind] = Object.assign(_limitedValue[ind], { [key]: value })
      const index = this.magicConfig.findIndex(m => m.name === row.name)
      const magicRow = this.magicConfig[index]
      const _row = Object.assign({}, magicRow, { limitedValue: _limitedValue })
      this.updateMagic(_row, index)
    },
    updateMagic (row, ind) {
      const _magicConfig = [...this.magicConfig]
      _magicConfig[ind] = row
      this.magicConfig = _magicConfig
    },
    onConfigChange (value, ind, key) {
      const row = this.magicConfig[ind]
      const _row = Object.assign({}, row, { [key]: Number(value) })
      this.updateMagic(_row, ind)
    },
    onSelect (selection, row) {
      this.handleSelect(row, true)
    },
    onSelectCancel (selection, row) {
      this.handleSelect(row, false)
    },
    handleSelect (row, checked) {
      const ind = this.magicConfig.findIndex(b => b.name === row.name)
      const magicRow = this.magicConfig[ind]
      const _row = Object.assign({}, magicRow, { _checked: checked })
      this.updateMagic(_row, ind)
    },
    onSelectAll () {
      const _magicConfig = [...this.magicConfig]
      _magicConfig.forEach(b => {
        b._checked = true
      })
      this.magicConfig = _magicConfig
    },
    onSelectNone () {
      const _magicConfig = [...this.magicConfig]
      _magicConfig.forEach(b => {
        b._checked = false
      })
      this.magicConfig = _magicConfig
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
  overflow: hidden;
  white-space: nowrap;

  &.multiple-row {
    line-height: 32px;
  }

  &.single-row {
  line-height: 53px;
}
}
</style>
