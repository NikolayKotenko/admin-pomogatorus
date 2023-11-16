import Request from "../../../services/request";

export default {
  namespaced: true,
  state: {
    listEntries: [],
    listCharacteristic: [],
    listTypes: [],
    listBrands: [],
    loadingList: false,
    deleteModal: false,
    entry: {
      id: null,
      name: null,
      code: null,
      description: null,
      type: null,
      brand: null,
      tag: null,
      characteristics: [],
      e_client_files: [],
      photos: [],
    },
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
    changeListTypes(state, array) {
      state.listTypes = [];
      if (Array.isArray(array)) {
        state.listTypes = array;
      } else {
        state.listTypes = Object.values(array);
      }
    },
    changeListBrands(state, array) {
      state.listBrands = [];
      if (Array.isArray(array)) {
        state.listBrands = array;
      } else {
        state.listBrands = Object.values(array);
      }
    },
    setListCharacteristics(state, array) {
      state.listCharacteristic = [];
      if (Array.isArray(array)) {
        state.listCharacteristic = array;
      } else {
        state.listCharacteristic = Object.values(array);
      }
    },
    setEntry(state, object) {
      if (object == null) return false;

      state.entry = object;
    },
    clearEntry(state) {
      state.entry = {
        id: null,
        name: null,
        code: null,
        type: null,
        description: null,
        tag: null,
        characteristics: [],
        e_client_files: [],
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
      commit("changeLoadingList", true);
      commit("deleteModalCommit", false);

      await Request.delete(
        this.state.BASE_URL +
          "/dictionary/nomenclature-family/" +
          this.state.FamiliesModule.entry.id
      );

      await dispatch("getListEntries");
      commit("clearEntry");

      commit("changeLoadingList", false);
    },
    async onSubmit({ commit, dispatch }) {
      if (this.state.FamiliesModule.entry.name === null) {
        return false;
      }

      commit("changeLoadingList", true);

      let response = null;

      if (location.search.match("create")) {
        response = await dispatch("createEntry");
        commit(
          "change_notification_modal",
          { error: false, message: "Семейство создано" },
          { root: true }
        );
      } else {
        response = await dispatch(
          "updateEntry",
          this.state.FamiliesModule.entry
        );
        commit(
          "change_notification_modal",
          { error: false, message: "Семейство обновлено" },
          { root: true }
        );
      }

      await dispatch("getListEntries", response.data.id);

      commit("changeLoadingList", false);
    },
    async createEntry({ commit }) {
      try {
        let resp = await Request.post(
          this.state.BASE_URL + "/dictionary/nomenclature-family",
          this.state.FamiliesModule.entry
        );

        return resp;
      } catch (e) {
        console.log(e);
        console.log(e.stack);
        commit("change_notification_modal", e, { root: true });
      }
    },
    async updateEntry({ commit }, objRequest) {
      try {
        let resp = await Request.put(
          this.state.BASE_URL +
            "/dictionary/nomenclature-family/" +
            objRequest.id,
          objRequest
        );
        console.log(objRequest);

        return resp;
      } catch (e) {
        console.log(e);
        console.log(e.stack);
        commit("change_notification_modal", e, { root: true });
      }
    },
    async getListEntries({ commit }, id) {
      commit("changeLoadingList", true);

      try {
        const result = await Request.get(
          this.state.BASE_URL + "/dictionary/nomenclature-family"
        );

        commit("changeListEntries", result.data);
        const listEntries = this.state.FamiliesModule.listEntries;

        const getLocalEntry = () => {
          if (id) {
            return listEntries.find((elem) => elem.id == id);
          }
        };
        commit("setEntry", getLocalEntry());
      } catch (e) {
        console.log(e);
        commit("change_notification_modal", e, { root: true });
      }
      commit("changeLoadingList", false);
    },
    async getListTypes({ commit }) {
      commit("changeLoadingList", true);

      try {
        const result = await Request.get(
          this.state.BASE_URL + "/dictionary/family-types"
        );
        commit("changeListTypes", result.data);
      } catch (e) {
        console.log(e);
        commit("change_notification_modal", e, { root: true });
      }
      commit("changeLoadingList", false);
    },
    // async getListBrands({commit}) {
    //     commit("changeLoadingList", true);
    //     let filter = {
    //         flag_brands: true,
    //             flag_service: false,
    //             public_field_filter: true,
    //             flag_engineering_system: false
    //     }
    //     try {
    //         const result = await Request.get(
    //             this.state.BASE_URL + "/dictionary/tags",
    //             filter
    //         );
    //         commit("changeListBrands", result.data);
    //     } catch (e) {
    //         console.log(e);
    //         commit("change_notification_modal", e, {root: true});
    //     }
    //     commit("changeLoadingList", false);
    // },
  },
  getters: {
    getFamilyByName: (state) => (name) => {
      return state.listEntries.find((obj) => obj.name === name);
    },
  },
};
