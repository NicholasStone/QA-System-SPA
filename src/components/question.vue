<template>
  <b-card
    :sub-title="subTitle"
    class="mb-2 w-100">
    <p class="text-info">{{ question.tag.title }}</p>
    <p class="title mb-2">{{ question.title }}</p>
    <b-btn
      v-b-toggle="`detail-${question.id}`"
      size="sm"
      variant="primary">
      查看选项
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
      <p v-if="question.selected">答案: <br>{{ answer(question.selected) }}</p>
    </b-collapse>
  </b-card>
</template>

<script>
export default {
  name: 'Question',
  props: {
    question: {
      type: Object,
      required: true,
      default () {
        return null
      }
    }
  },
  data () {
    return {
      fields: {
        value: '#',
        text: '选项内容'
      }
    }
  },
  computed: {
    subTitle () {
      let question = this.question
      return question.user
        ? question.user.name + ' 创建于 ' + question.created
        : null
    }
  },
  methods: {
    selected (val) {
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
