import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store/index";

/* VIEWS */
import Desktop from "../views/Desktop";
import Companies from "../views/Companies";
import Questions from "../views/Questions";
import Articles from "../views/Articles";
import Answers from "../views/Answers";

/* COMPONENTS */
import DetailQuestion from "../components/questions/DetailQuestion";
import DetailArticles from "../components/articles/DetailArticles";

import Question from "../components/frontLayouts/Question";

import LoginAuth from "../components/auth/LoginAuth";
import Logging from "@/services/logging";
import DetailTag from "@/components/tags/DetailTag";
import DetailUser from "@/components/users/DetailUser";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Desktop",
    component: Desktop,
    meta: {
      title: 'Рабочий стол',
      ru_name: 'Рабочий стол',
      requiresAuth: true,
    },
  },
  {
    path: "/companies",
    name: "Companies",
    component: Companies,
    meta: {
      title: 'Компании',
      ru_name: 'Компании',
      requiresAuth: true,
    },
  },
  {
    path: "/question",
    name: "Question",
    component: Question,
    meta: {
      title: 'Вопрос',
      ru_name: 'Вопрос',
      requiresAuth: true,
    },
  },
  {
    path: '/questions',
    name: 'Questions',
    component: Questions,
    meta: {
      title: 'Список вопросов',
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
      title: 'Вопросы',
      ru_name: 'Вопросы',
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
      title: 'Список статей',
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
      title: 'Статья',
      ru_name: 'Статья',
      requiresAuth: true,
      returnLink: {
        name: "Articles",
        path: "/articles",
      },
    },
  },
  {
    path: '/tags/:id?/',
    name: 'DetailTag',
    component: DetailTag,
    meta: {
      title: 'Создание/редактирование тэга',
      ru_name: 'Создание/редактирование тэга',
      requiresAuth: true,
      canCreate: true,
      canEdit: true,
      canView: true,
      createLink: {
        name: 'DetailTag',
        query: {action: 'create'},
      },
      editLink: {
        name: 'DetailTag',
        params: {action: 'edit'},
        query: {id: null},
      },
      returnLink: {
        name: 'Tags',
        path: '/tags'
      }
    },
  },
  {
    path: '/users/:id?',
    name: 'DetailUser',
    component: DetailUser,
    meta: {
      title: 'Просмотр/назначение пользователя',
      ru_name: 'Просмотр/назначение пользователя',
      requiresAuth: true,
      canCreate: true,
      canEdit: true,
      canView: true,
      createLink: {
        name: 'DetailUser',
        query: {action: 'create'},
      },
      editLink: {
        name: 'DetailUser',
        params: {action: 'edit'},
        query: {id: null},
      },
      returnLink: {
        name: 'Users',
        path: '/users'
      }
    },
  },
  {
    path: '/login/',
    name: 'login',
    component: LoginAuth,
    meta: {
      visible_front: false,
      title: 'Авторизация',
      ru_name: 'Авторизация',
    }
  },
  {
    path: '/answers',
    name: 'Answers',
    component: Answers,
    meta: {
      title: 'Ответы пользователей',
      ru_name: 'Ответы пользователей',
      requiresAuth: true,
      canCreate: false,
      // createLink: {
      //   name: 'DetailQuestion',
      //   params: {action: 'create'},
      // },
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
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
    document.title = to.meta.title;

    //Если валидация на этом компоненте не нужна - пропускаем
    if(! to.matched.some(record => record.meta.requiresAuth))
      next()

  //Если есть параметр из email письма с авторизацией то аутентифицируем (пишем в userData)
  if (to.query.userEmail)
    await store.dispatch("loginUser", { userEmail: to.query.userEmail });

  // console.group('tokens')
  //   console.log("Vue.$cookies.get('accessToken') === null - ", Vue.$cookies.get('accessToken') === null)
  //   console.log('process.env.NODE_ENV -', process.env.NODE_ENV)
  // console.groupEnd()

  if (process.env.NODE_ENV === "production") {
    if (Vue.$cookies.get("accessToken") === null) {
      const refreshResponse = await store.dispatch("refreshTokens");
      if (!refreshResponse) next("/login");
      if (Logging.checkExistErr(refreshResponse)) next("/login");
    }
  }

  next();
});

export default router;
