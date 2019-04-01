<template>
  <Card class="container">
    <Split v-model="split">
      <div slot="left">
        <UserList @on-user-change="getCurrentUser" />
      </div>
      <div slot="right">
        <Tabs
          type="line"
          v-model="currentTab">
          <div slot="extra">
            <Button
              type="primary"
              style="margin: 20px"
              v-if="currentTab === 'user'"
              @click="onModifyClick"
            >
              保存
            </Button>
            <Button
              type="primary"
              style="margin: 20px"
              v-if="currentTab === 'group'"
              @click="isShowGroupModal = true"
            >
              添加已有用户组
            </Button>
            <Button
              type="primary"
              style="margin: 20px"
              v-if="currentTab === 'auth'"
              @click="isShowAuthModal = true"
            >
              添加权限
            </Button>
          </div>
          <TabPane
            label="详情"
            name="user"
            class="tab-pane">
            <UserDetail
              :currentUser="currentUser"
              v-if="currentUser"
              @on-modify-user="getModifyUser" />
          </TabPane>
          <TabPane
            label="用户组"
            name="group"
            class="tab-pane">
            <UserGroup
              :currentUser="currentUser"
              :isReloadGroupList="isReloadGroupList"
              v-if="currentUser" />
            <UserGroupEdit
              :currentUser="currentUser"
              :isShowGroupModal="isShowGroupModal"
              v-if="currentUser"
              @on-submit="reloadGroupList"
              @on-close="isShowGroupModal = false" />
          </TabPane>
          <TabPane
            label="权限"
            name="auth"
            class="tab-pane">
            <ResourceInfo
              :currentRole="currentRole"
              :resourceTypeList="resourceTypeList"
              :permission="permission" />
            <ResourceEdit
              :currentRole="currentRole"
              :resourceTypeList="resourceTypeList"
              :isShowAuthModal="isShowAuthModal"
              v-if="currentRole"
              @on-submit="getPermission"
              @on-close="isShowAuthModal = false" />
          </TabPane>
        </Tabs>
      </div>
    </Split>
  </Card>
</template>

<script>
// eslint-disable-next-line
import { Split, Button, Tabs, TabPane, Card, Message } from 'iview'

import UserList from './user'
import UserDetail from './user/UserDetail.vue'
import UserGroup from './group'
import UserGroupEdit from './group/UserGroupEdit.vue'
import ResourceInfo from './resource'
import ResourceEdit from './resource/ResourceEdit.vue'

import { api } from './api'

export default {
  name: 'UserManage',
  components: {
    Split,
    Button,
    Tabs,
    TabPane,
    Card,
    UserList,
    UserDetail,
    UserGroup,
    UserGroupEdit,
    ResourceInfo,
    ResourceEdit
  },
  data () {
    return {
      split: 0.2,
      currentTab: 'user',
      isShowGroupModal: false,
      isReloadGroupList: false,
      isReloadRoleList: false,
      currentUser: null,
      userDetail: null,
      currentRole: {
        description: '',
        id: 36,
        name: 'atest',
        tenantId: 'goldwind'
      },
      permission: {
        appResInfoId: 'p00,p10',
        appResTypeId: 'md4x_ui',
        operationNames: [],
        subjectId: 36,
        subjectType: 'role'
      },
      resourceTypeList: [],
      isShowAuthModal: false
    }
  },
  mounted () {
    // 获取资源类型列表
    this.$axios.get(`${api.resourceTypes}?type=all`).then(res => {
      this.resourceTypeList = res.data.result
    })
  },
  methods: {
    getCurrentUser (currentUser) {
      this.currentUser = currentUser
    },
    getModifyUser (userDetail) {
      this.userDetail = userDetail
    },
    onModifyClick () {
      this.$axios.put(`${api.users}/${this.currentUser.username}`, this.userDetail)
        .then(() => {
          this.currentUser = this.userDetail
          this.$Message.success('修改成功！')
        })
    },
    reloadRoleList () {
      this.isShowGroupModal = false
      this.isReloadRoleList = !this.isReloadRoleList
    },
    reloadGroupList () {
      this.isShowGroupModal = false
      this.isReloadGroupList = !this.isReloadGroupList
    },
    getPermission (permission) {
      this.isShowAuthModal = false
      this.permission = permission
    }
  }
}
</script>

<style lang="css" scoped>
</style>
