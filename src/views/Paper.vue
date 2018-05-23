<template>
  <b-row>
    <b-card
      v-for="(item, key) in papers"
      :key="key"
      :title="item.title"
      :sub-title="item.user.name +' 创建于 '+ item.created"
      class="mb-2 col-10"
    >
      <b-table
        :items="item.questions.data"
        :fields="fields"
        hover
        striped
        bordered
      />
    </b-card>
  </b-row>
</template>

<script>
import Comm from '../api/communication'

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
  }
}
</script>

<style scoped>

</style>
