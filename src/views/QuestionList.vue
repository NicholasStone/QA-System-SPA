<template>
  <b-row>
    <b-card
      v-for="(item, key) in questions"
      :key="key"
      :title="item.title"
      :sub-title="item.user.name +' 创建于 '+ item.created"
      class="mb-2 col-10"
    >
      <b-table
        v-if="item.options"
        :items="item.options"
        :fields="fields"
        bordered
        striped
        hover
      />
      <b-button
        v-b-toggle="`${key}-answer`"
        variant="default"
      >答案
      </b-button>
      <b-collapse
        :id="`${key}-answer`"
        class="mt-3"
      >
        {{ answer(item.answer) }}
      </b-collapse>
    </b-card>
  </b-row>
</template>

<script>
import Comm from '../api/communication'
// todo 分页
export default {
  name: 'QuestionList',
  props: {
    id: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      questions: [],
      fields: {
        index: '#',
        option: '选项内容'
      }
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

</style>
