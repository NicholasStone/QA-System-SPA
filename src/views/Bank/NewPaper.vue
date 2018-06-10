<template>
  <div>
    <b-form @submit.prevent="submit">
      <b-form-group
        id="paper-title-group"
        horizontal
        label-cols="2"
        breakpoint="md"
        label="试卷标题"
        label-size="lg"
        label-for="paper-title">
        <b-form-input
          id="paper-title"
          v-model="title"
          size="lg"
          type="text"/>
      </b-form-group>
      <small>总分 <b>{{ total_score }}</b></small>
      <div class="mb-4">加入的题目</div>
      <b-row
        v-for="(item, key) in selected"
        :key="key">
        <b-col cols="2">
          <label class="mb-2"> 第 {{ key+1 }} 题 </label>
          <div class="w-100"/>
          <b-button-group>
            <b-button
              class="icon-center"
              variant="danger"
              size="sm"
              @click="remove(key)">
              <icon name="trash-alt"/>
            </b-button>
            <b-button
              v-if="key !== 0"
              class="icon-center"
              size="sm"
              variant="default"
              @click="swapUp(key)">
              <icon name="arrow-up"/>
            </b-button>
            <b-button
              v-if="key !== selected.length - 1"
              class="icon-center"
              size="sm"
              variant="default"
              @click="swapDown(key)">
              <icon name="arrow-down"/>
            </b-button>
          </b-button-group>
          <b-form-group
            :label-for="`question-${item.id}-score`"
            class="mt-2"
            label-cols="5"
            label="分数"
            horizontal>
            <b-form-input
              :id="`question-${item.id}-score`"
              v-model.number="item.score"
              type="number"
              size="sm"/>
          </b-form-group>
        </b-col>
        <b-col>
          <question :question="getOrigin(item)"/>
        </b-col>
      </b-row>
      <b-button
        v-b-modal="'question-list'"
        variant="outline-primary"
        block>
        添加新题目
      </b-button>
      <b-button
        class="mt-2"
        variant="success"
        type="submit">
        提交新试卷
      </b-button>
      <b-modal
        id="question-list"
        title="请选择题目"
        size="lg"
        ok-only
        centered>
        <b-container
          fluid
          class="question-list">
          <b-form-checkbox
            v-for="(item, key) in questions"
            :id="`${item.id}-checkbox`"
            :key="key"
            :value="{id: item.id, score: 10}"
            v-model="selected">
            <span>试题编号 {{ item.id }}</span>
            <question :question="item"/>
          </b-form-checkbox>
        </b-container>
        <div
          slot="modal-footer"
          class="modal-footer">
          已选择题目编号 {{ selected | pluck_id }}
        </div>
      </b-modal>
    </b-form>
  </div>

</template>

<script>
import Comm from '../../api/communication'
import Question from '../../components/question'
import 'vue-awesome/icons/trash-alt'
import 'vue-awesome/icons/arrow-up'
import 'vue-awesome/icons/arrow-down'
import Icon from 'vue-awesome/components/Icon'

export default {
  name: 'NewPaper',
  components: {
    'question': Question,
    'icon': Icon
  },
  filters: {
    pluck_id (value) {
      return value.map(val => val.id).join(' , ')
    }
  },
  data () {
    return {
      id: null,
      title: '',
      questions: [],
      pagination: null,
      selected: []
    }
  },
  computed: {
    total_score () {
      return this.selected.reduce((previous, current) => previous + current.score, 0)
    }
  },
  beforeMount () {
    Comm.get('bank/question', {
      params: {
        per_page: 40
      }
    })
      .then(resp => {
        this.questions = resp.data.data
        this.pagination = resp.data.meta.pagination
      })
  },
  methods: {
    submit () {
      if (this.id) {
        this.attachQuestions()
      } else {
        this.createPaper().then(() => this.attachQuestions())
      }
    },
    getOrigin (value) {
      return this.questions[value.id]
    },
    remove (key) {
      this.selected.splice(key, 1)
    },
    swapUp (key) {
      this.selected.splice(key - 1, 2, this.selected[key], this.selected[key - 1])
    },
    swapDown (key) {
      this.selected.splice(key, 2, this.selected[key + 1], this.selected[key])
    },
    createPaper () {
      return new Promise((resolve, reject) => {
        Comm.post('bank/paper', {
          title: this.title
        }).then(resp => {
          this.$store.dispatch('success', '成功建立试题，id : ' + resp.data.id)
          this.id = resp.data.id
          resolve(resp)
        }).catch(error => {
          this.$store.dispatch('except', error)
          reject(error)
        })
      })
    },
    attachQuestions () {
      let questions = this.selected.map((item, key) => {
        return {
          id: item.id,
          score: item.score,
          sequence: key + 1
        }
      })
      return new Promise((resolve, reject) => {
        Comm.post(`bank/paper/${this.id}/attach`, {questions})
          .then(resp => {
            this.$store.dispatch('success', '已添加试题')
            resolve(resp)
          })
          .catch(error => {
            this.$store.dispatch('except', error)
            reject(error)
          })
      })
    }
    // 不能用普通的零时变量交换方式，需要采用上述方式来让 vue 捕捉到 Array 的 mutation
    // https://stackoverflow.com/questions/41857143/vue-js-swap-array-items
  }
}
</script>

<style scoped>
  .icon-center {
    line-height: 100%;
  }

  .question-list {
    max-height: 65vh;
    overflow: scroll;
  }
</style>
