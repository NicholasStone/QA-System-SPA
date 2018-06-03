<template>
  <div>
    <div class="form-group">
      <label class="sr-only">搜索</label>
      <div class="input-group">
        <input
          id="search-input"
          v-model="keys"
          class="form-control rounded-0"
          placeholder="找份卷子做做...">
        <span class="input-group-append">
          <router-link
            :to="{name:'Search', query:{q:keys}}"
            class="btn btn-dark btn-lg rounded-0"
            type="submit">搜索</router-link>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Search',
  data () {
    return {
      keys: ''
    }
  }
}
</script>

<style>
</style>
