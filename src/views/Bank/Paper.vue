<template>
  <b-row>
    <b-card
      v-for="(item, key) in papers"
      :key="key"
      :title="item.title"
      :sub-title="item.user.name +' 创建于 '+ item.created"
      class="mb-2 col-10">
      <b-table
        :items="item.questions.data"
        :fields="fields"
        hover
        striped
        bordered/>
      <b-button
        variant="primary"
        @click="exam(item.id)">
        做题
      </b-button>
    </b-card>
  </b-row>
</template>

<script>
import Comm from '../../api/communication'

export default {
  name: 'Paper',
  data () {
    return {
      papers: [],
      fields: {
        id: '#',
        title: '题目',
        score: '分数'
      }
    }
  },
  beforeMount () {
    Comm.get('/bank/paper/', {
      params: {
        include: 'user,questions'
      }
    })
      .then(response => {
        this.papers = response.data.data
      })
      .catch(error => {
        this.$store.dispatch('except', error)
      })
  },
  methods: {
    exam (id) {
      this.$router.push({name: 'Examination', params: {id}})
    }
  }
}
</script>

<style scoped>

</style>
