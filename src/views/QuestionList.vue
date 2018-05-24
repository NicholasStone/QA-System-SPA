<template>
  <b-row>
    <question
      v-for="(item, key) in questions"
      :key="key"
      :question="item"/>
  </b-row>
</template>

<script>
import Comm from '../api/communication'
import Question from '../components/question'

// todo 分页
export default {
  name: 'QuestionList',
  components: {
    'question': Question
  },
  props: {
    id: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      questions: []
    }
  },
  beforeMount () {
    Comm.get('bank/question/' + (this.id ? this.id : ''), {
      params: {
        include: 'user'
      }
    })
      .then(resp => {
        if (this.id) {
          this.questions.push(resp.data)
        } else {
          this.questions = resp.data.data
        }
      })
  }
}
</script>

<style scoped>

</style>
