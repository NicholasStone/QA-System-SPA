<template>
  <b-row class="p-2">
    <b-col cols="3">
      <b-list-group>
        <b-list-group-item
          v-for="(item, key) in catalog"
          :key="key"
          :to="item.to">
          {{ item.name }}
        </b-list-group-item>
      </b-list-group>
      <div class="mt-2 w-100"/>
      <b-list-group>
        <b-list-group-item
          v-for="(item, key) in options"
          :key="key"
          :to="item.to">
          {{ item.name }}
        </b-list-group-item>
      </b-list-group>
    </b-col>
    <b-col>
      <router-view/>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'Bank',
  data () {
    return {
      catalog: [
        {name: '类型列表', to: {name: 'QuestionTag'}},
        {name: '题库', to: {name: 'QuestionList'}},
        {name: '试卷库', to: {name: 'Paper'}}
      ],
      options: [
        {name: '出新题', to: {name: 'New-Question'}},
        {name: '出新试卷', to: {name: 'New-Paper'}}
      ]
    }
  }
}
</script>

<style scoped>

</style>
