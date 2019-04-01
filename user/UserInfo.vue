<!-- 用户信息 -->
<template>
  <div>
    <Button
      type="default"
      long
      class="margin-bottom add-btn"
      @click="isShowUserModal = true">
      创建用户
    </Button>
    <Input
      placeholder="搜索用户"
      class="margin-bottom"
      v-model="userName"
      @on-change="onSearchClick" />
    <UserEdit
      :isShowUserModal="isShowUserModal"
      class="margin-bottom"
      @on-submit="onReloadList"
      @on-close="isShowUserModal = false" />
    <UserList
      :userList="userList"
      :currentUser="currentUser"
      @on-select="onChangeUser"
      @on-delete="onDeleteGroup" />
  </div>
</template>

<script>
import { Input, Button } from 'iview'
import UserEdit from './UserEdit.vue'
import UserList from './UserList.vue'

import { api } from '../api'

export default {
  name: 'UserInfo',
  components: {
    Button,
    Input,
    UserEdit,
    UserList
  },
  data () {
    return {
      isShowUserModal: false,
      userName: '',
      userList: null,
      currentUser: null
    }
  },
  mounted () {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    getUserList () {
      let url = `${api.users}/?page=1&size=20`
      if (this.userName) {
        url += `&username=${this.userName}`
      }

      this.$axios.get(url).then(res => {
        this.userList = res.data.result
        if (this.currentUser) return
        this.currentUser = res.data.result[0]
        this.$emit('on-user-change', this.currentUser)
      })
    },
    // 新建成功更新用户列表
    onReloadList () {
      this.isShowUserModal = false
      setTimeout(this.getUserList, 5000)
    },
    // 选择用户
    onChangeUser (id) {
      this.currentUser = this.userList.find(item => item.id === id)
      this.$emit('on-user-change', this.currentUser)
    },
    // 删除用户
    onDeleteGroup (id) {
      this.$axios.delete(`${api.groups}/${id}`).then(res => {
        // 删除的用户为当前选中用户当前选中用户设置为null
        if (this.currentUser.id === id) {
          this.currentUser = null
        }
        this.getUserList()
      })
    },
    onSearchClick () {
      this.getUserList()
    }
  }
}
</script>

<style lang="css" scoped>
.margin-bottom {
  margin-bottom: 6px;
}
</style>
