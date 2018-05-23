<template>
  <div>
    <b-form @submit.stop="submit">
      <b-form-group
        id="paper-title-group"
        horizontal
        label-cols="3"
        breakpoint="md"
        label="试卷标题"
        label-for="paper-title">
        <b-form-input
          id="paper-title"
          v-model="title"
          type="text"/>
      </b-form-group>
      <b-button
        class="offset-3 col-9"
        variant="primary"
        block
        @click="appendQuestion">
        添加新题目
      </b-button>
      <b-button
        class="offset-3 mt-2"
        variant="success"
        type="submit">
        提交新试卷
      </b-button>
    </b-form>
  </div>
</template>

<script>
export default {
  name: 'NewPaper',
  data () {
    return {
      title: '',
      questions: []
    }
  },
  methods: {
    appendQuestion () {
      this.questions.push({})
    },
    submit () {
    }
  }
}
</script>

<style scoped>

</style>
