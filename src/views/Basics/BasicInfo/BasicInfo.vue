<template>
  <div class="basic-info h-full p-3">
    <Fiche title="基础信息">
      <Form
        :model="basicFormValidate"
        :rules="basicRuleValidate"
        :label-width="180"
        ref="basicFormValidate">
        <div class="flex flex-wrap">
          <div class="w-1/2">
            <FormItem label="项目名称：" prop="projectName" class="w-9/10">
              <Input v-model="basicFormValidate.projectName" />
            </FormItem>
          </div>
          <div class="w-1/2">
            <FormItem label="任务名称：" class="w-9/10">
              {{ basicFormValidate.taskName || '根据规则生成' }}
            </FormItem>
          </div>
          <div class="w-1/2">
            <FormItem label="基础形式：" prop="basicType" class="w-9/10">
              <Select placeholder="请选择载荷数据来源" v-model="basicFormValidate.basicType">
                <Option value="beijing">
                  New York
                </Option>
              </Select>
            </FormItem>
          </div>
          <div class="w-1/2">
            <FormItem label="塔架设计任务名称：" prop="towerTaskName" class="w-9/10">
              <Select placeholder="请选择载荷数据来源" v-model="basicFormValidate.towerTaskName">
                <Option value="beijing">
                  New York
                </Option>
              </Select>
            </FormItem>
          </div>
          <div class="w-1/2">
            <FormItem label="基础极限载荷Mxy(kNm)：" prop="baseUltimate" class="w-9/10">
              <Input v-model="basicFormValidate.baseUltimate" />
            </FormItem>
          </div>
          <div class="w-1/2">
            <FormItem label="水深：" prop="waterDepth" class="w-9/10">
              <Input v-model="basicFormValidate.waterDepth" />
            </FormItem>
          </div>
        </div>
        </From>
      </form>
    </Fiche>
    <Fiche title="约束条件" class="mt-6">
      <p class="pl-6 pb-2">
        约束条件配置：
      </p>
      <div class="px-6">
        <ConstraintTable
          :baseConfig="baseConfig"
          @on-table-change="onTableChange"
          @on-select-all="onTableSelectAll"
          @on-cancel-all="onTableCancelAll" />
      </div>
    </Fiche>
    <Fiche title="参数信息" class="my-6">
      <div class="p-3">
        <Tabs :animated="false">
          <TabPane label="几何参数">
            <BasicParamsCard basicType="geometry" :geometryInfo="geometryInfo" />
          </TabPane>
          <TabPane label="海况参数">
            海况参数
          </TabPane>
          <TabPane label="地质参数">
            地质参数
          </TabPane>
        </Tabs>
      </div>
    </Fiche>
    <div class="text-center mb-6">
      <Button type="primary" @click="save">
        保存
      </Button>
      <Button class="ml-3">
        取消
      </Button>
    </div>
  </div>
</template>

<script>
import { Button, Input, Form, FormItem, Select, Option, Icon, Tabs, TabPane } from 'iview'
import Fiche from '@/components/Fiche'
import ConstraintTable from '@/components/ConstraintTable'
import BasicParamsCard from '@/components/BasicParamsCard'

import { baseConfig } from '@/config'

export default {
  name: 'BasicInfo',
  components: {
    Button,
    Fiche,
    Input,
    Form,
    FormItem,
    Select,
    Option,
    Icon,
    ConstraintTable,
    Tabs,
    TabPane,
    BasicParamsCard
  },
  data () {
    return {
      baseConfig,
      basicFormValidate: {

      },
      basicRuleValidate: {

      },
      geometryInfo: null
    }
  },
  computed: {
    slotClass (item, index) {
      return item.length > 1 && index < item.length - 1 ? 'has-border' : ''
    }
  },
  async mounted () {
    if (this.$route.params.basicId === 'create') return
    const res = await this.$get(`foundations/${this.$route.params.basicId}`)
    this.basicFormValidate = {
      projectName: res.body.projectName,
      taskName: res.body.taskName,
      baseUltimate: res.body.baseUltimate
    }
    if (res.body.geometry.length > 0) {
      this.geometryInfo = res.body.geometry[0]
    }
  },
  methods: {
    onTableChange (row) {
      const _baseConfig = [...this.baseConfig]
      const index = _baseConfig.findIndex(b => b.name === row.name)
      _baseConfig[index] = row
      this.baseConfig = _baseConfig
    },
    onTableSelectAll () {
      const _baseConfig = [...this.baseConfig]
      _baseConfig.forEach(b => {
        b._checked = true
      })
      this.baseConfig = _baseConfig
    },
    onTableCancelAll () {
      const _baseConfig = [...this.baseConfig]
      _baseConfig.forEach(b => {
        b._checked = false
      })
      this.baseConfig = _baseConfig
    },
    save () {
      const constraint = this.baseConfig.map(item => {
        const _item = Object.assign({}, item, { checked: item._checked })
        Reflect.deleteProperty(_item, '_checked')
        return _item
      })
      console.log(constraint)
    }
  }
}
</script>

<style>
  .ido-table .ivu-table-body.ivu-table-overflowX {
    overflow-x: hidden
  }
</style>
