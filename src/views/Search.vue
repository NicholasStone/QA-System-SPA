<template>
  <b-row>
    <b-col cols="12">
      <div class="form-group">
        <label class="sr-only">搜索</label>
        <div class="input-group col-8 offset-2">
          <input
            id="search-input"
            v-model="keywords"
            class="form-control rounded-0"
            placeholder="找份卷子做做...">
          <span class="input-group-append">
            <button
              class="btn btn-dark btn-lg rounded-0"
              type="submit">搜索</button>
          </span>
        </div>
      </div>
    </b-col>
    <div class="w-100"/>
    <b-col>
      <h5>题目</h5>
      <ais-index
        :query="keywords"
        app-id="T2TA5RNB5Y"
        api-key="9568ab295bfd78bcb6fefb2be99d33a6"
        index-name="dev_questions">
        <ais-results>
          <template slot-scope="{result}">
            <b-card class="mt-2">
              <router-link
                :to="{name: 'Question', params: {id: result.question_id}}"
                class="card-title text-dark">
                <ais-highlight
                  :result="result"
                  attribute-name="question"/>
              </router-link>
            </b-card>
          </template>
        </ais-results>
        <ais-no-results>
          <template slot-scope="props">
            没有关于 <b>{{ props.query }}</b> 的搜索结果
          </template>
        </ais-no-results>
        <ais-pagination
          :class-names="{
            'ais-pagination': 'pagination',
            'ais-pagination__link': 'page-link',
            'ais-pagination__item': 'page-item',
            'ais-pagination__item--active': 'active',
            'ais-pagination__item--disabled': 'disabled'
          }"
          class="mt-3"
          @page-change="scrollTop"/>
      </ais-index>
    </b-col>
    <b-col>
      <h5>试卷</h5>
      <ais-index
        :query="keywords"
        app-id="T2TA5RNB5Y"
        api-key="9568ab295bfd78bcb6fefb2be99d33a6"
        index-name="dev_papers">
        <ais-results>
          <template slot-scope="{result}">
            <b-card class="mt-2">
              <router-link
                :to="{name: 'Paper', params: {id: result.paper_id}}"
                class="card-title text-dark">
                <ais-highlight
                  :result="result"
                  attribute-name="title"/>
              </router-link>
            </b-card>
          </template>
        </ais-results>
        <ais-no-results>
          <template slot-scope="props">
            没有关于 <b>{{ props.query }}</b> 的搜索结果
          </template>
        </ais-no-results>
        <ais-pagination
          :class-names="{
            'ais-pagination': 'pagination',
            'ais-pagination__link': 'page-link',
            'ais-pagination__item': 'page-item',
            'ais-pagination__item--active': 'active',
            'ais-pagination__item--disabled': 'disabled'
          }"
          class="mt-3"
          @page-change="scrollTop"/>
      </ais-index>
    </b-col>
  </b-row>
</template>

<script>
import search from '../components/search'

export default {
  name: 'Search',
  components: {search},
  props: {
    q: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      keywords: this.q
    }
  },
  methods: {
    scrollTop () {
      window.scroll(0, 0)
    }
  }
}
</script>

<style scoped>

</style>
