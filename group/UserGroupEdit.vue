<!-- 添加用户组对话框 -->
<template>
  <div>
    <Modal
      title="添加已有用户组"
      width="700"
      v-model="isShowModal"
      @on-ok="onClickOk"
      @on-cancel="onClickCancel"
    >
      <K2Transfer
        :data="group.data"
        filterable
        :style="{width: '702px', margin: '0 auto'}"
        :list-style="{height: '400px', width: '300px'}"
        :target-keys="group.selectKeys"
        :selected-keys="group.selectKeys"
        :titles="group.titles"
        @on-change="handleChange"
        @on-dblclick="handleChange">
      </K2Transfer>
    </Modal>
  </div>
</template>

<script>
import { Modal } from 'iview'
import K2Transfer from '@/components/kfc-k2transfer'

import { api } from '../api'

export default {
  name: 'UserGroupEdit',
  components: {
    Modal,
    K2Transfer
  },
  props: {
    currentUser: {
      type: Object,
      required: true
    },
    isShowGroupModal: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      isShowModal: this.isShowGroupModal,
      group: {
        titles: ['未选用户组', '已选用户组'],
        filterKey: 'id',
        filterLabel: 'name',
        data: [],
        selectKeys: []
      }
    }
  },
  watch: {
    isShowGroupModal: {
      handler (curVal, oldVal) {
        this.isShowModal = curVal
        // 清空选中用户组
        this.group.selectKeys.splice(0, this.group.selectKeys.length)
        if (curVal) {
          this.getUserList()
        }
      }
    }
  },
  methods: {
    // 添加用户组
    onClickOk () {
      let groups = []
      this.group.selectKeys.forEach(item => {
        groups.push({
          name: item
        })
      })
      this.$emit('on-close')
      // this.$axios.put(`${api.roles}/${this.currentRole.id}/add`, { groups: groups }).then(res => {
      //   this.$emit('on-submit')
      // })
    },
    onClickCancel () {
      this.$emit('on-close')
    },
    getUserList () {
      // 获取所有用户组
      this.$axios.get(`${api.groups}?type=all`).then(res => {
        this.group.data = res.data.result.map(item => {
          return {
            key: item.name,
            label: item.name
          }
        })
      })
      // 获取当前用户已有用户组列表
      // this.$axios.get(`${api.users}?type=all&groupname=${this.currentUser.name}`).then(res => {
      //   this.group.selectKeys = res.data.result.map(item => item.id)
      // })
    },
    handleChange (selectedFields) {
      this.group.selectKeys = selectedFields
    }
  }
}
</script>
