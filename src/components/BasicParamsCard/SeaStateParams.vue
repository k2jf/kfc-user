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
        :on-success="onLoadUploadSuccess">
        <Button size="small" icon="ios-cloud-upload-outline">
          上传文件
        </Button>
      </Upload>
    </ICol>
    <ICol span="5" style="line-height: 32px;" v-if="hasFatigue && form === 1">
      <span class="inline-block w-16 text-right">
        马尔科夫：
      </span>
      <Upload
        class="inline-block"
        :action="markvoAction"
        :show-upload-list="false"
        :on-error="onUploadError"
        :on-success="onMarkvoUploadSuccess">
        <Button size="small" icon="ios-cloud-upload-outline">
          上传文件
        </Button>
      </Upload>
    </ICol>
    <ICol span="4" :class="'wave' === errKey ? 'ivu-form-item-error' : ''">
      <span class="inline-block w-16 text-right">波浪类型：</span>
      <Select
        style="width: 80px"
        placeholder=""
        :value="wave || ''"
        @on-change="onChange($event, 'wave')">
        <Option :value="item" v-for="item in waveTypes">
          {{ item }}
        </Option>
      </Select>
    </ICol>
    <ICol span="4" :class="'degree' === errKey ? 'ivu-form-item-error' : ''">
      <span class="inline-block w-16 text-right">阶次：</span>
      <Select
        style="width: 80px"
        placeholder=""
        :value="degree || ''"
        @on-change="onChange($event, 'degree')">
        <Option :value="item" v-for="item in orders">
          {{ item }}
        </Option>
      </Select>
    </ICol>
    <ICol span="4" :class="'direction01' === errKey ? 'ivu-form-item-error' : ''">
      <span class="inline-block w-16 text-right">方向1/°：</span>
      <Input
        style="width: 60px"
        :value="direction01 || ''"
        @on-blur="onBlur($event.target.value, 'direction01')" />
    </ICol>
    <ICol span="4" :class="'direction02' === errKey ? 'ivu-form-item-error' : ''">
      <span class="inline-block w-24 text-right">方向2/°：</span>
      <Input
        style="width: 60px"
        :value="direction02 || ''"
        @on-blur="onBlur($event.target.value, 'direction02')" />
    </ICol>
    <ICol span="4" :class="'windSpeed' === errKey ? 'ivu-form-item-error' : ''">
      <span class="inline-block w-16 text-right">风速(m/s)：</span>
      <Input
        style="width: 60px"
        :value="windSpeed || ''"
        @on-blur="onBlur($event.target.value, 'windSpeed')" />
    </ICol>
    <ICol span="4" :class="'mudlineElevation' === errKey ? 'ivu-form-item-error' : ''">
      <span class="inline-block w-24 text-right">泥面高程(m)：</span>
      <Input
        style="width: 60px"
        :value="mudlineElevation || ''"
        @on-blur="onBlur($event.target.value, 'mudlineElevation')" />
    </ICol>
  </div>
</template>

<script>
import { Input, Col, Upload, Button, Select, Option } from 'iview'
import { mapState } from 'vuex'
import { baseUrl } from '@/config'

import { mutationMap, seaStateMap } from './mapping'

export default {
  name: 'SeaStateParams',
  components: {
    Input,
    ICol: Col,
    Upload,
    Button,
    Select,
    Option
  },
  data () {
    return {
      action: '',
      loadAction: '',
      markvoAction: '',
      errKey: '',
      waveTypes: ['STRE', 'STRN', 'AIRY', 'AIRC', 'STOK', 'CNOI', 'SOLI', 'LINE', 'REPT'],
      orders: ['', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
      wave: 'STRE',
      degree: '',
      direction01: '',
      direction02: '',
      windSpeed: '',
      mudlineElevation: ''
    }
  },
  computed: {
    ...mapState({
      config: state => state.foundation.seaState.config || {},
      hasFatigue: state => state.foundation.hasFatigue,
      form: state => state.foundation.form
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
    this.markvoAction = baseUrl + `foundations/${this.$route.params.foundationId}/upload?fileKey=markov`
    // this.setDefaultConfig()
    this.$store.commit('foundation/syncSeaState', {
      config: {
        wave: this.wave,
        degree: this.degree,
        direction01: this.direction01,
        direction02: this.direction02,
        windSpeed: this.windSpeed,
        mudlineElevation: this.mudlineElevation
      }
    })
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
    onChange (value, key) {
      console.log(...arguments)
      const config = Object.assign({}, this.config, { [key]: value })
      this.$store.commit(`foundation/${mutationMap['seaState']}`, { config })
    },
    onBlur (value, key) {
      this.errKey = ''
      let _value = Number(value)
      if (isNaN(_value)) {
        this.$Message.error(`${seaStateMap[key]}只能为数字`)
        this.errKey = key
        throw TypeError(`${seaStateMap[key]}只能为数字`)
      }
      const config = Object.assign({}, this.config, { [key]: _value })
      this.$store.commit(`foundation/${mutationMap['seaState']}`, { config })
    },
    onUploadError (error, file) {
      console.error(error)
      this.$Message.error(file.message || '未知错误')
    },
    onUploadSuccess (res, file, fileList) {
      this.$Message.success('上传成功')
      this.$store.commit(`foundation/${mutationMap['seaState']}`, {
        fileId: res.body.fileId,
        fileName: res.body.fileName
      })
      this.$parent.$parent.getExcel(this.$parent.$parent.fileId)
    },
    onMarkvoUploadSuccess (res, file, fileList) {
      this.$Message.success('上传成功')
    },
    async onLoadUploadSuccess (res, file, fileList) {
      console.log(res)
      this.$Message.success('上传成功')
      this.$store.commit(`foundation/${mutationMap['seaState']}`, {
        fileId: res.body.fileId,
        fileName: res.body.fileName
      })
      this.$parent.$parent.getExcel(this.$parent.$parent.fileId)
      this.$parent.$parent.$parent.$parent.$parent.$parent.updateMxy()
      const tId = this.$store.state.foundation.towerId
      const fId = this.$route.params.foundationId
      if (tId > -1 && this.$store.state.foundation.towerId && this.$store.state.foundation.towerId > -1) {
        try {
          await this.$get(`foundations/checkLoad?fId=${fId}&tId=${tId}`)
        } catch (error) {
          console.error(error)
        }
      }
    }
  }
}
</script>
