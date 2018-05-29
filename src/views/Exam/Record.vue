<template>
  <b-card
    v-if="record"
    :sub-title="identification"
    title="考试记录">
    <b-row>
      <b-col cols="12">
        <h5 class="text-center">
          总览
        </h5>
        <table class="table table-bordered table-striped">
          <thead>
            <tr>
              <th>分数</th>
              <th>开始时间</th>
              <th>结束时间</th>
              <th>试卷标题</th>
              <th>出题人</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ record.score }}/{{ record.meta.full_score }}</td>
              <td>{{ record.created }}</td>
              <td>{{ record.finished }}</td>
              <td>{{ record.paper.title }}</td>
              <td>{{ record.paper.user.name }}</td>
            </tr>
          </tbody>
        </table>
      </b-col>
    </b-row>
    <b-card
      v-for="(answer_record, key) in record.answer_record.data"
      :key="key"
      :header="`<b class='mr-2'>${question(key).tag.title}</b>  本题 ${answer_record.meta.origin_score} 分${score(answer_record)}`"
      :border-variant="variant(answer_record)"
      :header-bg-variant="variant(answer_record)"
      class="mb-2">
      <h5>{{ question(key).title }}</h5>
      <dl>
        <b-row>
          <dt class="col-2">正确答案</dt>
          <dd class="col-10">{{ answer(answer_record.meta.origin_answer) }}</dd>
        </b-row>
        <b-row class="mt-2">
          <dt class="col-2">提交的答案</dt>
          <dd class="col-10">{{ answer(answer_record.answer) }}</dd>
        </b-row>
      </dl>
      <div v-if="answer_record.meta.origin_type">
        <ul>
          <li
            v-for="option in question(key).options"
            :key="hash(option.text)"
            :class="['m-1', option_variant(option.value ,answer_record)]">
            <b>{{ option.value }}. </b>{{ option.text }}
          </li>
        </ul>
      </div>
    </b-card>
  </b-card>
  <b-card v-else>
    {{ load }}
  </b-card>
</template>

<script>
import Comm from '../../api/communication'

export default {
  name: 'Record',
  props: {
    id: {
      type: String,
      required: true,
      default: ''
    }
  },
  data () {
    return {
      record: null
    }
  },
  computed: {
    load () {
      return this.record === false
        ? '考试记录加载失败'
        : '正在加载考试记录 , 请稍后'
    },
    identification () {
      return `id: ${this.record.id}`.toUpperCase() + '<br> 因技术问题，主观题不计入总分'
    }
  },
  created () {
    Comm.get(`/record/examination/${this.id}`, {
      params: {
        include: ['answer_record', 'paper.user', 'paper.questions'].join(',')
      }
    }).then(resp => {
      this.record = resp.data
    }).catch(error => this.$store.dispatch('except', error))
  },
  methods: {
    question (key) {
      return this.record.paper.questions.data[key]
    },
    score (answerRecord) {
      return answerRecord.meta.origin_type ? ` ，得分 ${answerRecord.score} 分` : ''
    },
    variant (record) {
      if (record.meta.origin_type) {
        return record.correctness ? 'success' : 'danger'
      } else {
        return 'secondary'
      }
    },
    answer (value) {
      return value instanceof Array ? value.join(' , ') : value
    },
    hash (s) {
      let h = 0
      let l = s.length
      let i = 0
      if (l > 0) {
        while (i < l) {
          h = (h << 5) - h + s.charCodeAt(i++) | 0
        }
      }
      return h
    },
    option_variant (value, record) {
      const correct = 'correct-option'
      const wrong = 'wrong-option'
      const answer = record.answer
      const correctAnswer = record.meta.origin_answer
      // 多选题
      if (correctAnswer instanceof Array) {
        // 此为正确选项之一 且回答中有 则返回正确 否则返回错误
        if (correctAnswer.indexOf(value) >= 0) { // 正确选项之一
          if (answer.indexOf(value) >= 0) {
            // 回答中有
            return correct
          } else {
            return wrong
          }
        } else if (answer.indexOf(value) >= 0) {
          return wrong
        }
      } else {
        // 若为正确选项
        if (value === correctAnswer) {
          return correct
        } else if (value === answer) {
          return wrong
        }
      }
      return ''
    }
  }
}
</script>

<style scoped>
  .correct-option {
    background-color: #e6ffed;
  }

  .wrong-option {
    background-color: #ffeef0;
  }
</style>
