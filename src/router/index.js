import Vue from 'vue'
import Router from 'vue-router'
import Middleware from './middlewares'
import Index from '../views/Index'
import Blank from '../views/Blank'

import Register from '../views/User/Register'
import SignIn from '../views/User/SignIn'
import Profile from '../views/User/Profile'
import Avatar from '../views/User/Avatar'
import Dashboard from '../views/User/Dashboard'

import Question from '../views/Bank/Question'
import Paper from '../views/Bank/Paper'
import Bank from '../views/Bank/Bank'
import QuestionTag from '../views/Bank/QuestionTag'
import NewPaper from '../views/Bank/NewPaper'
import NewQuestion from '../views/Bank/NewQuestion'

import Examination from '../views/Exam/Examination'
import Result from '../views/Exam/Record'

import Notice from '../views/Notice'
import Search from '../views/Search'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {path: '/', name: 'Index', component: Index},
    {path: '/register', name: 'Register', component: Register},
    {path: '/sign-in', alias: '/login', name: 'Sign-in', component: SignIn},
    {path: '/home', name: 'Home', component: Dashboard, meta: {auth: true}},
    {path: '/notice/:id', name: 'Notice', component: Notice, props: true, meta: {auth: true}},
    {
      path: '/search',
      name: 'Search',
      component: Search,
      props: (router) => {
        return router.query
      }
    },
    {
      path: '/user',
      component: Blank,
      redirect: {name: 'Profile'},
      meta: {
        auth: true
      },
      children: [
        {path: 'profile', name: 'Profile', component: Profile},
        {path: 'avatar', name: 'Avatar', component: Avatar}
      ]
    },
    {
      path: '/bank',
      component: Bank,
      redirect: {name: 'Paper'},
      meta: {
        auth: true
      },
      children: [
        {path: 'question-tag/:slug?', name: 'QuestionTag', component: QuestionTag, props: true},
        {path: 'question/:id?', name: 'Question', component: Question, props: true},
        {path: 'paper/:id?', name: 'Paper', component: Paper},
        {path: 'new-paper', name: 'New-Paper', component: NewPaper},
        {path: 'new-question', name: 'New-Question', component: NewQuestion}
      ]
    },
    {
      path: '/examination',
      redirect: {name: 'Examination'},
      component: Blank,
      props: true,
      meta: {
        auth: true
      },
      children: [
        {path: ':id', name: 'Examination', component: Examination, props: true},
        {path: '/record/:id', name: 'Record', component: Result, props: true}
      ]
    }
  ]
})

router.beforeEach(Middleware)

export default router
