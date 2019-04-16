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
import { Input, Button, Table, Page, Modal, Form, FormItem, Select, Option } from 'iview'
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
    createNewTask () {
      this.$router.push({ name: 'new-basic-design', params: { basicId: 'create' } })
    },
    deleteTask (row) {
      alert(`删除-${row.title}`)
    },
    viewTask (row) {
      this.$router.push({ name: 'new-basic-design', params: { basicId: row.id } })
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
