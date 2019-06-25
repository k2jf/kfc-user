<template>
  <div class="project-item p-3">
    <div class="border-grey-light border-solid border rounded p-6">
      <div class="h-10 font-bold text-sm" style="line-height: 2.5rem">
        协鑫江苏如东H1-2（200MW）
        <Tag color="warning" style="transform:scale(.8)">
          黄色预警
        </Tag>
      </div>
      <Row class="p-3 pl-0">
        <ICol span="8">
          负责人：Mr.zhang
        </ICol>
        <ICol span="8">
          业主名称：Mr.zhang
        </ICol>
        <ICol span="8">
          当前进度：初步方案
        </ICol>
      </Row>
      <Row class="p-3 pl-0">
        <ICol span="8">
          创建时间：2019-02-01
        </ICol>
        <ICol span="8">
          计划完成时间：2019-03-10
        </ICol>
        <ICol span="8">
          过期时间：10天
        </ICol>
      </Row>
    </div>

    <div class="border-grey-light border-solid border rounded p-6 mt-6" v-if="false">
      <div class="h-10 font-bold text-sm mb-4" style="line-height: 2.5rem">
        处理进度
      </div>
      <Steps :current="1">
        <Step
          content="Mr.zhang 2019-02-0">
          <div slot="title">
            <Poptip
              transfer
              trigger="hover"
              content="content">
              创建项目
              <div slot="content">
                <div class="font-bold text-sm">
                  负责人：小龙女
                </div>
                <div>
                  <p>计划完成时间：2019-03-03</p>
                  <p>滞后时间：12小时</p>
                  <p>耗时：xx</p>
                </div>
              </div>
            </Poptip>
          </div>
        </Step>
        <Step content="小龙女">
          <div slot="title">
            <Poptip
              transfer
              trigger="hover"
              content="content">
              初步方案
              <div slot="content">
                <div class="font-bold text-sm">
                  负责人：小龙女
                </div>
                <div>
                  <p>计划完成时间：2019-03-03</p>
                  <p>滞后时间：12小时</p>
                  <p>耗时：xx</p>
                </div>
              </div>
            </Poptip>
          </div>
        </Step>
        <Step content="杨过">
          <div slot="title">
            <Poptip
              transfer
              trigger="hover"
              content="content">
              塔架主体设计
              <div slot="content">
                <div class="font-bold text-sm">
                  杨过
                </div>
                <div>
                  <p>计划完成时间：2019-03-03</p>
                  <p>滞后时间：12小时</p>
                  <p>耗时：xx</p>
                </div>
              </div>
            </Poptip>
          </div>
        </Step>
        <Step>
          <div slot="title">
            <Poptip
              transfer
              trigger="hover"
              content="content">
              完成
              <div slot="content">
                <div class="font-bold text-sm">
                  负责人：小龙女
                </div>
                <div>
                  <p>计划完成时间：2019-03-03</p>
                  <p>滞后时间：12小时</p>
                  <p>耗时：xx</p>
                </div>
              </div>
            </Poptip>
          </div>
        </Step>
      </Steps>
    </div>

    <div class="border-grey-light border-solid border rounded p-6 mt-6" v-if="false">
      <div class="h-10 font-bold text-sm mb-4" style="line-height: 2.5rem">
        人员分配
      </div>
      <div>
        <Tabs value="name1">
          <TabPane label="立项阶段" name="name1">
            <Row>
              <ICol class="p-6" span="12">
                <Card>
                  <div class="h-10 font-bold text-sm mb-4" style="line-height: 2.5rem">
                    创建项目
                  </div>
                  <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" />
                  <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" />
                  <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" />
                  <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" />
                </Card>
              </ICol>
            </Row>
          </TabPane>
          <TabPane label="B01" name="name2">
            标签二的内容
          </TabPane>
          <TabPane label="B02" name="name3">
            标签三的内容
          </TabPane>
        </Tabs>
      </div>
    </div>

    <div class="border-grey-light border-solid border rounded p-6 mt-6" ref="flow">
      流程图
      <div id="flow"></div>
    </div>
  </div>
</template>

<script>
import { Tag, Row, Col, Poptip, Tabs, TabPane, Card } from 'iview'
import Steps from '@/components/Steps'
import g6 from '@antv/g6'
import { firstData, secondData, thirdData } from './dataPick'

export default {
  name: 'ProjectItem',
  components: {
    Tag,
    Row,
    ICol: Col,
    Steps,
    Step: Steps.Step,
    Poptip,
    Tabs,
    TabPane,
    Card
  },
  mounted () {
    // this.$nextTick(() => {
    //   this.draw()
    // })
  },
  methods: {
    draw () {
      const width = this.$refs.flow.offsetWidth - 100
      const height = this.$refs.flow.offsetHeight
      console.log(width, height)

      const graph = new g6.Graph({
        container: 'flow',
        width,
        height: 800,
        modes: {
          default: [{
            type: 'tooltip',
            formatText (model) {
              let display = ''
              if (model.active) {
                display = (
                  `
                  <div class="ido-canvas-tooltip">
                    <div>负责人：xxx</div>
                    <div>开始时间：2019-06-12<div>
                    <div>工作进度：延误<div>
                    <div>预计完成时间：2019-07-12<div>
                  </div>
                  `
                )
              }
              return display
            }
          }]
        }
      })

      graph.data({
        nodes: firstData.nodes.concat(secondData.nodes).concat(thirdData.nodes),
        edges: firstData.edges.concat(secondData.edges).concat(thirdData.edges)
      })
      graph.render()
    }
  }
}
</script>
<style lang="less">
.g6-tooltip {
  // padding: 10px 6px;
  color: #fff;
  background-color: rgba(70,76,91,.9);
  // border: 1px solid #e2e2e2;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
}

.ido-canvas-tooltip {
  padding: 10px;
}
</style>
