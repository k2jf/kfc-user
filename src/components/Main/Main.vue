<template>
  <div class="layout" id="ido">
    <Layout>
      <Sider
        theme="light"
        hide-trigger
        collapsible
        :width="160"
        :collapsed-width="78"
        ref="side1"
        v-model="isCollapsed">
        <h2 class="gw-logo">
          <!-- <div class="goldwind">
            <GoldWind />
          </div> -->
          <img :src="gwLogo" alt="gwLogo">
          <img :src="textLogo" alt="textLogo" class="text-logo" />
        </h2>
        <Menu
          :active-name="activeName"
          theme="dark"
          width="auto"
          :class="menuitemClasses"
          @on-select="handleMenuSelect">
          <MenuItem
            :name="item.id"
            v-for="item in navList"
            :key="item.id">
            <Icon :type="item.icon" />
            <span>{{ item.name }}</span>
          </Menuitem>
        </Menu>
        </h1>
      </Sider>
      <Layout>
        <Header :style="{padding: 0}" class="layout-header-bar">
          <Icon
            :class="rotateIcon"
            :style="{margin: '0 20px', marginTop: '-4px'}"
            type="md-menu"
            size="24"
            @click.native="collapsedSider" />
          <span class="text-2xl">iDO 海上风机支撑结构一体化设计平台</span>
          <aside class="float-right mr-6">
            <Avatar class="alita" :src="alita" v-if="['kk', 'kangkai'].includes(userName)"></Avatar>
            <Avatar icon="ios-person" v-else></Avatar>
            <Dropdown trigger="click" v-if="userName" @on-click="onDropdownClick">
              <b class="px-4 text-base cursor-pointer">{{ userName }} <Icon type="ios-arrow-down" /></b>
              <DropdownMenu slot="list">
                <DropdownItem name="logout">
                  <Icon type="ios-log-out" /> 登出
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <b class="px-4 text-base" v-else>未登录</b>
          </aside>
        </Header>
        <Content
          class="mt-3 ml-3"
          :style="{background: '#fff', minHeight: '260px'}">
          <div class="h-10 pl-5 pt-3">
            <BreadCrumb :breadList="breadList"></BreadCrumb>
          </div>
          <main class="overflow-y-auto h-calc-10 relative" id="ido-body">
            <Spin fix size="large" v-if="loading" />
            <router-view fix />
          </main>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>

<script>
import { Layout, Sider, Menu, MenuItem, Header, Icon, Content, Avatar, Spin, Dropdown, DropdownMenu, DropdownItem } from 'iview'
import textLogo from '@/assets/gw_logo_2.png'
import gwLogo from '@/assets/gw_logo_1.png'
import alita from '@/assets/Alita.jpg'
import BreadCrumb from '@/components/BreadCrumb'

import { mapState, mapMutations } from 'vuex'

const navList = [
  { id: 0, name: '项目管理', to: 'projects', icon: 'ios-folder' },
  { id: 1, name: '载荷门户', link: 'http://internal-gw-zhy-loadportal-prod-front-474455559.cn-northwest-1.elb.amazonaws.com.cn/#/', icon: 'ios-search' },
  { id: 2, name: '塔架设计', to: 'towers', icon: 'md-build' },
  { id: 3, name: '基础设计', to: 'foundations', icon: 'md-document' }
  // { id: 4, name: '数据分析', to: 'data-analytics', icon: 'md-analytics' }
  // { id: 5, name: '数据管理', to: 'data-management', icon: 'md-podium' },
  // { id: 6, name: '用户管理', to: 'users', icon: 'md-contact' }
]

export default {
  name: 'Main',
  components: {
    Layout,
    Sider,
    Menu,
    MenuItem,
    Header,
    Icon,
    Content,
    Avatar,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    BreadCrumb,
    Spin
  },
  data () {
    return {
      alita,
      isCollapsed: false,
      textLogo,
      gwLogo,
      user: 'DEV',
      breadList: [],
      navList,
      activeName: 1
    }
  },
  computed: {
    ...mapState({
      userName: state => state.userName,
      loading: state => state.loading
    }),
    rotateIcon () {
      return [
        'menu-icon',
        this.isCollapsed ? 'rotate-icon' : ''
      ]
    },
    menuitemClasses () {
      return [
        'menu-item',
        this.isCollapsed ? 'collapsed-menu' : ''
      ]
    }

  },
  watch: {
    $route (next) {
      this.handleBreadList(next)
    }
  },
  mounted () {
    this.updateActiveName()
    this.handleBreadList(this.$route)
    // this.$refs.side1.toggleCollapse()
  },
  methods: {
    ...mapMutations(['setUserName']),
    collapsedSider () {
      this.$refs.side1.toggleCollapse()
    },
    handleBreadList (next) {
      const matched = next.matched.filter(m => !m.meta.ignore)
      const breadList = [{ name: 'iDO', to: '/' }]
      matched.forEach((m, i) => {
        if (m.name !== 'index') {
          breadList.push({
            name: m.meta.breadName,
            to: i === matched.length - 1 ? undefined : m.path
          })
        }
      })
      this.breadList = breadList

      this.activeName = navList.findIndex(n => next.fullPath.includes(n.to))
    },
    onDropdownClick (index) {
      if (index === 'logout') {
        this.setUserName('')
        setTimeout(() => {
          this.$router.push({ name: 'login' })
        }, 300)
      }
    },
    handleMenuSelect (index) {
      const name = navList[index].to
      if (name) {
        this.$router.push({ name })
      } else {
        window.open(navList[index].link)
        this.updateActiveName()
      }
    },
    updateActiveName () {
      const active = this.$route.name
      const index = navList.findIndex(n => n.to === active)
      this.activeName = index
    }
  }
}
</script>

<style lang="less">
// html, body {
//   height: 100%;
// }
.ivu-layout {
  height: 100%;
}

// 超链接波浪
.ido-link {
  padding: 2px 0;
  text-decoration: underline;

  &:hover {
  text-decoration: none;
  background: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 5'><path fill='none' stroke='%232d8cf0' d='M0 3.5c5 0 5-3 10-3s5 3 10 3 5-3 10-3 5 3 10 3'/></svg>") repeat-x 0 100%;
  background-size: 20px auto;
  animation: waveMove 1s infinite linear;
  }
}

@keyframes waveMove {
  0% {
  background-position: 0 100%;
  }
  100% {
  background-position: -20px 100%;
  }
}

// override of iview.css
@import '../../override.less';
</style>
<style scoped lang="less">
.layout{
  position: relative;
  overflow: hidden;
  height: 100%;
  min-width: 1100px;
}
.logo-wrap {
  display: none;
}
.gw-logo {
  display: block;
  height: 60px;
  text-align: center;
  padding-top: 10px;
  // background-color: #40485a;

  .goldwind {
    display: inline-block;
    width: 48px;
    height: 48px;
    // transform: scale(1.5);
    vertical-align: middle;
  }

  img {
    width: 36px;
    vertical-align: middle;
  }

  .text-logo {
    width: 80px;
    transition: width .2s ease;
  }
}
.ivu-layout-sider-collapsed .gw-logo .text-logo{
  transition: width .2s ease;
  width: 0;
}
.layout-header-bar{
    background: #fff;
    box-shadow: 0 1px 1px rgba(0,0,0,.1);
    font-size: 20px;
}
.layout-logo-left{
    width: 90%;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    margin: 15px auto;
}
.menu-icon{
    transition: all .3s;
}
.rotate-icon{
    transform: rotate(-90deg);
}
.menu-item span{
    display: inline-block;
    overflow: hidden;
    width: 69px;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    transition: width .2s ease .2s;
}
.menu-item i{
    transform: translateX(0px);
    transition: font-size .2s ease, transform .2s ease;
    vertical-align: middle;
    font-size: 16px;
}
.collapsed-menu span{
    width: 0px;
    transition: width .2s ease;
}
.collapsed-menu i{
    transform: translateX(5px);
    transition: font-size .2s ease .2s, transform .2s ease .2s;
    vertical-align: middle;
    font-size: 22px;
}
.alita:hover {
    transform: rotate(666turn);
    transition-delay: 1s;
    transition-property: all;
    transition-duration: 59s;
    transition-timing-function: cubic-bezier(.34,0,.84,1);
}
</style>
