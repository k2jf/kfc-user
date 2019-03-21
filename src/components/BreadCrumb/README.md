## 面包屑组件
> author Kk

用法：
```vue
<BreadCrumb :list="breadcrumb"></BreadCrumb>

<script>
  ...
  data () {
    return {
      breadcrumb: [
        { to: '/', name: '应用商店' },
        { name: '事业部' }
      ]
    }
  }
  ...
</script>
```
