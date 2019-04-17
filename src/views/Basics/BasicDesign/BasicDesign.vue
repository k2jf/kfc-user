<template>
  <div class="basic-design h-full p-3">
    <div class="h-12">
      <span>项目名称：</span>
      <Input
        style="width: 180px;margin-right: 20px;"
        placeholder="请输入项目名称"
        icon="ios-search"
        v-model="value" />
      <Button class="ml-3" type="primary">
        查询
      </Button>
      <Button class="ml-3" type="primary" @click="createNewTask">
        新增任务
      </Button>
      <Modal
        title="新增基础设计任务"
        :loading="loading"
        ok-text="创建任务"
        v-model="visible"
        @on-cancel="onCancel"
        @on-ok="asyncOK">
        <Form
          :model="formValidate"
          :rules="ruleValidate"
          :label-width="100"
          ref="formValidate">
          <FormItem label="项目名称：" prop="projectId">
            <Select placeholder="请选择一个项目" v-model="formValidate.projectId">
              <Option :value="item.projectId + ''" v-for="item in projects" :key="item.id">
                {{ item.projectName }}
              </Option>
            </Select>
          </FormItem>
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
              <a href="javascript:;">提交</a> |
              <a href="javascript:;" @click="viewTask(row)">编辑</a> |
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
import { Input, Button, Table, Page, Modal, Form, FormItem, Select, Option, Message } from 'iview'
import columns from './columnDef'

export default {
  name: 'BasicDesign',
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
      projects: [],
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
      const res = await this.$get('foundations', {
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
    async createNewTask () {
      const res = await this.$get('projects')
      this.projects = res.body.items
      this.visible = true
    },
    async deleteTask (row) {
      Modal.confirm({
        title: '删除',
        content: '删除操作不可回退，确定删除？',
        onOk: async () => {
          await this.$delete('foundations/' + row.id)
          Message.success('删除成功')
          this.getTaskList(this.pageInfo)
        }
      })
    },
    viewTask (row) {
      this.$router.push({ name: 'new-basic-design', params: { basicId: row.id } })
    },
    async asyncOK () {
      this.loading = true
      this.$refs.formValidate.validate(async (valid) => {
        if (valid) {
          try {
            const res = await this.$post('foundations', {
              json: {
                projectId: this.formValidate.projectId
              }
            })
            this.visible = false
            this.loading = false
            this.$router.push({ name: 'new-basic-design', params: { basicId: res.body.id } })
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
  .basic-design .ivu-table-body {
    overflow-x: hidden;
  }
  .ido-table .ivu-table-tip {
    overflow-x: hidden;
    overflow-y: hidden;
  }
</style>
