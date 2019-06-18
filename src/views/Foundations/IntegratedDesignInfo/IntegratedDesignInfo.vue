<template>
  <div class="basic-info h-full p-3">
    <Fiche title="基础信息">
      <Form
        :model="basicFormValidate"
        :rules="basicRuleValidate"
        :label-width="180"
        ref="basicFormValidate">
        <div class="flex flex-wrap">
          <div class="w-1/2">
            <FormItem label="项目名称：" prop="projectName" class="w-9/10">
              {{ basicFormValidate.projectName }}
            </FormItem>
          </div>
          <div class="w-1/2">
            <FormItem label="任务类型：" prop="integratedDesign" class="w-9/10">
              一体化设计校核
            </FormItem>
          </div>
          <div class="w-1/2">
            <FormItem label="任务名称：" class="w-9/10">
              {{ basicFormValidate.taskName }}
            </FormItem>
          </div>
          <div class="w-1/2">
            <FormItem label="设计阶段" prop="designPhase" class="w-9/10">
              {{ basicFormValidate.designPhase }}
            </FormItem>
          </div>
          <div class="w-1/2">
            <FormItem label="校核类型：" prop="checkType" class="w-9/10">
              {{ basicFormValidate.checkType }}
            </FormItem>
          </div>
          <div class="w-1/2">
            <FormItem label="sacs.in文件：" prop="sacs">
              <Upload
                class="float-left"
                :action="action"
                :show-upload-list="false"
                :on-error="onUploadError"
                :on-success="onUploadSuccess">
                <Button icon="ios-cloud-upload-outline">
                  上传文件
                </Button>
              </Upload>
              <div class="float-left ml-3 text-blue overflow-hidden h-8" v-if="sacsinFile.name">
                <span class="inline-block overflow-hidden"><Icon type="ios-link" />&ensp;</span>
                <a
                  target="_blank"
                  :href="href"
                  class="inline-block whitespace-no-wrap overflow-hidden"
                  style="text-overflow: ellipsis;max-width: 250px;">
                  {{ sacsinFile.name }}
                </a>
              </div>
            </FormItem>
          </div>
          <div class="w-1/2">
            <FormItem label="屈服强度(Mpa)：" prop="yieldStrength" v-if="basicFormValidate.integratedDesign === 1">
              <Input v-model="basicFormValidate.yieldStrength" />
            </FormItem>
            <FormItem label="基础顶高程(m)：" prop="topElevation" v-else>
              <Input v-model="basicFormValidate.topElevation" />
            </FormItem>
          </div>
        </div>
      </Form>
    </Fiche>
    <div class="text-center my-6">
      <Button type="primary" @click="save">
        保存
      </Button>
      <Button class="ml-3" @click="cancel">
        取消
      </Button>
    </div>
  </div>
</template>

<script>
import { Button, Input, Form, FormItem, Upload, Icon } from 'iview'
import Fiche from '@/components/Fiche'
import { baseUrl } from '@/config'

export default {
  name: 'IntegratedDesignInfo',
  components: {
    Button,
    Fiche,
    Input,
    Form,
    FormItem,
    Upload,
    Icon
  },
  data: () => ({
    action: '',
    href: '',
    sacsinFile: {},
    basicFormValidate: {

    },
    basicRuleValidate: {

    }
  }),
  mounted () {
    this.init()
    this.action = `${baseUrl}foundations/${this.$route.params.foundationId}/upload?fileKey=sacsin`
  },
  methods: {
    async init () {
      const res = await this.$get(`foundations/${this.$route.params.foundationId}`)
      this.basicFormValidate = {
        projectName: res.body.projectName,
        integratedDesign: res.body.integratedDesign,
        taskName: res.body.taskName,
        designPhase: { 'B': '投标', 'D': '中标' }[res.body.designPhase],
        checkType: ['', '极限强度', '疲劳损伤'][res.body.integratedDesign],
        foundationForm: res.body.foundationForm,
        yieldStrength: res.body.yieldStrength,
        topElevation: res.body.topElevation
      }
      if (res.body.sacsin && res.body.sacsin.length > 0) {
        this.href = `${baseUrl}foundations/stream?fileId=${res.body.sacsin[0].fileId}`
        this.sacsinFile = { name: res.body.sacsin[0].fileName }
      }
    },
    onUploadError (err, file) {
      console.error(err)
      this.$Message.error({
        content: '上传失败：' + file.message,
        duration: 3,
        closable: true
      })
    },
    onUploadSuccess (res) {
      this.$Message.success('上传成功')
      this.href = `${baseUrl}foundations/stream?fileId=${res.body.fileId}`
      this.sacsinFile = { name: res.body.fileName }
    },
    async save () {
      const json = {}
      if (this.basicFormValidate.integratedDesign === 1) {
        json.yieldStrength = this.basicFormValidate.yieldStrength
      } else {
        json.topElevation = this.basicFormValidate.topElevation
      }
      try {
        await this.$put(`foundations/${this.$route.params.foundationId}`, {
          json: Object.assign({}, json, {
            integratedDesign: this.basicFormValidate.integratedDesign
          }),
          silent: true
        })
        this.$Message.success('保存成功')
        setTimeout(() => {
          this.$router.push({ name: 'foundations' })
        }, 600)
      } catch (error) {

      }
    },
    cancel () {
      this.$router.push({ name: 'foundations' })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
