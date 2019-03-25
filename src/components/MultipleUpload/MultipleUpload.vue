<template>
  <div class="mul-upload">
    <Upload
      multiple
      type="drag"
      :on-progress="onProgress"
      action="//jsonplaceholder.typicode.com/posts/">
      <div style="padding: 20px 0">
        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
        <p>点击或将文件拖拽到这里上传</p>
        <p class="text-grey">
          支持扩展名：.xlsx .xls
        </p>
      </div>
    </Upload>
    <UploadList :files="files" />
  </div>
</template>

<script>
import { Upload, Icon } from 'iview'
import UploadList from './UploadList'

export default {
  name: 'MultipleUpload',
  components: {
    Upload,
    Icon,
    UploadList
  },
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      files: []
    }
  },
  methods: {
    onProgress (ev, file, fileList) {
      this.files = fileList
    }
  }
}
</script>
