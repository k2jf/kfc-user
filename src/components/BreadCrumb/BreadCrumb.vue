<template>
  <div class="bread-crumb">
    <Breadcrumb separator="/">
      <BreadcrumbItem
        :to="item.to"
        v-for="(item, index) in breadList"
        :key="index">
        {{ item.name }}
      </BreadcrumbItem>
    </Breadcrumb>
  </div>
</template>
<script>
import { Breadcrumb, BreadcrumbItem } from 'iview'

export default {
  name: 'BreadCrumb',
  components: {
    Breadcrumb,
    BreadcrumbItem
  },
  props: {
    breadList: {
      type: Array,
      required: true
    }
  },
  data () {
    return {}
  }
}
</script>
<style lang="less" scoped>
.bread-crumb {
  height: 100%;
  min-height: 40px;
  max-height: 60px;
}
</style>
<style>
/* #wtia .ivu-breadcrumb-item-separator {
  color: #333;
} */
</style>
