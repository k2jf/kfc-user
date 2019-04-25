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
              {{ basicFormValidate.projectName }}
              <!-- <Input v-model="basicFormValidate.projectName" /> -->
            </FormItem>
          </div>
          <div class="w-1/2">
            <FormItem label="任务名称：" class="w-9/10">
              {{ basicFormValidate.taskName }}
            </FormItem>
          </div>
          <div class="w-1/2">
            <FormItem label="基础形式：" prop="baseType" class="w-9/10">
              <Select placeholder="请选择载荷数据来源" v-model="basicFormValidate.baseType">
                <Option value="need_a_name_1">
                  单桩
                </Option>
                <Option value="need_a_name_2">
                  高桩承台
                </Option>
              </Select>
            </FormItem>
          </div>
          <div class="w-1/2">
            <FormItem label="塔架设计任务名称：" prop="towerTaskId" class="w-9/10">
              <Select placeholder="请选择载荷数据来源" v-model="basicFormValidate.towerTaskId">
                <Option :value="item.id" v-for="item in towerTaskList" :key="item.id">
                  {{ item.taskName }}
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
            <BasicParamsCard
              basicType="geometry"
              :fileId="geometryFileId"
              :fileName="geometryFileName"
              @on-change="onGeometryChange" />
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
      <Button class="ml-3" @click="cancel">
        取消
      </Button>
    </div>
  </div>
</template>

<script>
import { Button, Input, Form, FormItem, Select, Option, Icon, Tabs, TabPane, Message } from 'iview'
import Fiche from '@/components/Fiche'
import ConstraintTable from '@/components/ConstraintTable'
import BasicParamsCard from '@/components/BasicParamsCard'

import { baseConfig } from '@/config'

/**
 * 海况基础信息上传文件 fileKey: seaStateBase
 * 海况载荷信息上传文件 fileKey: seaStateLoad
 * 海况和载荷合并文件 fileKey: seaState
 */
export default {
  name: 'FoundationInfo',
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
      towerTaskList: [],
      basicFormValidate: {

      },
      basicRuleValidate: {

      },
      geometryFileId: -1,
      geometryFileName: ''
    }
  },
  computed: {
    slotClass (item, index) {
      return item.length > 1 && index < item.length - 1 ? 'has-border' : ''
    }
  },
  mounted () {
    this.init()
    this.getTowerTaskList()
  },
  methods: {
    async init () {
      if (this.$route.params.foundationId === 'create') return
      const res = await this.$get(`foundations/${this.$route.params.foundationId}`)
      this.basicFormValidate = {
        baseType: res.body.baseType,
        projectName: res.body.projectName,
        taskName: res.body.taskName,
        towerTaskId: res.body.towerTaskId,
        waterDepth: res.body.waterDepth,
        baseUltimate: res.body.baseUltimate
      }
      if (res.body.geometry.length > 0) {
        this.geometryFileId = res.body.geometry[0].fileId
        this.geometryFileName = res.body.geometry[0].fileName
      }
      if (res.body.constraints) {
        this.assembleBaseConfigs(res.body.constraints)
      }
    },
    async getTowerTaskList () {
      const res = await this.$get('towerTasks', {
        searchParams: { pageNum: 1, pageSize: 9999 }
      })
      this.towerTaskList = res.body.items
    },
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
    async save () {
      const constraints = this.baseConfig.map(item => {
        const _item = Object.assign({}, item, { checked: item._checked })
        Reflect.deleteProperty(_item, '_checked')
        Reflect.deleteProperty(_item, 'multiple')
        return _item
      })
      try {
        await this.$put(`foundations/${this.$route.params.foundationId}`, {
          json: {
            constraints,
            baseType: this.basicFormValidate.baseType,
            waterDepth: this.basicFormValidate.waterDepth,
            towerTaskId: this.basicFormValidate.towerTaskId,
            baseUltimate: this.basicFormValidate.baseUltimate
          }
        })
        Message.success('保存成功')
        this.$router.push({ name: 'foundations' })
      } catch (error) {
        Message.error('保存失败')
      }
    },
    assembleBaseConfigs (constraints) {
      const _baseConfig = [...baseConfig]
      _baseConfig.forEach((item, ind) => {
        item._checked = constraints[ind].checked
        item.limitedValue = constraints[ind].limitedValue
      })
      this.baseConfig = _baseConfig
    },
    cancel () {
      this.$router.push({ name: 'foundations' })
    },
    onGeometryChange ({ fileId, fileName }) {
      this.geometryFileId = fileId
      this.geometryFileName = fileName
    }
  }
}
</script>

<style>
  .ido-table .ivu-table-body.ivu-table-overflowX {
    overflow-x: hidden
  }
</style>
