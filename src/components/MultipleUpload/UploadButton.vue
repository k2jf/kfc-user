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
      :mask-closable="false"
      title="批量上传文件"
      v-model="visible"
      @on-ok="onOk"
      @on-cancel="onCancel">
      <div>
        <!-- <MultipleUpload :list="list" :action="action" /> -->
        <Upload
          multiple
          type="drag"
          :show-upload-list="false"
          :before-upload="beforeUpload"
          :on-progress="onProgress"
          :on-success="onSuccess"
          :on-error="onError"
          :action="action">
          <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>点击或将文件拖拽到这里上传</p>
            <p class="text-grey">
              支持扩展名：.xlsx .xls
            </p>
          </div>
        </Upload>
        <div class="ido-upload-list overflow-y-auto relative" v-if="files.length > 0">
          <div class="ido-clear-btn absolute w-16 h-8 pin-r">
            <a class="underline ido-link" href="javascript: void();" @click="clear">清空列表</a>
          </div>
          <div class="w-4/5">
            <UploadList :files="files" @on-file-remove="onRemove" />
          </div>
          <!-- <UploadList :files="toBeUploadList" /> -->
        </div>
      </div>
      <div slot="footer">
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
import { Upload, Button, Modal, Icon, Message } from 'iview'
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
  model: {
    prop: 'files',
    event: 'file-change'
  },
  props: {
    display: {
      type: String,
      default: '上传文件'
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
      this.$emit('on-close')
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
      // const existIndex = this.files.findIndex(f => f.name === file.name)
      // if (existIndex > -1) {
      //   this.files.splice(existIndex, 1)
      // }
    },
    onProgress (e, file, fileList) {
      // this.files = fileList
      const existIndex = this.files.findIndex(f => f.name === file.name)
      if (existIndex > -1) {
        this.files.splice(existIndex, 1)
      }
    },
    onRemove (file) {
      this.$emit('on-remove', file)
    },
    onSuccess (res, file, fileList) {
      if (fileList.every(e => e.status === 'finished')) {
        Message.success('上传完毕')
      }
      const newFile = {
        ...file,
        fileId: res.body.fileId
      }
      /**
       * ivew upload.vue
       *
       * if (_file) {
            _file.status = 'finished';
            _file.response = res;

            this.onSuccess(res, _file, this.fileList);
            this.dispatch('FormItem', 'on-form-change', _file);

            setTimeout(() => {
              _file.showProgress = false;
            }, 1000);
          }

       * Inside onSuccess callback, _file address has been changed,
       * must manully implement the fade out of progress
       */
      setTimeout(() => {
        newFile.showProgress = false
      }, 1000)

      this.files.push(newFile)
      // Array.splice or Array.push could responsively change data,
      // so there has no need to emit event.
      // this.$emit('file-change', fileList)
    },
    onError (err, file, fileList) {
      console.error(err)
      Message.error({
        content: '上传失败：' + file.message,
        duration: 3,
        closable: true
      })
    }
  }
}
</script>
<style lang="less" scoped>
.ido-upload-list {
  max-height: 400px;
}
.ido-clear-btn {
  top: 10px;
}
</style>
