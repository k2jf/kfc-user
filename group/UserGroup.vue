<!-- 用户组列表 -->
<template>
  <div class="group-container" ref="groupContainer">
    <Row :gutter="16" class="margin-bottom">
      <Col span="14">
      <Button
        type="primary"
        @click="isShowGroupModal = true"
      >
        添加已有用户组
      </Button>
      </Col>
      <Col span="10">
      <Input
        placeholder="搜索用户组"
        v-model="group.filterName"
        @on-change="onSearchClick"></Input>
      </Col>
    </Row>
    <UserGroupEdit
      :currentUser="currentUser"
      :isShowGroupModal="isShowGroupModal"
      v-if="currentUser"
      @on-submit="reloadGroupList"
      @on-close="isShowGroupModal = false" />
    <Table
      :columns="group.columns"
      :data="group.data"
      size="small"
      :height="tableHeight"
      :loading="group.loading"
    ></Table>
  </div>
</template>

<script>
// eslint-disable-next-line
import { Table, Icon, Row, Col, Button, Input } from 'iview'
import UserGroupEdit from './UserGroupEdit.vue'

import { api } from '../api'

export default {
  name: 'UserGroup',
  components: {
    Table,
    Row,
    Col,
    Button,
    Input,
    UserGroupEdit
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
      group: {
        filterName: '',
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
                      this.deleteGroup(params.row.name)
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
    // 删除用户组
    deleteGroup (id) {
      this.$axios.put(`${api.groups}/${id}/remove`, { users: [{ name: this.currentUser.name }] }).then(res => {
        this.getGroupList()
      })
    },
    // 获取用户组列表
    getGroupList () {
      this.group.loading = true

      let url = `${api.groups}/?type=all`

      if (this.group.filterName) {
        url += `&groupname=${this.group.filterName}`
      }

      this.$axios.get(url).then(res => {
        this.group.data = res.data.result
        if (this.tableHeight > res.data.result.length * 40 + 32) {
          this.tableHeight = res.data.result.length * 40 + 32
        } else {
          let cur = this.$refs.groupContainer
          this.tableHeight = cur.clientHeight - 43
        }
        this.group.loading = false
      })
    },
    onSearchClick () {
      this.getGroupList()
    },
    reloadGroupList () {
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
