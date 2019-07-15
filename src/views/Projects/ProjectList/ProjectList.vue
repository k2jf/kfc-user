<template>
  <div class="ido-projects h-full relative">
    <Spin fix size="large" v-if="loading" />
    <div class="h-16 p-3">
      <Button @click="syncJiraProjects">
        <Icon class="text-sm" title="同步jira" type="md-sync" />
      </Button>
      <RadioGroup type="button" class="ml-3" v-model="status">
        <Radio :label="item.id" v-for="item in radioGroup" :key="item.id">
          {{ item.value }}
        </Radio>
      </RadioGroup>
      <Input
        class="ml-3"
        placeholder="请输入项目名称"
        icon="ios-search"
        style="width: 160px"
        v-model="value" />
      <a class="float-right underline ido-link" href="http://jira.goldwind.com.cn/" target="_blank">
        进入jira管理页面
      </a>
    </div>
    <div class="h-calc-16">
      <Row v-if="projects.length > 0">
        <ICol
          class="p-2 bt-4"
          span="6"
          v-for="item in projects"
          :key="item.id">
          <Card class="w-full cursor-pointer" @click.native="linkToInfo(item.projectId)">
            <div class="overflow-hidden pl-2">
              <div class="text-sm py-1 text-overflow" :title="item.projectName">
                {{ item.projectName }}
              </div>
              <div class="status py-1 text-grey-dark text-xs">
                <div class="inline-block w-16">
                  状态：
                </div> {{ returnStatus(item.status) }}
              </div>
              <div class="text-xs py-1 text-grey-dark">
                <div class="inline-block w-16">
                  负责人：
                </div>
                {{ item.riskOwner }}
              </div>
              <div class="text-xs py-1 text-grey-dark">
                <div class="inline-block w-16">
                  设计阶段：
                </div>
                {{ returnDesignStatus(item.designPhase) }}
              </div>
              <div class="text-xs py-1 text-grey-dark">
                <div class="inline-block w-16">
                  截止日期：
                </div>
                {{ D(item.endTime).format('YYYY-MM-DD') }}
              </div>
            </div>
          </Card>
        </ICol>
      </Row>
      <div v-else>
        暂无项目
      </div>
    </div>
  </div>
</template>

<script>
import { RadioGroup, Radio, Input, Card, Row, Col, Tag, Icon, Button, Spin } from 'iview'
import D from 'dayjs'
import _ from 'lodash'

export default {
  name: 'ProjectList',
  components: {
    Input,
    Card,
    Button,
    Row,
    ICol: Col,
    Tag,
    Icon,
    Spin,
    RadioGroup,
    Radio
  },
  data () {
    return {
      loading: false,
      value: '',
      projects: [],
      D,
      status: 'all',
      radioGroup: [
        { id: 'all', value: '全部' },
        { id: '0', value: '进行中' },
        { id: '1', value: '完成' }
        // { id: '2', value: '超时' }
      ]
    }
  },
  watch: {
    status (value) {
      const searchParams = {}
      if (value !== 'all') {
        searchParams.status = value
      }
      this.getProjects(searchParams)
    },
    value: _.debounce(function (projectName) {
      this.getProjects({ projectName })
    }, 300)
  },
  async mounted () {
    this.getProjects()
  },
  methods: {
    async getProjects (searchParams) {
      try {
        this.loading = true
        const res = await this.$get('projects', {
          searchParams
        })
        this.projects = res.body.items
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },
    linkToInfo (projectId) {
      this.$router.push({ name: 'project-info', params: { projectId } })
    },
    async syncJiraProjects () {
      try {
        this.loading = true
        await this.$post('projects/sync')
        this.getProjects()
      } catch (error) {
        this.loading = false
      }
    },
    returnStatus (status) {
      return ['进行中', '完成'][status]
    },
    returnDesignStatus (status) {
      return ({
        A: '标前',
        B: '投标',
        D: '中标'
      })[status]
    }
  }
}
</script>
<style lang="less" scoped>
.text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}
</style>
