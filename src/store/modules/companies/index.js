import Request from "../../../services/request";

export default {
  namespaced: true,
  state: {
    listCompanies: [],
    deleteModal: false,
    company: {
      id: null,
      name: null,
      description: null,
      physical_address: null,
      lat: null,
      long: null,
      telephone: null,
      email: null,
      site: null,
      instagram: null,
      youtube: null,
      tiktok: null,
      facebook: null,
      inn: null,
      ids_brands: [],
      e_client_files: [],
    },
  },
  mutations: {
    changeListCompanies(state, array) {
      state.listCompanies = [];
      if (Array.isArray(array)) {
        state.listCompanies = array;
      } else {
        state.listCompanies = Object.values(array);
      }
    },
    setCompany(state, object) {
      if (object == null) return false;
      state.company = object;
    },
    setCompanyData(state, data) {  // новая мутация
      state.company = { ...state.company, ...data };
    },
    clearCompany(state) {
      state.company = {
        id: null,
        name: null,
        description: null,
        physical_address: null,
        lat: null,
        long: null,
        telephone: null,
        email: null,
        site: null,
        instagram: null,
        youtube: null,
        tiktok: null,
        facebook: null,
        inn: null,
        ids_brands: [],
        e_client_files: [],
      };
    },
    deleteModalCommit(state, value) {
      state.deleteModal = value;
    },
  },
  actions: {
    clearCompany({ commit }) {
      commit("clearCompany");
    },
    stateModalAction({ commit }, value) {
      commit("deleteModalCommit", value);
    },
    async getListCompanies({ commit }, id) {
      commit("changeLoadingGeneral", true, { root: true });

      try {
        const selects = ["*", "e_client_files", "_brands"];
        const query = Request.modifyQuery([], selects);
        const result = await Request.get(
          this.state.BASE_URL + `/dictionary/companies${query}`
        );
        commit("changeListCompanies", result.data);
        const listCompanies = this.state.Companies.listCompanies;

        const getCompany = () => {
          if (id) {
            return listCompanies.find((elem) => elem.id == id);
          }
        };
        commit("setCompany", getCompany());
      } catch (e) {
        console.log(e);
        commit("change_notification_modal", e, { root: true });
      }
      commit("changeLoadingGeneral", false, { root: true });
    },
    async createCompany({ commit, state }) {
      commit("changeLoadingGeneral", true, { root: true });
      try {
        const response = await Request.post(
          this.state.BASE_URL + "/dictionary/companies",
          state.company
        );
        commit("setCompany", response.data);
        commit("changeLoadingGeneral", false, { root: true });
        return response;
      } catch (e) {
        console.log(e);
        commit("change_notification_modal", e, { root: true });
        commit("changeLoadingGeneral", false, { root: true });
      }
    },
    async updateCompany({ commit, state }) {
      try {
        return await Request.put(
          this.state.BASE_URL + "/dictionary/companies/" + state.company.id,
          state.company
        );
      } catch (e) {
        console.log(e);
        commit("change_notification_modal", e, { root: true });
      }
    },
    async deleteCompany({ commit, state }) {
      commit("changeLoadingGeneral", true, { root: true });

      await Request.delete(
        this.state.BASE_URL + "/dictionary/companies/" + state.company.id
      );

      commit("changeLoadingGeneral", false, { root: true });
    },
  },
  getters: {},
};
