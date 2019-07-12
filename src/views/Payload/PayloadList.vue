<template>
  <div class="payload h-full p-3">
    <div class="h-12 relative">
      <aside class="absolute pin-r pin-t">
        <a class="float-right underline ido-link" href="http://internal-gw-zhy-loadportal-prod-front-474455559.cn-northwest-1.elb.amazonaws.com.cn/#/" target="_blank">
          载荷门户链接
        </a>
      </aside>
      <Input style="width:200px;" placeholder="请输入载荷编号" v-model="value" />
      <Button type="primary" class="mx-3" @click="submit">
        查询
      </Button>
      <Button type="primary" @click="addPayload">
        添加载荷数据
      </Button>
      <Modal
        :closable="false"
        :mask-closable="false"
        title="添加载荷数据"
        v-model="visible"
        @on-cancel="onCancel"
        @on-ok="onOk">
        <Form
          :model="formValidate"
          :rules="ruleValidate"
          :label-width="90"
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
          :data="data"
          :columns="columns">
          <template slot="operation" slot-scope="{ row }">
            <div class="text-grey">
              <a href="javascript:;" @click="editLoad(row.id)">编辑</a> |
              <a href="javascript:;" @click="deleteLoad(row.id)">删除</a>
            </div>
          </template>
        </Table>
      </div>
      <div class="footer h-16 pt-4">
        <Page
          show-total
          show-elevator
          show-sizer
          class="float-right" />
      </div>
    </div>
  </div>
</template>

<script>
import { Input, Button, Table, Modal, Form, FormItem, Select, Option, Page } from 'iview'
import columns from './columns'

export default {
  name: 'PayloadList',
  components: {
    Input,
    Button,
    Table,
    Modal,
    Form,
    FormItem,
    Select,
    Option,
    Page
  },
  data () {
    return {
      data: [],
      projects: [],
      columns,
      value: '',
      visible: false,
      formValidate: {},
      ruleValidate: {
        projectId: [
          { required: true, trigger: 'blur', message: '不能为空' }
        ]
      }
    }
  },
  mounted () {
    this.getPayloadList()
  },
  methods: {
    async getPayloadList () {
      try {
        const res = await this.$get('loads')
        this.data = res.body.items
      } catch (error) {
        console.error(error)
      }
    },
    async submit () {

    },
    async addPayload () {
      const res = await this.$get('projects')
      this.projects = res.body.items
      this.visible = true
    },
    onCancel () {
      this.visible = false
      this.$refs.formValidate.resetFields()
    },
    async onOk () {
      this.$refs.formValidate.validate(async (valid) => {
        if (valid) {
          try {
            const res = await this.$post('loads', {
              json: {
                projectId: Number(this.formValidate.projectId)
              }
            })
            this.$Message.success('添加成功')
            this.$router.push({ name: 'edit-load', params: { loadId: res.body.id } })
          } catch (error) {

          }
        }
      })
    },
    editLoad (loadId) {
      this.$router.push({ name: 'edit-load', params: { loadId } })
    },
    deleteLoad (loadId) {
      Modal.confirm({
        title: '删除',
        content: '删除操作不可回退，确定删除？',
        onOk: async () => {
          await this.$delete('loads/' + loadId)
          this.$Message.success('删除成功')
          this.getPayloadList()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.ido-table .ivu-table-wrapper {
  height: 100%;

  .ivu-table-body {
    height: calc(100% - 40px);
    overflow-y: auto;
    overflow-x: hidden;
  }

}
</style>
