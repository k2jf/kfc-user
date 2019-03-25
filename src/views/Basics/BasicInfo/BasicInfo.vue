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
                    {{ item }}
                  </ICol>
                  <ICol span="6">
                    <Select size="small" style="width: 60px" placeholder="">
                      <Option :value="exp" v-for="(exp, index) in expressions" :key="index">
                        {{ exp }}
                      </Option>
                    </Select>
                  </ICol>
                  <ICol span="14">
                    <Input size="small" style="width: 160px" />
                  </ICol>
                </Row>
              </div>
            </div>
          </template>
        </Table>
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
import { Upload, Button, Row, Col, Input, Form, FormItem, Select, Table, Option, Switch, Icon, Message } from 'iview'
import Fiche from '@/components/Fiche'
// import { baseUrl } from '@/config'

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
  name: 'BasicInfo',
  components: {
    Upload,
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
    Table
  },
  data () {
    return {
      columns,
      tableData,
      expressions,
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
<style lang="less">
  .basic-info .ivu-table-tbody td:nth-of-type(3) .ivu-table-cell{
    padding: 0
  }
  .has-border {
    border-bottom: 1px solid #e8eaec;
  }
  .multiple-row {
    padding-top: 10px;
    padding-bottom: 10px;
  }
</style>
<style>
  .ido-table .ivu-table-body.ivu-table-overflowX {
    overflow-x: hidden
  }
</style>
