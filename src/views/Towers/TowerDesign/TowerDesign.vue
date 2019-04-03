<template>
  <div class="tower-design h-full p-3">
    <div class="h-12">
      <!-- <span>项目名称：</span>
      <Input
        style="width: 180px;margin-right: 20px;"
        placeholder="请输入项目名称"
        icon="ios-search"
        v-model="value" />
      <span>塔架高度（m）：</span>
      <Input
        style="width: 180px;margin-right: 20px;"
        placeholder="请输入塔底高度"
        icon="ios-search"
        v-model="value" />
      <span>塔底直径（m）：</span>
      <Input
        style="width: 180px"
        placeholder="请输入塔底直径"
        icon="ios-search"
        v-model="value" />
      <Button class="ml-3" type="primary">
        查询
      </Button> -->
      <Button type="primary" @click="createNewTask">
        新增任务
      </Button>
      <Modal
        title="新增塔架设计任务"
        :loading="loading"
        ok-text="创建任务"
        v-model="visible"
        @on-cancel="onCancel"
        @on-ok="asyncOK">
        <Form
          :model="formValidate"
          :rules="ruleValidate"
          :label-width="140"
          ref="formValidate">
          <FormItem label="项目名称：" prop="projectId">
            <Select placeholder="请选择一个项目" v-model="formValidate.projectId">
              <Option :value="item.projectId + ''" v-for="item in projects" :key="item.id">
                {{ item.projectName }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="载荷数据来源：" prop="dataOrigin">
            <Select placeholder="请选择载荷数据来源" v-model="formValidate.dataOrigin" @on-change="onChange">
              <Option value="0">
                LCC载荷
              </Option>
              <Option value="1">
                载荷门户
              </Option>
            </Select>
          </FormItem>
          <div v-if="isOnline">
            <FormItem label="仿真任务标号：" prop="simulationId">
              <Input v-model="formValidate.simulationId" />
            </FormItem>
            <FormItem label="极限后处理任务编号：" prop="limitBackTaskId">
              <Input v-model="formValidate.limitBackTaskId" />
            </FormItem>
            <FormItem label="疲劳后处理任务编号：" prop="fatigueBackTaskId">
              <Input v-model="formValidate.fatigueBackTaskId" />
            </FormItem>
          </div>
        </Form>
      </Modal>
    </div>
    <div class="h-calc-12">
      <div class="ido-table h-calc-16">
        <Table
          class="ido-table"
          border
          stripe
          :columns="columns"
          :data="data">
          <template slot="operation" slot-scope="{ row }">
            <div class="text-grey">
              <!-- <a href="javascript:;">提交</a> | -->
              <a href="javascript:;" @click="viewTask(row)">编辑</a>
              <!-- <a href="javascript:;">结果</a> | -->
              <!-- <a href="javascript:;" @click="deleteTask(row)">删除</a> -->
            </div>
          </template>
        </Table>
      </div>
      <div class="footer h-16 pt-4">
        <Page
          show-total
          show-elevator
          show-sizer
          class="float-right"
          :page-size="pageInfo.pageSize"
          :total="pageInfo.total"
          :current="pageInfo.pageNum"
          @on-change="onPageChange"
          @on-page-size-change="onPageSizeChange" />
      </div>
    </div>
  </div>
</template>
<script>
import { Input, Button, Table, Page, Modal, Form, FormItem, Select, Option } from 'iview'
import columns from './columnDef'
import D from 'dayjs'

export default {
  name: 'TowerDesign',
  components: {
    Input,
    Button,
    Table,
    Page,
    Modal,
    Form,
    FormItem,
    Select,
    Option
  },
  data () {
    return {
      value: '',
      columns,
      data: [],
      isOnline: false,
      projects: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      },
      loading: true,
      visible: false,
      formValidate: {
        projectId: 0,
        dataOrigin: ''
      },
      ruleValidate: {
        projectId: [
          { required: true, trigger: 'change', message: '不能为空' }
        ],
        dataOrigin: [
          { required: true, trigger: 'change', message: '不能为空' }
        ]
      }
    }
  },
  async mounted () {
    this.getTaskList(this.pageInfo)
  },
  methods: {
    async getTaskList ({ pageNum, pageSize }) {
      const res = await this.$get('towerTasks', {
        searchParams: { pageNum, pageSize }
      })
      this.data = res.body.items
      this.pageInfo = res.body.pageInfo
    },
    onPageChange (pageNum) {
      this.pageInfo = Object.assign(this.pageInfo, { pageNum })
      this.getTaskList(this.pageInfo)
    },
    onPageSizeChange (pageSize) {
      this.pageInfo = Object.assign(this.pageInfo, { pageSize })
      this.getTaskList(this.pageInfo)
    },
    onChange (value) {
      this.isOnline = value === '1'
    },
    async createNewTask () {
      const res = await this.$get('projects')
      this.projects = res.body.items
      this.visible = true
    },
    deleteTask (row) {
      alert(`删除-${row.title}`)
    },
    viewTask (row) {
      this.$router.push({ name: 'new-tower-design', params: { taskId: row.id } })
    },
    async asyncOK () {
      this.loading = true
      this.$refs.formValidate.validate(async (valid) => {
        if (valid) {
          try {
            const res = await this.$post('towerTasks', {
              json: {
                projectId: this.formValidate.projectId,
                isOnline: this.formValidate.dataOrigin === '1'
              }
            })
            if (res.code === 0) {
              this.visible = false
              this.loading = false
              this.$router.push({ name: 'new-tower-design', params: { taskId: res.body.id } })
            }
          } catch (error) {
            this.loading = false
          }
        } else {
          this.loading = false
        }
      })
    },
    onCancel () {
      this.$refs.formValidate.resetFields()
    }
  }
}
</script>
<style lang="less">
// support table height to auto full size
.ido-table .ivu-table-wrapper {
  height: 100%;

  .ivu-table-body {
    height: calc(100% - 40px);
    overflow-y: auto;
    overflow-x: hidden;
  }

}
</style>
