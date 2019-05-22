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
            <FormItem label="泥面高程(m)：" prop="mudlineElevation" class="w-9/10">
              <Input v-model="basicFormValidate.mudlineElevation" />
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
          :type="constraintType"
          :baseConfig="baseConfig"
          ref="constraints" />
      </div>
    </Fiche>
    <Fiche title="参数信息" class="my-6">
      <div>
        <Tabs :animated="false" @on-click="onTabClick">
          <TabPane label="几何参数">
            <BasicParamsCard basicType="geometry">
              <template v-slot:params>
                <GeometryParams />
              </template>
            </BasicParamsCard>
          </TabPane>
          <TabPane label="海况参数">
            <BasicParamsCard basicType="seaState">
              <template v-slot:params>
                <SeaStateParams />
              </template>
            </BasicParamsCard>
          </TabPane>
          <TabPane label="地质参数">
            <BasicParamsCard basicType="geology">
              <template v-slot:params>
                <GeologyParams />
              </template>
            </BasicParamsCard>
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
import { Button, Input, Form, FormItem, Select, Option, Tabs, TabPane, Message } from 'iview'
import Fiche from '@/components/Fiche'
import ConstraintTable from '@/components/ConstraintTable'
import BasicParamsCard, { SeaStateParams, GeologyParams, GeometryParams } from '@/components/BasicParamsCard'
// import BasicParamsCard from '@/components/BasicParamsCard'

import { mapMutations } from 'vuex'

import { singlePileConfig, highPileConfig } from '@/config'

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
    ConstraintTable,
    Tabs,
    TabPane,
    BasicParamsCard,
    GeometryParams,
    SeaStateParams,
    GeologyParams
  },
  data () {
    return {
      baseConfig: [],
      towerTaskList: [],
      basicFormValidate: {

      },
      basicRuleValidate: {

      },
      constraintType: 1
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
  // beforeDestroy () {
  //   this.syncGeometry({ geometry: {} })
  //   this.syncSeaState({ seaState: {} })
  //   this.syncGeology({ geology: {} })
  // },
  methods: {
    ...mapMutations('foundation', ['syncGeometry', 'syncSeaState', 'syncGeology']),
    async init () {
      if (this.$route.params.foundationId === 'create') return
      const res = await this.$get(`foundations/${this.$route.params.foundationId}`)
      this.basicFormValidate = {
        foundationForm: res.body.foundationForm,
        projectName: res.body.projectName,
        taskName: res.body.taskName,
        towerTaskId: res.body.towerTaskId,
        mudlineElevation: res.body.mudlineElevation,
        baseUltimate: res.body.baseUltimate
      }
      this.constraintType = res.body.foundationForm
      if (res.body.foundationForm === 1) {
        // 单桩
        this.baseConfig = [...singlePileConfig]
      } else {
        this.baseConfig = [...highPileConfig]
      }

      if (res.body.geometry.length > 0) {
        this.syncGeometry({
          ...res.body.geometry[0]
        })
      }

      if (res.body.seaState.length > 0) {
        this.syncSeaState({
          ...res.body.seaState[0]
        })
      }

      if (res.body.geology.length > 0) {
        this.syncGeology({
          ...res.body.geology[0]
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
    async save () {
      const constraints = this.$refs.constraints.magicConfig.filter(m => m._checked).map(item => {
        return {
          checked: item._checked,
          name: item.name,
          limitedValue: item.limitedValue,
          checkedConfig: {
            windLoad: item.windLoad,
            waveLoad: item.waveLoad,
            combination: item.combination,
            dead: item.dead,
            members: item.members
          }
        }
      })
      // const geoms = ['codes', 'lrfdPHI', 'no_PNS', 'no_PS', 'pDelta', 'plTheory', 'shearDef', 'units']
      // let geomConfig = {}
      // geoms.forEach(g => {
      //   geomConfig[g] = this.$refs.geometry[g]
      // })
      try {
        await this.$put(`foundations/${this.$route.params.foundationId}`, {
          json: {
            constraints,
            // geomConfig,
            mudlineElevation: this.basicFormValidate.mudlineElevation,
            towerTaskId: this.basicFormValidate.towerTaskId,
            baseUltimate: this.basicFormValidate.baseUltimate
          },
          silent: true
        })
        Message.success('保存成功')
        setTimeout(() => {
          this.$router.push({ name: 'foundations' })
        }, 600)
      } catch (error) {
        // Message.error('保存失败')
      }
    },
    assembleBaseConfigs (constraints) {
      const _baseConfig = [...this.baseConfig]
      for (let i = 0; i < constraints.length; i++) {
        const index = _baseConfig.findIndex(b => b.name === constraints[i].name)
        const config = _baseConfig.find(b => b.name === constraints[i].name)
        let _config = {
          multiple: config.multiple,
          name: constraints[i].name,
          _checked: constraints[i].checked,
          limitedValue: constraints[i].limitedValue
        }
        if (constraints[i].checkedConfig) {
          Object.entries(constraints[i].checkedConfig).forEach(c => {
            _config[c[0]] = c[1] ? c[1].toFixed(2) : ''
          })
        }
        _baseConfig.splice(index, 1, _config)
      }
      console.log(_baseConfig)
      this.baseConfig = _baseConfig
    },
    cancel () {
      this.$router.push({ name: 'foundations' })
    },
    onTabClick () {
      this.$nextTick(() => {
        window.dispatchEvent(new Event('resize'))
      })
    }
  }
}
</script>

<style>
  .ido-table .ivu-table-body.ivu-table-overflowX {
    overflow-x: hidden
  }
</style>
