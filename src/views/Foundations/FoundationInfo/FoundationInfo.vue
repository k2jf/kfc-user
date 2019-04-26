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
            <FormItem label="基础类型：" class="w-9/10">
              {{ basicFormValidate.foundationForm === 1 ? '单桩' : '高桩' }}
            </FormItem>
          </div>
          <div class="w-1/2">
            <FormItem label="塔架设计任务名称：" prop="towerTaskId" class="w-9/10">
              <Select placeholder="请选择塔架设计任务" v-model="basicFormValidate.towerTaskId">
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
          ref="constraints"
          @on-table-change="onTableChange"
          @on-select-all="onTableSelectAll"
          @on-cancel-all="onTableCancelAll" />
      </div>
    </Fiche>
    <Fiche title="参数信息" class="my-6">
      <div>
        <Tabs :animated="false">
          <TabPane label="几何参数">
            <BasicParamsCard basicType="geometry" ref="geometry" />
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

import { mapMutations } from 'vuex'

import { baseConfig } from '@/config'
import { debug } from 'util'

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
      baseConfig: [],
      towerTaskList: [],
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
    this.init()
    this.getTowerTaskList()
  },
  beforeDestroy () {
    this.syncGeometry({
      geometry: {}
    })
  },
  methods: {
    ...mapMutations('foundation', ['syncGeometry']),
    async init () {
      if (this.$route.params.foundationId === 'create') return
      const res = await this.$get(`foundations/${this.$route.params.foundationId}`)
      this.basicFormValidate = {
        foundationForm: res.body.foundationForm,
        projectName: res.body.projectName,
        taskName: res.body.taskName,
        towerTaskId: res.body.towerTaskId,
        waterDepth: res.body.waterDepth,
        baseUltimate: res.body.baseUltimate
      }
      if (res.body.foundationForm === 1) {
        // 单桩
        this.baseConfig = baseConfig.filter(b => b.name !== 'tension')
      } else {
        this.baseConfig = baseConfig.filter(b => b.name !== 'compression' && b.name !== 'fatigue')
      }

      if (res.body.geometry.length > 0) {
        this.syncGeometry({
          geometry: {
            fileId: res.body.geometry[0].fileId,
            fileName: res.body.geometry[0].fileName
          }
        })
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
      console.log(row)
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
      console.log(this.$refs.constraints.magicConfig)
      // const constraints = this.baseConfig.map(item => {
      //   const _item = Object.assign({}, item, { checked: item._checked })
      //   Reflect.deleteProperty(_item, '_checked')
      //   Reflect.deleteProperty(_item, 'multiple')
      //   return _item
      // })
      // const geoms = ['codes', 'lrfdPHI', 'no_PNS', 'no_PS', 'pDelta', 'plTheory', 'shearDef', 'units']
      // let geomConfig = {}
      // geoms.forEach(g => {
      //   geomConfig[g] = this.$refs.geometry[g]
      // })
      // try {
      //   await this.$put(`foundations/${this.$route.params.foundationId}`, {
      //     json: {
      //       constraints,
      //       geomConfig,
      //       waterDepth: this.basicFormValidate.waterDepth,
      //       towerTaskId: this.basicFormValidate.towerTaskId,
      //       baseUltimate: this.basicFormValidate.baseUltimate
      //     },
      //     silent: true
      //   })
      //   Message.success('保存成功')
      //   setTimeout(() => {
      //     this.$router.push({ name: 'foundations' })
      //   }, 600)
      // } catch (error) {
      //   // Message.error('保存失败')
      // }
    },
    assembleBaseConfigs (constraints) {
      const _baseConfig = [...this.baseConfig]
      _baseConfig.forEach((item, ind) => {
        item._checked = constraints[ind].checked
        item.limitedValue = constraints[ind].limitedValue
        if (constraints[ind].checkedConfig) {
          Object.entries(constraints[ind].checkedConfig).forEach(c => {
            item[c[0]] = c[1]
          })
        }
      })
      console.log(_baseConfig)
      this.baseConfig = _baseConfig
    },
    cancel () {
      this.$router.push({ name: 'foundations' })
    }
  }
}
</script>

<style>
  .ido-table .ivu-table-body.ivu-table-overflowX {
    overflow-x: hidden
  }
</style>
