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
          <TabPane
            label="详情"
            name="user"
            class="tab-pane">
            <UserDetail
              :currentUser="currentUser"
              v-if="currentUser"
              @on-modify-user="getCurrentUser" />
          </TabPane>
          <TabPane
            label="用户组"
            name="group"
            class="tab-pane">
            <UserGroup :currentUser="currentUser" v-if="currentUser" />
          </TabPane>
          <TabPane
            label="权限"
            name="auth"
            class="tab-pane">
            <ResourceInfo :currentUser="currentUser" v-if="currentUser" />
          </TabPane>
        </Tabs>
      </div>
    </Split>
  </Card>
</template>

<script>
import { Split, Tabs, TabPane, Card } from 'iview'

import UserList from './user'
import UserDetail from './user/UserDetail.vue'
import UserGroup from './group'
import ResourceInfo from './resource'

export default {
  name: 'UserManage',
  components: {
    Split,
    Tabs,
    TabPane,
    Card,
    UserList,
    UserDetail,
    UserGroup,
    ResourceInfo
  },
  data () {
    return {
      split: 0.2,
      currentTab: 'user',
      currentUser: null
    }
  },
  methods: {
    getCurrentUser (currentUser) {
      this.currentUser = currentUser
    }
  }
}
</script>
