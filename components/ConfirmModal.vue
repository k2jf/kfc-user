<template>
  <Modal
    width="200"
    :mask-closable="false"
    class-name="vertical-center-modal"
    v-model="isModalShow">
    <div class="ivu-modal-confirm-body-icon ivu-modal-confirm-body-icon-confirm">
      <i class="ivu-icon ivu-icon-help-circled"></i>
    </div>
    <div class="content">
      {{ content }}
    </div>
    <div slot="footer">
      <Button @click="onModalCancel">取消</Button>
      <Button type="primary" @click="onModalOk">
        确认
      </Button>
    </div>
  </Modal>
</template>

<script>
import { Modal, Button } from 'iview'

export default {
  name: 'ConfirmModal',
  components: {
    Modal,
    Button
  },
  data () {
    return {
      isModalShow: false,
      content: ''
    }
  },
  methods: {
    handleModal ({ content }) {
      this.isModalShow = true
      this.content = content || '是否确认删除？'
    },
    onModalOk () {
      this.isModalShow = false
      this.$emit('transfer-ok')
    },
    onModalCancel () {
      this.isModalShow = false
    }
  }
}
</script>

<style lang="css" scoped>
.content{
  margin-top: 6px;
  padding-left: 50px;
  padding-top: 40px;
  padding-bottom: 30px;
  font-size: 16px;
  color: #495060;
}
.ivu-modal-confirm-body-icon-confirm {
  color: #f90;
  margin-top: 44px;
  margin-left: 20px;
}
.ivu-modal-confirm-body-icon {
  font-size: 36px;
}
.iview-modal-body{
  margin-top: 6px;
  padding-left: 48px;
  padding-top: 18px;
  font-size: 12px;
  color: #495060;
  position: relative;
}
.v-transfer-dom .vertical-center-modal{
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
