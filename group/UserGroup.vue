<!-- 用户组列表 -->
<template>
  <div class="group-container" ref="groupContainer">
    <Row :gutter="16" class="margin-bottom">
      <Col span="14">
      <Button type="primary" @click="isShowGroupModal = true">
        添加已有用户组
      </Button>
      </Col>
      <Col span="10">
      <Input
        placeholder="搜索用户组"
        v-model="group.fuzzyName"
        @on-change="onSearchClick"></Input>
      </Col>
    </Row>
    <UserGroupEdit
      :currentUser="currentUser"
      :isShowGroupModal="isShowGroupModal"
      :currentGroupList="getCurrentGroupList"
      v-if="currentUser"
      @on-submit="onReloadList"
      @on-close="isShowGroupModal = false" />
    <Table
      :columns="group.columns"
      :data="group.data"
      size="small"
      :height="tableHeight"
      :loading="group.loading"
    ></Table>
    <ConfirmModal ref="confirmModal" @transfer-ok="onDeleteClick"></ConfirmModal>
  </div>
</template>

<script>
// eslint-disable-next-line
import { Table, Icon, Row, Col, Button, Input, Modal } from 'iview'
import UserGroupEdit from './UserGroupEdit.vue'
import ConfirmModal from '../components/ConfirmModal.vue'

import api from '../api'

export default {
  name: 'UserGroup',
  components: {
    Table,
    Row,
    Col,
    Button,
    Input,
    UserGroupEdit,
    ConfirmModal
  },
  props: {
    currentUser: {
      type: Object,
      required: false,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      tableHeight: 400,
      isShowGroupModal: false,
      id: null, // 删除id
      group: {
        fuzzyName: '',
        loading: false,
        data: [],
        columns: [
          { title: '名称', key: 'name', minWidth: 110 },
          { title: '描述', key: 'description', minWidth: 130 },
          {
            title: '操作',
            width: 100,
            render: (h, params) => {
              return h(
                'span',
                {
                  style: {
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {
                      this.showConfirmModal(params.row.id)
                    }
                  }
                },
                [
                  h(
                    'Icon',
                    {
                      props: {
                        type: 'ios-trash',
                        size: 16,
                        color: '#5cadff'
                      }
                    }
                  ),
                  h(
                    'span', '移除'
                  )
                ]
              )
            }
          }
        ]
      }
    }
  },
  computed: {
    getCurrentGroupList () {
      return this.group.data.map(item => item.id)
    }
  },
  watch: {
    currentUser: {
      handler (curVal, oldVal) {
        if (curVal && curVal.id) {
          this.getGroupList()
        }
      }
    }
  },
  mounted () {
    if (this.currentUser) {
      this.getGroupList()
    }
    this.$nextTick(() => {
      let cur = this.$refs.groupContainer
      this.tableHeight = cur.clientHeight - 43
    })
  },
  methods: {
    showConfirmModal (id) {
      this.id = id
      this.$refs.confirmModal.handleModal({
        content: '是否确认删除？'
      })
    },
    // 删除用户组
    onDeleteClick () {
      this.$axios.delete(`${api.users}/${this.currentUser.id}/usrgrps/${this.id}`).then(res => {
        this.$Message.success('删除成功！')
        this.getGroupList()
      })
    },
    // 获取用户组列表
    getGroupList () {
      let url = `${api.groups}?userId=${this.currentUser.id}`

      this.group.loading = true

      if (this.group.fuzzyName) {
        url += `&fuzzyName=${this.group.fuzzyName}`
      }

      this.$axios.get(url).then(res => {
        this.group.data = res.data.body.userGroups
        if (this.tableHeight > res.data.body.userGroups.length * 40 + 32) {
          this.tableHeight = res.data.body.userGroups.length * 40 + 32
        } else {
          let cur = this.$refs.groupContainer
          this.tableHeight = cur.clientHeight - 43
        }
      }).finally(() => {
        this.group.loading = false
      })
    },
    onSearchClick () {
      this.getGroupList()
    },
    onReloadList () {
      this.isShowGroupModal = false
      if (this.currentUser) {
        // 添加用户组后刷新用户组列表页面
        this.getGroupList()
      }
    }
  }
}
</script>

<style lang="css" scoped>
.group-container {
  position: relative;
  height: calc(100vh - 206px);
  border-radius: 4px;
}
</style>
