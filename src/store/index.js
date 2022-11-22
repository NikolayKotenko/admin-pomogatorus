import Vue from "vue";
import Vuex from "vuex";
// Modules import
import QuestionsModule from "./modules/questions";
import ArticleModule from "./modules/article";
import AuthModule from "./modules/auth";
import AnswersModule from "./modules/answers";
import TagsModule from "./modules/tags";
import UsersModule from "./modules/users";
import Request from "../services/request";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    BASE_URL:
      process.env.NODE_ENV === "development"
        ? "https://api-test.agregatorus.com"
        : "https://api.agregatorus.com",
    notification_modal: {
      show_notification: false,
      error: false,
      message: "",
    },
    cur_num: 0,
    loadingAgents: false,
    listAgents: [],
    loadingRequestGeneral: false,
    emailRules: [
      (v) => !!v || "Обязательное для заполнение поле",
      (v) => /.+@.+/.test(v) || "E-mail должен быть валидным.",
    ],
    nameRules: [(v) => !!v || "Обязательное для заполнение поле"],
  },
  mutations: {
    change_notification_modal(state, value) {
      state.notification_modal.show_notification = true;
      state.notification_modal.message = value.message;
      state.notification_modal.error = value.error;
    },
    change_cur_num(state, value) {
      state.cur_num = value;
    },
    changeListAgents(state, array) {
      state.listAgents = array;
    },
    changeLoadingAgents(state, value) {
      state.loadingAgents = value;
    },
    changeLoadingGeneral(state, value) {
      state.loadingRequestGeneral = value;
    },
  },
  actions: {
    async getListAgents({ commit }) {
      commit("changeLoadingAgents", true);

      try {
        const result = await Request.get(
          `${this.state.BASE_URL}/users/get-list-users`,
          { "filter[is_agent]": true }
        );
        commit("changeListAgents", result.data);
      } catch (e) {
        console.log(e);
        commit("change_notification_modal", e, { root: true });
      }

      commit("changeLoadingAgents", false);
    },
    deleteFileGeneral({ state }, id) {
      state.loadingRequestGeneral = true;
      const response = Request.delete(
        this.state.BASE_URL + "/entity/files/" + id
      );
      state.loadingRequestGeneral = false;
      return response;
    },
    setTitle(_, title) {
      // console.log('setTitle title = ', title)
      if (!title) return false;
      if (document.title.match(">")) return false;

      const dynamicTitle = title ? " > " + title : "";
      document.title = document.title + dynamicTitle;
    },
  },
  getters: {
    stateEditCreate: () => (action) => {
      return ["create", "edit"].includes(action);
    },
  },
  modules: {
    QuestionsModule,
    ArticleModule,
    AuthModule,
    AnswersModule,
    TagsModule,
    UsersModule,
  },
});
