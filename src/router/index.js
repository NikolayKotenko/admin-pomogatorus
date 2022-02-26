import Vue from 'vue'
import VueRouter from 'vue-router'
import Desktop from "../views/Desktop";
import Companies from "../views/Companies"
import Questions from "../views/Questions";
import DetailQuestion from "../components/questions/DetailQuestion";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Desktop',
    component: Desktop
  },
  {
    path: '/companies',
    name: 'Companies',
    component: Companies,
    meta: {
      ru_name: 'Компании'
    },
  },
  {
    path: '/questions',
    name: 'Questions',
    component: Questions,
    meta: {
      ru_name: 'Список вопросов'
    },
  },
  {
    path: '/questions/:action/',
    name: 'DetailQuestion',
    component: DetailQuestion,
    meta: {
      ru_name: 'Вопрос'
    },
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
