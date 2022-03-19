import Vue from 'vue'
import VueRouter from 'vue-router'

/* VIEWS */
import Desktop from "../views/Desktop";
import Companies from "../views/Companies"
import Questions from "../views/Questions";
import Articles from "../views/Articles";

/* COMPONENTS */
import DetailQuestion from "../components/questions/DetailQuestion";
import DetailArticles from "../components/articles/DetailArticles";

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
      ru_name: 'Компании',
    },
  },
  {
    path: '/questions',
    name: 'Questions',
    component: Questions,
    meta: {
      ru_name: 'Список вопросов',
      canCreate: true,
      createLink: {
        name: 'DetailQuestion',
        params: {action: 'create'},
      },
    },
  },
  {
    path: '/questions/:action/',
    name: 'DetailQuestion',
    component: DetailQuestion,
    meta: {
      ru_name: 'Вопрос',
      returnLink: {
        name: 'Questions',
        path: '/questions'
      }
    },
  },
  {
    path: '/articles',
    name: 'Articles',
    component: Articles,
    meta: {
      ru_name: 'Список статей',
      canCreate: true,
      createLink: {
        name: 'DetailArticles',
        params: {action: 'create'},
      },
    },
  },
  {
    path: '/articles/:action/',
    name: 'DetailArticles',
    component: DetailArticles,
    meta: {
      ru_name: 'Статья',
      returnLink: {
        name: 'Articles',
        path: '/articles'
      }
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
