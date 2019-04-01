<template>
  <i-modal
    title="创建用户"
    :loading="isModalLoading"
    v-model="isShowModal"
    @on-ok="onOkClick"
    @on-cancel="onCancelClick">
    <i-form
      :model="formModel"
      :rules="formRules"
      :label-width="80"
      ref="formRef">
      <i-form-item prop="username" label="用户名">
        <i-input
          placeholder="请输入用户名"
          v-model="formModel.username" />
      </i-form-item>
      <i-form-item prop="email" label="邮箱">
        <i-input placeholder="请输入邮箱" v-model="formModel.email" />
      </i-form-item>
      <i-form-item
        prop="password"
        label="密码">
        <i-input
          type="password"
          placeholder="请输入密码"
          v-model="formModel.password" />
      </i-form-item>
      <i-form-item
        prop="confirmPassword"
        label="确认密码">
        <i-input
          type="password"
          placeholder="请输入确认密码"
          v-model="formModel.confirmPassword" />
      </i-form-item>
      <i-form-item prop="roles" label="角色">
        <i-select
          multiple
          v-model="formModel.roles">
          <i-option
            :value="opt.id"
            v-for="opt in roleOpts"
            :key="opt.id">
            {{ opt.name }}
          </i-option>
        </i-select>
      </i-form-item>
      <i-form-item prop="roles" label="用户组">
        <i-select
          multiple
          v-model="formModel.groups">
          <i-option
            :value="opt.id"
            v-for="opt in groupOpts"
            :key="opt.id">
            {{ opt.name }}
          </i-option>
        </i-select>
      </i-form-item>
    </i-form>
  </i-modal>
</template>

<script>
import { Modal, Form, FormItem, Input, Select, Option } from 'iview'

export default {
  name: 'UserEdit',
  components: {
    'i-modal': Modal,
    'i-form': Form,
    'i-form-item': FormItem,
    'i-input': Input,
    'i-select': Select,
    'i-option': Option
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
