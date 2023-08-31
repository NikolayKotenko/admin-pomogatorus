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
import ObjectProperties from "@/components/object-properties/ObjectProperties";
import Dictionaries from "@/components/dictionaries/Dictionaries";
import NomenclatureForm from "@/components/nomenclatures/NomenclatureForm";
import Family from "@/components/nomenclatures/Family";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Desktop",
    component: Desktop,
    meta: {
      title: "Рабочий стол",
      ru_name: "Рабочий стол",
      requiresAuth: true,
    },
  },
  {
    path: "/companies",
    name: "Companies",
    component: Companies,
    meta: {
      title: "Компании",
      ru_name: "Компании",
      requiresAuth: true,
    },
  },
  {
    path: "/question",
    name: "Question",
    component: Question,
    meta: {
      title: "Вопрос",
      ru_name: "Вопрос",
      requiresAuth: true,
    },
  },
  {
    path: "/questions",
    name: "Questions",
    component: Questions,
    meta: {
      title: "Список вопросов",
      ru_name: "Список вопросов",
      requiresAuth: true,
      canCreate: true,
      createLink: {
        name: "DetailQuestion",
        params: { action: "create" },
      },
    },
  },
  {
    path: "/questions/:action/",
    name: "DetailQuestion",
    component: DetailQuestion,
    meta: {
      title: "Вопрос",
      ru_name: "Вопрос",
      requiresAuth: true,
      returnLink: {
        ru_name: "Список вопросов",
        name: "Questions",
        path: "/questions",
      },
    },
  },
  {
    path: "/articles",
    name: "Articles",
    component: Articles,
    meta: {
      title: "Список статей",
      ru_name: "Список статей",
      requiresAuth: true,
      canCreate: true,
      createLink: {
        name: "DetailArticles",
        params: { action: "create" },
      },
    },
  },
  {
    path: "/articles/:action/",
    name: "DetailArticles",
    component: DetailArticles,
    meta: {
      title: "Статья",
      ru_name: "Статья",
      requiresAuth: true,
      returnLink: {
        ru_name: "Список статей",
        name: "Articles",
        path: "/articles",
      },
    },
  },
  {
    path: "/tags/:id?/",
    name: "DetailTag",
    component: DetailTag,
    meta: {
      title: "Тэги",
      ru_name: "Тэги",
      singleComponent: true,
      requiresAuth: true,
      canCreate: true,
      canEdit: true,
      canView: true,
      canDelete: true,
      createLink: {
        name: "DetailTag",
        query: { action: "create" },
      },
      editLink: {
        name: "DetailTag",
        params: { action: "edit" },
        query: { id: null },
      },
      returnLink: {
        ru_name: "Тэги",
        name: "Tags",
        path: "/tags",
      },
      deleteLink: {
        name: "Tags",
        path: "/tags",
        actionModalAsk: "stateModalAction",
      },
    },
  },
  {
    path: "/object-properties/:code?/",
    name: "ObjectProperties",
    component: ObjectProperties,
    meta: {
      title: "Параметр",
      ru_name: "Параметр",
      singleComponent: true,
      requiresAuth: true,
      canCreate: true,
      canEdit: true,
      canView: true,
      canDelete: true,
      createLink: {
        name: "ObjectProperties",
        query: { action: "create" },
      },
      editLink: {
        name: "ObjectProperties",
        params: { action: "edit" },
        query: { code: null },
      },
      returnLink: {
        ru_name: "Параметры объекта",
        name: "ObjectProperties",
        path: "/object-properties",
      },
      deleteLink: {
        name: "ObjectProperties",
        path: "/object-properties",
        actionModalAsk: "ObjectPropertiesModule/stateModalAction",
      },
    },
  },
  {
    path: "/dictionaries/:code?/",
    name: "Dictionaries",
    component: Dictionaries,
    meta: {
      title: "Справочники",
      ru_name: "Справочники",
      singleComponent: true,
      requiresAuth: true,
      canCreate: true,
      canEdit: true,
      canView: true,
      canDelete: true,
      createLink: {
        name: "Dictionaries",
        query: { action: "create" },
      },
      editLink: {
        name: "Dictionaries",
        params: { action: "edit" },
        query: { code: null },
      },
      returnLink: {
        ru_name: "Справочники",
        name: "Dictionaries",
        path: "/dictionaries",
      },
      deleteLink: {
        name: "Dictionaries",
        path: "/dictionaries",
        actionModalAsk: "DictionariesModule/stateModalAction",
      },
    },
  },
  {
    path: "/users/:id?",
    name: "DetailUser",
    component: DetailUser,
    meta: {
      title: "Пользователи",
      ru_name: "Пользователи",
      singleComponent: true,
      requiresAuth: true,
      canCreate: true,
      canEdit: true,
      canView: true,
      canDelete: true,
      createLink: {
        name: "DetailUser",
        query: { action: "create" },
      },
      editLink: {
        name: "DetailUser",
        params: { action: "edit" },
        query: { id: null },
      },
      returnLink: {
        ru_name: "Пользователи",
        name: "Users",
        path: "/users",
      },
      deleteLink: {
        name: "Tags",
        path: "/tags",
        actionModalAsk: "UsersModule/stateModalAction",
      },
    },
  },
  {
    path: "/nomenclatures/:id?",
    name: "NomenclatureForm",
    component: NomenclatureForm,
    meta: {
      title: "Номенклатура",
      ru_name: "Номенклатура",
      singleComponent: true,
      requiresAuth: true,
      canCreate: true,
      canEdit: true,
      canView: true,
      canDelete: true,
      createLink: {
        name: "NomenclatureForm",
        query: {action: "create"},
      },
      editLink: {
        name: "NomenclatureForm",
        params: {action: "edit"},
        query: {id: null},
      },
      returnLink: {
        ru_name: "Номенклатура",
        name: "Nomenclatures",
        path: "/nomenclatures",
      },
      deleteLink: {
        name: "Tags",
        path: "/tags",
      },
    },
  },
  {
    path: "/family/:id?",
    name: "Family",
    component: Family,
    meta: {
      title: "Номенклатура",
      ru_name: "Номенклатура",
      singleComponent: true,
      requiresAuth: true,
      canCreate: true,
      canEdit: true,
      canView: true,
      canDelete: true,
      createLink: {
        name: "Family",
        query: {action: "create"},
      },
      editLink: {
        name: "Family",
        params: {action: "edit"},
        query: {id: null},
      },
      returnLink: {
        ru_name: "Номенклатура",
        name: "Family",
        path: "/family",
      },
      deleteLink: {
        name: "Family",
        path: "/family",
      },
    },
  },
  {
    path: "/login/",
    name: "login",
    component: LoginAuth,
    meta: {
      visible_front: false,
      title: "Авторизация",
      ru_name: "Авторизация",
    },
  },
  {
    path: "/answers",
    name: "Answers",
    component: Answers,
    meta: {
      title: "Ответы пользователей",
      ru_name: "Ответы пользователей",
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
  if (!to.matched.some((record) => record.meta.requiresAuth)) next();

  //Если есть параметр из email письма с авторизацией то аутентифицируем (пишем в
  // )
  if (to.query.userEmail)
    await store.dispatch("loginUser", { userEmail: to.query.userEmail });

  // console.group('tokens')
  //   console.log("Vue.$cookies.get('accessToken') === null - ", Vue.$cookies.get('accessToken') === null)
  //   console.log('process.env.NODE_ENV -', process.env.NODE_ENV)
  // console.groupEnd()

  if (process.env.NODE_ENV === "production") {
    // Если access кука пустая вызываем обновление токенов
    if (Vue.$cookies.get("accessToken") === null) {
      const refreshResponse = await store.dispatch("refreshTokens");
      if (!refreshResponse) next("/login");
      if (Logging.checkExistErr(refreshResponse)) next("/login");
    } else {
      // Если пустой объект в сторе с пользовательскими данными, вызываем проверку
      // console.log("store.getters.stateAuth", store.getters.stateAuth);
      if (!store.getters.stateAuth) {
        const validateAuth = await store.dispatch("validateAuth");
        if (Logging.checkExistErr(validateAuth)) next("/login");
      }
    }

    // Если в пользовательских данных группа не админа то на логин
    if (!store.getters.isAdminGroup) next("/login");
  }

  next();
});

export default router;
