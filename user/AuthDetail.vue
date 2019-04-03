<!-- 资源类型信息 -->
<template>
  <div style="height: 100%;">
    <p>资源类型: {{ authDetail.appResTypeName }}</p>
    <Table
      :columns="columns"
      :data="authDetail.resource"
      size="small"
      class="margin-bottom"></Table>
  </div>
</template>

<script>
import { Table } from 'iview'

export default {
  name: 'AuthDetail',
  components: {
    Table
  },
  props: {
    authDetail: {
      type: Object,
      required: false,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      columns: [
        { title: '资源个例id', key: 'appResInfoId', minWidth: 110 },
        { title: '资源个例名称', key: 'appResInfoName', minWidth: 130 },
        { title: '权限',
          minWidth: 100,
          render: (h, params) => {
            return h(
              'span', params.row.operations.join(',')
            )
          }
        }
      ]
    }
  }
}
</script>
