<!-- 用户列表信息 -->
<template>
  <CellGroup class="left-list-pane" @on-click="onSelectClick">
    <Cell
      :selected="currentUser && userItem.id === currentUser.id"
      :name="userItem.id"
      v-for="userItem in userList"
      :key="userItem.id">
      <Icon
        type="md-person"
        size="18"
        slot="icon"
        color="#5cadff" />
      <span
        class="c-pointer"
        slot="label"
      >{{ userItem.name }}</span>
      <span slot="extra" @click="onDeleteClick(userItem.id)"><Icon type="ios-trash" size="16" color="#5cadff"/></span>
    </Cell>
  </CellGroup>
</template>

<script>
import { Icon, CellGroup, Cell } from 'iview'

export default {
  name: 'UserList',
  components: {
    Icon,
    CellGroup,
    Cell
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
  methods: {
    onDeleteClick (id) {
      this.$emit('on-delete', id)
    },
    onSelectClick (id) {
      this.$emit('on-select', id)
    }
  }
}
</script>
