<template>
  <div style="overflow:auto">
    <Form
      :model="user"
      :label-width="80"
      :rules="rules"
      ref="formRef">
      <FormItem prop="username" label="用户名:">
        <label>{{ user.username }}</label>
      </FormItem>
      <FormItem prop="email" label="邮箱:">
        <Input placeholder="请输入邮箱" v-model="user.email" />
      </FormItem>
      <FormItem label="权限:">
        <Card class="auth-detail">
          <template v-for="authItem in authList">
            <AuthDetail
              :authDetail="authItem"
              v-if="authItem.resource.length>0"
              :key="authItem.appResTypeId"></AuthDetail>
          </template>
        </Card>
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
import { Form, FormItem, Input, Card, Button } from 'iview'
import AuthDetail from './AuthDetail.vue'

import { api } from '../api'

export default {
  name: 'UserDetail',
  components: {
    Form,
    FormItem,
    Input,
    Card,
    Button,
    AuthDetail
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
      authList: [{
        appResTypeName: '资源队列',
        appResTypeId: 'md4x_ui',
        resource: []
      }, {
        appResTypeName: '资源队列',
        appResTypeId: 'resource',
        resource: []
      }],
      rules: {
        email: [
          { required: true, type: 'string', message: '邮箱不能为空', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    currentUser (val) {
      this.user = { ...val }
    }
  },
  mounted () {
    // 获取资源详细信息
    this.getAuthDetail()
  },
  methods: {
    getAuthDetail () {
      let queryAuthRequest = []
      this.authList.forEach(item => {
        queryAuthRequest.push(this.$axios.get(`${api.resourceinfos}?page=1&size=6&subjectId=36&subjectType=role&appResTypeId=${encodeURIComponent(item.appResTypeId)}`))
      })

      Promise.all(queryAuthRequest).then(resDataList => {
        resDataList.forEach((item, index) => {
          this.authList[index].resource = item.data.result
        })
      })
    },
    onSaveClick () {
      this.$axios.put(`${api.users}/${this.currentUser.username}`, this.user)
        .then(() => {
          this.$emit('on-modify-user', this.user)
          this.$Message.success('修改成功！')
        })
    }
  }
}
</script>
