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
        {{ dictionary[row.name] }}
      </template>
      <!-- 阈值配置 -->
      <!-- ========================================================= -->
      <template slot="config" slot-scope="{ row }">
        <div v-if="row.name !== 'mode'">
          <div
            class="px-4"
            :class="{
              'has-border': (row.multiple && ind < row.limitedValue.length - 1),
              'multiple-row': row.multiple
            }"
            v-for="(item,ind) in row.limitedValue"
            :key="ind">
            <Row>
              <ICol span="6">
                <div class="item-name">
                  {{ dictionary[item.name] }}
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
              <ICol span="8">
                <Input
                  :value="item.value"
                  style="width: 100%"
                  @on-change="onInputChange($event.target.value, row, ind)" />
              </ICol>
            </Row>
          </div>
        </div>
        <div v-else>
          <div class="px-4">
            <Row>
              <ICol span="4">
                <Input
                  style="width: 100%"
                  :value="(row.limitedValue)[0].value"
                  @on-blur="onInputBlur"
                  @on-change="onInputChange($event.target.value, row, 0)" />
              </ICol>
              <ICol span="6" class="text-center">
                <Select
                  style="width: 50px;"
                  placeholder=""
                  :value="(row.limitedValue)[0].operator"
                  @on-change="onSelectChange($event, row, 0)">
                  <!-- <Option :value="exp.value" v-for="(exp, index) in expressions" :key="index">
                    {{ exp.label }}
                  </Option> -->
                  <Option value="gt">
                    &lt;
                  </Option>
                  <Option value="gte">
                    &lt;=
                  </Option>
                </Select>
              </ICol>
              <ICol span="4">
                <div class="item-name text-center">
                  {{ dictionary[(row.limitedValue)[0].name] }}
                </div>
              </ICol>
              <ICol span="6" class="text-center">
                <Select
                  style="width: 50px"
                  placeholder=""
                  :value="(row.limitedValue)[1].operator"
                  @on-change="onSelectChange($event, row, 1)">
                  <!-- <Option :value="exp.value" v-for="(exp, index) in expressions" :key="index">
                    {{ exp.label }}
                  </Option> -->
                  <Option value="lt">
                    &lt;
                  </Option>
                  <Option value="lte">
                    &lt;=
                  </Option>
                </Select>
              </ICol>
              <ICol span="4">
                <Input
                  style="width: 100%"
                  :value="(row.limitedValue)[1].value"
                  @on-blur="onInputBlur"
                  @on-change="onInputChange($event.target.value, row, 1)" />
              </ICol>
            </Row>
          </div>
        </div>
      </template>
      <!-- ========================================================= -->
      <!-- 表达式 -->
      <!-- ========================================================= -->
      <template slot="expression" slot-scope="{ row }">
        <div v-if="row.name !== 'mode'">
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
              {{ dictionary[item.name] }}
              {{ dictionary[item.operator] }}
              {{ item.value }}
              <span v-if="row.name === 'deflection'">
                {{ unitDic[item.name] }}
              </span>
              <span v-if="row.name === 'compression'">
                {{ unitDic[item.name] }}
              </span>
            </span>
          </div>
        </div>
        <div v-else>
          <div class="px-4 expression-item single-row">
            <span
              :class="err ? 'text-red': ''"
              v-if="(row.limitedValue)[0].name && (row.limitedValue)[0].operator && (row.limitedValue)[0].value && (row.limitedValue)[1].operator && (row.limitedValue)[1].value">
              {{ (row.limitedValue)[0].value }}
              {{ unitDic[(row.limitedValue)[0].name] }}
              {{ moodDictionary[(row.limitedValue)[0].operator] }}
              {{ dictionary[(row.limitedValue)[0].name] }}
              {{ dictionary[(row.limitedValue)[1].operator] }}
              {{ (row.limitedValue)[1].value }}
              {{ unitDic[(row.limitedValue)[1].name] }}
            </span>
          </div>
        </div>
      </template>
      <!-- ========================================================= -->
      <!-- windLoad 风机载荷 -->
      <!-- ========================================================= -->
      <template slot="windLoad" slot-scope="{ row, index }">
        <!-- <Input :value="row.windLoad" @on-change="onConfigChange($event.target.value, index, 'windLoad')" /> -->
        <Select
          placeholder=""
          :value="row.windLoad"
          v-if="row.name !== 'fatigue'"
          @on-change="onConfigChange($event, index, 'windLoad')">
          <Option value="1.35">
            1.35
          </Option>
          <Option value="1.50">
            1.50
          </Option>
          <Option value="1.00">
            1.00
          </Option>
        </Select>
      </template>
      <!-- ========================================================= -->
      <!-- waveLoad 波流载荷 -->
      <!-- ========================================================= -->
      <template slot="waveLoad" slot-scope="{ row, index }">
        <Select
          placeholder=""
          :value="row.waveLoad"
          v-if="row.name !== 'fatigue'"
          @on-change="onConfigChange($event, index, 'waveLoad')">
          <Option value="1.35">
            1.35
          </Option>
          <Option value="1.50">
            1.50
          </Option>
          <Option value="1.00">
            1.00
          </Option>
        </Select>
      </template>
      <!-- ========================================================= -->
      <!-- dead 自重 -->
      <!-- ========================================================= -->
      <template slot="dead" slot-scope="{ row, index }">
        <Select
          placeholder=""
          :value="row.dead"
          v-if="row.name !== 'fatigue'"
          @on-change="onConfigChange($event, index, 'dead')">
          <Option value="1.00">
            1.00
          </Option>
          <Option value="1.10">
            1.10
          </Option>
          <Option value="0.90">
            0.90
          </Option>
        </Select>
      </template>
      <!-- ========================================================= -->
      <!-- combination 载荷组合系数 -->
      <!-- ========================================================= -->
      <template slot="combination" slot-scope="{ row, index }">
        <Select
          placeholder=""
          :value="row.combination"
          v-if="row.name !== 'fatigue'"
          @on-change="onConfigChange($event, index, 'combination')">
          <Option value="0.70">
            0.70
          </Option>
          <Option value="1.00">
            1.00
          </Option>
        </Select>
      </template>
      <!-- ========================================================= -->
      <!-- members 结构重要性系数 -->
      <!-- ========================================================= -->
      <template slot="members" slot-scope="{ row, index }">
        <Select
          placeholder=""
          :value="row.members"
          v-if="row.name !== 'fatigue'"
          @on-change="onConfigChange($event, index, 'members')">
          <Option value="1.10">
            1.10
          </Option>
          <Option value="1.00">
            1.00
          </Option>
        </Select>
      </template>
      <!-- ========================================================= -->
    </Table>
  </div>
</template>

<script>
import { Select, Option, Input, Table, Row, Col } from 'iview'
import { baseDictionary, expressions, highDictionary } from '@/config'

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
    width: 260
  },
  {
    title: '表达式',
    slot: 'expression',
    width: 200
  },
  {
    title: '风机载荷',
    slot: 'windLoad'
  },
  {
    title: '波流载荷',
    slot: 'waveLoad'
  },
  {
    title: '自重',
    slot: 'dead'
  },
  {
    title: '载荷组合系数',
    slot: 'combination'
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
    type: {
      type: Number,
      required: true
    },
    baseConfig: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      columns,
      dictionary: baseDictionary,
      expressions,
      magicConfig: [...this.baseConfig],
      moodDictionary: {
        'gt': '<',
        'gte': '<='
      },
      err: false,
      unitDic: {
        D_mudline: 'cm',
        D_pileTip: 'cm',
        D_tilt: 'rad',
        D_settlement: 'cm',
        allowable: 'kN',
        frequency: 'Hz'
      }
    }
  },
  watch: {
    baseConfig (_) {
      this.magicConfig = [..._]
    },
    type (value) {
      this.dictionary = value === 1 ? baseDictionary : highDictionary
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
      // this.equip(...[Number(value), ...others, 'value'])
      this.equip(...[...arguments, 'value'])
    },
    onInputBlur () {
      const mode = this.magicConfig.find(m => m.name === 'mode')
      const first = mode.limitedValue[0]
      const second = mode.limitedValue[1]
      if (first.value > second.value) {
        // this.$Message.error('模态范围不合理')
        this.err = true
      } else {
        this.err = false
      }
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
      console.log(...arguments)
      const row = this.magicConfig[ind]
      const _row = Object.assign({}, row, { [key]: value })
      this.updateMagic(_row, ind)
    },
    onSelect (selection, row) {
      this.handleSelect(row, true)
      if (row.name === 'fatigue') {
        this.$store.commit('foundation/syncFatigue', { hasFatigue: true })
      }
    },
    onSelectCancel (selection, row) {
      this.handleSelect(row, false)
      if (row.name === 'fatigue') {
        this.$store.commit('foundation/syncFatigue', { hasFatigue: false })
      }
    },
    handleSelect (row, checked) {
      const ind = this.magicConfig.findIndex(b => b.name === row.name)
      const magicRow = this.magicConfig[ind]
      const _row = Object.assign({}, magicRow, { _checked: checked })
      this.updateMagic(_row, ind)
    },
    onSelectAll () {
      console.log(this.magicConfig)
      const _magicConfig = [...this.magicConfig]
      _magicConfig.forEach(b => {
        b._checked = true
      })
      console.log(_magicConfig)
      this.$store.commit('foundation/syncFatigue', { hasFatigue: true })
      this.magicConfig = _magicConfig
      this.$emit('on-select-all-change', _magicConfig)
      // this.data = _magicConfig
    },
    onSelectNone () {
      const _magicConfig = [...this.magicConfig]
      _magicConfig.forEach(b => {
        b._checked = false
      })
      this.magicConfig = _magicConfig
      this.$store.commit('foundation/syncFatigue', { hasFatigue: false })
      this.$emit('on-select-all-change', _magicConfig)
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
