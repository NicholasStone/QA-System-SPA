<template>
  <div class="mt-5 pt-5">
    <b-row align-h="around">
      <b-col cols="3">
        <router-link
          :to="{name: 'Paper'}"
          class="btn btn-block btn-outline-light home-button new-exam border-dark rounded-0">
          去做题
        </router-link>
      </b-col>
      <b-col cols="3">
        <router-link
          :to="{name: 'New-Question'}"
          class="btn btn-block btn-outline-light home-button new-paper border-dark rounded-0">
          去出题
        </router-link>
      </b-col>
      <b-col cols="3">
        <router-link
          :to="{name: 'Examination', params: {id: Math.ceil(Math.random() * 200)}}"
          class="btn btn-block btn-outline-light home-button random-exam border-dark rounded-0">
          手气不错
        </router-link>
      </b-col>
    </b-row>
    <b-row
      class="mt-5 pt-5"
      align-h="center">
      <b-col cols="10">
        <b-card
          no-body
          class="notice"
          header="系统公告">
          <b-list-group flush>
            <b-list-group-item
              v-for="(notice, key) in notices"
              :key="key"
              button
              @click="$router.push({name: 'Notice', params: {id: notice.id}})">
              {{ notice.title }} <span class="float-right text-muted">发布时间: {{ notice.published }}</span>
            </b-list-group-item>
          </b-list-group>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Comm from '../../api/communication'

export default {
  name: 'Dashboard',
  data () {
    return {
      notices: []
    }
  },
  created () {
    Comm.get('/notice').then(resp => {
      this.notices = resp.data.data
    }).catch(error => this.$store.dispatch('except', error))
  }
}
</script>

<style scoped>
  .home-button {
    height: 20vh;
    line-height: 17vh;
    font-size: 2.4rem;
    background-color: #343a40;
  }

  .new-exam:hover {
    background: url('../../../static/image/examination.jpg') no-repeat;
    background-size: 100%;
  }

  .new-paper:hover {
    background: url('../../../static/image/0037037210185297_b.jpg') no-repeat;
    background-size: 100%;
  }

  .random-exam:hover {
    background: url('../../../static/image/68D58PIC9hR_1024.jpg') no-repeat;
    background-size: 100%;
  }

  .notice {
    max-height: 50vh;
  }
</style>
