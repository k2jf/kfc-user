<template>
  <Upload
    multiple
    type="drag"
    :on-progress="onProgress"
    :action="action">
    <div style="padding: 20px 0">
      <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
      <p>点击或将文件拖拽到这里上传</p>
      <p class="text-grey">
        支持扩展名：.xlsx .xls
      </p>
    </div>
  </Upload>
</template>

<script>
import { Upload, Icon } from 'iview'

export default {
  name: 'MultipleUpload',
  components: {
    Upload,
    Icon
  },
  props: {
    action: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      files: []
    }
  }
}
</script>
