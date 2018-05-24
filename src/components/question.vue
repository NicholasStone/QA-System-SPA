<template>
  <b-card
    :sub-title="subTitle"
    class="mb-2">
    <p class="title mb-2">{{ question.title }}</p>
    <b-btn
      v-b-toggle="`detail-${question.id}`"
      variant="primary"
    >详情
    </b-btn>
    <b-collapse
      :id="`detail-${question.id}`"
      class="mt-3">
      <b-table
        v-if="question.options"
        :items="question.options"
        :fields="fields"
        bordered
        striped
        hover/>
      <p>答案: <br>{{ answer(question.answer) }}</p>
    </b-collapse>
  </b-card>
</template>

<script>
export default {
  name: 'QuestionList',
  props: {
    question: {
      type: Object,
      required: true,
      default () {
        return null
      }
    }
    // tag: {
    //   type: Object,
    //   required: true,
    //   default () {
    //     return null
    //   }
    // }
  },
  data () {
    return {
      fields: {
        index: '#',
        option: '选项内容'
      }
    }
  },
  computed: {
    subTitle () {
      let question = this.question
      return question.user ? question.user.name + ' 创建于 ' + question.created : null
    }
  },
  methods: {
    answer (val) {
      if (val instanceof Array) {
        return val.join(',')
      }
      return val
    }
  }
}
</script>

<style scoped>
  .title {
    font-size: 1.05rem;
  }
</style>
