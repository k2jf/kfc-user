<!-- 用户组列表 -->
<template>
  <div class="group-container" ref="groupContainer">
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
import { Table, Icon } from 'iview'

import { api } from '../api'

export default {
  name: 'UserGroup',
  components: {
    Table
  },
  props: {
    currentUser: {
      type: Object,
      required: false,
      default: () => {
        return {}
      }
    },
    isReloadGroupList: {
      type: Boolean,
      required: false
    }
  },
  data () {
    return {
      tableHeight: 400,
      group: {
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
    },
    isReloadGroupList: {
      handler (curVal, oldVal) {
        if (this.currentUser) {
          // 添加用户组后刷新用户组列表页面
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
      this.tableHeight = cur.clientHeight
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

      this.$axios.get(`${api.groups}/?type=all`).then(res => {
        this.group.data = res.data.result
        this.group.loading = false
      })
    }
  }
}
</script>

<style lang="css" scoped>
.group-container {
  position: relative;
  height: calc(100vh - 204px);
  border-radius: 4px;
}
</style>
