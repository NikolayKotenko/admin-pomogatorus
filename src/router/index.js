import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index'

/* VIEWS */
import Desktop from "../views/Desktop";
import Companies from "../views/Companies"
import Questions from "../views/Questions";
import Articles from "../views/Articles";

/* COMPONENTS */
import DetailQuestion from "../components/questions/DetailQuestion";
import DetailArticles from "../components/articles/DetailArticles";

import Question from "../components/frontLayouts/Question";

import LoginAuth from "../components/auth/LoginAuth";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Desktop',
    component: Desktop,
    meta: {
      ru_name: 'Рабочий стол',
      requiresAuth: true,
    },
  },
  {
    path: '/companies',
    name: 'Companies',
    component: Companies,
    meta: {
      ru_name: 'Компании',
      requiresAuth: true,
    },
  },
  {
    path: '/question',
    name: 'Question',
    component: Question,
    meta: {
      ru_name: 'Вопрос',
      requiresAuth: true,
    },
  },
  {
    path: '/questions',
    name: 'Questions',
    component: Questions,
    meta: {
      ru_name: 'Список вопросов',
      requiresAuth: true,
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
      requiresAuth: true,
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
      requiresAuth: true,
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
      requiresAuth: true,
      returnLink: {
        name: 'Articles',
        path: '/articles'
      }
    },
  },
  {
    path: '/login/',
    name: 'login',
    component: LoginAuth,
    meta: {
      visible_front: false,
      ru_name: 'Авторизация',
    }
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
});

router.beforeEach(async (to, from, next) => {
    //Если валидация на этом компоненте не нужна - пропускаем
    if(! to.matched.some(record => record.meta.requiresAuth))
      next()

    //Если есть параметр из email письма с авторизацией то аутентифицируем (пишем в userData)
    if (to.query.userEmail)
      await store.dispatch('loginUser', {'userEmail': to.query.userEmail})

    //Проверяем на пустоту массив userData
    if (! store.getters.stateAuth)
      next('/login')

    next()
});

export default router
