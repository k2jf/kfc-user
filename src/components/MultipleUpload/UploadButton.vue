<template>
  <div class="up-btn inline-block">
    <Button :type="type" :size="size" @click="visible = true">
      {{ display }}
    </Button>
    <Modal
      title="批量上传文件"
      v-model="visible"
      @on-ok="onOk"
      @on-cancel="onCancel">
      <div style="max-height: 500px;">
        <MultipleUpload :list="list" />
      </div>
    </Modal>
  </div>
</template>

<script>
import { Button, Modal } from 'iview'
import MultipleUpload from './MultipleUpload'

export default {
  name: 'UploadButton',
  components: {
    Button,
    Modal,
    MultipleUpload
  },
  props: {
    display: {
      type: String,
      default: '点击上传'
    },
    size: {
      type: String,
      default: 'small'
    }
  },
  data () {
    return {
      type: 'info',
      list: [],
      visible: false
    }
  },
  methods: {
    onOk () {

    },
    onCancel () {

    }
  }
}
</script>
