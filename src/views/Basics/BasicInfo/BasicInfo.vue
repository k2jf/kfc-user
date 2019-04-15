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
            <FormItem label="基础极限载荷Mxy(kNm)：" prop="limitPayload" class="w-9/10">
              <Input v-model="basicFormValidate.limitPayload" />
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
        <ConstraintTable />
      </div>
    </Fiche>
    <Fiche title="参数信息" class="my-6">
      <div class="p-3">
        <Tabs :animated="false">
          <TabPane label="几何参数">
            几何参数
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
      <Button type="primary">
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
    TabPane
  },
  data () {
    return {

      basicFormValidate: {

      },
      basicRuleValidate: {

      }
    }
  },
  computed: {
    slotClass (item, index) {
      return item.length > 1 && index < item.length - 1 ? 'has-border' : ''
    }
  },
  async mounted () {
    if (this.$route.params.basicId === 'create') return
    const res = await this.$get(`baseTasks/${this.$route.params.basicId}`)
    this.basicFormValidate = {
      taskName: res.body.taskName
    }
  }
}
</script>

<style>
  .ido-table .ivu-table-body.ivu-table-overflowX {
    overflow-x: hidden
  }
</style>
