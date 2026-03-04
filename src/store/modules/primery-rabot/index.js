import Request from "../../../services/request";

export default {
  namespaced: true, // добавили namespace
  state: {
    listEntries: [],
    deleteModal: false,
    entry: {
      id: null,
      code: null,
      name: null,
      description: null,
      seo_title: null,
      seo_description: null,
      seo_keywords: null,
      created_at: null,
      updated_at: null,
      id_image: null,
      _hotspots: [],
      _image: {},
    },
    listNomenclatures: [],
    listFamilies: [],
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
    setEntry(state, object) {
      if (object == null) return false;
      state.entry = object;
    },
    setEntryData(state, data) {
      // новая мутация
      state.entry = { ...state.entry, ...data };
    },
    change_list_nomenclature(state, data) {
      state.listNomenclatures = data;
    },
    change_list_families(state, data) {
      state.listFamilies = data;
    },
    clearEntry(state) {
      state.entry = {
        id: null,
        code: null,
        name: null,
        description: null,
        seo_title: null,
        seo_description: null,
        seo_keywords: null,
        created_at: null,
        updated_at: null,
        id_image: null,
        _hotspots: [],
        _image: {},
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
        const selects = ["*"];
        const query = Request.modifyQuery([], selects);
        const result = await Request.get(
          this.state.BASE_URL + `/entity/specifications${query}`
        );
        commit("changeListEntries", result.data);
        const list = this.state.PrimeryRabot.listEntries;

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
          this.state.BASE_URL + "/entity/specifications",
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
      commit("changeLoadingGeneral", true, { root: true });
      const response = await Request.put(
        this.state.BASE_URL + "/entity/specifications/" + state.entry.id,
        state.entry
      );
      if (response.isError)
        throw new Error(
          "Ошибка put запроса /entity/specifications/state.entry.id - " +
            response.message
        );

      commit("setEntry", response.data);
      commit("changeLoadingGeneral", false, { root: true });
    },
    async deleteEntry({ commit, state }) {
      commit("changeLoadingGeneral", true, { root: true });

      await Request.delete(
        this.state.BASE_URL + "/entity/specifications/" + state.entry.id
      );

      commit("changeLoadingGeneral", false, { root: true });
    },
    async getSetOnceEntry({ commit, state }) {
      commit("changeLoadingGeneral", true, { root: true });

      const selects = ["*"];
      const query = Request.modifyQuery([], selects);
      const response = await Request.get(
        this.state.BASE_URL + `/entity/specifications/${state.entry.id}${query}`
      );
      if (response.isError)
        throw new Error(
          "Ошибка get запроса /entity/specifications/state.entry.id - " +
            response.message
        );

      commit("setEntry", response.data);
      commit("changeLoadingGeneral", false, { root: true });
    },
    async getListNomenclature({ commit, state }) {
      commit("changeLoadingGeneral", true, { root: true });

      const selects = ["*", "_family"];
      const query = Request.modifyQuery([], selects);
      const response = await Request.get(
        `${this.state.BASE_URL}/entity/nomenclature${query}`
      );
      commit("change_list_nomenclature", response.data);

      commit("changeLoadingGeneral", false, { root: true });
    },
    async getListFamilies({ commit, state }) {
      commit("changeLoadingGeneral", true, { root: true });

      const selectQuery = Request.ConstructSelectQuery(["*"]);
      const response = await Request.get(
        `${this.state.BASE_URL}/dictionary/nomenclature-family?${selectQuery}`
      );
      commit("change_list_families", response.data);

      commit("changeLoadingGeneral", false, { root: true });
    },
  },
  getters: {},
};
