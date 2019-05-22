<template>
  <Dropdown>
    <a href="javascript:void(0)">
      结果
      <Icon type="ios-arrow-down"></Icon>
    </a>
    <DropdownMenu slot="list" @on-click="onClick">
      <DropdownItem v-for="item in list" :key="item.fileId">
        {{ item.fileName }}
      </DropdownItem>
    </DropdownMenu>
  </Dropdown>
</template>

<script>
import { Dropdown, DropdownMenu, DropdownItem } from 'iview'

export default {
  name: 'ResultList',
  components: {
    Dropdown,
    DropdownMenu,
    DropdownItem
  },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      list: []
    }
  },
  async mounted () {
    const res = this.$get(`foundations/${this.id}/resultFiles`)
    this.list = res.body.items
  },
  methods: {
    onClick (name) {
      console.log(...arguments)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
