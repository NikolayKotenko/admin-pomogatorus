import Request from "../../../services/request";

export default {
  namespaced: true, // добавили namespace
  state: {
    listStocks: [],
    deleteModal: false,
    entry: {
      id: null,
      name: null,
      code: null,
      purpose: null,
      description: null,
      end_date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      activity: false,
      ids_families: [],
      ids_brands: [],
      _brands: [],
      _brands_names: [],
      _images: [],
    },
  },
  mutations: {
    changeListEntries(state, array) {
      state.listStocks = [];
      if (Array.isArray(array)) {
        state.listStocks = array;
      } else {
        state.listStocks = Object.values(array);
      }
    },
    setEntry(state, object) {
      if (object == null) return false;
      state.entry = object;
    },
    setEntryData(state, data) {
      // новая мутация
      state.entry = { ...state.entry, ...data };
    },
    clearEntry(state) {
      state.entry = {
        id: null,
        name: null,
        code: null,
        purpose: null,
        description: null,
        end_date: null,
        activity: false,
        ids_families: [],
        ids_brands: [],
        _brands: [],
        _brands_names: [],
        _images: [],
      };
    },
    deleteModalCommit(state, value) {
      state.deleteModal = value;
    },
  },
  actions: {
    clearEntry({ commit }) {
      commit("clearEntry");
    },
    stateModalAction({ commit }, value) {
      commit("deleteModalCommit", value);
    },
    async getListEntries({ commit }, id) {
      commit("changeLoadingGeneral", true, { root: true });

      try {
        const selects = ["*", "_brands"];
        const query = Request.modifyQuery([], selects);
        const result = await Request.get(
          this.state.BASE_URL + `/entity/stocks${query}`
        );
        commit("changeListEntries", result.data);
        const list = this.state.Stocks.listStocks;

        const getEntry = () => {
          if (id) {
            return list.find((elem) => elem.id == id);
          }
        };
        commit("setEntry", getEntry());
      } catch (e) {
        console.log(e);
        commit("change_notification_modal", e, { root: true });
      }
      commit("changeLoadingGeneral", false, { root: true });
    },
    async createEntry({ commit, state }) {
      commit("changeLoadingGeneral", true, { root: true });
      try {
        const response = await Request.post(
          this.state.BASE_URL + "/entity/stocks",
          state.entry
        );
        commit("setEntry", response.data);
        commit("changeLoadingGeneral", false, { root: true });
        return response;
      } catch (e) {
        console.log(e);
        commit("change_notification_modal", e, { root: true });
        commit("changeLoadingGeneral", false, { root: true });
      }
    },
    async updateEntry({ commit, state }) {
      try {
        return await Request.put(
          this.state.BASE_URL + "/entity/stocks/" + state.entry.id,
          state.entry
        );
      } catch (e) {
        console.log(e);
        commit("change_notification_modal", e, { root: true });
      }
    },
    async deleteEntry({ commit, state }) {
      commit("changeLoadingGeneral", true, { root: true });

      await Request.delete(
        this.state.BASE_URL + "/entity/stocks/" + state.entry.id
      );

      commit("changeLoadingGeneral", false, { root: true });
    },
  },
  getters: {},
};
