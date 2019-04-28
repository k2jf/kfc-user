<template>
  <div style="overflow:auto">
    <Form
      :model="user"
      :label-width="80"
      :rules="rules">
      <FormItem prop="name" label="用户名:">
        <Input placeholder="请输入用户名" v-model="user.name" />
      </FormItem>
      <FormItem prop="email" label="邮箱:">
        <Input placeholder="请输入邮箱" v-model="user.email" />
      </FormItem>
      <FormItem label="权限:" v-if="user.permissions && user.permissions.length">
        <div class="auth-detail">
          <Table
            :columns="permissionColumns"
            :data="user.permissions"
            size="small"
            class="margin-bottom"></Table>
        </div>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="onSaveClick">
          保存
        </Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { Form, FormItem, Input, Button, Table } from 'iview'

import api from '../api'

export default {
  name: 'UserDetail',
  components: {
    Form,
    FormItem,
    Input,
    Table,
    Button
  },
  props: {
    currentUser: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      user: { ...this.currentUser },
      permissionColumns: [
        { title: '资源个例名称', key: 'resourceName', minWidth: 130 },
        { title: '权限', key: 'operations', minWidth: 130 },
        { title: '是否生效',
          minWidth: 100,
          render: (h, params) => {
            return h(
              'span', params.row.disabled ? '是' : '否'
            )
          }
        }
      ],
      rules: {
        name: [
          { required: true, type: 'string', message: '用户名不能为空', trigger: 'change' }
        ],
        email: [
          { required: true, type: 'string', message: '邮箱不能为空', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    currentUser (val) {
      this.getUserDetail()
    }
  },
  mounted () {
    // 获取用户详细信息
    this.getUserDetail()
  },
  methods: {
    getUserDetail () {
      this.$axios.get(`${api.users}/${this.currentUser.id}`)
        .then(res => {
          this.user = res.data.body.userDetail
        })
    },
    onSaveClick () {
      let { email, name } = this.user

      this.$axios.put(`${api.users}/${this.currentUser.id}`, { email, name })
        .then(() => {
          this.$emit('on-modify-user', this.user)
          this.$Message.success('修改成功！')
        })
    }
  }
}
</script>
