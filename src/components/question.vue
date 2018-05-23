<template>
  <b-card
    :title="title"
    :sub-title="subTitle"
  >
    {{ options }}
  </b-card>
</template>

<script>
export default {
  name: 'QuestionList',
  props: {
    question: {
      type: Object,
      required: true,
      default: function () {
        return null
      }
    },
    tags: {
      type: Object,
      required: true,
      default: function () {
        return null
      }
    }
  },
  data () {
    return {
      title: '',
      subTitle: '',
      options: ''
    }
  }
}
</script>

<style scoped>

</style>
