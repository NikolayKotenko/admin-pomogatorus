import Request from "../../../services/request";

export default {
  namespaced: true,
  state: {
    listEntries: [],
    loadingList: false,
    deleteModal: false,
    entry: {
      id: null,
      code: null,
      name: null,
    },
    listPropertyObject: [],
    listTags: [],
  },
  mutations: {
    changeListEntries(state, array) {
      state.listEntries = [];
      if (Array.isArray(array)) {
        state.listEntries = array;
      } else {
        state.listEntries = Object.values(array);
      }
    },
    setListPropertyObject(state, array) {
      state.listPropertyObject = [];
      if (Array.isArray(array)) {
        state.listPropertyObject = array;
      } else {
        state.listPropertyObject = Object.values(array);
      }
    },
    setListTags(state, array) {
      state.listTags = [];
      state.listTags = array;
    },
    setEntry(state, object) {
      if (object == null) return false;

      state.entry = object;
    },
    clearEntry(state) {
      state.entry = {
        id: null,
        code: null,
        name: null,
      };
    },
    changeLoadingList(state, value) {
      state.loadingList = value;
    },
    deleteModalCommit(state, value) {
      state.deleteModal = value;
    },
  },
  actions: {
    stateModalAction({ commit }, value) {
      commit("deleteModalCommit", value);
    },
    clearEntry({ commit }) {
      commit("clearEntry");
    },
    async deleteEntry({ commit, dispatch }) {
      //START
      commit("changeLoadingList", true);
      commit("deleteModalCommit", false);

      await Request.delete(
        this.state.BASE_URL +
          "/dictionary/dictionaries/" +
          this.state.DictionariesModule.entry.code
      );
      await dispatch("getListEntries");
      commit("clearEntry");

      //END
      commit("changeLoadingList", false);
    },
    async onSubmit({ commit, dispatch }) {
      if (this.state.DictionariesModule.entry.name == null) return false;

      //START
      commit("changeLoadingList", true);

      let response = null;
      if (location.search.match("create")) {
        response = await dispatch("createEntry");
      } else {
        response = await dispatch(
          "updateEntry",
          this.state.DictionariesModule.entry
        );
      }
      await dispatch("getListEntries", response.data.code);

      //END
      commit("changeLoadingList", false);
    },
    async createEntry({ commit }) {
      try {
        return await Request.post(
          this.state.BASE_URL + "/dictionary/dictionaries",
          this.state.DictionariesModule.entry
        );
      } catch (e) {
        console.log(e);
        commit("change_notification_modal", e, { root: true });
      }
    },
    async updateEntry({ commit }, objRequest) {
      try {
        return await Request.put(
          this.state.BASE_URL +
            "/dictionary/dictionaries/" +
            objRequest.code,
          objRequest
        );
      } catch (e) {
        console.log(e);
        commit("change_notification_modal", e, { root: true });
      }
    },
    async getListEntries({ commit }, code) {
      commit("changeLoadingList", true);

      try {
        const result = await Request.get(
          this.state.BASE_URL + "/dictionary/dictionaries"
        );
        commit("changeListEntries", result.data);
        const listEntries = this.state.DictionariesModule.listEntries;

        const getLocalEntry = () => {
          if (code) {
            return listEntries.find((elem) => elem.code == code);
          }
        };
        commit("setEntry", getLocalEntry());
      } catch (e) {
        console.log(e);
        commit("change_notification_modal", e, { root: true });
      }
      commit("changeLoadingList", false);
    },
    async getEntry(_, code) {
      return await Request.get(
        this.state.BASE_URL + "/dictionary/dictionaries/" + code
      );
    },
    async getInfoByEntry({ commit, dispatch }) {
      const responsePropertyObject = await Request.get(
        this.state.BASE_URL + "/dictionary/property-object"
      );
      const responseTags = await dispatch(
        "getUniversalListTag",
        "?filter[flag_engineering_system]=true",
        { root: true }
      );
      commit("setListPropertyObject", responsePropertyObject.data);
      commit("setListTags", responseTags.data);
    },
  },
  getters: {},
};
