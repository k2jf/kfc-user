<template>
  <h1 align="center">
    This is a vue template.
  </h1>
</template>
<script>
export default {
  name: 'Home',
  mounted () {
    console.log(this.$axios)
    // 如下方式调用接口
    // this.$axios.get('/test-api')
    //   .then(res => {
    //     console.log(res)
    //   })
  }
}
</script>
