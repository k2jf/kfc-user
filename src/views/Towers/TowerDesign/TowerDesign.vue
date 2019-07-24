<template>
  <div class="tower-design h-full p-3">
    <div class="h-12">
      <span>项目名称：</span>
      <Input
        style="width: 180px;margin-right: 20px;"
        placeholder="请输入项目名称"
        v-model="projectName" />
      <span>塔架高度（m）：</span>
      <Input
        style="width: 180px;margin-right: 20px;"
        placeholder="请输入塔底高度"
        v-model="towerHeight" />
      <span>塔底直径（m）：</span>
      <Input
        style="width: 180px"
        placeholder="请输入塔底直径"
        v-model="bottomDiameter" />
      <Button class="mx-3" type="primary" @click="filtrate">
        查询
      </Button>
      <Button type="primary" class="ml-3" @click="createNewTask">
        新增任务
      </Button>
      <Modal
        :closable="false"
        :mask-closable="false"
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
            <Select placeholder="请选择一个项目" v-model="formValidate.projectId" @on-change="onChange">
              <Option :value="item.projectId + ''" v-for="item in projects" :key="item.id">
                {{ item.projectName }}
              </Option>
            </Select>
          </FormItem>
          <!-- <FormItem label="任务类型：" prop="taskType">
            <Select placeholder="请选择载荷数据来源" v-model="formValidate.loadId">
              <Option :value="String(item.id)" v-for="item in loadList" :key="item.id">
                {{ item.code }}
              </Option>
            </Select>
          </FormItem> -->
          <FormItem label="载荷编码：" prop="loadId">
            <Select placeholder="请选择载荷数据来源" v-model="formValidate.loadId">
              <Option :value="String(item.id)" v-for="item in loadList" :key="item.id">
                {{ item.code }}
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
              <a href="javascript:;" :disabled="row.status === 1" @click="viewTask(row)">编辑 | </a>
              <a href="javascript:;" :disabled="row.status !== 2" @click="viewResult(row.id)">结果</a> |
              <a href="javascript:;" @click="copyTask(row.id)">复制</a> |
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
import { mapState, mapMutations } from 'vuex'

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
      loadList: [],
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
        loadId: ''
      },
      ruleValidate: {
        projectId: [
          { required: true, trigger: 'blur', message: '项目不能为空' }
        ],
        loadId: [
          { required: true, trigger: 'blur', message: '载荷编码不能为空' }
        ]
      }
    }
  },
  computed: mapState({
    userName: state => state.userName
  }),
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (vm.$route.query.total) {
        vm.pageInfo = {
          pageNum: Number(vm.$route.query.pageNum),
          pageSize: Number(vm.$route.query.pageSize),
          total: Number(vm.$route.query.total)
        }
      }
    })
  },
  mounted () {
    Object.entries(this.$route.query).forEach(item => {
      this[item[0]] = item[1]
    })
    const searchParams = this.$route.query
    this.setListInterval({
      ...this.pageInfo,
      ...searchParams
    })
    // this.setListInterval()
    this.getLoadList()
  },
  beforeDestroy () {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  },
  methods: {
    ...mapMutations(['syncLoading']),
    async getTaskList (searchParams) {
      const res = await this.$get('towerTasks', {
        searchParams
      })
      if (!this._.isEqual(this.data, res.body.items)) {
        this.data = res.body.items
        this.pageInfo = {
          pageNum: res.body.pageInfo.pageNum,
          pageSize: res.body.pageInfo.pageSize,
          total: res.body.pageInfo.total
        }
      }
    },
    async getLoadList (projectId) {
      let searchParams = projectId !== undefined ? { projectId } : {}
      const res = await this.$get('loads', {
        searchParams
      })
      this.loadList = res.body.items
    },
    onChange (value) {
      if (value && !Number.isNaN(Number(value))) {
        this.getLoadList(Number(value))
        this.formValidate.loadId = ''
      }
    },
    onPageChange (pageNum) {
      this.pageInfo = Object.assign(this.pageInfo, { pageNum })
      const searchParams = this.getFiltrate()
      this.setListInterval({
        ...this.pageInfo,
        ...searchParams
      })
      this.$router.replace({ query: {
        ...searchParams,
        ...this.pageInfo
      } })
    },
    onPageSizeChange (pageSize) {
      this.pageInfo = Object.assign(this.pageInfo, { pageSize })
      const searchParams = this.getFiltrate()
      this.setListInterval({
        ...this.pageInfo,
        ...searchParams
      })
      this.$router.replace({ query: {
        ...searchParams,
        ...this.pageInfo
      } })
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
          const searchParams = this.getFiltrate()
          this.setListInterval({
            ...this.pageInfo,
            ...searchParams
          })
        }, 500)
      }
    },
    viewResult (id) {
      this.$router.push({ name: 'tower-result', params: { taskId: id } })
    },
    async copyTask (id) {
      try {
        this.syncLoading({ loading: true })
        const res = await this.$post(`towerTasks/${id}/copy`)
        this.syncLoading({ loading: false })
        this.$Message.success('复制成功')
        this.$router.push({ name: 'tower-design', params: { taskId: res.body.id } })

        // const searchParams = this.getFiltrate()
        // this.setListInterval({
        //   ...this.pageInfo,
        //   ...searchParams
        // })
      } catch (error) {
        this.syncLoading({ loading: false })
      }
    },
    async deleteTask (row) {
      Modal.confirm({
        title: '删除',
        content: '删除操作不可回退，确定删除？',
        onOk: async () => {
          await this.$delete('towerTasks/' + row.id)
          Message.success('删除成功')
          const searchParams = this.getFiltrate()
          this.setListInterval({
            ...this.pageInfo,
            ...searchParams
          })
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
                loadId: Number(this.formValidate.loadId),
                creator: this.userName
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
      this.formValidate = {
        projectId: 0,
        loadId: ''
      }
    },
    getFiltrate () {
      const searchParams = {}
      const searchArr = ['projectName', 'towerHeight', 'bottomDiameter']
      searchArr.forEach(item => {
        if (this[item]) {
          searchParams[item] = this[item].trim()
        }
      })
      return searchParams
    },
    filtrate () {
      const searchParams = this.getFiltrate()
      this.setListInterval({
        ...this.pageInfo,
        ...searchParams
      })
      this.$router.replace({ query: searchParams })
    },
    setListInterval (searchParams) {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
      this.getTaskList(searchParams)
      this.timer = setInterval(() => {
        this.getTaskList(searchParams)
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
