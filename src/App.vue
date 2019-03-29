<template>
  <div class="layout" id="ido">
    <Layout>
      <Sider
        hide-trigger
        collapsible
        :collapsed-width="78"
        ref="side1"
        v-model="isCollapsed">
        <h1 class="logo">
          <img :src="logo" alt="logo" />
          <img :src="IDO" class="ido-logo" alt="IDO" />
        </h1>
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
          <span class="text-2xl">IDO 海上风机一体化设计平台</span>
          <aside class="float-right mr-6">
            <Avatar :src="logo" />
            <Dropdown trigger="click" v-if="user" @on-click="onDropdownClick">
              <b class="px-4 text-base cursor-pointer">{{ user }} <Icon type="ios-arrow-down" /></b>
              <DropdownMenu slot="list">
                <DropdownItem name="logout">
                  <Icon type="ios-log-out" /> 登出
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <b v-else>未登录</b>
          </aside>
        </Header>
        <Content
          class="overflow-y-scroll mt-3 ml-3"
          :style="{background: '#fff', minHeight: '260px'}">
          <div class="h-10 pl-5 pt-3">
            <BreadCrumb :breadList="breadList"></BreadCrumb>
          </div>
          <main class="h-calc-10" style="min-width: 1100px">
            <router-view />
          </main>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>

<script>
import { Layout, Sider, Menu, MenuItem, Header, Icon, Content, Avatar, Dropdown, DropdownMenu, DropdownItem } from 'iview'
import logo from '@/assets/logo.png'
import IDO from '@/assets/IDO.png'
import BreadCrumb from '@/components/BreadCrumb'

const navList = [
  { id: 0, name: '项目管理', to: 'projects', icon: 'ios-folder' },
  { id: 1, name: '载荷门户', link: 'http://internal-dev-loadportal-front-1393092945.cn-north-1.elb.amazonaws.com.cn', icon: 'ios-search' },
  { id: 2, name: '塔架设计', to: 'towers', icon: 'md-build' },
  { id: 3, name: '基础设计', to: 'basics', icon: 'md-document' },
  { id: 4, name: '数据分析', to: 'data-analytics', icon: 'md-analytics' },
  { id: 5, name: '数据管理', to: 'data-management', icon: 'md-podium' },
  { id: 6, name: '用户管理', to: 'users', icon: 'md-contact' }
]

export default {
  name: 'App',
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
    BreadCrumb
  },
  data () {
    return {
      isCollapsed: false,
      logo: logo,
      IDO: IDO,
      user: 'Dev',
      breadList: [],
      navList,
      activeName: 0
    }
  },
  computed: {
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
      // console.log(next)
      const matched = next.matched.filter(m => !m.meta.ignore)
      const breadList = [{ name: 'IDO', to: '/' }]
      matched.forEach((m, i) => {
        breadList.push({
          name: m.meta.breadName,
          to: i === matched.length - 1 ? undefined : m.path
        })
      })
      this.breadList = breadList
      this.activeName = navList.findIndex(n => n.to === next.name)
    }
  },
  mounted () {
    this.updateActiveName()
    this.$refs.side1.toggleCollapse()
  },
  methods: {
    collapsedSider () {
      this.$refs.side1.toggleCollapse()
    },
    onDropdownClick (index) {
      console.log('click ' + index)
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
html, body {
  height: 100%;
}
.ivu-layout {
  height: 100%;
}

// 超链接波浪
.ido-link {
  padding: 2px 0;

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
@import './override.less';
</style>
<style scoped lang="less">
.layout{
  position: relative;
  overflow: hidden;
  height: 100%;
}
.logo {
  height: 60px;
  // background: #5b6270;
  text-align: center;
  padding-top: 10px;

  img {
    width: 30px;
  }

  .ido-logo {
    width: 90px;
    transition: width .2s ease;
  }

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
.ivu-layout-sider-collapsed .ido-logo{
  transition: width .2s ease;
  width: 0px;
}
</style>
