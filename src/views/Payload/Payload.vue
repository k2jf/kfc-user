<template>
  <div class="payload h-full p-3">
    <div class="h-16 relative">
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
      </aside>
    </div>
    <Table
      border
      stripe
      :data="data"
      :columns="columns">
      <template slot="opreator" slot-scope="{ row }">
        修改 | 删除
      </template>
    </Table>
    <Modal
      title="添加载荷数据"
      v-model="visible"
      @on-cancel="onCancel"
      @on-ok="onOk">
      <Form
        :model="formValidate"
        :rules="ruleValidate"
        :label-width="140"
        ref="formValidate">
</Form>
    </Modal>
  </div>
</template>

<script>
import { Input, Button, Table, Modal, Form, FormItem } from 'iview'

export default {
  name: 'Payload',
  components: {
    Input,
    Button,
    Table,
    Modal,
    Form,
    FormItem
  },
  data () {
    return {
      data: [],
      columns: [],
      value: '',
      visible: false,
      formValidate: {},
      ruleValidate: {
        projectId: [
          { required: true, trigger: 'blur', message: '不能为空' }
        ],
        loadDatasource: [
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
      // this.$get('')
    },
    async submit () {

    },
    async addPayload () {

    }
  }
}
</script>

<style lang="scss" scoped>

</style>
