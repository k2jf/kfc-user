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
      <div class="table h-calc-10">
        <Table
          stripe
          :columns="columns"
          :data="data">
          <template slot="operation" slot-scope="{ row }">
            <div class="text-grey">
              <a href="javascript:;">提交</a> |
              <a href="javascript:;">查看</a> |
              <a href="javascript:;">编辑</a> |
              <a href="javascript:;">结果</a> |
              <a href="javascript:;" @click="deleteTask(row)">删除</a>
            </div>
          </template>
        </Table>
      </div>
      <div class="footer h-10 pt-2">
        <Page class="float-right" :total="100" show-total />
      </div>
    </div>
  </div>
</template>
<script>
import { Input, Button, Table, Page, Modal, Form, FormItem, Select, Option } from 'iview'
import columns from './columnDef'
import { setTimeout } from 'timers'

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
    const res = await this.$get('http://localhost:3334/ido/towers').json()
    this.data = res.body.list
  },
  methods: {
    createNewTask () {
      this.visible = true
    },
    deleteTask (row) {
      alert(`删除-${row.title}`)
    },
    asyncOK () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          setTimeout(() => {
            this.visible = false
            this.$router.push({ name: 'new-tower-design' })
          }, 1000)
        }
      })
    },
    onCancel () {
      this.$refs.formValidate.resetFields()
    }
  }
}
</script>
<style lang="less" scoped>

</style>
