<template>
  <div class="Data-Analysis h-full" ref="foo">
    data analysis
    <Button class="copyyy-btn" data-clipboard-target="#foo" @click="copy">
      复制
    </Button>
    <Button
      ghost
      type="primary"
      class="copyyy-btn"
      @click="copyyy">
      复制
    </Button>
    <textarea
      rows="10"
      cols="10"
      style="height:10px;width:20px;opacity: 0;"
      id="htmlToCopy"></textarea>
  </div>
</template>
<script>
import tableCopy from '@/libs/tableCopy'
const columns1 = [
  {
    title: 'Name',
    key: 'name'
  },
  {
    title: 'Age',
    key: 'age'
  },
  {
    title: 'Address',
    key: 'address'
  }
]
const data1 = [
  {
    name: 'John Brown',
    age: 18,
    address: 'New York No. 1 Lake Park',
    date: '2016-10-03'
  },
  {
    name: 'Jim Green',
    age: 24,
    address: 'London No. 1 Lake Park',
    date: '2016-10-01'
  },
  {
    name: 'Joe Black',
    age: 30,
    address: 'Sydney No. 1 Lake Park',
    date: '2016-10-02'
  },
  {
    name: 'Jon Snow',
    age: 26,
    address: 'Ottawa No. 2 Lake Park',
    date: '2016-10-04'
  }
]
export default {
  components: {

  },
  data () {
    return {
      columns1,
      data1,
      clipboard: null
    }
  },
  methods: {
    copy () {
      console.log(1)
      tableCopy('htmlToCopy', columns1, data1)
    }
  }
}
</script>
<style lang="less" scoped>

</style>
