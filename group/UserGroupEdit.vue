<!-- 添加用户组对话框 -->
<template>
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
</template>

<script>
import { Modal } from 'iview'
import K2Transfer from '@/components/kfc-k2transfer'

import api from '../api'

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
    },
    currentGroupList: {
      type: Array,
      required: false
    }
  },
  data () {
    return {
      isShowModal: this.isShowGroupModal,
      group: {
        titles: ['未选用户组', '已选用户组'],
        data: [],
        selectKeys: [...this.currentGroupList]
      }
    }
  },
  watch: {
    isShowGroupModal: {
      handler (curVal, oldVal) {
        this.isShowModal = curVal
        if (this.group.data.length) return
        this.getGroupList()
      }
    },
    currentGroupList: {
      handler (curVal, oldVal) {
        this.group.selectKeys = [...curVal]
      }
    }
  },
  methods: {
    // 添加用户组
    onClickOk () {
      let usrgrpIds = this.group.selectKeys.join(',')

      this.$axios.put(`${api.users}/${this.currentUser.id}/usrgrps/${usrgrpIds}`).then(res => {
        this.$Message.success('添加成功！')
        this.$emit('on-submit')
      }).catch(() => {
        this.$emit('on-close')
      })
    },
    onClickCancel () {
      this.$emit('on-close')
    },
    getGroupList () {
      // 获取所有用户组
      this.$axios.get(`${api.groups}`).then(res => {
        this.group.data = res.data.body.userGroups.map(item => {
          return {
            key: item.id,
            label: item.name
          }
        })
      })
    },
    handleChange (selectedFields) {
      this.group.selectKeys = selectedFields
    }
  }
}
</script>
