<template>
  <div>
    <ICol span="5" style="line-height: 32px;">
      <span class="inline-block w-24 text-right">
        地质参数表：
      </span>
      <Upload
        class="inline-block"
        :action="action"
        :show-upload-list="false"
        :on-error="onUploadError"
        :on-success="onUploadSuccess">
        <Button size="small" icon="ios-cloud-upload-outline">
          上传文件
        </Button>
      </Upload>
    </ICol>
  </div>
</template>

<script>
import { Col, Upload, Button } from 'iview'
import { mapState } from 'vuex'
import { baseUrl } from '@/config'
import _ from 'lodash'

import { mutationMap } from './mapping'

export default {
  name: 'GeologyParams',
  components: {
    ICol: Col,
    Upload,
    Button
  },
  data () {
    return {
      action: ''
    }
  },
  computed: {
    ...mapState({
      config: state => state.foundation.geology.config || {}
    })
  },
  mounted () {
    this.action = baseUrl + `foundations/${this.$route.params.foundationId}/upload?fileKey=geology`
  },
  methods: {
    onChange: _.debounce(function onInputChange (value, key) {
      const config = Object.assign({}, this.config, { [key]: value })
      this.$store.commit(`foundation/${mutationMap['geology']}`, { config })
    }, 100),
    onUploadError (error, file) {
      console.error(error)
      this.$Message.error(file.message)
    },
    onUploadSuccess (res, file, fileList) {
      this.$Message.success('上传成功')
      this.$store.commit(`foundation/${mutationMap['geology']}`, {
        fileId: res.body.fileId,
        fileName: res.body.fileName
      })
      this.$parent.$parent.getExcel(this.$parent.$parent.fileId)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
