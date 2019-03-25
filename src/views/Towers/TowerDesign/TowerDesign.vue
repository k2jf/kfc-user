<template>
  <div class="tower-design h-full p-3">
    <div class="h-12">
      <span>项目名称：</span>
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
      </Button>
      <Button class="ml-3" type="primary" @click="createNewTask">
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
          :label-width="80"
          ref="formValidate">
          <FormItem label="项目名称" prop="projectId">
            <Select placeholder="请选择一个项目" v-model="formValidate.projectId">
              <Option value="beijing">
                New York
              </Option>
              <Option value="shanghai">
                London
              </Option>
              <Option value="shenzhen">
                Sydney
              </Option>
            </Select>
          </FormItem>
          <FormItem label="任务名称">
            (接口返回xxxxxx)
          </FormItem>
        </Form>
      </Modal>
    </div>
    <div class="h-calc-12">
      <div class="ido-table h-calc-16">
        <Table
          class="ido-table"
          stripe
          :columns="columns"
          :data="data">
          <template slot="operation" slot-scope="{ row }">
            <div class="text-grey">
              <a href="javascript:;">提交</a> |
              <a href="javascript:;" @click="viewTask(row)">查看</a> |
              <a href="javascript:;">编辑</a> |
              <a href="javascript:;">结果</a> |
              <a href="javascript:;" @click="deleteTask(row)">删除</a>
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
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      },
      loading: true,
      visible: false,
      formValidate: {
        projectId: 0
      },
      ruleValidate: {
        projectId: [
          { required: true, message: '项目不能为空', trigger: 'blur' }
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
    createNewTask () {
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
                projectId: 567,
                taskName: '泰坦星塔架设计'
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
