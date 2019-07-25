# kfc-auth-user
用户管理

# UserList

## 功能
用于用户编辑用户添加角色添加资源授权

## 维护者
youli

## 示例
```
<template>
    <UserList />
</template>

<script>
  import UserList from '@/components/kfc-auth-user'

  export default {
    components: {
        UserList
    },
    data () {
        return {
        }
    },
  }
</script>

```

## 注意
此组件依赖 kfc-transfer 组件，请确保同时安装
