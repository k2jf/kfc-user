<template>
  <Select
    transfer
    multiple
    v-model="curOperation"
    @on-change="onOperationChange"
  >
    <Option
      :value="item"
      v-for="item in operationList"
      :key="item">
      {{ item }}
    </Option>
  </Select>
</template>

<script>
import { Select, Option } from 'iview'

export default {
  name: 'OperationCell',
  components: {
    Select,
    Option
  },
  props: {
    operations: {
      type: String,
      required: false
    },
    operationList: {
      type: Array,
      required: true,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      curOperation: this.operations ? this.operations.split(',') : this.operations
    }
  },
  methods: {
    onOperationChange () {
      if (this.operations === this.curOperation.join(',')) return
      this.$emit('change', this.curOperation.join(','))
    }
  }
}
</script>
