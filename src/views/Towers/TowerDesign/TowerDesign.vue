<template>
  <div class="tower-design h-full p-3">
    <div class="h-12">
      <span>项目名称：</span>
      <Input
        style="width: 180px;margin-right: 20px;"
        placeholder="请输入项目名称"
        icon="ios-search"
        v-model="projectName" />
      <span>塔架高度（m）：</span>
      <Input
        style="width: 180px;margin-right: 20px;"
        placeholder="请输入塔底高度"
        icon="ios-search"
        v-model="towerHeight" />
      <span>塔底直径（m）：</span>
      <Input
        style="width: 180px"
        placeholder="请输入塔底直径"
        icon="ios-search"
        v-model="bottomDiameter" />
      <Button class="mx-3" type="primary" @click="filtrate">
        查询
      </Button>
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
          <FormItem label="载荷数据来源：" prop="loadDatasource">
            <Select placeholder="请选择载荷数据来源" v-model="formValidate.loadDatasource" @on-change="onChange">
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
              <a href="javascript:;" :disabled="row.status === 1" @click="submitTask(row.id)">提交</a> |
              <a href="javascript:;" :disabled="row.status === 1" @click="viewTask(row)">编辑 | </a>
              <a href="javascript:;" :disabled="row.status !== 2" @click="viewResult(row.id)">结果</a> |
              <a href="javascript:;" :disabled="row.status === 1" @click="deleteTask(row)">删除</a>
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
import { Input, Button, Table, Page, Modal, Form, FormItem, Select, Option, Message } from 'iview'
import columns from './columnDef'

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
      projectName: '',
      towerHeight: '',
      bottomDiameter: '',
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
        loadDatasource: ''
      },
      ruleValidate: {
        projectId: [
          { required: true, trigger: 'change', message: '不能为空' }
        ],
        loadDatasource: [
          { required: true, trigger: 'change', message: '不能为空' }
        ]
      }
    }
  },
  mounted () {
    this.setListInterval()
  },
  beforeDestroy () {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  },
  methods: {
    async getTaskList ({ pageNum, pageSize }) {
      const res = await this.$get('towerTasks', {
        searchParams: { pageNum, pageSize }
      })
      if (!this._.isEqual(this.data, res.body.items)) {
        this.data = res.body.items
        this.pageInfo = res.body.pageInfo
      }
    },
    onPageChange (pageNum) {
      this.pageInfo = Object.assign(this.pageInfo, { pageNum })
      this.setListInterval()
    },
    onPageSizeChange (pageSize) {
      this.pageInfo = Object.assign(this.pageInfo, { pageSize })
      this.setListInterval()
    },
    onChange (value) {
      this.isOnline = value === '1'
    },
    async createNewTask () {
      const res = await this.$get('projects')
      this.projects = res.body.items
      this.visible = true
    },
    async submitTask (id) {
      const res = await this.$post(`towerTasks/${id}/codeSubmit`, { silent: true })

      if (res.code !== 0) {
        Message.error(res.body.message)
      } else {
        Message.success('提交成功')
        setTimeout(() => {
          this.setListInterval()
        }, 500)
      }
    },
    viewResult (id) {
      this.$router.push({ name: 'tower-result', params: { taskId: id } })
    },
    async deleteTask (row) {
      Modal.confirm({
        title: '删除',
        content: '删除操作不可回退，确定删除？',
        onOk: async () => {
          await this.$delete('towerTasks/' + row.id)
          Message.success('删除成功')
          // this.getTaskList(this.pageInfo)
          this.setListInterval()
        }
      })
    },
    viewTask (row) {
      this.$router.push({ name: 'tower-design', params: { taskId: row.id } })
    },
    async asyncOK () {
      this.loading = true
      this.$refs.formValidate.validate(async (valid) => {
        if (valid) {
          try {
            const res = await this.$post('towerTasks', {
              json: {
                projectId: this.formValidate.projectId,
                loadDatasource: Number(this.formValidate.loadDatasource)
              }
            })
            if (res.code === 0) {
              this.visible = false
              this.loading = false
              this.$router.push({ name: 'tower-design', params: { taskId: res.body.id } })
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
    },
    filtrate () {
      //
    },
    setListInterval () {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
      this.getTaskList(this.pageInfo)
      this.timer = setInterval(() => {
        this.getTaskList(this.pageInfo)
      }, 5000)
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
