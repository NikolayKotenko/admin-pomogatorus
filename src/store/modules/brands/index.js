import Request from "../../../services/request";

export default {
  namespaced: true,
  state: {
    listBrands: [],
    deleteModal: false,
    brand: {
      id: null,
      code: null,
      name: null,
      description: null,
      e_client_files: [],
    },
  },
  mutations: {
    changeListBrands(state, array) {
      state.listTags = [];
      if (Array.isArray(array)) {
        state.listBrands = array;
      } else {
        state.listBrands = Object.values(array);
      }
    },
    setBrand(state, object) {
      if (object == null) return false;

      state.brand = object;
    },
    clearBrand(state) {
      state.brand = {
        id: null,
        code: null,
        name: null,
        description: null,
        e_client_files: [],
      };
    },
    deleteModalCommit(state, value) {
      state.deleteModal = value;
    },
  },
  actions: {
    clearBrand({ commit }) {
      commit("clearBrand");
    },
    stateModalAction({ commit }, value) {
      commit("deleteModalCommit", value);
    },
    // async getListBrands({ commit }) {
    //     const response = await Request.get(
    //         this.state.BASE_URL + '/dictionary/brands'
    //     )
    //     commit('changeListBrands', response.data)
    // },
    async getListBrands({ commit }, id) {
      commit("changeLoadingGeneral", true);

      try {
        const selects = ["*", "e_client_files"];
        const query = Request.modifyQuery([], selects);
        const result = await Request.get(
          this.state.BASE_URL + `/dictionary/brands${query}`
        );
        commit("changeListBrands", result.data);
        const listBrands = this.state.Brands.listBrands;

        const getBrand = () => {
          if (id) {
            return listBrands.find((elem) => elem.id == id);
          }
        };
        commit("setBrand", getBrand());
      } catch (e) {
        console.log(e);
        commit("change_notification_modal", e, { root: true });
      }
      commit("changeLoadingGeneral", false);
    },
    async createBrand({ commit }) {
      commit("changeLoadingGeneral", true);
      try {
        const response = await Request.post(
          this.state.BASE_URL + "/dictionary/brands",
          this.state.Brands.brand
        );
        commit("setBrand", response.data);
        commit("changeLoadingGeneral", false);
        return response;
      } catch (e) {
        console.log(e);
        commit("change_notification_modal", e, { root: true });
        commit("changeLoadingGeneral", false);
      }
    },
    async updateBrand({ commit }) {
      try {
        return await Request.put(
          this.state.BASE_URL +
            "/dictionary/brands/" +
            this.state.Brands.brand.id,
          this.state.Brands.brand
        );
      } catch (e) {
        console.log(e);
        commit("change_notification_modal", e, { root: true });
      }
    },
    async onSubmitBrands({ commit, dispatch }) {
      if (this.state.Brands.brand.name == null) return false;

      //START
      commit("changeLoadingGeneral", true);

      let response = null;
      if (location.search.match("create")) {
        response = await dispatch("createBrand");
      } else {
        response = await dispatch("updateBrand");
      }

      await dispatch("clearBrand");
      await dispatch("getListBrands", response.data.id);
      //END
      commit("changeLoadingGeneral", false);
    },
    async deleteBrand({ commit, dispatch }) {
      commit("changeLoadingGeneral", true);

      await Request.delete(
        this.state.BASE_URL + "/dictionary/brands/" + this.state.Brands.brand.id
      );

      await dispatch("getListBrands");

      commit("clearBrand");
      commit("changeLoadingGeneral", false);
      commit("deleteModalCommit", false);
    },
  },
  getters: {},
};
