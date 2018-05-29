<template>
  <main v-if="paper">
    <b-card
      class="count-down"
      size="sm"
      header="剩余时间">
      <h6>
        {{ countdown }}
      </h6>
      <div class="w-100"/>
      <b-button
        v-b-modal="'before-submit'"
        class="mt-2"
        size="sm"
        variant="outline-danger">
        交卷
      </b-button>
    </b-card>
    <b-card>
      <h2 class="m-2 card-title text-capitalize text-center">{{ paper.title }}</h2>
      <b-row>
        <b-col cols="6">
          <h5
            v-if="paper.time_limit"
            class="m-2 card-subtitle text-muted text-left">
            考试时限 :<span class="text-danger">{{ paper.time_limit }} 分钟</span>
          </h5>
          <h5
            v-else
            class="m-2 card-subtitle text-muted text-left">
            无时间限制
          </h5>
        </b-col>
        <b-col cols="6">
          <h6
            v-if="record"
            class="m-2 text-capitalize text-muted text-right">
            考试记录 :{{ record.id }}
          </h6>
          <h6
            v-if="record"
            class="m-2 text-muted text-right">
            开始时间 {{ record.started }}
          </h6>
        </b-col>
      </b-row>
      <b-form @submit.prevent="complete">
        <b-row
          v-for="(question, key) in paper.questions.data"
          :key="key">
          <b-col cols="1">
            <p>第 {{ key + 1 }} 题</p>
            <p>
              <small>{{ question.tag.title }}</small>
            </p>
            <p>
              <small>本题 {{ question.score }}分</small>
            </p>
          </b-col>
          <b-col>
            <b-form-group
              :id="`question-${key}-group`"
              :label="question.title">
              <b-form-textarea
                v-if="!question.tag.meta"
                v-model="answer[key]"
                :name="`question-options-${key}`"
                rows="3"
                max-rows="5"/>
              <b-form-checkbox-group
                v-else-if="question.tag.meta.multiple"
                v-model="answer[key]"
                :name="`question-options-${key}`"
                :options="question.options"
                stacked/>
              <b-form-radio-group
                v-else
                v-model="answer[key]"
                :name="`question-options-${key}`"
                :options="question.options"
                stacked/>
            </b-form-group>
          </b-col>
        </b-row>
        <b-button
          v-b-modal="'before-submit'"
          variant="danger">
          完成考试，交卷
        </b-button>
      </b-form>
    </b-card>
    <b-modal
      id="before-exam"
      v-model="modal_show"
      title="请仔细阅读以下提示"
      ok-title="开始考试"
      ok-variant="success"
      cancel-title="取消"
      cancel-variant="danger"
      size="lg"
      centered
      no-close-on-backdrop
      no-close-on-esc
      hide-header-close
      @ok="ELUA_accepted"
      @cancel="ELUA_refused">
      <h4> 试卷名 : <b>{{ paper.title }}</b></h4>
      <h5 class="text-muted">请您阅读以下提示</h5>
      <ol id="notice">
        <li class="m-1"><span class="text-danger">1. 若您未按规定导致出现问题，后果自负</span></li>
        <li class="m-1">2. 如果您点击 “取消” 将会跳转到您的首页</li>
        <li class="m-1">3. 考试一旦开始，便会产生一条 <b> 不能 </b> 修改或删除的考试记录</li>
        <li class="m-1">4. 在您点击 “开始考试" 按钮后，考试开始，并开始倒计时</li>
        <li class="m-1">5. 倒计时不可暂停，倒计时结束后强制交卷</li>
        <li class="m-1">6. 点击倒计时下方的 “交卷按钮” 可以提前交卷</li>
        <li class="m-1">7. 交卷后 <b>不能</b> 修改试卷</li>
        <li class="m-1">8. 因技术原因，<b>只有客观题计入入总分</b>，主观题不计入总分</li>
        <li class="m-1">9. 祝您考试愉快</li>
      </ol>
    </b-modal>
    <b-modal
      id="before-submit"
      title="提示"
      ok-title="确定提交"
      ok-variant="success"
      cancel-title="取消"
      cancel-variant="danger"
      size="bg"
      centered
      no-close-on-backdrop
      no-close-on-esc
      hide-header-close
      @ok="complete">
      <h4 class="text-danger text-center">
        提交试卷后不可修改，确认提交吗?
      </h4>
    </b-modal>
    <b-modal
      id="after-submit"
      v-model="finished"
      title="提示"
      ok-title="查看结果"
      ok-variant="primary"
      cancel-title="返回首页"
      cancel-variant="default"
      size="sm"
      centered
      no-close-on-backdrop
      no-close-on-esc
      hide-header-close
      @ok="$router.push({name: 'Record', params: {id: record.id}})"
      @cancel="$router.push({name: 'Home'})">
      考试已结束，您填写的答案已提交
    </b-modal>
  </main>
  <b-card
    v-else
    align="center">
    {{ loading }}
  </b-card>
</template>

<script>
import Comm from '../../api/communication'

export default {
  name: 'Examination',
  props: {
    'id': {
      type: [String, Number],
      required: true,
      default: 0
    }
  },
  data () {
    return {
      paper: null,
      answer: [],
      modal_show: true,
      record: null,
      EULA: false,
      second_left: 0,
      interval: null,
      finished: false
    }
  },
  computed: {
    loading () {
      if (this.paper === false) {
        return '试卷加载出错或无此试卷'
      } else if (this.paper === null) {
        return '正在初始化试卷，请稍后 ...'
      } else {
        return ''
      }
    },
    countdown () {
      let second = this.second_left % 60
      return Math.floor(this.second_left / 60) + ':' + (second < 9 ? '0' + second : second)
    }
  },
  created () {
    if (!/^[1-9][0-9]*$/.test(this.id)) {
      this.$store.dispatch('except', '试卷编号错误')
      this.$router.push({name: 'Paper'})
    } else {
      Comm.get(`/bank/paper/${this.id}`, {
        params: {
          include: 'questions'
        }
      }).then(resp => this.init(resp.data))
        .catch(error => {
          console.error(error)
          this.paper = false
          this.$store.dispatch('except', error)
        })
    }
  },
  methods: {
    init (data) {
      this.paper = data
      this.second_left = data.time_limit * 60
      this.answer.fill(null, 0, data.questions.length)
    },
    complete () {
      clearInterval(this.interval)
      Comm.post(`/record/answer/${this.record.id}`, {
        record: this.record.id,
        answers: this.answer
      })
        .then(() => {
          this.finished = true
        })
        .catch(error => this.$store.dispatch('except', error))
    },
    ELUA_accepted () {
      this.EULA = true
      // tall server examination started
      Comm.post('/record/examination', {
        paper: this.paper.id
      }).then(resp => {
        this.record = resp.data
      })
      this.startCountDown()
    },
    ELUA_refused () {
      this.$router.push({name: 'Home'})
    },
    startCountDown () {
      if (this.second_left === 0) {
        return
      }
      this.interval = setInterval(() => {
        if (this.second_left > 0) {
          this.second_left--
        } else {
          this.complete()
        }
      }, 1000)
    }
  }
}
</script>

<style scoped>
  .count-down {
    width: 115px;
    position: fixed;
    top: 70px;
    right: 0.5vh;
    z-index: 1000;
  }
</style>
