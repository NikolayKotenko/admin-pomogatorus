import Request from "@/services/request";
import Vue from "vue";

export default {
  state: {
    userData: {},
    inserting_component: false,
  },
  getters: {
    stateAuth(state) {
      return Object.keys(state.userData).length !== 0;
    },
    checkAccessMenu(state, getters) {
      // console.log(getters.isAdminGroup);
      if (process.env.NODE_ENV === "development") return true;

      return process.env.NODE_ENV === "production" && getters.isAdminGroup;
    },
    checkAdminPanel() {
      if (!process.env.VUE_APP_SERVER) return false;

      return Boolean(process.env.VUE_APP_SERVER.match("admin"));
    },
    getNameUser(state) {
      return Object.keys(state.userData).length
        ? state.userData.user_data.first_name
        : "";
    },
    isAdminGroup(state) {
      return Object.keys(state.userData).length
        ? state.userData.user_data.is_admin
        : false;
    },
  },
  actions: {
    async validateAuth({ commit }) {
      const response = await Request.post(
        this.state.BASE_URL + "/auth/validate-auth"
      );
      commit("set_user_data", response.data);
      return response;
    },
    async refreshTokens({ commit }) {
      try {
        const tokensData = await Request.post(
          this.state.BASE_URL + "/auth/refresh"
        );
        if (!tokensData) return null;
        commit("set_user_data", tokensData.data);
        return tokensData;
      } catch (e) {
        console.log(e);
        commit("change_notification_modal", e, { root: true });
      }
    },
    async loginUser({ commit }, objData) {
      const tokensData = await Request.post(
        this.state.BASE_URL + "/auth/login",
        objData
      );
      commit("set_user_data", tokensData.data);

      return tokensData;
    },
    async createUserByEmail(_, objData) {
      //Делаем запрос на создание пользователя, если такой есть то будет 409 конфликт ошибка ну и бог с ней
      return await Request.post(
        this.state.BASE_URL + "/users/create-from-only-email",
        objData
      );
    },
    async resendUserPass(_, objData) {
      return await Request.post(
        this.state.BASE_URL + "/users/resend-user-pass",
        objData
      );
    },
    async sendEmail(_, objData) {
      return await Request.post(this.state.BASE_URL + "/email/send", objData);
    },
    async logout({ commit }) {
      const response = await Request.post(this.state.BASE_URL + "/auth/logout");
      commit("set_user_data", {});
      Vue.$cookies.remove("accessToken");
      Vue.$cookies.remove("refreshToken");
      return response;
    },
  },
  mutations: {
    set_user_data(state, result) {
      state.userData = {};
      state.userData = result;

      // if (!result.access_token) return false;
      //
      // console.log("set_user_data accessToken", result.access_token);
      //
      // const arrayToken = result.access_token.split(".");
      // const tokenPayload = JSON.parse(atob(arrayToken[1]));
      // console.log("tokenPayload", tokenPayload);
      //
      // Vue.$cookies.set(
      //   "accessToken",
      //   result.access_token,
      //   new Date(tokenPayload.exp * 1000)
      // );
    },
    changeInsertingComponents(state, value) {
      state.inserting_component = value;
    },
  },
};
