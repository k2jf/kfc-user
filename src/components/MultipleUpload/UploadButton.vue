<template>
  <div class="up-btn inline-block">
    <Button
      :type="type"
      :size="size"
      icon="ios-cloud-upload-outline"
      @click="visible = true">
      {{ display }}
    </Button>
    <Modal
      :closable="false"
      :mark-closable="false"
      title="批量上传文件"
      v-model="visible"
      @on-ok="onOk"
      @on-cancel="onCancel">
      <div>
        <!-- <MultipleUpload :list="list" :action="action" /> -->
        <div class="relative">
          <div class="absolute w-full h-full z-50 bg-grey-light opacity-25 cursor-not-allowed"></div>
          <Upload
            multiple
            type="drag"
            :show-upload-list="false"
            :before-upload="beforeUpload"
            :on-success="onSuccess"
            :action="action">
            <div style="padding: 20px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>点击或将文件拖拽到这里上传</p>
              <p class="text-grey">
                支持扩展名：.xlsx .xls
              </p>
            </div>
          </Upload>
        </div>
        <div class="overflow-y-auto" style="max-height: 400px">
          <UploadList :files="files" />
          <UploadList :files="toBeUploadList" />
        </div>
      </div>
      <div slot="footer">
        <Button :disabled="toBeUploadList.length === 0" @click="upload">
          上传
        </Button>
        <Button
          :disabled="files.length === 0"
          ghost
          type="error"
          @click="clear">
          清空
        </Button>
        <Button
          ghost
          type="primary"
          @click="onOk">
          关闭
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { Upload, Button, Modal, Icon } from 'iview'
import UploadList from './UploadList'

const isObject = value => value !== null && typeof value === 'object'

export default {
  name: 'UploadButton',
  components: {
    Upload,
    Button,
    Modal,
    Icon,
    UploadList
  },
  props: {
    display: {
      type: String,
      default: '点击上传'
    },
    size: {
      type: String,
      default: 'small'
    },
    action: {
      type: String,
      required: true
    },
    files: {
      type: Array,
      required: true,
      default: () => [],
      validator (files) {
        return files.every(file => isObject(file) && file.name)
      }
    }
  },
  data () {
    return {
      type: 'info',
      list: [],
      visible: false,
      toBeUploadList: []
    }
  },
  computed: {
    loadingFiles () {
      return this.toBeUploadList.map(({ name }) => ({ name }))
    }
  },
  methods: {
    onOk () {
      this.visible = !this.visible
    },
    onCancel () {

    },
    upload () {
      this.$emit('multiple-upload', this.toBeUploadList)
    },
    clear () {
      this.$emit('on-clear')
    },
    beforeUpload (file) {
      this.toBeUploadList.push({
        file,
        name: file.name
      })
      console.log(this.toBeUploadList)
      return false
    },
    onRemove (file) {
      console.log(file)
    },
    onSuccess (res, file, fileList) {
      console.log(res, file, fileList)
    }
  }
}
</script>
