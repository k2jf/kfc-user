<!-- 用户列表信息 -->
<template>
  <div>
    <CellGroup class="aside-list-panel" @on-click="onSelectClick">
      <Cell
        :selected="currentUser && userItem.id === currentUser.id"
        :name="userItem.id"
        v-for="userItem in userList"
        :key="userItem.id">
        <Icon
          type="md-person"
          size="18"
          color="#5cadff"
          slot="icon" />
        <span
          class="c-pointer"
          slot="label"
        >{{ userItem.name }}</span>
        <span slot="extra" @click="showConfirmModal(userItem.id)"><Icon
          type="ios-trash"
          size="16"
          color="#5cadff" /></span>
      </Cell>
    </CellGroup>
    <ConfirmModal ref="confirmModal" @transfer-ok="onDeleteClick"></ConfirmModal>
  </div>
</template>

<script>
import { Icon, CellGroup, Cell } from 'iview'
import ConfirmModal from '../components/ConfirmModal.vue'

export default {
  name: 'UserList',
  components: {
    Icon,
    CellGroup,
    Cell,
    ConfirmModal
  },
  props: {
    userList: {
      type: Array,
      required: false,
      default: () => {
        return []
      }
    },
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
      id: null // 删除id
    }
  },
  methods: {
    showConfirmModal (id) {
      this.id = id
      this.$refs.confirmModal.handleModal({
        content: '是否确认删除？'
      })
    },
    onDeleteClick () {
      this.$emit('on-delete', this.id)
    },
    onSelectClick (id) {
      this.$emit('on-select', id)
    }
  }
}
</script>
