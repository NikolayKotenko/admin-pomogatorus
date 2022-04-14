import Vue from 'vue'
import VueRouter from 'vue-router'
import AuthStore from '../store/modules/auth/index'

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

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    console.log('start beforeEach')
      if (Object.keys(AuthStore.state.userData).length !== 0) {
        console.log('vse chetko prohodi')
        next();
      } else {
        next('/login')
      }
    // if (store.getters.isLoggedIn) {
    //     next();
    //     return
    // }
    // next('/login')
  } else {
    next()
  }
});

export default router
