<template>
  <div class="p-3">
    <Fiche title="载荷信息">
      <Form
        :model="loadFormValidate"
        :rules="loadRuleValidate"
        :label-width="180"
        ref="formValidate">
        <div class="flex flex-wrap">
          <div class="w-1/2">
            <FormItem label="载荷编码：" prop="code" class="w-9/10">
              {{ loadFormValidate.code }}
            </FormItem>
          </div>
          <div class="w-1/2">
            <FormItem label="项目名称：" prop="projectName" class="w-9/10">
              {{ loadFormValidate.projectName }}
            </FormItem>
          </div>
          <div class="w-1/2">
            <FormItem label="基础型式：" prop="foundationForm" class="w-9/10">
              <Select placeholder="请选择基础型式" v-model="loadFormValidate.foundationForm">
                <Option value="1">
                  单桩
                </Option>
                <Option value="2">
                  高桩
                </Option>
              </Select>
            </FormItem>
          </div>
          <div class="w-1/2">
            <FormItem label="塔底直径：" prop="towerBottomD" class="w-9/10">
              <Input v-model="loadFormValidate.towerBottomD" />
            </FormItem>
          </div>
          <div class="w-1/2">
            <FormItem label="设计者：" prop="designer" class="w-9/10">
              <Input v-model="loadFormValidate.designer" />
            </FormItem>
          </div>
          <div class="w-1/2">
            <FormItem label="上传载荷文件：" class="w-9/10" prop="file">
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
              &ensp;&ensp;
              <Icon class="text-green" type="md-checkmark-circle" v-if="loadFormValidate.file" />
            </FormItem>
          </div>
          <div class="w-1/2">
            <FormItem label="马尔科夫矩阵：" class="w-9/10" prop="markov">
              <UploadButton
                :action="markovAction"
                v-model="markovFiles"
                @on-close="onClose"
                @on-remove="removeSigleMarkov"
                @on-clear="clearMarkov" />
              <span class="inline-block ml-3">
                已上传
                <!-- <a class="ido-link">&ensp;{{ markovFiles.length }}&ensp;</a> -->
                <b>{{ markovFiles.length }}</b>
                个文件
              </span>
            </FormItem>
          </div>
          <div class="w-full">
            <FormItem label="备注：" style="width: 95%;" prop="remark">
              <Input
                type="textarea"
                :autosize="{minRows: 2,maxRows: 5}"
                v-model="loadFormValidate.remark"></Input>
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
import Fiche from '@/components/Fiche'
import { baseUrl } from '@/config'
import { UploadButton } from '@/components/MultipleUpload'
import { Button, Input, Form, FormItem, Select, Option, Upload, Icon } from 'iview'

export default {
  name: 'EditLoad',
  components: {
    Fiche,
    Button,
    Input,
    Form,
    FormItem,
    Select,
    Option,
    Upload,
    Icon,
    UploadButton
  },
  data () {
    const towerBottomDValidate = (rule, value, cb) => {
      if (value === '') {
        cb(new Error('塔底直径不能为空'))
      } else {
        if (Number.isNaN(Number(value))) {
          cb(new Error('塔底直径只能为数字'))
        } else {
          cb()
        }
      }
    }

    const fileValidate = (rule, value, cb) => {
      if (!value) {
        cb(new Error('载荷文件不能为空'))
      } else {
        cb()
      }
    }
    return {
      action: '',
      markovAction: '',
      markovFiles: [],
      loadFormValidate: {
        code: '',
        foundationForm: '',
        towerBottomD: '',
        designer: '',
        file: null,
        remark: '',
        projectName: ''
      },
      loadRuleValidate: {
        foundationForm: [
          { required: true, message: '请选择基础型式', trigger: 'change' }
        ],
        towerBottomD: [
          { required: true, validator: towerBottomDValidate, trigger: 'blur' }
        ],
        designer: [
          { required: true, message: '设计者不能为空', trigger: 'blur' }
        ],
        file: [
          { required: true, validator: fileValidate, trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    this.action = baseUrl + `loads/${this.$route.params.loadId}/upload?fileKey=ultimate`
    this.markovAction = baseUrl + `loads/${this.$route.params.loadId}/upload?fileKey=markov`
    this.getLoadInfo()
  },
  methods: {
    async getLoadInfo () {
      try {
        const res = await this.$get(`loads/${this.$route.params.loadId}`)
        this.loadFormValidate = {
          code: res.body.code,
          foundationForm: String(res.body.foundationForm),
          towerBottomD: res.body.towerBottomD,
          designer: res.body.designer,
          remark: res.body.remark,
          projectName: res.body.projectName,
          file: res.body.ultimate
        }

        if (res.body.markov.length > 0) {
          this.markovFiles = res.body.markov.map(f => ({
            name: f.fileName,
            fileId: f.fileId
          }))
        }
      } catch (error) {
        console.error(error)
      }
    },
    onUploadError (error, file) {
      console.error(error)
      this.$Message.error(file.message)
    },
    onUploadSuccess (res, file, fileList) {
      this.$Message.success('上传成功')
      this.loadFormValidate.file = file.name
    },
    async clearMarkov () {
      try {
        const res = await this.$delete(`loads/file/batch?loadId=${this.$route.params.loadId}&fileKey=markov`, { silent: true })
        if (res.code === 0) {
          this.markovFiles = []
          this.Message.success('清空成功')
        }
      } catch (error) {
        this.Message.error('清空失败')
      }
    },
    async removeSigleMarkov (file) {
      try {
        const res = await this.$delete(`loads/file?fileId=${file.fileId}`, { silent: true })
        if (res.code === 0) {
          this.$Message.success('已删除：' + file.name)
          this.markovFiles = this.markovFiles.filter(m => m.fileId !== file.fileId)
        }
      } catch (error) {
        this.$Message.error('删除失败')
      }
    },
    onClose () {
      this.getLoadInfo()
    },
    async save () {
      this.$refs.formValidate.validate(async (valid) => {
        if (valid) {
          try {
            await this.$put(`loads/${this.$route.params.loadId}`, {
              json: {
                foundationForm: Number(this.loadFormValidate.foundationForm),
                towerBottomD: Number(this.loadFormValidate.towerBottomD),
                designer: this.loadFormValidate.designer,
                remark: this.loadFormValidate.remark
              }
            })
            this.$Message.success('保存成功')
            setTimeout(() => {
              this.$router.push({ name: 'payloads' })
            }, 300)
          } catch (error) {
            this.$Message.error(error.message)
          }
        }
      })
    },
    cancel () {
      this.$router.push({ name: 'payloads' })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
