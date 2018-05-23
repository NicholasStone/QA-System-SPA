import Vue from 'vue'
import Router from 'vue-router'
import Middleware from './middlewares'
import Index from '../views/Index'
import Register from '../views/Register'
import SignIn from '../views/SignIn'
import Blank from '../views/Blank'
import Profile from '../views/Profile'
import Avatar from '../views/Avatar'
import Dashboard from '../views/Dashboard'
import QuestionList from '../views/QuestionList'
import Paper from '../views/Paper'
import Bank from '../views/Bank'
import QuestionTag from '../views/QuestionTag'
import NewPaper from '../views/NewPaper'
import NewQuestion from '../views/NewQuestion'
Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {path: '/', name: 'Index', component: Index},
    {path: '/register', name: 'Register', component: Register},
    {path: '/sign-in', alias: '/login', name: 'Sign-in', component: SignIn},
    {path: '/home', name: 'Home', component: Dashboard, meta: {auth: true}},
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
      meta: {
        auth: true
      },
      children: [
        {path: 'question-tag/:slug?', name: 'QuestionTag', component: QuestionTag, props: true},
        {path: 'question/:id?', name: 'QuestionList', component: QuestionList, props: true},
        {path: 'paper/:id?', name: 'Paper', component: Paper},
        {path: 'new-paper', name: 'New-Paper', component: NewPaper},
        {path: 'new-question', name: 'New-Question', component: NewQuestion}
      ]
    }
  ]
})

router.beforeEach(Middleware)

export default router
