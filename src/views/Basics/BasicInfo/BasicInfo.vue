<template>
  <div class="basic-info h-full p-3">
    <Fiche title="基础信息">
      <Form
        :model="basicFormValidate"
        :rules="basicRuleValidate"
        :label-width="180"
        ref="basicFormValidate">
        <Row>
          <ICol span="12">
            <FormItem label="项目名称：" prop="projectName" class="w-9/10">
              <Input v-model="basicRuleValidate.projectName" />
            </FormItem>
          </ICol>
          <ICol span="12">
            <FormItem label="任务名称：" class="w-9/10">
              <Input v-model="basicRuleValidate.taskName" />
            </FormItem>
          </ICol>
          <ICol span="12">
            <FormItem label="基础形式：" prop="basicType" class="w-9/10">
              <Select placeholder="请选择载荷数据来源" v-model="basicRuleValidate.basicType">
                <Option value="beijing">
                  New York
                </Option>
              </Select>
            </FormItem>
          </ICol>
          <ICol span="12">
            <FormItem label="塔架设计任务名称：" prop="towerTaskName" class="w-9/10">
              <Select placeholder="请选择载荷数据来源" v-model="basicRuleValidate.towerTaskName">
                <Option value="beijing">
                  New York
                </Option>
              </Select>
            </FormItem>
          </ICol>
          <ICol span="12">
            <FormItem label="基础极限载荷Mxy(kNm)：" prop="limitPayload" class="w-9/10">
              <Input v-model="basicRuleValidate.limitPayload" />
            </FormItem>
          </ICol>
          <ICol span="12">
            <FormItem label="水深：" prop="waterDepth" class="w-9/10">
              <Input v-model="basicRuleValidate.waterDepth" />
            </FormItem>
          </ICol>
        </Row>
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
      参数信息
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
import { Button, Row, Col, Input, Form, FormItem, Select, Option, Icon } from 'iview'
import Fiche from '@/components/Fiche'
import ConstraintTable from '@/components/ConstraintTable'
// import { baseUrl } from '@/config'

export default {
  name: 'BasicInfo',
  components: {
    Button,
    Fiche,
    Row,
    ICol: Col,
    Input,
    Form,
    FormItem,
    Select,
    Option,
    Icon,
    ConstraintTable
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
  mounted () {

  }
}
</script>

<style>
  .ido-table .ivu-table-body.ivu-table-overflowX {
    overflow-x: hidden
  }
</style>
