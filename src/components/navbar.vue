<template>
  <b-navbar
    :variant="variant"
    toggleable="md"
    type="light"
    fixed="top">
    <b-navbar-toggle target="nav_collapse"/>
    <b-navbar-brand
      v-if="!index"
      :to="{name: 'Index'}">
      {{ brand }}
    </b-navbar-brand>
    <b-collapse
      id="nav_collapse"
      is-nav>
      <b-navbar-nav v-if="!index">
        <b-nav-item :to="{name: 'Paper'}">我要答题</b-nav-item>
        <b-nav-item :to="{name: 'New-Question'}">我要出题</b-nav-item>
        <b-nav-item :to="{name: 'Examination', params: {id: Math.ceil(Math.random() * 200)}}">试试手气
        </b-nav-item>
      </b-navbar-nav>
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-form v-if="!index && $route.name !== 'Search'">
          <b-form-input
            v-model="key"
            size="sm"
            class="mr-sm-2"
            type="text"
            placeholder="搜索"/>
          <b-button
            :to="{name:'Search', query: {q: key}}"
            size="sm"
            class="my-2 my-sm-0"
            type="submit">
            搜索
          </b-button>
        </b-nav-form>
      </b-navbar-nav>
      <b-navbar-nav
        v-if="authenticated"
        class="ml-2">
        <b-nav-item-dropdown
          right>
          <!-- Using button-content slot -->
          <template slot="button-content">
            <img
              :src="avatar"
              :alt="name"
              class="avatar rounded">
          </template>
          <b-dropdown-item :to="{ name: 'Home'}"> 主页</b-dropdown-item>
          <b-dropdown-item :to="{ name: 'Profile'}"> 个人信息</b-dropdown-item>
          <b-dropdown-item @click="signOut"> 登出</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
      <b-navbar-nav
        v-else
        class="ml-2">
        <b-nav-item
          :to="{ name: 'Sign-in'}"
          class="border-right"
        >登录
        </b-nav-item>
        <b-nav-item
          :to="{ name: 'Register'}">
          注册
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
  <!-- navbar-1.vue -->
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
// import Config from '~/config'

export default {
  name: 'Navbar',
  data () {
    return {
      brand: '考拉',
      index: false,
      variant: 'fate',
      path: this.$route.path,
      key: '',
      search: false
    }
  },
  computed: {
    ...mapGetters([
      'name', 'authenticated', 'avatar'
    ])
  },
  watch: {
    '$route.path' (val) {
      this.index = val === '/'
      this.variant = val === '/' ? 'fate' : 'light'
    }
  },
  created: function () {
    this.index = this.path === '/'
    this.variant = this.path === '/' ? 'fate' : 'light'
  },
  methods: {
    ...mapActions({
      signOut: 'revoke'
    })
  }
}
</script>

<style scoped>
  .avatar {
    max-width: 30px;
  }
</style>
