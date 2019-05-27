#删除确认框公共组件

## 确认删除后触发事件transfer-ok

## 维护人：
youli

##使用示例：
```
  import ConfirmModal from './ConfirmModal.vue'
  <ConfirmModal ref="confirmModal" @transfer-ok="onDeleteOk"></ConfirmModal>
  <!-- 删除提示 -->
  this.$refs.confirmModal.handleModal({
    content: '是否确认删除？' // 删除提示信息
    })
  <!-- 删除 -->
  onDeleteOk () {
    <!-- 调用删除接口成功 -->
    this.$Message.success({
      content: '删除成功',
      duration: 3
    })
  }

```
