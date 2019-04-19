<template>
  <Modal
    width="500"
    :mask-closable="false"
    class-name="vertical-center-modal"
    v-model="isModalShow">
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
</style>
