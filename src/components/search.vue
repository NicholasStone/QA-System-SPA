<template>
  <b-form
    inline
    class="page-center mb-3">
    <div class="form-group col-12 input-group-lg justify-content-center">
      <label
        for="search-input"
        class="sr-only">搜索</label>
      <div class="input-group col-8 mt-4 mb-4">
        <input
          id="search-input"
          v-model="query"
          type="text"
          name="search-input"
          placeholder="找份卷子做做..."
          class="form-control rounded-0">
        <div class="input-group-append">
          <button class="btn btn-dark btn-lg rounded-0">搜索</button>
        </div>
      </div>
    </div>
  </b-form>
</template>

<script>
export default {
  name: 'Search',
  props: {
    query: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>

</style>
