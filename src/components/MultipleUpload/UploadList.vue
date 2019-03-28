<template>
  <ul :class="[prefixCls + '-list']">
    <li
      :class="fileCls(file)"
      v-for="(file, i) in files"
      :key="i"
      @click="handleClick(file)">
      <span @click="handlePreview(file)">
        <Icon :type="format(file)"></Icon> {{ file.name }}
      </span>
      <Icon
        type="ios-close"
        :class="[prefixCls + '-list-remove']"
        @click.native="handleRemove(file)" />
    </li>
  </ul>
</template>
<script>
import { Icon } from 'iview'
const prefixCls = 'ivu-upload'

export default {
  name: 'UploadList',
  components: { Icon },
  props: {
    files: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      prefixCls: prefixCls
    }
  },
  methods: {
    fileCls (file) {
      return [
        `${prefixCls}-list-file`
      ]
    },
    handleClick (file) {
      this.$emit('on-file-click', file)
    },
    handlePreview (file) {
      this.$emit('on-file-preview', file)
    },
    handleRemove (file) {
      const index = this.files.findIndex(f => f.name === file.name)
      this.files.splice(index, 1)
    },
    format (file) {
      const format = file.name.split('.').pop().toLocaleLowerCase() || ''
      let type = 'ios-document-outline'

      if (['gif', 'jpg', 'jpeg', 'png', 'bmp', 'webp'].indexOf(format) > -1) {
        type = 'ios-image'
      }
      if (['mp4', 'm3u8', 'rmvb', 'avi', 'swf', '3gp', 'mkv', 'flv'].indexOf(format) > -1) {
        type = 'ios-film'
      }
      if (['mp3', 'wav', 'wma', 'ogg', 'aac', 'flac'].indexOf(format) > -1) {
        type = 'ios-musical-notes'
      }
      if (['doc', 'txt', 'docx', 'pages', 'epub', 'pdf'].indexOf(format) > -1) {
        type = 'md-document'
      }
      if (['numbers', 'csv', 'xls', 'xlsx'].indexOf(format) > -1) {
        type = 'ios-stats'
      }
      if (['keynote', 'ppt', 'pptx'].indexOf(format) > -1) {
        type = 'ios-videocam'
      }

      return type
    }
  }
}
</script>
