<template>
  <div>
    <b-form @submit.prevent="submit">
      <b-form-group
        id="paper-title-group"
        horizontal
        label-cols="2"
        breakpoint="md"
        label="试卷标题"
        label-for="paper-title">
        <b-form-input
          id="paper-title"
          v-model="title"
          type="text"/>
      </b-form-group>
      <b-form-row>
        <b-col cols="2">
          加入的题目
        </b-col>
        <b-col>
          <b-row
            v-for="(id, key) in selected"
            :key="key"
          >
            <b-col cols="2">
              <p class="pl-1 pt-3 mb-3"> 第 {{ key+1 }} 题 </p>
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
            </b-col>
            <b-col>
              <question :question="getOrigin(id)"/>
            </b-col>
          </b-row>
        </b-col>
      </b-form-row>
      <b-button
        v-b-modal="'question-list'"
        class="offset-2 col-10"
        variant="outline-primary"
        block>
        添加新题目
      </b-button>
      <b-button
        class="offset-2 mt-2"
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
            :value="item.id"
            v-model="selected">
            <p>
              试题编号 {{ item.id }}
            </p>
            <question :question="item"/>
          </b-form-checkbox>
        </b-container>
        <div
          slot="modal-footer"
          class="modal-footer">
          已选择题目编号 {{ selected.join(' , ') }}
        </div>
      </b-modal>
    </b-form>
  </div>

</template>

<script>
import Comm from '../api/communication'
import Question from '../components/question'
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
  data () {
    return {
      title: '',
      questions: [],
      pagination: null,
      selected: []
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
      Comm.post('bank/paper', {})
    },
    getOrigin (value) {
      return this.questions[value]
    },
    remove (key) {
      this.selected.splice(key, 1)
    },
    swapUp (key) {
      this.selected.splice(key - 1, 2, this.selected[key], this.selected[key - 1])
    },
    swapDown (key) {
      this.selected.splice(key, 2, this.selected[key + 1], this.selected[key])
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
