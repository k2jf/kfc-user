<template>
  <div>
    <ICol span="5" style="line-height: 32px;">
      <span class="inline-block w-24 text-right">
        几何图形参数表：
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
    <ICol span="4">
      <span class="inline-block w-24 text-right">Units：</span>
      <Input style="width: 50px" :value="config.units || ''" @on-change="onChange($event.target.value, 'units')" />
    </ICol>
    <ICol span="4">
      <span class="inline-block w-24 text-right">P-Delta：</span>
      <Input style="width: 50px" :value="config.pDelta || ''" @on-change="onChange($event.target.value, 'pDelta')" />
    </ICol>
    <ICol span="4">
      <span class="inline-block w-24 text-right">ShearDef：</span>
      <Input style="width: 50px" :value="config.shearDef || ''" @on-change="onChange($event.target.value, 'shearDef')" />
    </ICol>
    <ICol span="4">
      <span class="inline-block w-24 text-right">No.Pns：</span>
      <Input style="width: 50px" :value="config.no_PNS || ''" @on-change="onChange($event.target.value, 'no_PNS')" />
    </ICol>
    <ICol span="3">
      <span class="inline-block w-16 text-right">No.PS：</span>
      <Input style="width: 50px" :value="config.no_PS || ''" @on-change="onChange($event.target.value, 'no_PS')" />
    </ICol>
    <ICol span="5">
      <span class="inline-block w-24 text-right">Codes：</span>
      <Input style="width: 50px" :value="config.codes || ''" @on-change="onChange($event.target.value, 'codes')" />
    </ICol>
    <ICol span="4">
      <span class="inline-block w-24 text-right">PL Theory：</span>
      <Input style="width: 50px" :value="config.plTheory || ''" @on-change="onChange($event.target.value, 'plTheory')" />
    </ICol>
    <ICol span="4">
      <span class="inline-block w-24 text-right">LRFD PHI：</span>
      <Input style="width: 50px" :value="config.lrfdPHI || ''" @on-change="onChange($event.target.value, 'lrfdPHI')" />
    </ICol>
  </div>
</template>

<script>
import { Input, Col, Upload, Button } from 'iview'
import { mapState } from 'vuex'
import { baseUrl } from '@/config'
import _ from 'lodash'

import { mutationMap } from './mapping'

export default {
  name: 'GeometryParams',
  components: {
    Input,
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
      // fileId: state => state.foundation.geometry.fileId,
      // fileName: state => state.foundation.geometry.fileName || templateName,
      config: state => state.foundation.geometry.config || {}
    })
  },
  watch: {
    config () {
      this.setDefaultConfig()
    }
  },
  mounted () {
    this.action = baseUrl + `foundations/${this.$route.params.foundationId}/upload?fileKey=geometry`
    this.setDefaultConfig()
  },
  methods: {
    setDefaultConfig () {
      const config = this.$store.state.foundation.geometry.config || {}
      this.codes = config.codes
      this.units = config.units
      this.no_PS = config.no_PS
      this.pDelta = config.pDelta
      this.no_PNS = config.no_PNS
      this.lrfdPHI = config.lrfdPHI
      this.shearDef = config.shearDef
      this.plTheory = config.plTheory
    },
    onChange: _.debounce(function onInputChange (value, key) {
      const config = Object.assign({}, this.config, { [key]: value })
      this.$store.commit(`foundation/${mutationMap['geometry']}`, { config })
    }, 100),
    onUploadError (error, file) {
      console.error(error)
      this.$Message.error(file.message)
    },
    onUploadSuccess (res, file, fileList) {
      this.$Message.success('上传成功')
      this.$store.commit(`foundation/${mutationMap['geometry']}`, {
        fileId: res.body.fileId,
        fileName: res.body.fileName
      })
    }
  }
}
</script>
