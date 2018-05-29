<template>
  <b-card
    title="新题目"
    sub-title="请填写下列空白">
    <b-form @submit.prevent="submit">
      <b-form-group
        id="question-title-group"
        horizontal
        label="题面"
        label-for="question-title"
        label-cols="3"
        breakpoint="md">
        <b-form-textarea
          id="question-title"
          v-model="question.title"
          rows="3"
          type="text"/>
      </b-form-group>
      <b-form-group
        id="question-tag-group"
        horizontal
        label="类型"
        label-for="question-tag"
        label-cols="3"
        breakpoint="md">
        <b-form-select
          id="question-tag"
          v-model="question.tag"
          :options="tags"/>
      </b-form-group>
      <b-form-group
        v-if="type"
        id="question-options-group"
        :state="validateOptions"
        horizontal
        label="选项"
        label-cols="3"
        breakpoint="md"
        invalid-feedback="选项最少两个">
        <b-form-group
          v-for="(option, index) in question.options"
          :key="index"
          :id="`question-option-group-${index}`"
          :label="`# ${index + 1}`"
          :label-for="`question-option-${index}`"
          label-cols="1"
          horizontal>
          <div class="input-group">
            <b-form-input
              :id="`question-option-${index}`"
              v-model="option.t"
              type="text"/>
            <div class="input-group-append">
              <b-button
                variant="outline-danger"
                @click="removeOption(index)">
                删除此项
              </b-button>
            </div>
          </div>
        </b-form-group>
        <b-button
          variant="success"
          @click="addOption">
          添加新选项
        </b-button>
      </b-form-group>
      <b-form-group
        id="question-answer-group"
        :state="validateAnswer"
        invalid-feedback="请按照提示输入格式正确的答案"
        label="问题答案"
        label-for="question-answer"
        label-cols="3"
        description="选择题答案请填写选项编号，多选请将选项用 <b>英文逗号 ( ',' )</b> 隔开"
        horizontal>
        <b-form-textarea
          id="question-answer"
          :state="validateAnswer"
          v-model="question.answer"
          type="text"
          rows="3"/>
      </b-form-group>
      <b-button
        variant="success"
        type="submit">
        提交
      </b-button>
    </b-form>
  </b-card>

</template>

<script>
import Comm from '../../api/communication'
// todo validate input
export default {
  name: 'NewQuestion',
  data () {
    return {
      question: {
        title: '',
        tag: null,
        options: [{t: ''}],
        answer: ''
      },
      original_tags: []
    }
  },
  computed: {
    tags () {
      let tag = this.original_tags.map((obj, index) => {
        return {
          value: index,
          text: obj.title
        }
      })
      tag.push({
        value: null,
        text: '请选择题目类型'
      })
      return tag
    },
    type () {
      // 主观客观
      return this.question.tag !== null ? this.original_tags[this.question.tag].type : false
    },
    validateAnswer () {
      return this.type && this.question.answer.length !== 0 ? /^\d+(,\d+)*$/.test(this.question.answer) : null
    },
    validateOptions () {
      return this.type && this.question.options.length < 2 ? false : null
    }
  },
  beforeMount () {
    Comm.get('/bank/question-tag')
      .then(resp => {
        this.original_tags = resp.data.data
      })
  },
  methods: {
    addOption () {
      this.question.options.push({t: ''})
    },
    removeOption (index) {
      this.question.options.splice(index, 1)
    },
    submit () {
      let data = {
        question: this.question.title,
        type: this.type,
        tag: this.question.tag,
        options: this.question.options,
        answer: this.question.answer
      }

      Comm.post('/bank/question', data)
        .then(resp => console.log(resp.data))
    }
  }
}
</script>

<style scoped>

</style>
