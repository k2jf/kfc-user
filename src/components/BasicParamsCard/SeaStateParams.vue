<template>
  <div>
    <ICol span="5" style="line-height: 32px;">
      <span class="inline-block w-24 text-right">
        海况参数表：
      </span>
      <Upload
        class="inline-block"
        :action="action"
        :show-upload-list="false"
        :on-error="onUploadError"
        :on-success="onUploadSuccess">
        <!-- <Button size="small" icon="ios-cloud-upload-outline" :class="fileId ? 'uploaded-color' : ''"> -->
        <Button size="small" icon="ios-cloud-upload-outline">
          上传文件
        </Button>
      </Upload>
    </ICol>
    <ICol span="5" style="line-height: 32px;">
      <span class="inline-block w-16 text-right">
        载荷参数：
      </span>
      <Upload
        class="inline-block"
        :action="loadAction"
        :show-upload-list="false"
        :on-error="onUploadError"
        :on-success="onUploadSuccess">
        <Button size="small" icon="ios-cloud-upload-outline">
          上传文件
        </Button>
      </Upload>
    </ICol>
    <ICol span="4" :class="'wave' === errKey ? 'ivu-form-item-error' : ''">
      <span class="inline-block w-16 text-right">波浪类型：</span>
      <Input style="width: 60px" :value="config.wave || ''" @on-change="onChange($event.target.value, 'wave')" />
    </ICol>
    <ICol span="4" :class="'degree' === errKey ? 'ivu-form-item-error' : ''">
      <span class="inline-block w-16 text-right">阶次：</span>
      <Input style="width: 60px" :value="config.degree || ''" @on-change="onChange($event.target.value, 'degree')" />
    </ICol>
    <ICol span="4" :class="'direction01' === errKey ? 'ivu-form-item-error' : ''">
      <span class="inline-block w-16 text-right">方向1/°：</span>
      <Input style="width: 60px" :value="config.direction01 || ''" @on-change="onChange($event.target.value, 'direction01')" />
    </ICol>
    <ICol span="5" :class="'direction02' === errKey ? 'ivu-form-item-error' : ''">
      <span class="inline-block w-24 text-right">方向2/°：</span>
      <Input style="width: 60px" :value="config.direction02 || ''" @on-change="onChange($event.target.value, 'direction02')" />
    </ICol>
    <ICol span="5" :class="'windSpeed' === errKey ? 'ivu-form-item-error' : ''">
      <span class="inline-block w-16 text-right">风速：</span>
      <Input style="width: 60px" :value="config.windSpeed || ''" @on-change="onChange($event.target.value, 'windSpeed')" />
    </ICol>
    <ICol span="5" :class="'mudlineElevation' === errKey ? 'ivu-form-item-error' : ''">
      <span class="inline-block w-16 text-right">泥面高程：</span>
      <Input style="width: 60px" :value="config.mudlineElevation || ''" @on-change="onChange($event.target.value, 'mudlineElevation')" />
    </ICol>
  </div>
</template>

<script>
import { Input, Col, Upload, Button } from 'iview'
import { mapState } from 'vuex'
import { baseUrl } from '@/config'
import _ from 'lodash'

import { mutationMap, seaStateMap } from './mapping'

export default {
  name: 'SeaStateParams',
  components: {
    Input,
    ICol: Col,
    Upload,
    Button
  },
  data () {
    return {
      action: '',
      loadAction: '',
      errKey: ''
    }
  },
  computed: {
    ...mapState({
      config: state => state.foundation.seaState.config || {}
    })
  },
  watch: {
    config () {
      this.setDefaultConfig()
    }
  },
  mounted () {
    this.action = baseUrl + `foundations/${this.$route.params.foundationId}/upload?fileKey=seaStateBase`
    this.loadAction = baseUrl + `foundations/${this.$route.params.foundationId}/upload?fileKey=seaStateLoad`
    this.setDefaultConfig()
  },
  methods: {
    setDefaultConfig () {
      const config = this.$store.state.foundation.seaState.config || {}
      this.wave = config.wave
      this.degree = config.degree
      this.direction01 = config.direction01
      this.direction02 = config.direction02
      this.windSpeed = config.windSpeed
      this.mudlineElevation = config.mudlineElevation
    },
    onChange: _.debounce(function onInputChange (value, key) {
      let _value = value
      this.errKey = ''
      if (key !== 'wave') {
        _value = Number(value)
        if (isNaN(_value)) {
          this.$Message.error(`${seaStateMap[key]}只能为数字`)
          this.errKey = key
          throw TypeError(`${seaStateMap[key]}只能为数字`)
        }
      }
      const config = Object.assign({}, this.config, { [key]: _value })
      this.$store.commit(`foundation/${mutationMap['seaState']}`, { config })
    }, 100),
    onUploadError (error, file) {
      console.error(error)
      this.$Message.error(file.message)
    },
    onUploadSuccess (res, file, fileList) {
      this.$Message.success('上传成功')
      this.$store.commit(`foundation/${mutationMap['seaState']}`, {
        fileId: res.body.fileId,
        fileName: res.body.fileName
      })
      this.$parent.$parent.getExcel(this.$parent.$parent.fileId)
    }
  }
}
</script>
