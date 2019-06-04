<template>
  <div class="basic-design h-full p-3">
    <div class="h-12">
      <!-- <span>项目名称：</span>
      <Input
        style="width: 180px;margin-right: 20px;"
        placeholder="请输入项目名称"
        icon="ios-search"
        v-model="value" /> -->
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
          :label-width="120"
          ref="formValidate">
          <FormItem label="项目名称：" prop="projectId">
            <Select placeholder="请选择一个项目" v-model="formValidate.projectId">
              <Option :value="item.projectId + ''" v-for="item in projects" :key="item.id">
                {{ item.projectName }}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="载荷数据来源：" prop="loadDatasource">
            <Select placeholder="请选择载荷数据来源" v-model="formValidate.loadDatasource">
              <Option value="0">
                LCC载荷
              </Option>
              <Option value="1">
                载荷门户
              </Option>
            </Select>
          </FormItem>
          <FormItem label="基础类型：" prop="foundationForm">
            <Select placeholder="请选择基础类型" v-model="formValidate.foundationForm">
              <Option value="1">
                单桩
              </Option>
              <Option value="2">
                高桩
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
              <a href="javascript:;" :disabled="row.status === 1" @click="submitTask(row.id)">提交</a> |
              <a href="javascript:;" :disabled="row.status === 1" @click="viewTask(row)">编辑</a> |
              <a href="javascript:;" :disabled="!row.showResultList" @click="viewTable(row.id)">查看交互表</a> |
              <a href="javascript:;" :disabled="row.resultFiles.length === 0">
                <Dropdown transfer v-if="row.resultFiles.length > 0">
                  <a href="javascript:void(0)">
                    结果
                    <Icon type="ios-arrow-down"></Icon>
                  </a>
                  <DropdownMenu slot="list">
                    <DropdownItem :name="item.fileId" v-for="item in row.resultFiles" :key="item.fileId">
                      <a :href="baseUrl + 'foundations/stream?fileId=' + item.fileId" target="_blank">
                        {{ item.fileName.split('.')[0] }}_{{ item.checkName }}
                      </a>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                <span class="" v-else>
                  结果
                  <Icon type="ios-arrow-down"></Icon>
                </span>
              </a> |
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
import { Input, Button, Table, Page, Modal, Form, FormItem, Select, Option, Message, Dropdown, DropdownMenu, DropdownItem, Icon } from 'iview'
import columns from './columnDef'
import { baseUrl } from '@/config'
import { mapState } from 'vuex'

export default {
  name: 'FoundationDesign',
  components: {
    Input,
    Button,
    Table,
    Page,
    Icon,
    Modal,
    Form,
    FormItem,
    Select,
    Option,
    Dropdown,
    DropdownMenu,
    DropdownItem
  },
  data () {
    return {
      value: '',
      columns,
      data: [],
      baseUrl,
      resultList: [],
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
        ],
        loadDatasource: [
          { required: true, message: '载荷数据来源不能为空', trigger: 'change' }
        ],
        foundationForm: [
          { required: true, message: '基础类型不能为空', trigger: 'change' }
        ]
      }
    }
  },
  computed: mapState({
    userName: state => state.userName
  }),
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
      const res = await this.$get('foundations', {
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
      this.$router.push({ name: 'foundation-design', params: { foundationId: row.id } })
    },
    viewTable (id) {
      this.$router.push({ name: 'foundation-result', params: { foundationId: id } })
    },
    async submitTask (id) {
      const res = await this.$put(`foundations/${id}/codeSubmit`, { silent: true })

      if (res.code !== 0) {
        Message.error(res.body.message)
      } else {
        Message.success('提交成功')
        setTimeout(() => {
          this.setListInterval()
        }, 500)
      }
    },
    async asyncOK () {
      this.loading = true
      this.$refs.formValidate.validate(async (valid) => {
        if (valid) {
          try {
            const res = await this.$post('foundations', {
              json: {
                projectId: this.formValidate.projectId,
                loadDatasource: Number(this.formValidate.loadDatasource),
                foundationForm: Number(this.formValidate.foundationForm),
                creator: this.userName
              }
            })
            this.visible = false
            this.loading = false
            this.$router.push({ name: 'foundation-design', params: { foundationId: res.body.id } })
          } catch (error) {
            console.error(error)
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
  .basic-design .ivu-table-body {
    overflow-x: hidden;
  }
  .ido-table .ivu-table-tip {
    overflow-x: hidden;
    overflow-y: hidden;
  }
</style>
