<template>
  <Modal
    title="创建用户"
    :maskClosable="false"
    :loading="isLoading"
    v-model="isShowModal"
    @on-ok="onClickOk"
    @on-cancel="onClickCancel">
    <Form
      :model="user"
      :rules="rules"
      :label-width="80"
      ref="formValidate">
      <FormItem prop="name" label="用户名">
        <Input placeholder="请输入用户名" v-model="user.name" />
      </FormItem>
      <FormItem prop="email" label="邮箱">
        <Input placeholder="请输入邮箱" v-model="user.email" />
      </FormItem>
      <FormItem prop="password" label="密码">
        <Input
          type="password"
          placeholder="请输入密码"
          v-model="user.password" />
      </FormItem>
      <FormItem prop="confirmPassword" label="确认密码">
        <Input
          type="password"
          placeholder="请输入确认密码"
          v-model="user.confirmPassword" />
      </FormItem>
      <FormItem label="用户组">
        <Select multiple v-model="user.usrgrpIds">
          <Option
            :value="groupItem.id"
            v-for="groupItem in userGroups"
            :key="groupItem.id">
            {{ groupItem.name }}
          </Option>
        </Select>
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
import { Modal, Form, FormItem, Input, Select, Option } from 'iview'

import MD5 from 'md5.js'
import api from '../api'

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
    const validatePassword = (rule, value, callback) => {
      let confirmPassword = this.user.confirmPassword
      if (!value) {
        callback(new Error('密码不能为空'))
      }
      if (confirmPassword && value !== confirmPassword) {
        callback(new Error('确认密码和密码不一致'))
      }
      callback()
    }
    const validateConfirmPassword = (rule, value, callback) => {
      let password = this.user.password
      if (!value) {
        callback(new Error('确认密码不能为空'))
      }
      if (password && value !== password) {
        callback(new Error('确认密码和密码不一致'))
      }
      callback()
    }
    return {
      isShowModal: this.isShowUserModal,
      isLoading: true,
      user: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        usrgrpIds: []
      },
      rules: {
        name: [
          { required: true, type: 'string', message: '用户名不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, type: 'email', message: '邮箱格式不对', trigger: 'blur' }
        ],
        password: [
          { required: true, type: 'string', validator: validatePassword, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, type: 'string', validator: validateConfirmPassword, trigger: 'blur' }
        ]
      },
      userGroups: []
    }
  },
  watch: {
    isShowUserModal (val) {
      this.$refs.formValidate.resetFields()
      this.user.usrgrpIds = []
      this.isShowModal = val
    }
  },
  mounted () {
    this.$axios.get(`${api.groups}`)
      .then(res => {
        this.userGroups = res.data.body.userGroups
      })
  },
  methods: {
    // 新建用户
    onClickOk () {
      this.$refs.formValidate.validate((valid) => {
        if (!valid) {
          this.isLoading = false
          this.$nextTick(() => {
            this.isLoading = true
          })
          return
        }

        let { name, email, password, usrgrpIds } = this.user
        let createUserRequest = {
          name,
          email,
          usrgrpIds: usrgrpIds.join(','),
          password: new MD5().update(password).digest('hex')
        }

        this.$axios.post(`${api.users}`, createUserRequest)
          .then(() => {
            this.$Message.success('新建成功！')
            this.$emit('on-submit')
          }).finally(() => {
            this.isLoading = false
            this.$nextTick(() => {
              this.isLoading = true
            })
          })
      })
    },
    onClickCancel () {
      this.$emit('on-close')
    }
  }
}
</script>
