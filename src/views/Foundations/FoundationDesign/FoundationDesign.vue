<template>
  <div class="basic-design h-full p-3">
    <div class="h-12">
      <span>项目名称：</span>
      <Input
        style="width: 180px;margin-right: 20px;"
        placeholder="请输入项目名称"
        icon="ios-search"
        v-model="value" />
      <Button class="ml-3" type="primary" @click="filtrate">
        查询
      </Button>
      <Button class="ml-3" type="primary" @click="createNewTask">
        新增任务
      </Button>
      <Modal
        title="新增基础设计任务"
        v-model="visible">
        <Form
          :style="{paddingRight: '20px'}"
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
          <FormItem label="任务类型：" prop="integratedDesign">
            <Select placeholder="请选择任务类型" v-model="formValidate.integratedDesign">
              <Option value="0">
                分布迭代
              </Option>
              <Option value="1">
                一体化设计校核
              </Option>
            </Select>
          </FormItem>
          <FormItem label="设计阶段：" prop="designPhase">
            <Select placeholder="请选择设计阶段：" v-model="formValidate.designPhase">
              <Option value="B">
                投标
              </Option>
              <Option value="D">
                中标
              </Option>
            </Select>
          </FormItem>
          <FormItem label="载荷来源：" prop="loadDatasource" v-if="formValidate.integratedDesign === '0'">
            <Select placeholder="请选择载荷数据来源" v-model="formValidate.loadDatasource">
              <Option value="0">
                LCC载荷
              </Option>
              <Option value="1">
                载荷门户
              </Option>
            </Select>
          </FormItem>
          <FormItem label="基础类型：" prop="foundationForm" v-if="formValidate.integratedDesign === '0'">
            <Select placeholder="请选择基础类型" v-model="formValidate.foundationForm">
              <Option value="1">
                单桩
              </Option>
              <Option value="2">
                高桩
              </Option>
            </Select>
          </FormItem>
          <FormItem label="sacs.in文件：" prop="sacs" v-if="formValidate.integratedDesign !== '0'">
            <Upload
              :action="action"
              :show-upload-list="false"
              :on-error="onUploadError"
              :on-success="onUploadSuccess">
              <Button icon="ios-cloud-upload-outline">
                上传文件
              </Button>
            </Upload>
          </FormItem>
          <FormItem label="校核类型：" prop="checkType" v-if="formValidate.integratedDesign !== '0'">
            <Select placeholder="请选择校核类型：" v-model="formValidate.checkType">
              <Option value="1">
                极限强度
              </Option>
              <Option value="2">
                疲劳损伤
              </Option>
            </Select>
          </FormItem>
          <FormItem label="天然泥面高程(m)：" prop="mudlineElevation" v-if="formValidate.integratedDesign === '0'">
            <Input v-model="formValidate.mudlineElevation" />
          </FormItem>
          <FormItem label="屈服强度(Mpa)：" prop="yieldStrength" v-if="formValidate.integratedDesign !== '0' && formValidate.checkType === '1'">
            <Input v-model="formValidate.yieldStrength" />
          </FormItem>
          <FormItem label="基础顶高程(m)：" prop="topElevation" v-if="formValidate.integratedDesign !== '0' && formValidate.checkType === '2'">
            <Input v-model="formValidate.topElevation" />
          </FormItem>
        </Form>
        <div slot="footer">
          <Button @click="onCancel">
            取消
          </Button>
          <Button type="primary" :loading="loading" @click="asyncOK">
            创建任务
          </Button>
        </div>
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
              <a href="javascript:;" :disabled="!row.showResultList" @click="viewTable(row.id)">结果</a> |
              <a href="javascript:;" :disabled="row.resultFiles.length === 0">
                <Dropdown transfer v-if="row.resultFiles.length > 0">
                  <a href="javascript:void(0)">
                    查看文件
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
                  查看文件
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
import { Input, Upload, Button, Table, Page, Modal, Form, FormItem, Select, Option, Message, Dropdown, DropdownMenu, DropdownItem, Icon } from 'iview'
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
    Upload,
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
      action: '',
      columns,
      data: [],
      baseUrl,
      resultList: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 10
      },
      projects: [],
      loading: false,
      visible: false,
      formValidate: {
        projectId: 0,
        integratedDesign: '0',
        designPhase: 'B',
        loadDatasource: '0',
        foundationForm: '1',
        checkType: '1'
      },
      ruleValidate: {
        projectId: [
          { required: true, message: '项目不能为空', trigger: 'change' }
        ],
        integratedDesign: [
          { required: true, message: '任务类型不能为空', trigger: 'blur' }
        ],
        designPhase: [
          { required: true, message: '设计阶段不能为空', trigger: 'blur' }
        ],
        loadDatasource: [
          { required: true, message: '载荷数据来源不能为空', trigger: 'change' }
        ],
        foundationForm: [
          { required: true, message: '基础类型不能为空', trigger: 'change' }
        ],
        mudlineElevation: [
          { required: true, message: '高程不能为空', trigger: 'change' }
        ],
        topElevation: [
          { required: true, message: '高程不能为空', trigger: 'change' }
        ],
        checkType: [
          { required: true, message: '高程不能为空', trigger: 'change' }
        ]
      }
    }
  },
  computed: mapState({
    userName: state => state.userName
  }),
  mounted () {
    this.setListInterval()
    // this.action =
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
    asyncOK () {
      this.loading = true
      if (this.formValidate.integratedDesign === '0') {
        this.normalOk()
      } else {
        this.integrateOk()
      }
    },
    async normalOk () {
      this.$refs.formValidate.validate(async (valid) => {
        if (valid) {
          try {
            const res = await this.$post('foundations', {
              json: {
                projectId: this.formValidate.projectId,
                loadDatasource: Number(this.formValidate.loadDatasource),
                foundationForm: Number(this.formValidate.foundationForm),
                creator: this.userName,
                integratedDesign: 0,
                designPhase: this.formValidate.designPhase,
                mudlineElevation: this.formValidate.mudlineElevation
              }
            })
            this.visible = false
            this.loading = false
            this.$router.push({ name: 'foundation-design', params: { foundationId: res.body.id } })
          } catch (err) {
            console.error(err)
            this.loading = false
          }
        } else {
          this.loading = false
          return false
        }
      })
    },
    async integrateOk () {
      this.$refs.formValidate.validate(async (valid) => {
        if (valid) {
          try {
            await this.$post('foundations', {
              json: {
                projectId: this.formValidate.projectId,
                creator: this.userName,
                designPhase: this.formValidate.designPhase,
                integratedDesign: Number(this.formValidate.checkType),
                topElevation: this.formValidate.checkType === '2' && this.formValidate.topElevation,
                yieldStrength: this.formValidate.checkType === '1' && this.formValidate.yieldStrength
              }
            })
            this.visible = false
            this.loading = false
          } catch (error) {
            console.error(error)
            this.loading = false
          }
        } else {
          this.loading = false
          return false
        }
      })
    },
    onCancel () {
      this.visible = false
      this.loading = false
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
    },
    filtrate () {
      const searchParams = {
        projectName: this.value
      }
      this.setFiltrateListInterval(searchParams)
    },
    setFiltrateListInterval (searchParams) {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
      this.getTaskFiltrateList(searchParams)
      this.timer = setInterval(() => {
        this.getTaskFiltrateList(searchParams)
      }, 5000)
    },
    async getTaskFiltrateList (searchParams) {
      const res = await this.$get('foundations', {
        searchParams: {
          ...searchParams,
          pageNum: 1,
          pageSize: 10
        }
      })
      if (!this._.isEqual(this.data, res.body.items)) {
        this.data = res.body.items
        this.pageInfo = res.body.pageInfo
      }
    },
    onUploadError () {

    },
    onUploadSuccess () {

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
