<template>
  <div>
    <b-row>
      <b-col cols="12">
        <h1 class="mt-5 title text-center">考拉</h1>
        <search class="offset-2 col-8"/>
        <div class="text-center">
          <router-link
            :to="{name: 'Examination', params: {id: Math.ceil(Math.random() * 200)}}"
            class="btn btn-dark rounded-0 col-2 mr-5">
            手气不错
          </router-link>
          <router-link
            :to="{name: 'Paper'}"
            class="btn btn-dark rounded-0 col-2">
            我要出题
          </router-link>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Search from '../components/search'

export default {
  name: 'Index',
  components: {
    'search': Search
  },
  data () {
    return {
      search: ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .title {
    font-size: 112px;
    font-family: "华文细黑", 'Microsoft YaHei', "微软雅黑", 'Noto Sans', serif;
  }

</style>
