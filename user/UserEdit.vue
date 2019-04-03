<template>
  <Modal
    title="创建用户"
    :loading="isModalLoading"
    v-model="isShowModal"
    @on-ok="onOkClick"
    @on-cancel="onCancelClick">
    <Form
      :model="formModel"
      :rules="formRules"
      :label-width="80"
      ref="formRef">
      <FormItem prop="username" label="用户名">
        <Input
          placeholder="请输入用户名"
          v-model="formModel.username" />
      </FormItem>
      <FormItem prop="email" label="邮箱">
        <Input placeholder="请输入邮箱" v-model="formModel.email" />
      </FormItem>
      <FormItem
        prop="password"
        label="密码">
        <Input
          type="password"
          placeholder="请输入密码"
          v-model="formModel.password" />
      </FormItem>
      <FormItem
        prop="confirmPassword"
        label="确认密码">
        <Input
          type="password"
          placeholder="请输入确认密码"
          v-model="formModel.confirmPassword" />
      </FormItem>
      <FormItem prop="roles" label="角色">
        <Select
          multiple
          v-model="formModel.roles">
          <Option
            :value="opt.id"
            v-for="opt in roleOpts"
            :key="opt.id">
            {{ opt.name }}
          </Option>
        </Select>
      </FormItem>
      <FormItem prop="roles" label="用户组">
        <Select
          multiple
          v-model="formModel.groups">
          <Option
            :value="opt.id"
            v-for="opt in groupOpts"
            :key="opt.id">
            {{ opt.name }}
          </Option>
        </Select>
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
import { Modal, Form, FormItem, Input, Select, Option } from 'iview'

export default {
  name: 'UserEdit',
  components: {
    Modal,
    Form,
    FormItem,
    Input,
    Select,
    Option
  },
  props: {
    isShowUserModal: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isModalLoading: true,
      isShowModal: this.isShowUserModal,
      formModel: {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        roles: '',
        groups: ''
      },
      formRules: {
        username: [
          { required: true, type: 'string', message: '用户名不能为空', trigger: 'change' }
        ],
        email: [
          { required: true, type: 'string', message: '邮箱不能为空', trigger: 'change' }
        ],
        password: [
          { required: true, type: 'string', message: '密码不能为空', trigger: 'change' }
        ],
        confirmPassword: [
          { required: true, type: 'string', message: '确认密码不能为空', trigger: 'change' }
        ]
      },
      roleOpts: [],
      groupOpts: []
    }
  },
  watch: {
    isShowUserModal (val) {
      this.$refs.formRef.resetFields()
      this.isShowModal = val
    }
  },
  mounted () {
    this.$axios.get('/kmx/auth-service/v1/roles?type=all')
      .then(res => {
        this.roleOpts = res.data.result
      })

    this.$axios.get('/kmx/auth-service/v1/groups?type=all')
      .then(res => {
        this.groupOpts = res.data.result
      })
  },
  methods: {
    onOkClick () {
      this.$refs.formRef.validate()
        .then(isSuccess => {
          if (!isSuccess) {
            this.isModalLoading = false
            this.$nextTick(() => {
              this.isModalLoading = true
            })
          }

          let formParams = JSON.parse(JSON.stringify(this.formModel))
          formParams.groups = formParams.groups ? formParams.groups.map(item => ({ name: item })) : []
          formParams.roles = formParams.roles ? formParams.roles.map(item => ({ name: item })) : []
          delete formParams.confirmPassword

          this.$axios.post('/kmx/auth-service/v1/users', formParams)
            .then(() => {
              this.$emit('on-submit')
            })
            .finally(() => {
              this.isModalLoading = false
              this.$nextTick(() => {
                this.isModalLoading = true
              })
            })
        })
    },
    onCancelClick () {
      this.$emit('on-close')
    }
  }
}
</script>
