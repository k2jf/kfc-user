<template>
  <div>
    <i-form
      :model="user"
      :label-width="80"
      ref="formRef">
      <i-form-item prop="username" label="用户名">
        <i-input
          placeholder="请输入用户名"
          v-model="user.username" @on-change="onDetailChange"/>
      </i-form-item>
      <i-form-item prop="email" label="邮箱">
        <i-input placeholder="请输入邮箱" v-model="user.email" @on-change="onDetailChange" />
      </i-form-item>
    </i-form>
  </div>
</template>

<script>
import { Form, FormItem, Input } from 'iview'

export default {
  name: 'UserDetail',
  components: {
    'i-form': Form,
    'i-form-item': FormItem,
    'i-input': Input
  },
  props: {
    currentUser: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      user: { ...this.currentUser }
    }
  },
  watch: {
    currentUser (val) {
      this.user = { ...val }
    }
  },
  methods: {
    onDetailChange () {
      this.$emit('on-modify-user', this.user)
    }
  }
}
</script>
