<template>
  <b-row v-if="tags.length">
    <b-card
      v-for="(item, key) in tags"
      :key="key"
      :title="item.title"
      :sub-title="item.user.name +' 创建于 '+ item.created"
      class="mb-2 col-10">
      <p>{{ item.description }}</p>
    </b-card>
  </b-row>
  <alert
    v-else
    :alerts="{type: 'danger', message: '查询的类型不存在', index: 0, expire: false, local: true}"/>
</template>

<script>
import Alert from '../../components/alert'
import Comm from '../../api/communication'

export default {
  name: 'QuestionTag',
  components: {
    alert: Alert
  },
  props: {
    slug: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      tags: []
    }
  },
  beforeMount () {
    let url = '/bank/question-tag'
    if (this.slug !== '') {
      this.url += this.slug
    }
    Comm.get(url, {
      params: {
        include: 'user'
      }
    })
      .then(resp => {
        if (resp.data.data) {
          this.tags = resp.data.data
        } else {
          this.tags.push(resp.data)
        }
      })
  }
}
</script>

<style scoped>

</style>
