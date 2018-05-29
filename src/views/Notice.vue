<template>
  <b-card
    v-if="notice"
    :img-src="notice.image"
    :title="notice.title"
    :sub-title="notice.excerpt"
    img-bottom>
    <div v-html="notice.body.text"/>
    <div class="text-right">
      <b-img
        :src="notice.author.avatar"
        width="45px"/>
      <div>{{ notice.author.name }}</div>
      <div>{{ notice.published }}</div>
    </div>
  </b-card>
  <b-card v-else>
    {{ load }}
  </b-card>
</template>

<script>
import Comm from '../api/communication'

export default {
  name: 'Notice',
  props: {
    id: {
      type: [String, Number],
      required: true,
      default: 0
    }
  },
  data () {
    return {
      notice: null
    }
  },
  computed: {
    load () {
      if (this.notice === null) {
        return '正在加载'
      } else if (!this.notice) {
        return '加载失败'
      }
    }
  },
  created () {
    Comm.get(`/notice/${this.id}`, {
      params: {
        include: ['author', 'body'].join(',')
      }
    }).then(resp => {
      this.notice = resp.data
    }).catch(error => {
      this.notice = false
      this.$store.dispatch('except', error)
    })
  }
}
</script>

<style scoped>

</style>
