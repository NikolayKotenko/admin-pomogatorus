import Request from "../../../services/request";

export default {
  state: {
    showDetailAnswer: false,
    listAnswers: [],
    loadingList: false,
    showFilters: false,
    listVariables: [],
  },
  mutations: {
    changeShowDetailAnswer(state, value) {
      state.showDetailAnswer = value;
    },
    changeShowFilters(state, value) {
      state.showFilters = value;
    },
    changeListAnswers(state, array) {
      state.listAnswers = [];
      if (Array.isArray(array)) {
        state.listAnswers = array;
      } else {
        state.listAnswers = Object.values(array);
      }
    },
    changeLoadingList(state, value) {
      state.loadingList = value;
    },
    changeListVariables(state, array) {
      state.listVariables = array;
    },
  },
  actions: {
    async getListVariables({ commit }, query) {
      commit("changeLoadingList", true);

      try {
        const result = await Request.get(
          `${this.state.BASE_URL}/entity/answers/search/{q}?q=${query}`
        );
        commit("changeListVariables", result.data);
      } catch (e) {
        console.log(e);
        commit("change_notification_modal", e, { root: true });
      }

      commit("changeLoadingList", false);
    },
    async getListAnswers({ commit }, params) {
      commit("changeLoadingList", true);

      const { queryObj, date, sort } = params;

      const filter = {};

      let queryName = "";
      let queryValue = "";

      if (queryObj) {
        const { query } = queryObj;
        let values = query.split("=");
        queryName = values[0];
        queryValue = values[1];
        filter[`filter[${queryName}]`] = queryValue;
      }

      if (date) {
        filter[`filter[created_at]`] = date;
      }

      if (sort) {
        const queryName = Object.keys(sort)[0];
        filter[`sort[${queryName}]`] = sort[queryName];
      }

      console.log(filter);

      try {
        const result = await Request.get(
          this.state.BASE_URL + "/entity/answers",
          filter
        );
        commit("changeListAnswers", result.data);
      } catch (e) {
        console.log(e);
        commit("change_notification_modal", e, { root: true });
      }
      commit("changeLoadingList", false);
    },
  },
  getters: {},
};
